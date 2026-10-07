import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';
import { createAuthToken } from '../common/utils/token.utils.ts';
import { AuthenticatedRequest } from '../common/middleware/auth.middleware.ts';
import { sendRecoveryEmail, maskEmail } from '../common/utils/email.utils.ts';

const COOKIE_NAME = 'auth_token';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const verification = await queries.verifyAdminLogin(email, password);
    if (!verification.success) {
      return res.status(401).json({ success: false, error: verification.message || 'Invalid credentials' });
    }

    const token = createAuthToken(verification.email || email, 'admin');

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SEVEN_DAYS_MS,
    });

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';

    await queries.createAuditEntry({
      action: 'ADMIN_LOGIN_SUCCESS',
      entityType: 'User',
      entityId: verification.email,
      ipHash: Buffer.from(clientIp).toString('base64').substring(0, 16),
      userAgent,
    });

    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        email: verification.email,
        role: 'Super Administrator',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Authentication error' });
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, authenticated: false, error: 'Not authenticated' });
  }

  res.json({
    success: true,
    authenticated: true,
    user: {
      email: req.user.email,
      role: req.user.role,
    },
  });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}

export async function updateCredentials(req: AuthenticatedRequest, res: Response) {
  try {
    const { currentEmail, email, newEmail, currentPassword, newPassword } = req.body;
    
    // Determine current administrator email from session or payload
    const fromEmail = currentEmail || req.user?.email;
    const targetEmail = (newEmail || email || fromEmail)?.trim().toLowerCase();

    if (!targetEmail) {
      return res.status(400).json({ success: false, error: 'Administrator email is required' });
    }

    // Verify current password if provided
    if (currentPassword && fromEmail) {
      const verification = await queries.verifyAdminLogin(fromEmail, currentPassword);
      if (!verification.success) {
        return res.status(401).json({ success: false, error: 'Current password verification failed. Please check your current password.' });
      }
    }

    // Update credentials with explicit parameter separation: (currentEmail, newEmail, newPassword)
    const result = await queries.updateAdminCredentials(
      fromEmail || targetEmail,
      targetEmail !== fromEmail ? targetEmail : undefined,
      newPassword && newPassword.trim() ? newPassword.trim() : undefined
    );

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error || 'Failed to update credentials' });
    }

    const token = createAuthToken(targetEmail, 'admin');
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SEVEN_DAYS_MS,
    });

    await queries.createAuditEntry({
      action: 'ADMIN_CREDENTIALS_UPDATED',
      entityType: 'User',
      entityId: targetEmail,
      metadata: {
        emailUpdated: fromEmail !== targetEmail,
        passwordUpdated: Boolean(newPassword),
      },
    });

    res.json({ success: true, data: result.user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update credentials' });
  }
}

export async function getSessions(req: Request, res: Response) {
  try {
    const sessions = await queries.getAdminSessions();
    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch sessions' });
  }
}

export async function upsertSession(req: Request, res: Response) {
  try {
    const session = await queries.upsertAdminSession(req.body);
    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to record session' });
  }
}

export async function deleteSession(req: Request, res: Response) {
  try {
    await queries.deleteAdminSession(req.params.id);
    res.json({ success: true, message: 'Session terminated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete session' });
  }
}

export async function logoutAllSessions(req: Request, res: Response) {
  try {
    await queries.deleteAllAdminSessions();
    res.json({ success: true, message: 'All active sessions terminated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to terminate sessions' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Administrator email is required.' });
    }

    const result = await queries.generatePasswordResetToken(email);
    if (!result.success || !result.code) {
      return res.status(404).json({ success: false, error: result.error || 'Account not found.' });
    }

    // Send code strictly to the registered administrator email inbox
    await sendRecoveryEmail(result.email, result.code);

    // SECURITY: The recovery code is NEVER sent to the client screen
    res.json({
      success: true,
      message: `A 6-digit recovery code has been dispatched to your registered administrator email address (${maskEmail(result.email)}). Please check your email inbox to proceed.`,
      email: maskEmail(result.email),
      expiresAt: result.expiresAt,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to process forgot password request.' });
  }
}

export async function verifyResetCode(req: Request, res: Response) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and recovery code are required.' });
    }

    const result = await queries.verifyPasswordResetCode(email, code);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to verify recovery code.' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, recovery code, and new password are required.' });
    }

    const result = await queries.resetPasswordWithCode(email, code, newPassword);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      message: result.message || 'Password successfully updated.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to reset password.' });
  }
}

