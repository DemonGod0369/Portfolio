import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as queries from '../src/db/queries.ts';
import { prisma } from '../src/db/index.ts';
import {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  isBcryptHash,
  sanitizeUser,
} from '../src/api/common/utils/password.utils.ts';
import {
  createAuthToken,
  createJwtToken,
  verifyAuthToken,
  verifyJwtToken,
  decodeAuthToken,
} from '../src/api/common/utils/token.utils.ts';
import jwt from 'jsonwebtoken';

describe('JWT Token & Password Security Suite', () => {
  const BASE_ADMIN_EMAIL = 'gunjanstha01@gmail.com';
  const BASE_ADMIN_PASSWORD = 'gunjan2026';

  beforeEach(async () => {
    // Ensure clean base administrator state
    const admin = await prisma.user.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    if (admin) {
      await queries.updateAdminCredentials(admin.email, BASE_ADMIN_EMAIL, BASE_ADMIN_PASSWORD);
    }
  });

  afterAll(async () => {
    // Restore base administrator state after suite completes
    const admin = await prisma.user.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    if (admin) {
      await queries.updateAdminCredentials(admin.email, BASE_ADMIN_EMAIL, BASE_ADMIN_PASSWORD);
    }
  });

  /* =========================================================================
   * 1. Password Strength & Complexity Validation
   * ========================================================================= */
  describe('Password Strength Validation', () => {
    it('rejects passwords shorter than 8 characters', () => {
      const res = validatePasswordStrength('short1!');
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/at least 8 characters/i);
    });

    it('rejects empty or whitespace passwords', () => {
      expect(validatePasswordStrength('').valid).toBe(false);
      expect(validatePasswordStrength('   ').valid).toBe(false);
      expect(validatePasswordStrength('  SecurePass1! ').valid).toBe(false);
    });

    it('rejects passwords without numbers or special symbols', () => {
      const res = validatePasswordStrength('JustLettersOnly');
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/number or special character/i);
    });

    it('accepts strong, compliant passwords with letters and numbers/symbols', () => {
      expect(validatePasswordStrength('SecureAdmin2026!').valid).toBe(true);
      expect(validatePasswordStrength('GunjanP@ssw0rd').valid).toBe(true);
      expect(validatePasswordStrength('Kathmandu#9871').valid).toBe(true);
    });
  });

  /* =========================================================================
   * 2. Bcrypt Hashing Functionality
   * ========================================================================= */
  describe('Bcrypt Hashing & Salting Mechanics', () => {
    it('produces valid bcrypt hashes with salt rounds (starts with $2a$ or $2b$)', async () => {
      const rawPassword = 'MySecretPassword123#';
      const hash = await hashPassword(rawPassword);

      expect(hash).not.toBe(rawPassword);
      expect(isBcryptHash(hash)).toBe(true);
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
      expect(hash.length).toBe(60);
    });

    it('generates unique salts for each hash of the exact same password', async () => {
      const pass = 'IdenticalPassword2026!';
      const hash1 = await hashPassword(pass);
      const hash2 = await hashPassword(pass);

      expect(hash1).not.toBe(hash2);
      expect(await comparePassword(pass, hash1)).toBe(true);
      expect(await comparePassword(pass, hash2)).toBe(true);
    });

    it('successfully compares valid passwords and rejects invalid attempts', async () => {
      const pass = 'ExecutiveKey#2026';
      const hash = await hashPassword(pass);

      expect(await comparePassword(pass, hash)).toBe(true);
      expect(await comparePassword('WrongPassword123!', hash)).toBe(false);
      expect(await comparePassword('', hash)).toBe(false);
    });
  });

  /* =========================================================================
   * 3. Database Pre-Storage Hashing & CRUD Protection
   * ========================================================================= */
  describe('Database Pre-Storage Password Hashing', () => {
    it('hashes passwords before storing to PostgreSQL when updating credentials', async () => {
      const targetEmail = 'security_officer@portfolio.internal';
      const plaintextPassword = 'SuperStrongKey#2026';

      // 1. Update administrator credentials with plaintext input
      const updateResult = await queries.updateAdminCredentials(
        BASE_ADMIN_EMAIL,
        targetEmail,
        plaintextPassword
      );
      expect(updateResult.success).toBe(true);

      // 2. Query raw database record directly via Prisma
      const dbUser = await prisma.user.findFirst({
        where: { email: targetEmail },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe(targetEmail);

      // 3. CRITICAL: Confirm database stores the BCRYPT HASH, NEVER plaintext!
      expect(dbUser?.passwordHash).not.toBe(plaintextPassword);
      expect(isBcryptHash(dbUser?.passwordHash ?? '')).toBe(true);

      // 4. Verify authentication succeeds with the plaintext password against stored hash
      const loginCheck = await queries.verifyAdminLogin(targetEmail, plaintextPassword);
      expect(loginCheck.success).toBe(true);

      // 5. Verify authentication fails with incorrect password
      const badLogin = await queries.verifyAdminLogin(targetEmail, 'incorrectPassword999!');
      expect(badLogin.success).toBe(false);

      // Revert back to base administrator
      await queries.updateAdminCredentials(targetEmail, BASE_ADMIN_EMAIL, BASE_ADMIN_PASSWORD);
    });

    it('hashes password with bcrypt when resetting password via recovery code', async () => {
      // 1. Request recovery code
      const tokenRes = await queries.generatePasswordResetToken(BASE_ADMIN_EMAIL);
      expect(tokenRes.success).toBe(true);
      const resetCode = tokenRes.code ?? '';

      // 2. Perform reset with new plaintext password
      const newPassword = 'RecoveredKey*7788Secure';
      const resetRes = await queries.resetPasswordWithCode(BASE_ADMIN_EMAIL, resetCode, newPassword);
      expect(resetRes.success).toBe(true);

      // 3. Query PostgreSQL directly to inspect stored value
      const userInDb = await prisma.user.findFirst({
        where: { email: BASE_ADMIN_EMAIL },
      });
      expect(userInDb).toBeDefined();
      expect(userInDb?.passwordHash).not.toBe(newPassword);
      expect(isBcryptHash(userInDb?.passwordHash ?? '')).toBe(true);
      expect(await comparePassword(newPassword, userInDb?.passwordHash ?? '')).toBe(true);

      // 4. Verify login succeeds with new password
      const authSuccess = await queries.verifyAdminLogin(BASE_ADMIN_EMAIL, newPassword);
      expect(authSuccess.success).toBe(true);

      // Restore base password
      await queries.updateAdminCredentials(BASE_ADMIN_EMAIL, BASE_ADMIN_EMAIL, BASE_ADMIN_PASSWORD);
    });

    it('rejects weak passwords when updating credentials and prevents database update', async () => {
      const weakPassword = '123';
      const failResult = await queries.updateAdminCredentials(
        BASE_ADMIN_EMAIL,
        undefined,
        weakPassword
      );
      expect(failResult.success).toBe(false);
      expect(failResult.error).toMatch(/at least 8 characters/i);
    });
  });

  /* =========================================================================
   * 4. RFC 7519 Compliant JSON Web Token (JWT) Implementation
   * ========================================================================= */
  describe('RFC 7519 JSON Web Token (JWT) Implementation', () => {
    it('generates standard 3-part dot-separated JWT tokens (header.payload.signature)', () => {
      const email = 'gunjanstha01@gmail.com';
      const token = createJwtToken(email, 'admin');

      expect(typeof token).toBe('string');
      const parts = token.split('.');
      expect(parts.length).toBe(3);

      // Check header contains standard JWT metadata
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
      expect(header.alg).toBe('HS256');
      expect(header.typ).toBe('JWT');
    });

    it('encodes correct user claims (email, role, iat, exp) in JWT payload', () => {
      const email = 'operator@example.com';
      const role = 'System Admin';
      const token = createAuthToken(email, role);

      const decoded = decodeAuthToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.email).toBe(email);
      expect(decoded?.role).toBe(role);
      expect(typeof decoded?.iat).toBe('number');
      expect(typeof decoded?.exp).toBe('number');
      const exp = decoded?.exp ?? 0;
      const iat = decoded?.iat ?? 0;
      expect(exp).toBeGreaterThan(iat);
    });

    it('successfully verifies genuine JWT tokens and extracts payload claims', () => {
      const testEmail = 'verify.test@domain.org';
      const token = createJwtToken(testEmail, 'admin');

      const verified = verifyJwtToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.email).toBe(testEmail);
      expect(verified?.role).toBe('admin');
    });

    it('rejects tampered or forged JWT tokens', () => {
      const legitimateToken = createJwtToken('real.admin@domain.org', 'admin');
      const parts = legitimateToken.split('.');

      // Tamper with the payload (change email claim)
      const tamperedPayload = Buffer.from(
        JSON.stringify({ email: 'hacker@attacker.com', role: 'admin' })
      ).toString('base64url');
      const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

      const verified = verifyAuthToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it('rejects expired JWT tokens', () => {
      const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'gunjan_shrestha_portfolio_secure_jwt_secret_2026';
      // Create a token expired 1 hour ago
      const expiredToken = jwt.sign(
        { email: 'expired@domain.com', role: 'admin' },
        secret,
        { expiresIn: '-1h', algorithm: 'HS256' }
      );

      const verified = verifyAuthToken(expiredToken);
      expect(verified).toBeNull();
    });
  });

  /* =========================================================================
   * 5. User Response Sanitization
   * ========================================================================= */
  describe('User Response Sanitization', () => {
    it('sanitizes user records by stripping passwordHash', () => {
      const rawUser = {
        id: 1,
        email: 'admin@domain.com',
        passwordHash: '$2a$12$abcdefghijklmnopqrstuvwxyz012345678901234567890123456789',
        isActive: true,
      };

      const sanitized = sanitizeUser(rawUser) as Record<string, unknown> | null;
      expect(sanitized).toBeDefined();
      expect(sanitized?.['passwordHash']).toBeUndefined();
      expect(sanitized?.['email']).toBe('admin@domain.com');
      expect(sanitized?.['isActive']).toBe(true);
    });

    it('handles null or undefined input safely in sanitizeUser', () => {
      expect(sanitizeUser(null)).toBeNull();
      expect(sanitizeUser(undefined)).toBeNull();
    });
  });
});
