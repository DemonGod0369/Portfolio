import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, setCurrentRoute, currentAdminUser } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 animate-fade-in">
      <div className="max-w-md w-full space-y-8 bg-[#111111] border border-[#262626] p-8 md:p-10 rounded-sm shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-[#171717] border border-[#262626] rounded-full flex items-center justify-center mx-auto text-[#c6a87d]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5] uppercase">
              Private CMS Portal
            </h1>
            <p className="text-xs font-mono text-[#969696] mt-1">
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
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#666666] absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#969696]">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#080808] border border-[#262626] focus:border-[#c6a87d] text-[#F5F5F5] placeholder-[#444444] rounded-sm text-sm focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#666666] absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-[#080808] bg-[#c6a87d] hover:bg-[#d8bc93] disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => setCurrentRoute('home')}
            className="text-xs font-mono text-[#666666] hover:text-[#969696] flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
