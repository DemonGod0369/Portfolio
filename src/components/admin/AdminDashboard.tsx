import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  BarChart3, 
  MessageSquare, 
  Layers, 
  Image as ImageIcon, 
  Globe, 
  Plus, 
  User, 
  TrendingUp, 
  CheckCircle2
} from 'lucide-react';
import { AdminCaseStudyEditorPanel } from './AdminCaseStudyEditorPanel';
import { AdminJournalEditorPanel } from './AdminJournalEditorPanel';

export const AdminDashboard: React.FC = () => {
  const { 
    projects, 
    blogPosts, 
    contactMessages, 
    galleryImages,
    setAdminActiveTab,
  } = useData();

  // Modals / Editor Drawers opened directly from Dashboard
  const [activeDrawer, setActiveDrawer] = useState<'case-study' | 'journal' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const newMessagesCount = contactMessages.filter(m => m.status === 'NEW').length;
  const totalArchiveCount = projects.length + blogPosts.length;
  const totalLiveCount = projects.filter(p => p.published).length + blogPosts.filter(b => b.status === 'PUBLISHED').length;

  // Website analytics
  const totalVisits = 14280;
  const uniqueVisitors = 8920;
  const bounceRate = '32.4%';
  const avgSessionDuration = '3m 42s';

  const monthlyTraffic = [
    { month: 'Mar', visitors: 1420, pageViews: 3890 },
    { month: 'Apr', visitors: 1850, pageViews: 4920 },
    { month: 'May', visitors: 2240, pageViews: 5810 },
    { month: 'Jun', visitors: 2680, pageViews: 6940 },
    { month: 'Jul', visitors: 2950, pageViews: 7450 },
    { month: 'Aug', visitors: 3140, pageViews: 8200 },
  ];

  const topPages = [
    { path: '/', title: 'Home / Overview', views: '6,420 views', share: '45%' },
    { path: '/work', title: 'Case Studies Archive', views: '3,810 views', share: '27%' },
    { path: '/blog', title: 'Journal & Technical Essays', views: '2,350 views', share: '16%' },
    { path: '/gallery', title: 'Visual Gallery', views: '1,700 views', share: '12%' },
  ];

  const trafficSources = [
    { source: 'Direct & Bookmarks', percent: 42, color: '#c6a87d' },
    { source: 'LinkedIn & Social', percent: 28, color: '#00E5FF' },
    { source: 'Organic Search (Google)', percent: 18, color: '#10B981' },
    { source: 'GitHub & Referrals', percent: 12, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-10 animate-fade-in relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#111111] border border-[#c6a87d] text-xs font-mono text-[#F5F5F5] rounded-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#c6a87d]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#c6a87d]">
            Executive Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F5] uppercase mt-1">
            System & Content Overview
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-mono rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Systems Normal</span>
          </span>
        </div>
      </div>

      {/* 1. METRIC OVERVIEW (4 REQUESTED CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Inquiries Inbox */}
        <div 
          onClick={() => setAdminActiveTab('messages')}
          className="p-6 bg-[#111111] border border-[#262626] hover:border-[#c6a87d]/60 rounded-sm cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#969696]">
            <span>Inquiries Inbox</span>
            <MessageSquare className="w-4 h-4 text-[#c6a87d] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-bold text-[#F5F5F5]">{contactMessages.length}</p>
          <p className="text-[11px] font-mono text-[#c6a87d]">
            {newMessagesCount > 0 ? `${newMessagesCount} unread message(s)` : 'All inquiries reviewed'}
          </p>
        </div>

        {/* Website Visits */}
        <div 
          className="p-6 bg-[#111111] border border-[#262626] hover:border-[#c6a87d]/60 rounded-sm transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#969696]">
            <span>Website Visits</span>
            <Globe className="w-4 h-4 text-[#00E5FF] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-bold text-[#F5F5F5]">{totalVisits.toLocaleString()}</p>
          <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.8% this past month</span>
          </p>
        </div>

        {/* Case Studies & Journal */}
        <div 
          onClick={() => setAdminActiveTab('case-studies-journal')}
          className="p-6 bg-[#111111] border border-[#262626] hover:border-[#c6a87d]/60 rounded-sm cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#969696]">
            <span>Case Studies & Journal</span>
            <Layers className="w-4 h-4 text-[#c6a87d] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-bold text-[#F5F5F5]">{totalArchiveCount}</p>
          <p className="text-[11px] font-mono text-[#666666]">
            {totalLiveCount} live • {projects.length} case studies • {blogPosts.length} journal
          </p>
        </div>

        {/* Gallery Assets */}
        <div 
          onClick={() => setAdminActiveTab('gallery')}
          className="p-6 bg-[#111111] border border-[#262626] hover:border-[#c6a87d]/60 rounded-sm cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#969696]">
            <span>Gallery Assets</span>
            <ImageIcon className="w-4 h-4 text-[#c6a87d] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-bold text-[#F5F5F5]">{galleryImages.length}</p>
          <p className="text-[11px] font-mono text-[#666666]">
            {galleryImages.filter(g => g.published).length} published media assets
          </p>
        </div>
      </div>

      {/* 2. DIRECT QUICK ACTION SHORTCUTS (DIRECTLY OPENS CREATE FORM WITHOUT ROUTE CHANGE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#c6a87d]">
            Direct Action Shortcuts
          </h2>
          <span className="text-[11px] font-mono text-[#666666]">
            Opens form instantly without navigating away
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveDrawer('case-study')}
            className="p-4 bg-[#111111] border border-[#262626] hover:border-[#c6a87d] text-left rounded-sm transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 bg-[#171717] rounded-sm group-hover:bg-[#c6a87d] group-hover:text-[#080808] transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F5F5F5] uppercase">New Case Study</p>
              <p className="text-[10px] font-mono text-[#666666]">Launch case study editor</p>
            </div>
          </button>

          <button
            onClick={() => setActiveDrawer('journal')}
            className="p-4 bg-[#111111] border border-[#262626] hover:border-[#c6a87d] text-left rounded-sm transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 bg-[#171717] rounded-sm group-hover:bg-[#c6a87d] group-hover:text-[#080808] transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F5F5F5] uppercase">New Journal Entry</p>
              <p className="text-[10px] font-mono text-[#666666]">Write Markdown essay</p>
            </div>
          </button>

          <button
            onClick={() => setAdminActiveTab('gallery')}
            className="p-4 bg-[#111111] border border-[#262626] hover:border-[#c6a87d] text-left rounded-sm transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 bg-[#171717] rounded-sm group-hover:bg-[#c6a87d] group-hover:text-[#080808] transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F5F5F5] uppercase">New Gallery Entry</p>
              <p className="text-[10px] font-mono text-[#666666]">Upload media file</p>
            </div>
          </button>

          <button
            onClick={() => setAdminActiveTab('profile')}
            className="p-4 bg-[#111111] border border-[#262626] hover:border-[#c6a87d] text-left rounded-sm transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 bg-[#171717] rounded-sm group-hover:bg-[#c6a87d] group-hover:text-[#080808] transition-colors">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F5F5F5] uppercase">Update Profile</p>
              <p className="text-[10px] font-mono text-[#666666]">Bio, timeline & skills</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. WEBSITE ANALYTICS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#c6a87d] flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Website Analytics & Visitor Telemetry</span>
          </h2>
          <span className="text-[11px] font-mono text-[#666666]">
            Real-time Traffic Tracking • Last 30 Days
          </span>
        </div>

        {/* Analytics Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#969696]">Unique Visitors</span>
            <p className="text-xl font-bold text-[#F5F5F5]">{uniqueVisitors.toLocaleString()}</p>
            <p className="text-[10px] font-mono text-[#10B981]">65% return rate</p>
          </div>

          <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#969696]">Avg Session Time</span>
            <p className="text-xl font-bold text-[#F5F5F5]">{avgSessionDuration}</p>
            <p className="text-[10px] font-mono text-[#c6a87d]">High engagement</p>
          </div>

          <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#969696]">Bounce Rate</span>
            <p className="text-xl font-bold text-[#F5F5F5]">{bounceRate}</p>
            <p className="text-[10px] font-mono text-[#10B981]">Optimal retention</p>
          </div>

          <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#969696]">Device Split</span>
            <p className="text-xl font-bold text-[#F5F5F5]">68% Desktop</p>
            <p className="text-[10px] font-mono text-[#94A3B8]">32% Mobile & Tablet</p>
          </div>
        </div>

        {/* Traffic Chart & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend Bars */}
          <div className="lg:col-span-2 p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-[#F5F5F5] font-bold">Monthly Growth Trajectory</h3>
              <span className="text-[11px] font-mono text-[#969696]">Page Views vs Unique Visitors</span>
            </div>

            <div className="pt-4 space-y-4">
              {monthlyTraffic.map((item) => (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#F5F5F5]">{item.month} 2025</span>
                    <span className="text-[#c6a87d] font-bold">{item.visitors.toLocaleString()} visitors • {item.pageViews.toLocaleString()} views</span>
                  </div>
                  <div className="h-2 w-full bg-[#1c1c1c] rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-[#c6a87d]" 
                      style={{ width: `${(item.visitors / 4000) * 100}%` }} 
                    />
                    <div 
                      className="h-full bg-[#00E5FF]/40" 
                      style={{ width: `${(item.pageViews / 10000) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acquisition Channels */}
          <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
            <h3 className="text-xs font-mono uppercase text-[#F5F5F5] font-bold">Acquisition Sources</h3>
            <div className="space-y-3 pt-2">
              {trafficSources.map((item) => (
                <div key={item.source} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#969696]">{item.source}</span>
                    <span className="text-[#F5F5F5] font-bold">{item.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages Table */}
        <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
          <h3 className="text-xs font-mono uppercase text-[#F5F5F5] font-bold">Top Performing Pages & Case Studies</h3>
          <div className="divide-y divide-[#1c1c1c]">
            {topPages.map((page) => (
              <div key={page.path} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#F5F5F5]">{page.title}</p>
                  <p className="text-[10px] font-mono text-[#666666]">{page.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-[#c6a87d] font-bold">{page.views}</p>
                  <p className="text-[10px] font-mono text-[#969696]">{page.share} traffic</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direct Drawers when clicking Quick Actions */}
      <AdminCaseStudyEditorPanel
        isOpen={activeDrawer === 'case-study'}
        onClose={(savedDraft) => {
          setActiveDrawer(null);
          if (savedDraft) showToast('Case study saved to Drafts');
        }}
      />

      <AdminJournalEditorPanel
        isOpen={activeDrawer === 'journal'}
        onClose={(savedDraft) => {
          setActiveDrawer(null);
          if (savedDraft) showToast('Journal entry saved to Drafts');
        }}
      />
    </div>
  );
};
