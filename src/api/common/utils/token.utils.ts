import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'gunjan_shrestha_portfolio_secure_jwt_secret_2026';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Generates an RFC 7519 compliant JSON Web Token (JWT) with HS256 algorithm.
 */
export function createAuthToken(email: string, role = 'admin', customClaims: Record<string, any> = {}): string {
  const payload: TokenPayload = {
    email,
    role,
    ...customClaims,
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Alias for createAuthToken emphasizing JWT standard naming.
 */
export const createJwtToken = createAuthToken;

/**
 * Verifies and decodes a JSON Web Token.
 * Also handles legacy 2-part HMAC tokens seamlessly during transition.
 */
export function verifyAuthToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;

  try {
    const trimmed = token.trim();

    // Standard 3-part RFC 7519 JWT
    if (trimmed.split('.').length === 3) {
      const decoded = jwt.verify(trimmed, JWT_SECRET) as TokenPayload;
      return decoded;
    }

    // Fallback for legacy 2-part HMAC tokens during transition
    const parts = trimmed.split('.');
    if (parts.length === 2) {
      const [encodedPayload, providedSignature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(encodedPayload)
        .digest('base64url');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const providedBuf = Buffer.from(providedSignature, 'utf8');

      if (expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf)) {
        const payload: TokenPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
        if (!payload.exp || Date.now() <= payload.exp) {
          return payload;
        }
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Alias for verifyAuthToken.
 */
export const verifyJwtToken = verifyAuthToken;

/**
 * Decodes a JWT token without verifying signature (useful for client inspection).
 */
export function decodeAuthToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload | null;
  } catch {
    return null;
  }
}
