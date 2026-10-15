import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 10;

export interface PasswordValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates password strength to ensure enterprise-grade security.
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one letter (a-z or A-Z)
 * - At least one digit or special character
 * - No leading or trailing spaces
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required.' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password must not exceed 128 characters.' };
  }

  if (password.trim() !== password) {
    return { valid: false, error: 'Password must not begin or end with whitespace.' };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigitOrSpecial = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  if (!hasLetter || !hasDigitOrSpecial) {
    return {
      valid: false,
      error: 'Password must contain at least one letter and at least one number or special character.',
    };
  }

  return { valid: true };
}

/**
 * Checks if a stored string is already a valid bcrypt hash.
 */
export function isBcryptHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  return /^\$2[aby]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/.test(hash);
}

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compares a plaintext password attempt with a stored hash or legacy plain string.
 * Supports legacy plain passwords with automatic fallback for seamless migration.
 */
export async function comparePassword(plainText: string, storedHashOrPlain: string): Promise<boolean> {
  if (!plainText || !storedHashOrPlain) {
    return false;
  }

  if (isBcryptHash(storedHashOrPlain)) {
    return bcrypt.compare(plainText, storedHashOrPlain);
  }

  // Fallback for legacy unhashed entries (e.g. prior to security upgrade)
  return plainText === storedHashOrPlain;
}

/**
 * Strips passwordHash and internal security fields from user records before returning in responses.
 */
export function sanitizeUser<T extends Record<string, any>>(user: T | null | undefined): Omit<T, 'passwordHash'> | null {
  if (!user) return null;
  const clone = { ...user };
  delete clone.passwordHash;
  return clone;
}
