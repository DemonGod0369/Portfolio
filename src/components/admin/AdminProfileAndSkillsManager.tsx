import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ImageUploadField } from '../ui/ImageUploadField';
import { Plus, Edit2, Trash2, Check, X, Shield, Eye, EyeOff } from 'lucide-react';

export const AdminProfileAndEducationManager: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    educations, 
    addEducation, 
    updateEducation, 
    deleteEducation,
    siteSettings,
    updateSiteSettings,
    openConfirmModal,
  } = useData();

  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    headline: profile.headline,
    shortBio: profile.shortBio,
    longBio: profile.longBio,
    profileImageUrl: profile.profileImageUrl,
    email: profile.email,
    phone: profile.phone || '',
    location: profile.location,
    website: profile.website,
  });

  const [logoState, setLogoState] = useState(siteSettings.logoUrl || '');

  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({
    institution: '',
    qualification: '',
    field: '',
    location: 'Kathmandu, Nepal',
    startDate: '2020',
    endDate: '2024',
    description: '',
    displayOrder: educations.length + 1,
    published: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    if (logoState !== (siteSettings.logoUrl || '')) {
      updateSiteSettings({ logoUrl: logoState });
    }
  };

  const handleEduSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEducation(eduForm);
    setIsAddingEdu(false);
    setEduForm({
      institution: '',
      qualification: '',
      field: '',
      location: 'Kathmandu, Nepal',
      startDate: '2020',
      endDate: '2024',
      description: '',
      displayOrder: educations.length + 2,
      published: true,
    });
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Profile Section */}
      <div className="space-y-6">
        <div className="border-b border-[#262626] pb-3">
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Personal Identity & Profile</h2>
          <p className="text-xs font-mono text-[#969696]">Core presentation credentials and brand statements.</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-6">
          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Full Legal / Display Name</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          {/* Profile Picture Uploader with Side-by-Side Live Preview */}
          <ImageUploadField
            label="Profile Picture / Avatar"
            value={profileForm.profileImageUrl}
            onChange={(val) => setProfileForm({ ...profileForm, profileImageUrl: val })}
            aspectRatio="portrait"
            previewLabel="Profile Photo Preview"
            helperText="Upload your official portrait/avatar or paste an image URL. Shows on About page, hero cards, and case studies."
          />

          {/* Personal Brand Logo Uploader with Side-by-Side Live Preview */}
          <ImageUploadField
            label="Personal Brand Logo (Header & Footer)"
            value={logoState}
            onChange={(val) => setLogoState(val)}
            aspectRatio="square"
            previewLabel="Header & Footer Logo Preview"
            helperText="Upload your personal signature or brand logo (SVG, PNG, or WEBP with transparent background recommended)."
          />

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Core Headline / Value Proposition</label>
            <input
              type="text"
              required
              value={profileForm.headline}
              onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Short Bio (Introduction Quote)</label>
            <textarea
              rows={2}
              required
              value={profileForm.shortBio}
              onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Detailed Background Biography</label>
            <textarea
              rows={4}
              required
              value={profileForm.longBio}
              onChange={(e) => setProfileForm({ ...profileForm, longBio: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Location</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Official Website</label>
              <input
                type="text"
                value={profileForm.website}
                onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Update Profile Information
            </button>
          </div>
        </form>
      </div>

      {/* Education Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Education & Academic History</h2>
            <p className="text-xs font-mono text-[#969696]">Maintained separately from commercial experience.</p>
          </div>
          <button
            onClick={() => setIsAddingEdu(!isAddingEdu)}
            className="px-4 py-1.5 bg-[#171717] border border-[#262626] hover:border-[#c6a87d] text-xs font-mono text-[#c6a87d] rounded-sm"
          >
            + Add Academic Record
          </button>
        </div>

        {isAddingEdu && (
          <form onSubmit={handleEduSubmit} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
            <h3 className="text-sm font-bold text-[#c6a87d] uppercase">New Academic Qualification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Institution</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. Tribhuvan University Affiliated Institute"
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Qualification Title</label>
                <input
                  type="text"
                  required
                  value={eduForm.qualification}
                  onChange={(e) => setEduForm({ ...eduForm, qualification: e.target.value })}
                  placeholder="e.g. Bachelor in Information Technology"
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Field of Study</label>
                <input
                  type="text"
                  value={eduForm.field}
                  onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                  placeholder="Software Engineering"
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Start Year</label>
                <input
                  type="text"
                  value={eduForm.startDate}
                  onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">End Year / Completion</label>
                <input
                  type="text"
                  value={eduForm.endDate}
                  onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Curriculum Description</label>
              <textarea
                rows={2}
                value={eduForm.description}
                onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingEdu(false)}
                className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm"
              >
                Save Record
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {educations.map((edu) => (
            <div key={edu.id} className="p-4 bg-[#111111] border border-[#262626] rounded-sm flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#F5F5F5]">{edu.qualification}</p>
                <p className="text-xs font-mono text-[#969696]">{edu.institution} • {edu.startDate} — {edu.endDate || 'Present'}</p>
              </div>
              <button
                onClick={() => {
                  openConfirmModal({
                    title: 'Delete Education Record?',
                    message: `Are you sure you want to permanently remove "${edu.qualification}"? This action cannot be undone.`,
                    confirmLabel: 'Delete',
                    destructive: true,
                    onConfirm: () => deleteEducation(edu.id),
                  });
                }}
                className="p-1.5 text-[#969696] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminSkillsAndServicesManager: React.FC = () => {
  const { 
    skillCategories, 
    skills, 
    addSkill, 
    updateSkill,
    deleteSkill, 
    services, 
    addService, 
    updateService, 
    deleteService,
    openConfirmModal,
  } = useData();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [targetCatId, setTargetCatId] = useState(skillCategories[0]?.id || '');

  const [isAddingSrv, setIsAddingSrv] = useState(false);
  const [srvForm, setSrvForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    published: true,
    featured: false,
    displayOrder: services.length + 1,
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !targetCatId) return;

    addSkill({
      categoryId: targetCatId,
      name: newSkillName.trim(),
      slug: newSkillName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newSkillDesc.trim(),
      displayOrder: skills.length + 1,
      published: true,
    });

    setNewSkillName('');
    setNewSkillDesc('');
  };

  const handleAddSrv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvForm.title.trim()) return;

    addService({
      ...srvForm,
      slug: srvForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });

    setIsAddingSrv(false);
    setSrvForm({
      title: '',
      shortDescription: '',
      description: '',
      published: true,
      featured: false,
      displayOrder: services.length + 2,
    });
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Skills Management */}
      <div className="space-y-6">
        <div className="border-b border-[#262626] pb-3">
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Skills & Categorized Competencies</h2>
          <p className="text-xs font-mono text-[#969696]">No percentage bars. Structured by capability domains.</p>
        </div>

        {/* Add Skill Mini Form */}
        <form onSubmit={handleAddSkill} className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-3">
          <p className="text-xs font-mono text-[#c6a87d] uppercase">Quick Add Competency</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={targetCatId}
              onChange={(e) => setTargetCatId(e.target.value)}
              className="px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
            >
              {skillCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Skill Name (e.g. PostgreSQL & Prisma)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
            />
            <input
              type="text"
              placeholder="Short descriptor"
              value={newSkillDesc}
              onChange={(e) => setNewSkillDesc(e.target.value)}
              className="px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase rounded-sm"
            >
              + Add Skill
            </button>
          </div>
        </form>

        {/* Skills list grouped */}
        <div className="space-y-6">
          {/* Unassigned Skills (from deleted categories) */}
          {skills.filter(s => !skillCategories.some(c => c.id === s.categoryId)).length > 0 && (
            <div className="p-5 bg-[#161208] border border-amber-900/60 rounded-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    ⚠️ Unassigned Skills ({skills.filter(s => !skillCategories.some(c => c.id === s.categoryId)).length})
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono rounded">
                    Hidden from website
                  </span>
                </div>
                <p className="text-[11px] text-amber-400/80 font-mono">
                  Select a category to reassign and publish
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.filter(s => !skillCategories.some(c => c.id === s.categoryId)).map((s) => (
                  <div key={s.id} className="p-3 bg-[#0a0804] border border-amber-900/40 rounded-sm flex flex-col justify-between gap-2.5">
                    <div>
                      <p className="text-xs font-semibold text-amber-200">{s.name}</p>
                      {s.description && <p className="text-[11px] text-[#888888] mt-0.5">{s.description}</p>}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-950">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-mono text-[#888888] shrink-0">Assign to:</span>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              updateSkill(s.id, { categoryId: e.target.value, published: true });
                            }
                          }}
                          className="w-full px-2 py-1 bg-[#121212] border border-[#333333] text-[11px] text-amber-300 rounded focus:border-[#c6a87d] focus:outline-none"
                        >
                          <option value="">-- Choose Category --</option>
                          {skillCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          openConfirmModal({
                            title: 'Delete Skill?',
                            message: `Are you sure you want to delete "${s.name}"? This action cannot be undone.`,
                            confirmLabel: 'Delete',
                            destructive: true,
                            onConfirm: () => deleteSkill(s.id),
                          });
                        }}
                        className="text-[#666666] hover:text-red-400 p-1 shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skillCategories.map((cat) => (
            <div key={cat.id} className="p-5 bg-[#111111] border border-[#262626] rounded-sm space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#c6a87d] border-b border-[#1c1c1c] pb-2">
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.filter(s => s.categoryId === cat.id).map((s) => (
                  <div key={s.id} className="p-3 bg-[#080808] border border-[#262626] rounded-sm flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-[#F5F5F5]">{s.name}</p>
                      {s.description && <p className="text-[11px] text-[#666666]">{s.description}</p>}
                    </div>
                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: 'Delete Skill?',
                          message: `Are you sure you want to delete "${s.name}"? This action cannot be undone.`,
                          confirmLabel: 'Delete',
                          destructive: true,
                          onConfirm: () => deleteSkill(s.id),
                        });
                      }}
                      className="text-[#666666] hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Services Offered</h2>
            <p className="text-xs font-mono text-[#969696]">Only display verified services you actually provide.</p>
          </div>
          <button
            onClick={() => setIsAddingSrv(!isAddingSrv)}
            className="px-4 py-1.5 bg-[#171717] border border-[#262626] hover:border-[#c6a87d] text-xs font-mono text-[#c6a87d] rounded-sm"
          >
            + New Service
          </button>
        </div>

        {isAddingSrv && (
          <form onSubmit={handleAddSrv} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Service Title</label>
              <input
                type="text"
                required
                value={srvForm.title}
                onChange={(e) => setSrvForm({ ...srvForm, title: e.target.value })}
                placeholder="e.g. Website & Interface Design"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Short Description</label>
              <input
                type="text"
                required
                value={srvForm.shortDescription}
                onChange={(e) => setSrvForm({ ...srvForm, shortDescription: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Detailed Description</label>
              <textarea
                rows={2}
                value={srvForm.description}
                onChange={(e) => setSrvForm({ ...srvForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingSrv(false)}
                className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm"
              >
                Save Service
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="p-5 bg-[#111111] border border-[#262626] rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F5F5F5]">{srv.title}</h3>
                <button
                  onClick={() => updateService(srv.id, { published: !srv.published })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    srv.published ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {srv.published ? 'Published' : 'Hidden'}
                </button>
              </div>
              <p className="text-xs text-[#969696] line-clamp-2">{srv.shortDescription}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    openConfirmModal({
                      title: 'Delete Service Offering?',
                      message: `Are you sure you want to delete service "${srv.title}"? This action cannot be undone.`,
                      confirmLabel: 'Delete',
                      destructive: true,
                      onConfirm: () => deleteService(srv.id),
                    });
                  }}
                  className="p-1 text-[#666666] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
