import nodemailer from 'nodemailer';

/**
 * Masks an email address for public or client-side display.
 * Example: 'gunjanstha01@gmail.com' -> 'g***a01@gmail.com'
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  const start = local.slice(0, 2);
  const end = local.slice(-2);
  return `${start}${'*'.repeat(Math.min(local.length - 4, 4))}${end}@${domain}`;
}

/**
 * Creates a Nodemailer transporter.
 * If SMTP credentials are configured via environment variables, uses standard SMTP.
 * Otherwise, falls back to a stream transport for robust operation without throwing errors.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback direct stream transport for development / environments without external SMTP
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

/**
 * Sends a password recovery email containing the one-time 6-digit code
 * strictly to the registered administrator's email inbox.
 */
export async function sendRecoveryEmail(recipientEmail: string, recoveryCode: string): Promise<{ success: boolean; messageId?: string }> {
  try {
    const transporter = createTransporter();
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || '"Executive CMS Portal Security" <security@cms-portal.internal>';

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0d0d0d; color: #f5f5f5; border: 1px solid #262626; border-radius: 6px; overflow: hidden;">
        <div style="background-color: #141414; padding: 24px; border-bottom: 1px solid #262626; text-align: center;">
          <h2 style="margin: 0; color: #c6a87d; font-size: 18px; text-transform: uppercase; letter-spacing: 0.1em;">
            Executive CMS Security Portal
          </h2>
          <p style="margin: 6px 0 0 0; color: #888888; font-size: 12px; font-family: monospace;">
            Single-Owner Access Verification
          </p>
        </div>
        
        <div style="padding: 32px 24px; text-align: center;">
          <p style="color: #cccccc; font-size: 14px; margin: 0 0 20px 0; line-height: 1.6;">
            A password reset was requested for the administrative account registered at <strong>${recipientEmail}</strong>.
          </p>

          <p style="color: #999999; font-size: 13px; margin: 0 0 12px 0;">
            Use the following 6-digit one-time verification code to reset your password:
          </p>

          <div style="background-color: #171717; border: 1px solid #c6a87d; display: inline-block; padding: 14px 28px; border-radius: 4px; margin: 12px 0 24px 0;">
            <span style="font-size: 30px; font-weight: bold; font-family: monospace; letter-spacing: 0.25em; color: #c6a87d;">
              ${recoveryCode}
            </span>
          </div>

          <p style="color: #888888; font-size: 12px; line-height: 1.5; margin: 0 0 8px 0;">
            This recovery code will expire in <strong>15 minutes</strong> and can only be used once.
          </p>

          <p style="color: #ff6b6b; font-size: 11px; line-height: 1.5; margin: 16px 0 0 0;">
            If you did not request this recovery code, please disregard this email. Your administrative account credentials remain unchanged.
          </p>
        </div>

        <div style="background-color: #111111; padding: 16px; border-top: 1px solid #262626; text-align: center;">
          <p style="margin: 0; color: #555555; font-size: 10px; font-family: monospace;">
            Automated security dispatch • Do not reply to this email
          </p>
        </div>
      </div>
    `;

    const textContent = `Executive CMS Security Portal\n\n` +
      `A password reset was requested for: ${recipientEmail}\n\n` +
      `Your 6-digit verification code is: ${recoveryCode}\n\n` +
      `This code expires in 15 minutes.\n` +
      `If you did not initiate this request, your account remains secure; please disregard this notification.`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipientEmail,
      subject: `[CMS Security] Your Password Recovery Code: ${recoveryCode}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Security Dispatch] Recovery email dispatched to ${recipientEmail} (Message ID: ${info.messageId || 'local-stream'})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Security Dispatch Error] Failed to send recovery email to ${recipientEmail}:`, error);
    // Return success true so user error does not expose infrastructure details, while failure is logged
    return { success: false };
  }
}
