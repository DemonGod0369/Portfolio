import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Experience, Project, BlogPost, GalleryImage, SkillCategory, Skill, Service, Education, BlogPostStatus, ContentCategory } from '../../types';
import { ImageUploadField } from '../ui/ImageUploadField';
import { Plus, Edit2, Trash2, Check, X, Tag, Eye, EyeOff, Layers, Image, FileText, ArrowUp, ArrowDown } from 'lucide-react';

// ==========================================
// 1. EXPERIENCE MANAGER
// ==========================================
export const AdminExperienceManager: React.FC = () => {
  const { experiences, addExperience, updateExperience, deleteExperience, openConfirmModal } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    category: 'Operations & Management',
    title: '',
    roleTitle: '',
    organization: '',
    location: 'Nepal',
    startDate: '2024',
    endDate: '',
    isCurrent: false,
    shortDescription: '',
    description: '',
    tags: 'IT, Software, Web',
    featured: true,
    displayOrder: experiences.length + 1,
    published: true,
  });

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      category: exp.category,
      title: exp.title,
      roleTitle: exp.roleTitle || '',
      organization: exp.organization || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      shortDescription: exp.shortDescription,
      description: exp.description,
      tags: exp.tags.join(', '),
      featured: exp.featured,
      displayOrder: exp.displayOrder,
      published: exp.published,
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingId) {
      updateExperience(editingId, {
        ...form,
        tags: tagsArray,
      });
    } else {
      addExperience({
        ...form,
        tags: tagsArray,
      });
    }

    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Experience Management</h2>
          <p className="text-xs font-mono text-[#969696]">Control chronological and thematic milestones on the hybrid timeline.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              category: `0${experiences.length + 1} — Technology`,
              title: '',
              roleTitle: '',
              organization: '',
              location: 'Kathmandu, Nepal',
              startDate: '2024',
              endDate: '',
              isCurrent: false,
              shortDescription: '',
              description: '',
              tags: 'Technology, Systems',
              featured: true,
              displayOrder: experiences.length + 1,
              published: true,
            });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Milestone</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
          <h3 className="text-sm font-bold text-[#c6a87d] uppercase tracking-wider border-b border-[#262626] pb-2">
            {editingId ? 'Edit Experience Milestone' : 'Create New Milestone'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Category / Domain</label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Operations & Management"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Milestone / Discipline Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Information Technology"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Role Title</label>
              <input
                type="text"
                value={form.roleTitle}
                onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                placeholder="e.g. Systems Practitioner"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Organization / Context</label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="e.g. Commercial Enterprise"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Kathmandu, Nepal"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Start Year / Date</label>
              <input
                type="text"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                placeholder="2022"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">End Year / Date</label>
              <input
                type="text"
                disabled={form.isCurrent}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                placeholder="2024"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d] disabled:opacity-40"
              />
            </div>

            <div className="pt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={form.isCurrent}
                onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                className="accent-[#c6a87d]"
              />
              <label htmlFor="isCurrent" className="text-xs font-mono text-[#F5F5F5]">Currently active</label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Short Description (for preview cards)</label>
            <input
              type="text"
              required
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Detailed Narrative (for full timeline)</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-[#c6a87d]"
              />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-[#c6a87d]"
              />
              <span>Published (Visible publicly)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingId(null); }}
              className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Experience Table List */}
      <div className="bg-[#111111] border border-[#262626] rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-[#262626] bg-[#0c0c0c] text-[#666666] uppercase tracking-wider">
            <tr>
              <th className="p-4">Seq</th>
              <th className="p-4">Category / Title</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Period</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c1c]">
            {experiences.map((exp) => (
              <tr key={exp.id} className="hover:bg-[#171717]/50">
                <td className="p-4 text-[#666666]">{exp.displayOrder}</td>
                <td className="p-4">
                  <p className="text-[#F5F5F5] font-semibold">{exp.title}</p>
                  <p className="text-[#c6a87d] text-[11px]">{exp.category}</p>
                </td>
                <td className="p-4 text-[#969696]">{exp.organization || '—'}</td>
                <td className="p-4 text-[#969696]">
                  {exp.startDate} {exp.isCurrent ? '(Present)' : exp.endDate ? `— ${exp.endDate}` : ''}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => updateExperience(exp.id, { published: !exp.published })}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1 ${
                      exp.published
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {exp.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{exp.published ? 'Published' : 'Hidden'}</span>
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-1.5 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: 'Delete Career Milestone?',
                          message: `Are you sure you want to permanently delete "${exp.title}"? This action cannot be undone.`,
                          confirmLabel: 'Delete',
                          destructive: true,
                          onConfirm: () => deleteExperience(exp.id),
                        });
                      }}
                      className="p-1.5 bg-[#171717] hover:text-red-400 border border-[#262626] rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 2. PROJECT & CASE STUDY MANAGER
// ==========================================
export const AdminProjectManager: React.FC = () => {
  const { projects, contentCategories, addProject, updateProject, deleteProject, openConfirmModal } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Software & Web',
    shortSummary: '',
    overview: '',
    problem: '',
    approach: '',
    design: '',
    technology: '',
    result: '',
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
    liveUrl: '',
    githubUrl: '',
    featured: true,
    published: true,
    displayOrder: projects.length + 1,
  });

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setForm({
      title: proj.title,
      slug: proj.slug,
      category: proj.category,
      shortSummary: proj.shortSummary,
      overview: proj.overview || '',
      problem: proj.problem || '',
      approach: proj.approach || '',
      design: proj.design || '',
      technology: proj.technology || '',
      result: proj.result || '',
      heroImage: proj.heroImage,
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: proj.featured,
      published: proj.published,
      displayOrder: proj.displayOrder,
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slugValue = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingId) {
      updateProject(editingId, { ...form, slug: slugValue });
    } else {
      addProject({
        ...form,
        slug: slugValue,
        images: [],
      });
    }

    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Project & Portfolio Manager</h2>
          <p className="text-xs font-mono text-[#969696]">Manage featured projects, case studies, and visual gallery assets.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              title: '',
              slug: '',
              category: 'Software Design',
              shortSummary: '',
              overview: '',
              problem: '',
              approach: '',
              design: '',
              technology: '',
              result: '',
              heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
              liveUrl: '',
              githubUrl: '',
              featured: true,
              published: true,
              displayOrder: projects.length + 1,
            });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-5">
          <h3 className="text-sm font-bold text-[#c6a87d] uppercase tracking-wider border-b border-[#262626] pb-2">
            {editingId ? 'Edit Project / Case Study' : 'Create New Project'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-[#969696] mb-1">Project Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Gold & Silver Trade Ledger Engine"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Category / Domain</label>
              <div className="space-y-1">
                <select
                  value={contentCategories.some(c => c.name === form.category) ? form.category : '__CUSTOM__'}
                  onChange={(e) => {
                    if (e.target.value !== '__CUSTOM__') {
                      setForm({ ...form, category: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                >
                  <option value="">-- Choose Category --</option>
                  {contentCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="__CUSTOM__">✍ Custom / New Category...</option>
                </select>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Software & Business Solutions"
                  className="w-full px-3 py-1.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Slug (URL identifier)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. gold-silver-trade-ledger"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            {/* Project Hero Image with Side-by-Side Live Preview */}
            <ImageUploadField
              label="Project Primary Cover / Hero Image"
              value={form.heroImage}
              onChange={(val) => setForm({ ...form, heroImage: val })}
              aspectRatio="video"
              previewLabel="Project Hero Preview"
              helperText="Upload a featured screenshot, architectural render, or project banner."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Short Summary</label>
            <input
              type="text"
              required
              value={form.shortSummary}
              onChange={(e) => setForm({ ...form, shortSummary: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          {/* Case study fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1c1c1c]">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">01 / Overview</label>
              <textarea
                rows={2}
                value={form.overview}
                onChange={(e) => setForm({ ...form, overview: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">02 / Problem</label>
              <textarea
                rows={2}
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">03 / Approach</label>
              <textarea
                rows={2}
                value={form.approach}
                onChange={(e) => setForm({ ...form, approach: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">04 / Result & Impact</label>
              <textarea
                rows={2}
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-[#c6a87d]"
              />
              <span>Feature on Homepage</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-[#c6a87d]"
              />
              <span>Published</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingId(null); }}
              className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#c6a87d]">
                  {proj.category}
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">{proj.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateProject(proj.id, { published: !proj.published })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    proj.published
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {proj.published ? 'Published' : 'Hidden'}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#969696] line-clamp-2 leading-relaxed">
              {proj.shortSummary}
            </p>

            <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#666666]">
                slug: /{proj.slug}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(proj)}
                  className="px-3 py-1 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] text-xs font-mono rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    openConfirmModal({
                      title: 'Delete Case Study / Project?',
                      message: `Are you sure you want to permanently delete "${proj.title}"? This action cannot be undone.`,
                      confirmLabel: 'Delete',
                      destructive: true,
                      onConfirm: () => deleteProject(proj.id),
                    });
                  }}
                  className="p-1.5 bg-[#171717] hover:text-red-400 border border-[#262626] rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. BLOG CMS MANAGER
// ==========================================
export const AdminBlogManager: React.FC = () => {
  const { blogPosts, contentCategories, addBlogPost, updateBlogPost, deleteBlogPost, openConfirmModal } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    coverImageUrl: string;
    content: string;
    category: string;
    tags: string;
    readingTime: number;
    status: BlogPostStatus;
    featured: boolean;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
    content: '',
    category: 'Design & Philosophy',
    tags: 'Systems, Architecture, Technology',
    readingTime: 5,
    status: 'PUBLISHED',
    featured: false,
  });

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      readingTime: post.readingTime,
      status: post.status,
      featured: post.featured,
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slugValue = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingId) {
      updateBlogPost(editingId, {
        ...form,
        slug: slugValue,
        tags: tagsArray,
        publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      });
    } else {
      addBlogPost({
        ...form,
        slug: slugValue,
        tags: tagsArray,
        publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      });
    }

    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Blog & Journal CMS</h2>
          <p className="text-xs font-mono text-[#969696]">Write and publish Markdown journal entries with reading time and category taxonomy.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              title: '',
              slug: '',
              excerpt: '',
              coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
              content: `Write your thoughts here in Markdown...\n\n### Core Concept\n\nExplain the foundational principle clearly.`,
              category: 'Technology & Systems',
              tags: 'Systems, Nepal, Business',
              readingTime: 5,
              status: 'DRAFT',
              featured: false,
            });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
          <h3 className="text-sm font-bold text-[#c6a87d] uppercase tracking-wider border-b border-[#262626] pb-2">
            {editingId ? 'Edit Journal Entry' : 'Create New Journal Entry'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-[#969696] mb-1">Article Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Why I Prefer Building Systems Over Screens"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Category / Domain</label>
              <div className="space-y-1">
                <select
                  value={contentCategories.some(c => c.name === form.category) ? form.category : '__CUSTOM__'}
                  onChange={(e) => {
                    if (e.target.value !== '__CUSTOM__') {
                      setForm({ ...form, category: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                >
                  <option value="">-- Choose Category --</option>
                  {contentCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="__CUSTOM__">✍ Custom / New Category...</option>
                </select>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Design & Philosophy"
                  className="w-full px-3 py-1.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated-from-title"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Reading Time (minutes)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={form.readingTime}
                onChange={(e) => setForm({ ...form, readingTime: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Publication Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as BlogPostStatus })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              >
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="PUBLISHED">PUBLISHED (Live)</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Short Excerpt</label>
            <input
              type="text"
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          {/* Article Cover Image with Side-by-Side Live Preview */}
          <ImageUploadField
            label="Article Cover Header Image"
            value={form.coverImageUrl}
            onChange={(val) => setForm({ ...form, coverImageUrl: val })}
            aspectRatio="video"
            previewLabel="Cover Image Preview"
            helperText="Upload a high-resolution cover image or paste a link for this journal article."
          />

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Markdown Body Content</label>
            <textarea
              rows={8}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingId(null); }}
              className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Save Article
            </button>
          </div>
        </form>
      )}

      {/* Blog Posts List */}
      <div className="bg-[#111111] border border-[#262626] rounded-sm divide-y divide-[#1c1c1c]">
        {blogPosts.map((post) => (
          <div key={post.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  post.status === 'PUBLISHED'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                    : post.status === 'DRAFT'
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {post.status}
                </span>
                <span className="text-[#c6a87d]">{post.category}</span>
                <span className="text-[#666666]">• {post.readingTime}m read</span>
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5]">{post.title}</h3>
              <p className="text-xs text-[#969696] line-clamp-1">{post.excerpt}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => updateBlogPost(post.id, { status: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })}
                className="px-3 py-1 bg-[#171717] hover:bg-[#222222] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm"
              >
                {post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => handleEdit(post)}
                className="p-2 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] rounded-sm"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  openConfirmModal({
                    title: 'Delete Journal Article?',
                    message: `Are you sure you want to permanently delete "${post.title}"? This action cannot be undone.`,
                    confirmLabel: 'Delete',
                    destructive: true,
                    onConfirm: () => deleteBlogPost(post.id),
                  });
                }}
                className="p-2 bg-[#171717] hover:text-red-400 border border-[#262626] rounded-sm"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. GALLERY & MEDIA MANAGER
// ==========================================
export const AdminGalleryManager: React.FC = () => {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, openConfirmModal } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    url: '',
    altText: '',
    caption: '',
    category: 'Technology',
    featured: false,
    published: true,
    displayOrder: galleryImages.length + 1,
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      url: '',
      altText: '',
      caption: '',
      category: 'Technology',
      featured: false,
      published: true,
      displayOrder: galleryImages.length + 1,
    });
    setIsAdding(true);
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setForm({
      url: img.url,
      altText: img.altText,
      caption: img.caption || '',
      category: img.category,
      featured: img.featured,
      published: img.published,
      displayOrder: img.displayOrder,
    });
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim() || !form.altText.trim()) {
      alert('Please upload an image and provide accessibility alt text.');
      return;
    }

    if (editingId) {
      updateGalleryImage(editingId, {
        ...form,
        width: 1200,
        height: 800,
      });
    } else {
      addGalleryImage({
        ...form,
        width: 1200,
        height: 800,
      });
    }

    setIsAdding(false);
    setEditingId(null);
    setForm({
      url: '',
      altText: '',
      caption: '',
      category: 'Technology',
      featured: false,
      published: true,
      displayOrder: galleryImages.length + 2,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Gallery & Visual Archive</h2>
          <p className="text-xs font-mono text-[#969696]">Upload high-resolution photography, system diagrams, and workspace assets.</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              setIsAdding(false);
              setEditingId(null);
            } else {
              handleOpenNew();
            }
          }}
          className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Editor' : 'Upload Gallery Image'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="text-sm font-bold text-[#c6a87d] uppercase tracking-wider">
              {editingId ? 'Edit Gallery Asset' : 'Upload New Gallery Asset'}
            </h3>
            <span className="text-xs font-mono text-[#666666]">
              {editingId ? 'Editing existing image' : 'Drafting new image'}
            </span>
          </div>

          {/* Image Upload Component with Side-by-Side Live Preview */}
          <ImageUploadField
            label="Gallery Photo / Media File"
            value={form.url}
            onChange={(val) => setForm({ ...form, url: val })}
            aspectRatio="video"
            previewLabel="Gallery Image Preview"
            required
            helperText="Drag & drop your local photo (PNG/JPG/WEBP) or paste an image URL. Live preview shown on right before saving."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Category & Theme</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              >
                <option value="Technology">Technology & Infrastructure</option>
                <option value="Design">Design & Architecture</option>
                <option value="Business & Craft">Business & Craft</option>
                <option value="Finance">Finance & Operations</option>
                <option value="Perspective">Perspective & Nepal Culture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Alt Text (Accessibility requirement) *</label>
              <input
                type="text"
                required
                value={form.altText}
                onChange={(e) => setForm({ ...form, altText: e.target.value })}
                placeholder="Descriptive image context for screen readers"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">Editorial Caption (Optional)</label>
            <input
              type="text"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Brief descriptive note or location (e.g., 'Kathmandu workshop during architecture review')"
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-[#c6a87d]"
              />
              <span>Featured in Highlights</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-[#c6a87d]"
              />
              <span>Published (Live in Public Gallery)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              {editingId ? 'Update Gallery Image' : 'Save & Publish Image'}
            </button>
          </div>
        </form>
      )}

      {/* Gallery Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((img) => (
          <div key={img.id} className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-3 flex flex-col justify-between group hover:border-[#c6a87d]/50 transition-colors">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-sm overflow-hidden bg-[#0c0c0c] relative border border-[#1f1f1f]">
                <img src={img.url} alt={img.altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    onClick={() => updateGalleryImage(img.id, { published: !img.published })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      img.published ? 'bg-emerald-900/90 text-emerald-300 border border-emerald-700' : 'bg-zinc-800/90 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {img.published ? 'Published' : 'Hidden'}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${
                    img.category === 'Unassigned' ? 'text-amber-400 font-bold' : 'text-[#c6a87d]'
                  }`}>
                    {img.category || 'Unassigned'}
                  </span>
                  {img.category === 'Unassigned' && (
                    <span className="px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono rounded">
                      ⚠️ Needs Category
                    </span>
                  )}
                </div>
                <p className="text-[#F5F5F5] text-xs font-medium line-clamp-1">{img.caption || img.altText}</p>
                <p className="text-[#666666] font-mono text-[10px] truncate">{img.altText}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#666666]">Order: {img.displayOrder}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(img)}
                  className="p-1.5 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] rounded text-xs transition-colors"
                  title="Edit image"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    openConfirmModal({
                      title: 'Delete Gallery Image?',
                      message: `Are you sure you want to delete image "${img.altText}"? This action cannot be undone.`,
                      confirmLabel: 'Delete',
                      destructive: true,
                      onConfirm: () => deleteGalleryImage(img.id),
                    });
                  }}
                  className="p-1.5 bg-[#171717] hover:text-red-400 border border-[#262626] rounded text-xs transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. CONTENT CATEGORIES MANAGER
// ==========================================
export const AdminCategoryManager: React.FC = () => {
  const { contentCategories, addContentCategory, updateContentCategory, deleteContentCategory, projects, blogPosts, openConfirmModal } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: contentCategories.length + 1,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingId) {
      updateContentCategory(editingId, {
        name: form.name.trim(),
        slug,
        description: form.description.trim(),
        displayOrder: form.displayOrder,
      });
    } else {
      addContentCategory({
        name: form.name.trim(),
        slug,
        description: form.description.trim(),
        displayOrder: form.displayOrder,
      });
    }

    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (cat: ContentCategory) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      displayOrder: cat.displayOrder,
    });
    setIsEditing(true);
  };

  const sortedCategories = [...contentCategories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase tracking-wide flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#c6a87d]" />
            Categories & Content Domains
          </h2>
          <p className="text-xs font-mono text-[#969696] mt-1">
            Manage categories used across Case Studies and Journal entries. Renaming a category automatically updates assigned projects and articles.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: '',
              slug: '',
              description: '',
              displayOrder: contentCategories.length + 1,
            });
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 self-start sm:self-auto hover:bg-[#b5956a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
          <h3 className="text-sm font-bold text-[#c6a87d] uppercase tracking-wider border-b border-[#262626] pb-2">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-[#969696] mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Technology & Systems"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Slug (URL Identifier)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. technology-systems (auto-generated if empty)"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">Description (Optional)</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this domain"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingId(null); }}
              className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#b5956a] transition-colors"
            >
              {editingId ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Table / List */}
      <div className="bg-[#111111] border border-[#262626] rounded-sm divide-y divide-[#1c1c1c]">
        {sortedCategories.map((cat, idx) => {
          const matchingProjects = projects.filter(p => p.category?.toLowerCase() === cat.name?.toLowerCase()).length;
          const matchingBlogs = blogPosts.filter(b => b.category?.toLowerCase() === cat.name?.toLowerCase()).length;
          const totalUsage = matchingProjects + matchingBlogs;

          return (
            <div key={cat.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-[#666666]">#{idx + 1}</span>
                  <h3 className="text-sm font-bold text-[#F5F5F5] tracking-wide">{cat.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#171717] text-[#969696] border border-[#262626] rounded">
                    slug: {cat.slug}
                  </span>
                </div>
                {cat.description && (
                  <p className="text-xs text-[#969696] max-w-xl">{cat.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono text-[#c6a87d]">
                  <span>{matchingProjects} Case Studies</span>
                  <span className="text-[#444444]">•</span>
                  <span>{matchingBlogs} Journal Entries</span>
                  <span className="text-[#444444]">•</span>
                  <span className="text-[#666666]">Display Order: {cat.displayOrder}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] rounded-sm text-xs transition-colors"
                  title="Edit category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const promptText = totalUsage > 0
                      ? `Category "${cat.name}" is currently assigned to ${totalUsage} items (${matchingProjects} case studies, ${matchingBlogs} journal articles). Associated items will NOT be deleted; they will be safely marked as Unassigned and hidden from the website until you reassign them.`
                      : `Are you sure you want to delete category "${cat.name}"?`;
                    openConfirmModal({
                      title: 'Delete Category?',
                      message: promptText,
                      confirmLabel: 'Delete',
                      destructive: true,
                      onConfirm: () => deleteContentCategory(cat.id),
                    });
                  }}
                  className="p-2 bg-[#171717] hover:text-red-400 border border-[#262626] rounded-sm text-xs transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
