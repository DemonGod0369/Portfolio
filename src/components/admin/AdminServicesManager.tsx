import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Briefcase, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Sparkles, 
  Search, 
  Eye, 
  EyeOff, 
  CheckCircle2
} from 'lucide-react';
import { Service } from '../../types';

export const AdminServicesManager: React.FC = () => {
  const { services, addService, updateService, deleteService, setCurrentRoute, openConfirmModal } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'ALL' | 'FEATURED' | 'STANDARD'>('ALL');
  
  // Drawer / Form state for Create / Edit
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    featured: false,
    published: true,
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      title: '',
      shortDescription: '',
      description: '',
      featured: false,
      published: true,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingId(srv.id);
    setForm({
      title: srv.title,
      shortDescription: srv.shortDescription,
      description: srv.description || '',
      featured: srv.featured,
      published: srv.published,
    });
    setIsDrawerOpen(true);
  };

  // Draft auto-save on outside click or cancel
  const saveServiceDraft = () => {
    if (!form.title.trim()) {
      setIsDrawerOpen(false);
      setEditingId(null);
      return;
    }

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingId) {
      updateService(editingId, {
        ...form,
        slug,
        published: false,
      });
    } else {
      addService({
        ...form,
        slug,
        icon: 'Briefcase',
        displayOrder: 0,
        published: false,
      });
    }

    setIsDrawerOpen(false);
    setEditingId(null);
    showToast('Service offering saved as Draft');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingId) {
      updateService(editingId, {
        ...form,
        slug,
      });
      showToast('Service offering updated successfully');
    } else {
      addService({
        ...form,
        slug,
        icon: 'Briefcase',
        displayOrder: 0,
      });
      showToast('Service offering created successfully');
    }

    setIsDrawerOpen(false);
    setEditingId(null);
  };

  // Sort latest to oldest
  const filteredServices = services
    .filter(s => {
      if (filterFeatured === 'FEATURED' && !s.featured) return false;
      if (filterFeatured === 'STANDARD' && s.featured) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchDesc = (s.shortDescription || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-[#c6a87d]" />
            <span>Services & Professional Offerings</span>
          </h2>
          <p className="text-xs font-mono text-[#969696]">
            Manage client engagement models, advisory services, technical solutions, and featured spotlights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentRoute('skills')}
            className="px-3.5 py-2 bg-[#111111] hover:bg-[#171717] border border-[#262626] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#c6a87d]" />
            <span>View Public Services Page</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Service Offering</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111111] p-3 border border-[#262626] rounded-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service title or description..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setFilterFeatured('ALL')}
            className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors ${
              filterFeatured === 'ALL'
                ? 'bg-[#1c1c1c] text-[#c6a87d] border border-[#c6a87d]/50 font-bold'
                : 'text-[#969696] hover:text-[#F5F5F5]'
            }`}
          >
            All ({services.length})
          </button>
          <button
            onClick={() => setFilterFeatured('FEATURED')}
            className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors ${
              filterFeatured === 'FEATURED'
                ? 'bg-[#1c1c1c] text-[#c6a87d] border border-[#c6a87d]/50 font-bold'
                : 'text-[#969696] hover:text-[#F5F5F5]'
            }`}
          >
            Featured ({services.filter(s => s.featured).length})
          </button>
        </div>
      </div>

      {/* Services Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`p-6 bg-[#111111] border rounded-sm space-y-4 flex flex-col justify-between transition-all hover:border-[#c6a87d]/60 group ${
              service.featured ? 'border-[#c6a87d]/40' : 'border-[#262626]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {service.featured ? (
                  <span className="px-2 py-0.5 bg-[#1a150b] border border-[#c6a87d]/40 text-[#c6a87d] text-[10px] font-mono uppercase tracking-wider rounded flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-[#171717] text-[#969696] text-[10px] font-mono uppercase tracking-wider rounded">
                    Service
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      updateService(service.id, { published: !service.published });
                      showToast(service.published ? 'Service set to Draft' : 'Service Published');
                    }}
                    className={`p-1.5 rounded-sm text-xs font-mono ${
                      service.published ? 'text-emerald-400 hover:text-emerald-300' : 'text-[#666666] hover:text-[#969696]'
                    }`}
                    title={service.published ? 'Published (Live)' : 'Draft (Hidden)'}
                  >
                    {service.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      updateService(service.id, { featured: !service.featured });
                      showToast(service.featured ? 'Removed from Featured' : 'Marked as Featured');
                    }}
                    className={`p-1.5 rounded-sm text-xs ${
                      service.featured ? 'text-[#c6a87d]' : 'text-[#666666] hover:text-[#c6a87d]'
                    }`}
                    title="Toggle Featured"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#c6a87d] transition-colors leading-snug">
                {service.title}
              </h3>

              <p className="text-xs text-[#969696] leading-relaxed line-clamp-2">
                {service.shortDescription}
              </p>

              {service.description && (
                <p className="text-[11px] text-[#666666] leading-relaxed line-clamp-3 pt-2 border-t border-[#1c1c1c]">
                  {service.description}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#1c1c1c] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#666666]">
                /{service.slug}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="px-2.5 py-1 bg-[#171717] hover:bg-[#222222] text-[#c6a87d] border border-[#262626] rounded-sm text-xs font-mono flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    openConfirmModal({
                      title: 'Delete Service Offering?',
                      message: `Are you sure you want to permanently delete "${service.title}"? This action cannot be undone.`,
                      confirmLabel: 'Delete',
                      destructive: true,
                      onConfirm: () => {
                        deleteService(service.id);
                        showToast('Service deleted');
                      },
                    });
                  }}
                  className="p-1 text-[#666666] hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="p-12 text-center border border-dashed border-[#262626] rounded-sm bg-[#0e0e0e] space-y-3">
          <Briefcase className="w-8 h-8 text-[#666666] mx-auto" />
          <p className="text-xs font-mono text-[#969696]">No services matching criteria.</p>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm"
          >
            Create First Service
          </button>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#111111] border border-[#c6a87d] text-xs font-mono text-[#F5F5F5] rounded-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#c6a87d]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Slide-over Drawer for Creating / Editing Service with Outside Click support */}
      {isDrawerOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              saveServiceDraft();
            }
          }}
          className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#0e0e0e] border-l border-[#262626] h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between animate-slide-in"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <h3 className="text-base font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#c6a87d]" />
                  <span>{editingId ? 'Edit Service Offering' : 'New Service Offering'}</span>
                </h3>
                <button
                  type="button"
                  onClick={saveServiceDraft}
                  className="p-1.5 text-[#969696] hover:text-[#F5F5F5]"
                  title="Close and Save Draft"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Website & Interface Design"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Short Description (Punchy Summary)</label>
                  <textarea
                    rows={2}
                    required
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    placeholder="Bespoke web designs with high typographic contrast and seamless responsiveness..."
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Full Detailed Offering Description</label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="In-depth breakdown of deliverables, technical stack, scope, and client consulting approach..."
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                  />
                </div>

                <div className="pt-3 border-t border-[#1c1c1c] space-y-3">
                  <label className="flex items-center gap-3 text-xs font-mono text-[#F5F5F5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="accent-[#c6a87d] w-4 h-4"
                    />
                    <span>Highlight as Featured Service</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-mono text-[#F5F5F5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="accent-[#c6a87d] w-4 h-4"
                    />
                    <span>Publish (Visible on Public Site)</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#666666]">Clicking outside saves as Draft</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={saveServiceDraft}
                    className="px-4 py-2 bg-[#171717] hover:bg-[#222222] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    {editingId ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
