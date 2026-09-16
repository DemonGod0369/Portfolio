import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { ContactMessage, ContactMessageStatus } from '../../types';
import { ImageUploadField } from '../ui/ImageUploadField';
import { 
  Mail, 
  Trash2, 
  Archive, 
  CheckCircle, 
  CheckCircle2,
  FileText,
  X,
  Shield, 
  Settings, 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Activity, 
  Search, 
  Lock,
  Globe,
  Sliders,
  AlertTriangle
} from 'lucide-react';

// ==========================================
// 1. MESSAGES INBOX
// ==========================================
export const AdminMessagesManager: React.FC = () => {
  const { contactMessages, updateMessageStatus, deleteMessage, openConfirmModal } = useData();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'NEW') {
      updateMessageStatus(msg.id, 'READ');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-[#262626] pb-4">
        <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Inquiries & Contact Inbox</h2>
        <p className="text-xs font-mono text-[#969696]">Private messages submitted through the public portal contact form.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 bg-[#111111] border border-[#262626] rounded-sm divide-y divide-[#1c1c1c] max-h-[600px] overflow-y-auto">
          {contactMessages.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#666666]">
              No messages received yet.
            </div>
          ) : (
            contactMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 cursor-pointer transition-colors space-y-1 ${
                  selectedMessage?.id === msg.id ? 'bg-[#1a1a1a] border-l-2 border-[#c6a87d]' : 'hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5F5F5]">{msg.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                    msg.status === 'NEW'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                      : msg.status === 'ARCHIVED'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-zinc-900 text-zinc-400'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-xs text-[#c6a87d] font-mono truncate">{msg.subject || 'No Subject'}</p>
                <p className="text-[11px] text-[#969696] line-clamp-1">{msg.message}</p>
                <p className="text-[10px] font-mono text-[#666666] pt-1">
                  {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Selected Message Detail */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#262626] p-6 rounded-sm">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#262626] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F5]">{selectedMessage.subject || 'Inquiry'}</h3>
                  <div className="text-xs font-mono text-[#969696] mt-1 space-y-0.5">
                    <p>From: <span className="text-[#F5F5F5]">{selectedMessage.name}</span> ({selectedMessage.email})</p>
                    <p>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, selectedMessage.status === 'ARCHIVED' ? 'READ' : 'ARCHIVED')}
                    className="p-2 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] rounded-sm text-xs font-mono"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      openConfirmModal({
                        title: 'Delete Message?',
                        message: `Permanently delete message from ${selectedMessage.name}? This action cannot be undone.`,
                        confirmLabel: 'Delete',
                        destructive: true,
                        onConfirm: () => {
                          deleteMessage(selectedMessage.id);
                          setSelectedMessage(null);
                        },
                      });
                    }}
                    className="p-2 bg-[#171717] hover:text-red-400 border border-[#262626] rounded-sm text-xs font-mono"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#080808] border border-[#262626] rounded-sm text-sm text-[#d6d6d6] leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Your inquiry on Gunjan Shrestha Platform')}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs font-mono text-[#666666]">
              Select a message from the list to review details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { AdminSeoAndSettingsManager } from './AdminSeoAndSettingsManager';

// ==========================================
// 2. SETTINGS & SEO (POWERED BY ADVANCED SUITE)
// ==========================================
export const AdminSettingsManager: React.FC = () => {
  return <AdminSeoAndSettingsManager />;
};

// ==========================================
// 3. SECURITY CENTER
// ==========================================
export { AdminSecurityManager } from './AdminSecurityManager';

// ==========================================
// 4. AUDIT LOG MANAGER
// ==========================================
export const AdminAuditLogManager: React.FC = () => {
  const { auditLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">System Audit Log</h2>
          <p className="text-xs font-mono text-[#969696]">Real-time chronological record of all administrative operations.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search action or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
          />
          <Search className="w-3.5 h-3.5 text-[#666666] absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="bg-[#111111] border border-[#262626] rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-[#262626] bg-[#0c0c0c] text-[#666666] uppercase">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity Type</th>
              <th className="p-4">Entity ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c1c]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#171717]/50">
                <td className="p-4 text-[#666666]">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 bg-[#171717] border border-[#262626] text-[#c6a87d] rounded text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-[#F5F5F5]">{log.entityType}</td>
                <td className="p-4 text-[#969696]">{log.entityId || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 5. DATABASE BACKUP & RESTORE
// ==========================================
export const AdminBackupManager: React.FC = () => {
  const { exportDatabaseBackup, importDatabaseBackup, resetToInitialState, openConfirmModal } = useData();
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    content: string;
    summary?: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const backup = exportDatabaseBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gunjan_shrestha_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setImportStatus({
        success: false,
        message: 'Invalid file format. Please upload a verified .json snapshot file.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Summarize items present in the snapshot
        const items: string[] = [];
        if (parsed.projects && Array.isArray(parsed.projects)) items.push(`${parsed.projects.length} Case Studies`);
        if (parsed.blogPosts && Array.isArray(parsed.blogPosts)) items.push(`${parsed.blogPosts.length} Articles`);
        if (parsed.skills && Array.isArray(parsed.skills)) items.push(`${parsed.skills.length} Skills`);
        if (parsed.experiences && Array.isArray(parsed.experiences)) items.push(`${parsed.experiences.length} Experiences`);
        if (parsed.galleryImages && Array.isArray(parsed.galleryImages)) items.push(`${parsed.galleryImages.length} Gallery Images`);

        setSelectedFile({
          name: file.name,
          size: file.size,
          content: text,
          summary: items.length > 0 ? items.join(' • ') : 'Verified platform database backup',
        });
        setImportStatus(null);
      } catch {
        setImportStatus({
          success: false,
          message: 'Malformed JSON: Unable to parse the selected file. Please ensure it is a valid JSON snapshot.',
        });
      }
    };
    reader.onerror = () => {
      setImportStatus({
        success: false,
        message: 'File read error: Failed to read the selected file.',
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearSelected = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExecuteRestore = () => {
    if (!selectedFile) return;

    openConfirmModal({
      title: 'Restore Snapshot from JSON?',
      message: `Are you sure you want to restore the platform database from "${selectedFile.name}"? Current data will be replaced with the snapshot contents.`,
      confirmLabel: 'Confirm & Restore',
      destructive: true,
      onConfirm: () => {
        const res = importDatabaseBackup(selectedFile.content);
        if (res.success) {
          setImportStatus({
            success: true,
            message: 'Database successfully restored from JSON backup!',
          });
          handleClearSelected();
        } else {
          setImportStatus({
            success: false,
            message: `Import Error: ${res.message}`,
          });
        }
      },
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="border-b border-[#262626] pb-4">
        <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Database Backup & Disaster Recovery</h2>
        <p className="text-xs font-mono text-[#969696]">Export or restore complete platform data in standard JSON format.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Export Column */}
        <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
          <div className="flex items-center gap-2 text-[#c6a87d]">
            <Download className="w-5 h-5" />
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase">Export Database Snapshot</h3>
          </div>
          <p className="text-xs text-[#969696] leading-relaxed">
            Download a portable JSON payload containing all profile information, experience items, education, skills, services, projects, blog posts, and gallery images.
          </p>
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Snapshot</span>
          </button>
        </div>

        {/* Factory Reset Column */}
        <div className="p-6 bg-[#111111] border border-red-950/60 rounded-sm space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase">Reset to Factory Data</h3>
          </div>
          <p className="text-xs text-[#969696] leading-relaxed">
            Restore all initial verified entries for Gunjan Shrestha (Nepal tech, software projects, authentic journal entries).
          </p>
          <button
            onClick={() => {
              openConfirmModal({
                title: 'Reset to Factory Data?',
                message: 'Are you sure you want to reset all content back to factory initial state? All custom modifications will be replaced with initial verified records.',
                confirmLabel: 'Reset All',
                destructive: true,
                onConfirm: () => resetToInitialState(),
              });
            }}
            className="w-full py-3 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Factory State</span>
          </button>
        </div>
      </div>

      {/* Restore / Import Form */}
      <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
        <div className="flex items-center gap-2 text-[#c6a87d]">
          <Upload className="w-5 h-5" />
          <h3 className="text-sm font-bold text-[#F5F5F5] uppercase">Restore Snapshot from JSON</h3>
        </div>

        <p className="text-xs text-[#969696]">
          Upload a valid JSON database snapshot file previously exported from this platform to restore your data.
        </p>

        {importStatus && (
          <div
            className={`p-3 text-xs font-mono rounded-sm flex items-center gap-2 border ${
              importStatus.success
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-red-950/40 border-red-800 text-red-300'
            }`}
          >
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json,application/json"
          onChange={handleFileInputChange}
          className="hidden"
          id="restore-snapshot-file-input"
        />

        {!selectedFile ? (
          /* Drag and Drop Zone */
          <div
            id="restore-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer p-8 border-2 border-dashed rounded-sm text-center transition-all ${
              dragOver
                ? 'border-[#c6a87d] bg-[#c6a87d]/10'
                : 'border-[#262626] hover:border-[#c6a87d]/60 bg-[#080808] hover:bg-[#121212]'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-[#171717] text-[#c6a87d] rounded-sm">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
                  Click to select or drag & drop snapshot JSON file
                </p>
                <p className="text-[11px] font-mono text-[#777777] mt-1">
                  Accepts .json backup files exported from this system
                </p>
              </div>
              <span className="inline-block px-3 py-1 bg-[#171717] hover:bg-[#202020] border border-[#333333] text-[11px] font-mono text-[#c6a87d] rounded-sm transition-colors">
                Browse File
              </span>
            </div>
          </div>
        ) : (
          /* File Selected Card & Execution Action */
          <div className="p-5 bg-[#080808] border border-[#c6a87d]/50 rounded-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#c6a87d]/10 text-[#c6a87d] rounded-sm mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F5] break-all">{selectedFile.name}</h4>
                  <p className="text-xs font-mono text-[#969696] mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  {selectedFile.summary && (
                    <p className="text-[11px] font-mono text-[#c6a87d] mt-2 inline-block px-2 py-0.5 bg-[#171717] border border-[#262626] rounded">
                      {selectedFile.summary}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearSelected}
                className="p-1.5 text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1a1a1a] rounded transition-colors"
                title="Remove and pick another file"
                id="btn-clear-snapshot-file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#1e1e1e]">
              <button
                type="button"
                onClick={handleExecuteRestore}
                id="btn-execute-restore"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Execute Restore</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2 bg-[#171717] hover:bg-[#222222] border border-[#262626] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors text-center"
              >
                Choose Different File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
