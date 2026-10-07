import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw,
  Clock
} from 'lucide-react';

type AuthViewMode = 'login' | 'forgot_email' | 'forgot_code' | 'success';

export const AdminLogin: React.FC = () => {
  const { 
    siteSettings,
    adminLogin, 
    setCurrentRoute, 
    requestPasswordReset, 
    resetPasswordWithCode 
  } = useData();

  // Mode management
  const [mode, setMode] = useState<AuthViewMode>('login');
  const [logoLoadError, setLogoLoadError] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Recovery & reset form state
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [generatedCodePreview, setGeneratedCodePreview] = useState<string | null>(null);
  const [expiresAtPreview, setExpiresAtPreview] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Feedback & async state
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Standard Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await adminLogin(email, password);
    setLoading(false);

    if (res.success) {
      setCurrentRoute('admin');
    } else {
      setError(res.message || 'Authentication failed. Please verify credentials.');
    }
  };

  // 2. Request Password Reset Code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered administrator email.');
      return;
    }

    setError(null);
    setLoading(true);

    const res = await requestPasswordReset(email);
    setLoading(false);

    if (res.success) {
      setRecoveryCode(''); // Security: Must be entered from email
      setGeneratedCodePreview(null);
      if (res.expiresAt) {
        setExpiresAtPreview(res.expiresAt);
      }
      setSuccessInfo(res.message || 'A 6-digit recovery code has been dispatched to your email address.');
      setMode('forgot_code');
    } else {
      setError(res.message || 'No registered administrator account found with that email.');
    }
  };

  // 3. Confirm Code & Set New Password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recoveryCode || recoveryCode.trim().length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const res = await resetPasswordWithCode(email, recoveryCode.trim(), newPassword);
    setLoading(false);

    if (res.success) {
      setPassword(newPassword); // Pre-fill password on login form
      setMode('success');
    } else {
      setError(res.message || 'Failed to reset password. Please check your recovery code.');
    }
  };

  // Helper: Copy code to clipboard
  const handleCopyCode = () => {
    if (generatedCodePreview) {
      navigator.clipboard.writeText(generatedCodePreview);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Helper: Resend code
  const handleResendCode = async () => {
    setError(null);
    setLoading(true);
    const res = await requestPasswordReset(email);
    setLoading(false);
    if (res.success) {
      setRecoveryCode('');
      setGeneratedCodePreview(null);
      setSuccessInfo('A new recovery code has been dispatched to your email address.');
    } else {
      setError(res.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16 animate-fade-in">
      <div className="max-w-md w-full space-y-7 bg-[#111111] border border-[#262626] p-7 sm:p-9 md:p-10 rounded-sm shadow-2xl relative overflow-hidden">
        
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c6a87d] to-transparent" />

        {/* ------------------------------------------------------------- */}
        {/* MODE: LOGIN                                                   */}
        {/* ------------------------------------------------------------- */}
        {mode === 'login' && (
          <>
            <div className="text-center space-y-3">
              {/* Site Logo Display above Title */}
              {siteSettings?.logoUrl && siteSettings.logoUrl.trim() !== '' && !logoLoadError ? (
                <div className="flex flex-col items-center justify-center mx-auto mb-1">
                  <img
                    src={siteSettings.logoUrl}
                    alt={siteSettings.siteName || 'Site Logo'}
                    onError={() => setLogoLoadError(true)}
                    className="h-14 w-auto max-w-[220px] object-contain rounded-sm border border-[#262626] p-1.5 bg-[#141414] shadow-md transition-all hover:border-[#c6a87d]/50"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-[#171717] border border-[#262626] rounded-full flex items-center justify-center mx-auto text-[#c6a87d] shadow-inner">
                  <Shield className="w-6 h-6" />
                </div>
              )}

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5] uppercase">
                  Private CMS Portal
                </h1>
                <p className="text-xs font-mono text-[#888888] mt-1">
                  Authorized Single Administrator Only
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono rounded-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm focus:outline-none transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[#666666] absolute right-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessInfo(null);
                      setMode('forgot_email');
                    }}
                    className="text-[11px] font-mono text-[#c6a87d] hover:text-[#d8bc93] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Forgot password?</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-4 pr-10 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#666666] hover:text-[#c6a87d] transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-[#080808] bg-[#c6a87d] hover:bg-[#d8bc93] disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setCurrentRoute('home')}
                className="text-xs font-mono text-[#666666] hover:text-[#969696] flex items-center justify-center gap-1.5 mx-auto transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Public Website</span>
              </button>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE: FORGOT PASSWORD - STEP 1 (EMAIL VERIFICATION)           */}
        {/* ------------------------------------------------------------- */}
        {mode === 'forgot_email' && (
          <>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#171717] border border-[#262626] rounded-full flex items-center justify-center mx-auto text-[#c6a87d] shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5] uppercase">
                  Account Recovery
                </h1>
                <p className="text-xs font-mono text-[#888888] mt-1">
                  Single-Owner Security Verification
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#171717] border border-[#2a2a2a] rounded-sm text-xs font-mono text-[#999999] leading-relaxed">
              Enter your registered administrator email address to generate an authenticated 6-digit recovery code.
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono rounded-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                  Registered Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm focus:outline-none transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[#666666] absolute right-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-[#080808] bg-[#c6a87d] hover:bg-[#d8bc93] disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Recovery Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Recovery Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="text-xs font-mono text-[#666666] hover:text-[#969696] flex items-center justify-center gap-1.5 mx-auto transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Login</span>
              </button>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE: FORGOT PASSWORD - STEP 2 (CODE & RESET)                 */}
        {/* ------------------------------------------------------------- */}
        {mode === 'forgot_code' && (
          <>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#171717] border border-[#262626] rounded-full flex items-center justify-center mx-auto text-[#c6a87d] shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5] uppercase">
                  Reset Password
                </h1>
                <p className="text-xs font-mono text-[#888888] mt-1 truncate">
                  Target: {email}
                </p>
              </div>
            </div>

            {/* Email Dispatch Notice (Recovery code is kept private in email inbox) */}
            <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-sm text-xs font-mono text-[#999999] leading-relaxed flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#c6a87d] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[#c6a87d] font-bold block uppercase tracking-wider text-[11px]">
                  Verification Code Dispatched
                </span>
                <p className="text-[#e5e5e5] text-xs">
                  A 6-digit one-time recovery code has been sent directly to your registered administrator email address.
                </p>
                <p className="text-[#777777] text-[11px]">
                  Please check your inbox (and spam/junk folder) and enter the code below to reset your password.
                </p>
              </div>
            </div>

            {successInfo && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono rounded-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successInfo}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono rounded-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                  6-Digit Recovery Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Number"
                  className="w-full px-4 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm font-mono tracking-widest text-center focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                  New Password (Min 6 Characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full pl-4 pr-10 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-3.5 text-[#666666] hover:text-[#c6a87d] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                  Confirm New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-[#080808] bg-[#c6a87d] hover:bg-[#d8bc93] disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 border-t border-[#1c1c1c] text-xs font-mono">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-[#888888] hover:text-[#c6a87d] transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="text-[#666666] hover:text-[#969696] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Login</span>
              </button>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE: SUCCESS - PASSWORD RESET COMPLETED                      */}
        {/* ------------------------------------------------------------- */}
        {mode === 'success' && (
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="w-14 h-14 bg-emerald-950/50 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F5] uppercase">
                Password Updated
              </h2>
              <p className="text-xs font-mono text-[#999999] leading-relaxed max-w-xs mx-auto">
                Your administrator password has been updated in the PostgreSQL database.
              </p>
            </div>

            <div className="p-3 bg-[#171717] border border-[#2a2a2a] rounded-sm text-xs font-mono text-[#c6a87d]">
              Ready to log in as: <strong className="text-[#F5F5F5]">{email}</strong>
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccessInfo(null);
                setMode('login');
              }}
              className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-[#080808] bg-[#c6a87d] hover:bg-[#d8bc93] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
