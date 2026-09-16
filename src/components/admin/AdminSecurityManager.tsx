import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { AdminSession } from '../../types';
import { 
  runSecurityDiagnosis, 
  DiagnosticReport 
} from '../../utils/securityDiagnosticUtils';
import { 
  detectBrowserClientPlatform, 
  ClientPlatformInfo 
} from '../../utils/browserDetectionUtils';
import { 
  Shield, 
  ShieldCheck, 
  Key, 
  Lock, 
  Mail, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  Cpu, 
  Database, 
  Copy, 
  Check, 
  LogOut, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  Zap,
  Globe,
  Laptop,
  Smartphone,
  Monitor,
  Trash2,
  XCircle,
  Plus
} from 'lucide-react';

export const AdminSecurityManager: React.FC = () => {
  const { 
    currentAdminUser, 
    profile, 
    siteSettings, 
    projects, 
    blogPosts, 
    contactMessages, 
    socialLinks, 
    auditLogs, 
    isAdminAuthenticated,
    adminSessions,
    currentSessionId,
    terminateSession,
    terminateAllOtherSessions,
    addSimulatedSession,
    updateAdminCredentials,
    forceLogoutAllSessions,
    setAdminActiveTab,
    showToast
  } = useData();

  // Diagnosis State
  const [isRunningDiagnosis, setIsRunningDiagnosis] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Browser & Device Platform Detection
  const [clientRefreshKey, setClientRefreshKey] = useState(0);
  const [isRetestingClient, setIsRetestingClient] = useState(false);
  const clientInfo = useMemo(() => detectBrowserClientPlatform(), [clientRefreshKey]);

  const handleRetestClient = () => {
    setIsRetestingClient(true);
    setTimeout(() => {
      setClientRefreshKey(prev => prev + 1);
      setIsRetestingClient(false);
      showToast('Client platform environment re-tested and verified.');
    }, 300);
  };

  // Targeted Session Revocation State
  const [sessionToRevoke, setSessionToRevoke] = useState<AdminSession | null>(null);
  const [showRevokeAllConfirm, setShowRevokeAllConfirm] = useState(false);

  // Active Sessions Partition
  const currentSession = useMemo(() => {
    return adminSessions.find(s => s.isCurrent) || adminSessions.find(s => s.id === currentSessionId) || adminSessions[0];
  }, [adminSessions, currentSessionId]);

  const otherSessions = useMemo(() => {
    return adminSessions.filter(s => s.id !== currentSession?.id && !s.isCurrent);
  }, [adminSessions, currentSession]);

  const handleSimulateDevice = (type: 'windows' | 'mac' | 'mobile') => {
    if (type === 'windows') {
      addSimulatedSession({
        deviceType: 'Desktop',
        browser: 'Microsoft Edge v128',
        os: 'Windows 11 (23H2)',
        location: 'Lalitpur Workstation (Windows Laptop)',
        screenResolution: '1920 × 1080',
      });
    } else if (type === 'mac') {
      addSimulatedSession({
        deviceType: 'Desktop',
        browser: 'Apple Safari v17.5',
        os: 'macOS Sonoma (14.5)',
        location: 'Kathmandu, NP (MacBook Pro)',
        screenResolution: '2560 × 1440',
      });
    } else {
      addSimulatedSession({
        deviceType: 'Mobile',
        browser: 'Mobile Safari v17',
        os: 'iOS 17.5 (iPhone 15)',
        location: 'Cellular Workstation',
        screenResolution: '393 × 852',
      });
    }
  };

  // Format relative time helper
  const formatSessionTime = (isoString?: string): string => {
    if (!isoString) return 'Recently';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Active just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Email & Credentials Form State
  const [newEmail, setNewEmail] = useState(currentAdminUser?.email || 'gunjanstha01@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [syncWithProfile, setSyncWithProfile] = useState(true);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [credError, setCredError] = useState<string | null>(null);
  const [credSuccess, setCredSuccess] = useState<string | null>(null);

  // Session Logout Confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Run System Diagnosis
  const handleRunDiagnosis = async () => {
    setIsRunningDiagnosis(true);
    setDiagnosticProgress(15);

    const progressTimer = setInterval(() => {
      setDiagnosticProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 15;
      });
    }, 120);

    try {
      const report = await runSecurityDiagnosis({
        profile,
        siteSettings,
        projects,
        blogPosts,
        contactMessages,
        socialLinks,
        auditLogs,
        currentAdminEmail: currentAdminUser?.email || 'gunjanstha01@gmail.com',
        isAdminAuthenticated,
      });

      clearInterval(progressTimer);
      setDiagnosticProgress(100);
      setDiagnosticReport(report);
      showToast('System Diagnosis completed: 100% checks evaluated.');
    } catch (err) {
      clearInterval(progressTimer);
      showToast('Diagnostic run encountered an error.');
    } finally {
      setIsRunningDiagnosis(false);
    }
  };

  // Copy Diagnostic Report to Clipboard
  const handleCopyReport = () => {
    if (!diagnosticReport) return;
    const text = `=== GUNJAN PORTFOLIO SYSTEM & SECURITY DIAGNOSIS ===\n` +
      `Timestamp: ${new Date(diagnosticReport.timestamp).toLocaleString()}\n` +
      `Health Score: ${diagnosticReport.healthScore}%\n` +
      `Checks: ${diagnosticReport.passedChecks}/${diagnosticReport.totalChecks} Passed\n` +
      `Execution Time: ${diagnosticReport.executionTimeMs}ms\n\n` +
      `--- DETAILED AUDIT FINDINGS ---\n` +
      diagnosticReport.checks.map(c => `[${c.status}] ${c.title} (${c.latencyMs}ms)\n  ${c.details}`).join('\n\n') +
      `\n\nSummary: ${diagnosticReport.summary}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    showToast('Diagnostic report copied to clipboard.');
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // Handle Credentials Save
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);
    setCredSuccess(null);

    if (!newEmail || !newEmail.includes('@')) {
      setCredError('Please enter a valid administrator email address.');
      return;
    }

    if (!currentPassword) {
      setCredError('Current password is required to verify your identity before saving changes.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredError('New password and confirmation password do not match.');
      return;
    }

    setIsSavingCreds(true);
    const result = await updateAdminCredentials({
      newEmail: newEmail.trim(),
      newPassword: newPassword ? newPassword.trim() : undefined,
      currentPassword: currentPassword.trim(),
      syncWithProfileEmail: syncWithProfile,
    });
    setIsSavingCreds(false);

    if (result.success) {
      setCredSuccess(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setCredError(result.message);
    }
  };

  // Filter last 5 security events from auditLogs
  const recentSecurityLogs = auditLogs
    .filter(log => 
      log.action.includes('LOGIN') || 
      log.action.includes('SECURITY') || 
      log.action.includes('CREDENTIAL') || 
      log.action.includes('SESSION') ||
      log.action.includes('SETTINGS') ||
      log.entityType === 'Security' ||
      log.entityType === 'Session'
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#c6a87d] mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest">
              Access Control & Infrastructure Protection
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#F5F5F5] uppercase tracking-tight">
            Security Center
          </h2>
          <p className="text-xs font-mono text-[#969696] mt-1">
            Single-owner architecture, credential administration, and automated system diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRunDiagnosis}
            disabled={isRunningDiagnosis}
            className="px-5 py-2.5 bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#c6a87d]/10 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagnosis ? 'animate-spin' : ''}`} />
            <span>{isRunningDiagnosis ? 'Running Diagnostics...' : 'Run System Diagnosis'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SYSTEM DIAGNOSTIC ENGINE & HEALTH REPORT */}
      {/* ======================================================== */}
      <div className="bg-[#111111] border border-[#262626] rounded-sm overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#1f1f1f] bg-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[#c6a87d]" />
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wide">
                System & Security Diagnostic Engine
              </h3>
              <p className="text-[11px] font-mono text-[#808080]">
                Automated 8-point health sweep across authentication, storage latency, browser client fingerprint, bot defense, and schema integrity.
              </p>
            </div>
          </div>

          {diagnosticReport && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyReport}
                className="px-3 py-1.5 bg-[#171717] hover:bg-[#212121] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm flex items-center gap-1.5 transition-colors"
              >
                {copiedReport ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#969696]" />}
                <span>{copiedReport ? 'Copied' : 'Copy Report'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar (Visible while scanning) */}
        {isRunningDiagnosis && (
          <div className="w-full bg-[#171717] h-1.5 overflow-hidden">
            <div 
              className="bg-[#c6a87d] h-full transition-all duration-300 ease-out"
              style={{ width: `${diagnosticProgress}%` }}
            />
          </div>
        )}

        <div className="p-6">
          {!diagnosticReport && !isRunningDiagnosis && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center mx-auto text-[#c6a87d]">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-sm font-bold text-[#F5F5F5] uppercase">
                  Diagnostics Standing By
                </h4>
                <p className="text-xs font-mono text-[#808080] leading-relaxed">
                  Click <span className="text-[#c6a87d]">"Run System Diagnosis"</span> to execute real-time performance benchmarks, audit storage I/O latency, test honeypot bot traps, and verify database integrity.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunDiagnosis}
                className="mt-2 px-4 py-2 bg-[#171717] hover:bg-[#212121] border border-[#333333] text-xs font-mono text-[#c6a87d] font-semibold rounded-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Security & Integrity Audit</span>
              </button>
            </div>
          )}

          {isRunningDiagnosis && (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#c6a87d]/20 animate-ping" />
                <div className="w-14 h-14 rounded-full bg-[#171717] border border-[#c6a87d] flex items-center justify-center text-[#c6a87d]">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wide">
                  Auditing System Security & Integrity... {diagnosticProgress}%
                </h4>
                <p className="text-xs font-mono text-[#808080]">
                  Evaluating authentication boundaries, database latency, and bot defense mechanisms.
                </p>
              </div>
            </div>
          )}

          {diagnosticReport && !isRunningDiagnosis && (
            <div className="space-y-6">
              {/* Scorecard Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
                    {diagnosticReport.healthScore}%
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#808080] uppercase block">
                      Health Score
                    </span>
                    <span className="text-xs font-bold text-emerald-400 uppercase">
                      Optimal & Secure
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm">
                  <span className="text-[10px] font-mono text-[#808080] uppercase block">
                    Security Tests
                  </span>
                  <span className="text-sm font-bold text-[#F5F5F5] font-mono">
                    {diagnosticReport.passedChecks} / {diagnosticReport.totalChecks} Checks Passed
                  </span>
                </div>

                <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm">
                  <span className="text-[10px] font-mono text-[#808080] uppercase block">
                    Total Audit Execution
                  </span>
                  <span className="text-sm font-bold text-[#c6a87d] font-mono">
                    {diagnosticReport.executionTimeMs} ms
                  </span>
                </div>

                <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm">
                  <span className="text-[10px] font-mono text-[#808080] uppercase block">
                    Last Verified
                  </span>
                  <span className="text-xs font-bold text-[#F5F5F5] font-mono">
                    {new Date(diagnosticReport.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Checks Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#808080] block">
                  Detailed Verification Audit Results
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {diagnosticReport.checks.map(item => (
                    <div 
                      key={item.id}
                      className="p-3.5 bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#2a2a2a] rounded-sm flex flex-col md:flex-row md:items-start justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {item.status === 'PASSED' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[#F5F5F5]">
                              {item.title}
                            </span>
                            <span className="px-1.5 py-0.5 bg-[#171717] text-[10px] font-mono text-[#808080] rounded-xs">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#969696] leading-relaxed">
                            {item.description}
                          </p>
                          <p className="text-[11px] font-mono text-[#c6a87d] bg-[#141414] px-2 py-1 rounded-xs border border-[#1f1f1f]">
                            {item.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-1 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1c1c1c]">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs ${
                          item.status === 'PASSED' 
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50' 
                            : 'bg-amber-950/60 text-amber-400 border border-amber-900/50'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] font-mono text-[#666666]">
                          {item.latencyMs}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OWNER AUTHENTICATION & CREDENTIALS MANAGER */}
      {/* ======================================================== */}
      <div className="bg-[#111111] border border-[#262626] rounded-sm p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#1f1f1f] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#c6a87d]" />
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wide">
                Owner Authentication & Primary Email Configuration
              </h3>
            </div>
            <p className="text-xs font-mono text-[#808080]">
              Modify the primary administrator login email and password for this CMS.
            </p>
          </div>
          <span className="px-2 py-1 bg-emerald-950/50 border border-emerald-900/60 text-emerald-400 text-[10px] font-mono uppercase font-bold rounded-xs shrink-0">
            Protected Root Authority
          </span>
        </div>

        {credError && (
          <div className="p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono rounded-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{credError}</span>
          </div>
        )}

        {credSuccess && (
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono rounded-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{credSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Admin Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                Primary Administrator Login Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="gunjanstha01@gmail.com"
                  className="w-full px-4 py-2.5 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] text-xs font-mono rounded-sm focus:outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-[#666666] absolute right-3 top-3" />
              </div>
              <p className="text-[11px] font-mono text-[#666666]">
                All administrative access to this system is restricted to this verified address.
              </p>
            </div>

            {/* Current Password Verification */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c6a87d] font-bold">
                  Current Password (Identity Verification) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-[10px] font-mono text-[#808080] hover:text-[#c6a87d] flex items-center gap-1"
                >
                  {showPasswords ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPasswords ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full px-4 py-2.5 bg-[#080808] border border-[#333333] focus:border-[#c6a87d] text-[#F5F5F5] text-xs font-mono rounded-sm focus:outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-[#c6a87d] absolute right-3 top-3" />
              </div>
              <p className="text-[11px] font-mono text-[#808080]">
                Demo Default: <span className="text-[#c6a87d]">gunjan2026</span>
              </p>
            </div>

            {/* New Password (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                New Password (Optional)
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep existing password"
                  className="w-full px-4 py-2.5 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] text-xs font-mono rounded-sm focus:outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-[#666666] absolute right-3 top-3" />
              </div>
              <p className="text-[11px] font-mono text-[#666666]">
                Minimum 6 characters. Leave empty if you only wish to change your email.
              </p>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  disabled={!newPassword}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] text-xs font-mono rounded-sm focus:outline-none transition-colors disabled:opacity-40"
                />
                <Lock className="w-4 h-4 text-[#666666] absolute right-3 top-3" />
              </div>
            </div>
          </div>

          {/* Sync With Public Profile Toggle */}
          <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm flex items-start gap-3">
            <input
              type="checkbox"
              id="syncProfileEmail"
              checked={syncWithProfile}
              onChange={e => setSyncWithProfile(e.target.checked)}
              className="mt-1 accent-[#c6a87d] cursor-pointer"
            />
            <label htmlFor="syncProfileEmail" className="text-xs font-mono text-[#F5F5F5] cursor-pointer space-y-0.5">
              <span className="font-bold block">
                Synchronize with Public Profile Contact Email
              </span>
              <span className="text-[11px] text-[#808080] block leading-relaxed">
                When enabled, saving will also update the public email displayed on your About page and footer (<span className="text-[#c6a87d]">{profile.email}</span>).
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1f1f1f]">
            <span className="text-[11px] font-mono text-[#666666]">
              Last changed: {currentAdminUser.lastChangedAt ? new Date(currentAdminUser.lastChangedAt).toLocaleDateString() : 'Initial System Provisioning'}
            </span>

            <button
              type="submit"
              disabled={isSavingCreds}
              className="px-6 py-2.5 bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{isSavingCreds ? 'Updating Credentials...' : 'Save Admin Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* 3. ACTIVE SESSIONS & DEVICE MANAGEMENT */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] border border-[#262626] rounded-sm p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f1f1f] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#c6a87d]" />
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
                  Active Administrative Sessions & Devices
                </h3>
              </div>
              <p className="text-[11px] font-mono text-[#808080] mt-1">
                Real-time authorization registry across all logged-in workstations and devices.
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleRetestClient}
                disabled={isRetestingClient}
                className="px-2.5 py-1 bg-[#171717] hover:bg-[#222222] border border-[#262626] hover:border-[#c6a87d]/40 text-[11px] font-mono text-[#c6a87d] rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Re-run client browser & OS fingerprint audit on this workstation"
              >
                <RefreshCw className={`w-3 h-3 ${isRetestingClient ? 'animate-spin' : ''}`} />
                <span>{isRetestingClient ? 'Auditing...' : 'Re-test Client'}</span>
              </button>

              {otherSessions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRevokeAllConfirm(true)}
                  className="px-2.5 py-1 bg-red-950/40 hover:bg-red-950/70 border border-red-900/60 text-red-300 hover:text-red-200 text-[11px] font-mono font-semibold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Terminate all other sessions except this current device"
                >
                  <XCircle className="w-3 h-3" />
                  <span>Revoke All Other ({otherSessions.length})</span>
                </button>
              )}

              <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded-xs">
                {adminSessions.length} Authorized {adminSessions.length === 1 ? 'Device' : 'Devices'}
              </span>
            </div>
          </div>

          {/* Current Device Highlight Card */}
          <div className="border border-emerald-900/50 bg-emerald-950/15 rounded-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                  This Workstation (Current Session)
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-900/40 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded-xs">
                Active Now
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {/* Authenticated Root Identity */}
              <div className="p-2.5 bg-[#0a0a0a]/70 border border-[#1f1f1f] rounded-sm space-y-0.5">
                <span className="text-[#808080] text-[10px] uppercase block">Authenticated Root</span>
                <span className="text-[#F5F5F5] font-semibold truncate block">{currentAdminUser?.email}</span>
                <span className="text-[10px] text-[#666666] block">{currentAdminUser?.role}</span>
              </div>

              {/* Browser Engine */}
              <div className="p-2.5 bg-[#0a0a0a]/70 border border-[#1f1f1f] rounded-sm space-y-0.5">
                <span className="text-[#808080] text-[10px] uppercase block">Audited Browser Engine</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#c6a87d] shrink-0" />
                  <span className="text-[#F5F5F5] font-semibold truncate">{clientInfo.browser}</span>
                </div>
                <span className="text-[10px] text-[#666666] block">Resolution: {clientInfo.screenResolution}</span>
              </div>

              {/* OS & Device */}
              <div className="p-2.5 bg-[#0a0a0a]/70 border border-[#1f1f1f] rounded-sm space-y-0.5">
                <span className="text-[#808080] text-[10px] uppercase block">Operating System & Hardware</span>
                <div className="flex items-center gap-1.5">
                  {clientInfo.deviceType === 'Mobile' ? (
                    <Smartphone className="w-3.5 h-3.5 text-[#c6a87d] shrink-0" />
                  ) : clientInfo.deviceType === 'Tablet' ? (
                    <Monitor className="w-3.5 h-3.5 text-[#c6a87d] shrink-0" />
                  ) : (
                    <Laptop className="w-3.5 h-3.5 text-[#c6a87d] shrink-0" />
                  )}
                  <span className="text-[#F5F5F5] font-semibold truncate">{clientInfo.os}</span>
                </div>
                <span className="text-[10px] text-[#666666] block">Device Category: {clientInfo.deviceType}</span>
              </div>

              {/* Security Context */}
              <div className="p-2.5 bg-[#0a0a0a]/70 border border-[#1f1f1f] rounded-sm space-y-0.5">
                <span className="text-[#808080] text-[10px] uppercase block">Transport Security</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-semibold truncate">TLS 1.3 Encrypted Tunnel</span>
                </div>
                <span className="text-[10px] text-[#666666] block">Session ID: {currentSession?.id || currentSessionId || 'sess_current'}</span>
              </div>
            </div>
          </div>

          {/* Other Active Connected Devices */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#D4D4D4] uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5 text-[#c6a87d]" />
                  <span>Other Active Devices ({otherSessions.length})</span>
                </h4>
                <p className="text-[11px] font-mono text-[#737373] mt-0.5">
                  Targeted revocation: Terminate any individual session remotely without affecting this machine.
                </p>
              </div>
            </div>

            {otherSessions.length > 0 ? (
              <div className="space-y-2.5">
                {otherSessions.map(session => (
                  <div 
                    key={session.id}
                    className="p-3 bg-[#0a0a0a] hover:bg-[#0e0e0e] border border-[#212121] hover:border-[#333333] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#171717] border border-[#262626] rounded-xs text-[#c6a87d] shrink-0 mt-0.5">
                        {session.deviceType === 'Mobile' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : session.os.toLowerCase().includes('mac') ? (
                          <Laptop className="w-4 h-4" />
                        ) : (
                          <Monitor className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[#F5F5F5] font-bold">
                            {session.os}
                          </span>
                          <span className="px-1.5 py-0.2 bg-[#1c1c1c] text-[#A3A3A3] text-[10px] rounded-xs border border-[#2a2a2a]">
                            {session.deviceType}
                          </span>
                          <span className="text-[#808080] text-[11px]">
                            • {session.browser}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#737373] flex items-center gap-2 flex-wrap">
                          <span>{session.location || 'Remote Workstation'}</span>
                          {session.screenResolution && <span>• {session.screenResolution}</span>}
                          <span>• Last active {formatSessionTime(session.lastActiveAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <button
                        type="button"
                        onClick={() => setSessionToRevoke(session)}
                        className="w-full sm:w-auto px-3 py-1.5 bg-red-950/30 hover:bg-red-950/70 border border-red-900/50 hover:border-red-800 text-red-300 text-xs font-mono font-bold rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title={`Terminate ${session.browser} on ${session.os}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Revoke Session</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-mono text-[#808080]">
                  No other active devices detected. Your account is only signed in on this current workstation.
                </p>
              </div>
            )}
          </div>

          {/* Multi-Device Testing Simulator */}
          <div className="pt-3 border-t border-[#1f1f1f] space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-mono text-[#808080]">
                Test Cross-Device Simulation (e.g. Mac vs. Windows):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSimulateDevice('windows')}
                  className="px-2 py-1 bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] hover:border-[#c6a87d]/40 text-[#c6a87d] text-[10px] font-mono rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Simulate a Windows 11 laptop login with Microsoft Edge"
                >
                  <Plus className="w-3 h-3" />
                  <span>Windows 11 Laptop</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateDevice('mac')}
                  className="px-2 py-1 bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] hover:border-[#c6a87d]/40 text-[#c6a87d] text-[10px] font-mono rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Simulate a MacBook Pro login with Safari"
                >
                  <Plus className="w-3 h-3" />
                  <span>MacBook Pro Safari</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateDevice('mobile')}
                  className="px-2 py-1 bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] hover:border-[#c6a87d]/40 text-[#c6a87d] text-[10px] font-mono rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Simulate an iPhone mobile session"
                >
                  <Plus className="w-3 h-3" />
                  <span>iPhone Mobile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Invalidate All Button */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#1f1f1f]">
            <p className="text-[11px] font-mono text-[#808080]">
              Need to invalidate active tokens from public devices?
            </p>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2 bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-red-300 text-xs font-mono font-bold uppercase rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminate All Sessions & Force Logout</span>
            </button>
          </div>
        </div>

        {/* Security Pillars */}
        <div className="bg-[#111111] border border-[#262626] rounded-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#c6a87d]" />
            <span>Defenses in Effect</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-sm space-y-1">
              <span className="text-[#c6a87d] font-bold text-[11px] uppercase block">
                • Closed Registration
              </span>
              <p className="text-[11px] text-[#808080]">
                Zero public sign-up attack surfaces. Only the verified owner can login.
              </p>
            </div>

            <div className="p-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-sm space-y-1">
              <span className="text-[#c6a87d] font-bold text-[11px] uppercase block">
                • Anti-Bot Honeypot
              </span>
              <p className="text-[11px] text-[#808080]">
                Hidden contact trap fields automatically discard automated crawler submissions.
              </p>
            </div>

            <div className="p-2.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-sm space-y-1">
              <span className="text-[#c6a87d] font-bold text-[11px] uppercase block">
                • Immutable Audit Log
              </span>
              <p className="text-[11px] text-[#808080]">
                Every data change or setting update writes an indelible timestamped audit trail.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. RECENT SECURITY EVENTS MINI-FEED */}
      {/* ======================================================== */}
      <div className="bg-[#111111] border border-[#262626] rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c6a87d]" />
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              Recent Security & Access Stream
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setAdminActiveTab('audit-log')}
            className="text-xs font-mono text-[#c6a87d] hover:underline flex items-center gap-1"
          >
            <span>View Full Audit Stream</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentSecurityLogs.length === 0 ? (
          <p className="text-xs font-mono text-[#666666] py-4 text-center">
            No recent security activity recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {recentSecurityLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[#171717] border border-[#262626] text-[#c6a87d] text-[10px] rounded-xs font-semibold">
                    {log.action}
                  </span>
                  <span className="text-[#969696] hidden sm:inline">
                    {log.userEmail || 'System'}
                  </span>
                </div>
                <span className="text-[#666666] text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Force Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-[#111111] border border-red-900/60 rounded-sm p-6 max-w-md w-full space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <LogOut className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#F5F5F5] uppercase">
                Terminate Administrative Session?
              </h3>
            </div>
            <p className="text-xs font-mono text-[#969696] leading-relaxed">
              This will immediately clear your active session token from local storage and record a security termination event in the audit stream. You will be redirected to the login portal.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-[#171717] hover:bg-[#212121] text-xs font-mono text-[#F5F5F5] rounded-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  forceLogoutAllSessions();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs font-mono font-bold text-white rounded-sm"
              >
                Confirm Force Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Targeted Session Revocation Modal */}
      {sessionToRevoke && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSessionToRevoke(null)}
        >
          <div 
            className="bg-[#111111] border border-red-900/60 rounded-sm p-6 max-w-md w-full space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#F5F5F5] uppercase">
                Revoke Device Session?
              </h3>
            </div>
            <div className="p-3 bg-[#0a0a0a] border border-[#212121] rounded-sm text-xs font-mono space-y-1">
              <div className="text-[#F5F5F5] font-bold">
                {sessionToRevoke.os} ({sessionToRevoke.deviceType})
              </div>
              <div className="text-[#808080]">
                Browser: {sessionToRevoke.browser}
              </div>
              <div className="text-[#808080]">
                Location: {sessionToRevoke.location || 'Remote Session'}
              </div>
            </div>
            <p className="text-xs font-mono text-[#969696] leading-relaxed">
              This device will be immediately revoked from accessing the administrative CMS. If that workstation has an open session, it will be forcefully terminated and redirected to the login portal.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSessionToRevoke(null)}
                className="px-4 py-2 bg-[#171717] hover:bg-[#212121] text-xs font-mono text-[#F5F5F5] rounded-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  terminateSession(sessionToRevoke.id);
                  setSessionToRevoke(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs font-mono font-bold text-white rounded-sm cursor-pointer"
              >
                Confirm Revoke Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminate All Other Sessions Confirmation Modal */}
      {showRevokeAllConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowRevokeAllConfirm(false)}
        >
          <div 
            className="bg-[#111111] border border-red-900/60 rounded-sm p-6 max-w-md w-full space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <XCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#F5F5F5] uppercase">
                Terminate All Other Sessions?
              </h3>
            </div>
            <p className="text-xs font-mono text-[#969696] leading-relaxed">
              This will immediately revoke active tokens for all other {otherSessions.length} active device(s) (including other laptops and mobile phones). Only your current workstation will remain logged in.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRevokeAllConfirm(false)}
                className="px-4 py-2 bg-[#171717] hover:bg-[#212121] text-xs font-mono text-[#F5F5F5] rounded-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRevokeAllConfirm(false);
                  terminateAllOtherSessions();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs font-mono font-bold text-white rounded-sm cursor-pointer"
              >
                Terminate {otherSessions.length} Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
