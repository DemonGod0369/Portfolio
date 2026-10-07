import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as queries from '../src/db/queries.ts';
import { prisma } from '../src/db/index.ts';

describe('Admin Security & Credential Management CRUD Suite', () => {
  const ORIGINAL_EMAIL = 'gunjanstha01@gmail.com';
  const ORIGINAL_PASSWORD = 'gunjan2026';

  beforeEach(async () => {
    // Ensure baseline admin exists
    const admin = await prisma.user.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    if (admin) {
      await queries.updateAdminCredentials(admin.email, ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
    }
  });

  afterAll(async () => {
    // Ensure database is cleanly restored to original verified admin credentials
    const admin = await prisma.user.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
    if (admin) {
      await queries.updateAdminCredentials(admin.email, ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
    }
  });

  it('1. Verifies initial administrator login with original credentials', async () => {
    const loginRes = await queries.verifyAdminLogin(ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
    expect(loginRes.success).toBe(true);
    expect(loginRes.email).toBe(ORIGINAL_EMAIL);

    const wrongPass = await queries.verifyAdminLogin(ORIGINAL_EMAIL, 'wrong-password-123');
    expect(wrongPass.success).toBe(false);
  });

  it('2. Fixes email and password change: password does NOT become email', async () => {
    const demoEmail = 'testadmin_demo1@example.com';
    const demoPassword = 'superSecretPassword987!';

    // Perform credential update
    const updateRes = await queries.updateAdminCredentials(ORIGINAL_EMAIL, demoEmail, demoPassword);
    expect(updateRes.success).toBe(true);
    expect(updateRes.user?.email).toBe(demoEmail);
    // Explicitly verify the email column contains the EMAIL, not the password
    expect(updateRes.user?.email).not.toBe(demoPassword);
    expect(updateRes.user?.passwordHash).toBe(demoPassword);

    // Verify database record directly via Prisma
    const dbUser = await prisma.user.findFirst({
      where: { email: demoEmail },
    });
    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(demoEmail);
    expect(dbUser?.passwordHash).toBe(demoPassword);

    // Verify login with new email and new password succeeds
    const verifySuccess = await queries.verifyAdminLogin(demoEmail, demoPassword);
    expect(verifySuccess.success).toBe(true);

    // Verify login with old credentials fails
    const verifyOld = await queries.verifyAdminLogin(ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
    expect(verifyOld.success).toBe(false);

    // Restore to original
    await queries.updateAdminCredentials(demoEmail, ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
  });

  it('3. Performs multiple email and password change CRUD cycles', async () => {
    const testCases = [
      { email: 'alpha.admin@domain.org', password: 'AlphaPass2026_Secure' },
      { email: 'beta.operator@enterprise.co', password: 'BetaOperator#456!' },
      { email: 'gamma.lead@systems.io', password: 'GammaLead*789Key' },
    ];

    let currentEmail = ORIGINAL_EMAIL;

    for (const testCase of testCases) {
      // UPDATE
      const updateResult = await queries.updateAdminCredentials(currentEmail, testCase.email, testCase.password);
      expect(updateResult.success).toBe(true);
      expect(updateResult.user?.email).toBe(testCase.email);
      expect(updateResult.user?.passwordHash).toBe(testCase.password);

      // VERIFY DB INTEGRITY
      const user = await prisma.user.findFirst({ where: { email: testCase.email } });
      expect(user).toBeDefined();
      expect(user?.email).toBe(testCase.email);
      expect(user?.passwordHash).toBe(testCase.password);

      // AUTHENTICATE
      const login = await queries.verifyAdminLogin(testCase.email, testCase.password);
      expect(login.success).toBe(true);

      currentEmail = testCase.email;
    }

    // Clean restore
    await queries.updateAdminCredentials(currentEmail, ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
    const restored = await queries.verifyAdminLogin(ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
    expect(restored.success).toBe(true);
  });

  it('4. Forgot password flow: generates secure recovery token and resets password', async () => {
    // Generate recovery code
    const tokenRes = await queries.generatePasswordResetToken(ORIGINAL_EMAIL);
    expect(tokenRes.success).toBe(true);
    expect(tokenRes.code).toBeDefined();
    expect(tokenRes.code?.length).toBe(6);

    const generatedCode = tokenRes.code!;

    // Test verifying wrong recovery code fails
    const invalidVerify = await queries.verifyPasswordResetCode(ORIGINAL_EMAIL, '000000');
    expect(invalidVerify.success).toBe(false);

    // Test verifying valid recovery code
    const validVerify = await queries.verifyPasswordResetCode(ORIGINAL_EMAIL, generatedCode);
    expect(validVerify.success).toBe(true);

    // Reset password using recovery code
    const newResetPassword = 'newRecoveredPassword2026!';
    const resetRes = await queries.resetPasswordWithCode(ORIGINAL_EMAIL, generatedCode, newResetPassword);
    expect(resetRes.success).toBe(true);

    // Verify login with new recovered password
    const newLogin = await queries.verifyAdminLogin(ORIGINAL_EMAIL, newResetPassword);
    expect(newLogin.success).toBe(true);

    // Verify used token cannot be reused
    const reuseAttempt = await queries.resetPasswordWithCode(ORIGINAL_EMAIL, generatedCode, 'anotherPass123');
    expect(reuseAttempt.success).toBe(false);

    // Restore original password
    await queries.updateAdminCredentials(ORIGINAL_EMAIL, ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
  });

  it('5. Full CRUD operations with 5 demo credentials, verifying DB fields never cross-contaminate', async () => {
    const demoAccounts = [
      { email: 'demo_exec1@portfolio.internal', pass: 'DemoKey_Pass1#2026' },
      { email: 'demo_exec2@portfolio.internal', pass: 'SecondPass_9988$$' },
      { email: 'demo_exec3@portfolio.internal', pass: 'ThirdCredential_Safe!7' },
      { email: 'demo_exec4@portfolio.internal', pass: 'FourthStrong#Key2026' },
      { email: 'demo_exec5@portfolio.internal', pass: 'FinalClean@Password99' },
    ];

    let activeEmail = ORIGINAL_EMAIL;

    for (const demo of demoAccounts) {
      // 1. UPDATE both email and password
      const res = await queries.updateAdminCredentials(activeEmail, demo.email, demo.pass);
      expect(res.success).toBe(true);

      // 2. READ directly from Prisma / DB
      const user = await prisma.user.findFirst({ where: { email: demo.email } });
      expect(user).toBeDefined();
      expect(user?.email).toBe(demo.email);
      expect(user?.email).not.toBe(demo.pass);
      expect(user?.passwordHash).toBe(demo.pass);
      expect(user?.passwordHash).not.toBe(demo.email);

      // 3. AUTHENTICATE with new credentials
      const login = await queries.verifyAdminLogin(demo.email, demo.pass);
      expect(login.success).toBe(true);

      // 4. TEST partial update: change ONLY password, keep same email
      const newOnlyPass = demo.pass + '_updated';
      const passOnlyRes = await queries.updateAdminCredentials(demo.email, undefined, newOnlyPass);
      expect(passOnlyRes.success).toBe(true);
      const userAfterPass = await prisma.user.findFirst({ where: { email: demo.email } });
      expect(userAfterPass?.email).toBe(demo.email);
      expect(userAfterPass?.passwordHash).toBe(newOnlyPass);

      // Revert pass back for next iteration
      await queries.updateAdminCredentials(demo.email, undefined, demo.pass);

      activeEmail = demo.email;
    }

    // Clean restore back to original administrator credentials
    await queries.updateAdminCredentials(activeEmail, ORIGINAL_EMAIL, ORIGINAL_PASSWORD);
    const finalAdmin = await prisma.user.findFirst({ where: { email: ORIGINAL_EMAIL } });
    expect(finalAdmin?.email).toBe(ORIGINAL_EMAIL);
    expect(finalAdmin?.passwordHash).toBe(ORIGINAL_PASSWORD);
  });
});
