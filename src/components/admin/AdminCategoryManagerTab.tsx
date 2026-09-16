import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Plus, 
  Tag, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  Sparkles,
  Bot,
  Palette,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { ContentCategory, SkillCategory } from '../../types';

export type CategoryTarget = 'CASE_STUDY' | 'JOURNAL' | 'GALLERY' | 'SKILLS';

export const AdminCategoryManagerTab: React.FC = () => {
  const { 
    contentCategories, 
    addContentCategory, 
    updateContentCategory, 
    deleteContentCategory,
    skillCategories,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    skills,
    projects,
    blogPosts,
    galleryImages,
    openConfirmModal,
  } = useData();

  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTarget>('CASE_STUDY');

  // Skill category form state
  const [skillCatName, setSkillCatName] = useState('');
  const [skillCatDesc, setSkillCatDesc] = useState('');
  const [editingSkillCatId, setEditingSkillCatId] = useState<string | null>(null);

  // Content category form state (Case Studies, Journal, Gallery)
  const [contentCatName, setContentCatName] = useState('');
  const [contentCatDesc, setContentCatDesc] = useState('');
  const [editingContentCatId, setEditingContentCatId] = useState<string | null>(null);

  // Category counts
  const getUsageCount = (categoryName: string, target: CategoryTarget) => {
    const cLower = categoryName.toLowerCase().trim();
    if (target === 'CASE_STUDY') {
      return projects.filter(p => (p.category || '').toLowerCase().trim() === cLower).length;
    }
    if (target === 'JOURNAL') {
      return blogPosts.filter(b => (b.category || '').toLowerCase().trim() === cLower).length;
    }
    if (target === 'GALLERY') {
      return galleryImages.filter(g => (g.category || '').toLowerCase().trim() === cLower).length;
    }
    return 0;
  };

  const getSkillCategoryCount = (catId: string) => {
    return skills.filter(s => s.categoryId === catId).length;
  };

  const handleSaveSkillCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillCatName.trim()) return;

    if (editingSkillCatId) {
      updateSkillCategory(editingSkillCatId, {
        name: skillCatName.trim(),
        slug: skillCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: skillCatDesc.trim(),
      });
      setEditingSkillCatId(null);
    } else {
      addSkillCategory({
        name: skillCatName.trim(),
        slug: skillCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: skillCatDesc.trim(),
        displayOrder: skillCategories.length + 1,
        published: true,
      });
    }

    setSkillCatName('');
    setSkillCatDesc('');
  };

  const handleSaveContentCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentCatName.trim()) return;

    if (editingContentCatId) {
      updateContentCategory(editingContentCatId, {
        name: contentCatName.trim(),
        slug: contentCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: activeCategoryTab as 'CASE_STUDY' | 'JOURNAL' | 'GALLERY',
        description: contentCatDesc.trim(),
      });
      setEditingContentCatId(null);
    } else {
      addContentCategory({
        name: contentCatName.trim(),
        slug: contentCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: activeCategoryTab as 'CASE_STUDY' | 'JOURNAL' | 'GALLERY',
        description: contentCatDesc.trim(),
        displayOrder: contentCategories.length + 1,
      });
    }

    setContentCatName('');
    setContentCatDesc('');
  };

  const handleStartEditSkillCategory = (cat: SkillCategory) => {
    setEditingSkillCatId(cat.id);
    setSkillCatName(cat.name);
    setSkillCatDesc(cat.description || '');
  };

  const handleStartEditContentCategory = (cat: ContentCategory) => {
    setEditingContentCatId(cat.id);
    setContentCatName(cat.name);
    setContentCatDesc(cat.description || '');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-[#262626] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">Taxonomy & Category Center</h2>
          <p className="text-xs font-mono text-[#969696]">
            Centrally create, update, and manage categories across Case Studies, Journal Articles, Gallery Media, and Skill Sets.
          </p>
        </div>
      </div>

      {/* Target Module Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#262626] pb-3">
        <button
          onClick={() => setActiveCategoryTab('CASE_STUDY')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeCategoryTab === 'CASE_STUDY'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Case Study Categories ({contentCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveCategoryTab('JOURNAL')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeCategoryTab === 'JOURNAL'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Journal Categories ({contentCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveCategoryTab('GALLERY')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeCategoryTab === 'GALLERY'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Gallery Media Categories ({contentCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveCategoryTab('SKILLS')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeCategoryTab === 'SKILLS'
              ? 'bg-[#00E5FF] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#00E5FF] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Skill Competency Categories ({skillCategories.length})</span>
        </button>
      </div>

      {/* SKILL CATEGORIES MANAGER */}
      {activeCategoryTab === 'SKILLS' ? (
        <div className="space-y-6">
          <form onSubmit={handleSaveSkillCategory} className="p-5 bg-[#111111] border border-[#262626] rounded-sm space-y-4 max-w-2xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{editingSkillCatId ? 'Edit Skill Competency Category' : 'Create New Skill Category'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Category Title / Domain Name</label>
                <input
                  type="text"
                  required
                  value={skillCatName}
                  onChange={(e) => setSkillCatName(e.target.value)}
                  placeholder="e.g. AI & Generative Workflows or Cloud & DevOps"
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Domain Description</label>
                <textarea
                  rows={2}
                  value={skillCatDesc}
                  onChange={(e) => setSkillCatDesc(e.target.value)}
                  placeholder="Overview of capabilities in this domain..."
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {editingSkillCatId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkillCatId(null);
                    setSkillCatName('');
                    setSkillCatDesc('');
                  }}
                  className="px-3 py-1.5 bg-[#171717] text-xs font-mono text-[#969696] rounded-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#00E5FF] hover:bg-[#38BDF8] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                {editingSkillCatId ? 'Update Category' : '+ Add Skill Category'}
              </button>
            </div>
          </form>

          {/* List of Skill Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map((cat) => {
              const count = getSkillCategoryCount(cat.id);
              return (
                <div 
                  key={cat.id} 
                  className={`p-5 bg-[#111111] border rounded-sm space-y-3 flex flex-col justify-between ${
                    editingSkillCatId === cat.id ? 'border-[#00E5FF]' : 'border-[#262626]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#F5F5F5]">{cat.name}</h4>
                      <span className="px-2 py-0.5 bg-[#171717] border border-[#262626] text-[#00E5FF] text-[10px] font-mono rounded">
                        {count} skill{count === 1 ? '' : 's'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[#969696] leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                    <p className="text-[10px] font-mono text-[#666666]">
                      Slug: <span className="text-[#888888]">/{cat.slug}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStartEditSkillCategory(cat)}
                      className="p-1.5 bg-[#171717] text-[#969696] hover:text-[#00E5FF] border border-[#262626] rounded-sm text-xs"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: 'Delete Skill Category?',
                          message: `Are you sure you want to delete skill category "${cat.name}"? Linked skills will NOT be deleted; they will be safely marked as Unassigned and hidden from the website until you reassign them.`,
                          confirmLabel: 'Delete',
                          destructive: true,
                          onConfirm: () => deleteSkillCategory(cat.id),
                        });
                      }}
                      className="p-1.5 bg-[#171717] text-[#969696] hover:text-red-400 border border-[#262626] rounded-sm text-xs"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CONTENT CATEGORIES MANAGER (Case Studies, Journal, Gallery) */
        <div className="space-y-6">
          <form onSubmit={handleSaveContentCategory} className="p-5 bg-[#111111] border border-[#262626] rounded-sm space-y-4 max-w-2xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#c6a87d] flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{editingContentCatId ? 'Edit Content Category' : `Create New Category for ${activeCategoryTab === 'CASE_STUDY' ? 'Case Studies' : activeCategoryTab === 'JOURNAL' ? 'Journal Articles' : 'Gallery Media'}`}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Category / Domain Name</label>
                <input
                  type="text"
                  required
                  value={contentCatName}
                  onChange={(e) => setContentCatName(e.target.value)}
                  placeholder="e.g. Distributed Systems or UI Engineering"
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Category Description</label>
                <textarea
                  rows={2}
                  value={contentCatDesc}
                  onChange={(e) => setContentCatDesc(e.target.value)}
                  placeholder="Scope or focus of this category..."
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {editingContentCatId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingContentCatId(null);
                    setContentCatName('');
                    setContentCatDesc('');
                  }}
                  className="px-3 py-1.5 bg-[#171717] text-xs font-mono text-[#969696] rounded-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                {editingContentCatId ? 'Update Category' : '+ Add Category'}
              </button>
            </div>
          </form>

          {/* List of Content Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentCategories
              .filter(cat => !cat.type || cat.type === activeCategoryTab)
              .map((cat) => {
              const usageCount = getUsageCount(cat.name, activeCategoryTab);
              return (
                <div 
                  key={cat.id} 
                  className={`p-5 bg-[#111111] border rounded-sm space-y-3 flex flex-col justify-between ${
                    editingContentCatId === cat.id ? 'border-[#c6a87d]' : 'border-[#262626]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#F5F5F5]">{cat.name}</h4>
                      <span className="px-2 py-0.5 bg-[#171717] border border-[#262626] text-[#c6a87d] text-[10px] font-mono rounded">
                        {usageCount} item{usageCount === 1 ? '' : 's'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[#969696] leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                    <p className="text-[10px] font-mono text-[#666666]">
                      Slug: <span className="text-[#888888]">/{cat.slug}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStartEditContentCategory(cat)}
                      className="p-1.5 bg-[#171717] text-[#969696] hover:text-[#c6a87d] border border-[#262626] rounded-sm text-xs"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: 'Delete Category?',
                          message: `Are you sure you want to delete category "${cat.name}"? Associated items will NOT be deleted; they will be safely marked as Unassigned and hidden from the website until you reassign them.`,
                          confirmLabel: 'Delete',
                          destructive: true,
                          onConfirm: () => deleteContentCategory(cat.id),
                        });
                      }}
                      className="p-1.5 bg-[#171717] text-[#969696] hover:text-red-400 border border-[#262626] rounded-sm text-xs"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
