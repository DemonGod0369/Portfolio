import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { GalleryImage } from '../../types';
import { ImageUploadField } from '../ui/ImageUploadField';
import { Plus, Edit2, Trash2, CheckCircle2, X, Image as ImageIcon } from 'lucide-react';

// ==========================================
// GALLERY & MEDIA MANAGER (SINGLE PAGE INLINE UPLOADER)
// ==========================================
export const AdminGalleryManager: React.FC = () => {
  const { 
    galleryImages, 
    contentCategories,
    addGalleryImage, 
    updateGalleryImage, 
    deleteGalleryImage,
    openConfirmModal,
  } = useData();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Gallery categories filtered strictly to Image Uploader / Gallery category types
  const categoryOptions = React.useMemo(() => {
    const galleryCategories = contentCategories
      .filter(c => c.type === 'GALLERY')
      .map(c => c.name);
    return galleryCategories.length > 0 
      ? galleryCategories 
      : ['Workspaces & Hardware', 'Typography & Interface', 'Art Direction & Print'];
  }, [contentCategories]);

  const [form, setForm] = useState({
    url: '',
    category: categoryOptions[0] || 'Workspaces & Hardware',
    caption: '',
    published: true,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      url: '',
      category: categoryOptions[0] || 'Workspaces & Hardware',
      caption: '',
      published: true,
    });
    setIsAdding(true);
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setForm({
      url: img.url || '',
      category: img.category || 'Unassigned',
      caption: img.caption || img.altText || '',
      published: img.published ?? true,
    });
    setIsAdding(true);
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) {
      alert('Please upload or specify a valid media image URL.');
      return;
    }

    // Auto-generate descriptive Alt Text in the background referencing caption & category
    const autoAltText = form.caption.trim() || `${form.category} visual asset`;

    if (editingId) {
      updateGalleryImage(editingId, {
        url: form.url.trim(),
        category: form.category,
        altText: autoAltText,
        caption: form.caption.trim(),
        featured: false,
        published: form.published,
      });
      showToast('Gallery image updated successfully');
    } else {
      addGalleryImage({
        url: form.url.trim(),
        category: form.category,
        altText: autoAltText,
        caption: form.caption.trim(),
        width: 1200,
        height: 800,
        featured: false,
        published: form.published,
        displayOrder: galleryImages.length + 1,
      });
      showToast('New gallery image published successfully');
    }

    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#111111] border border-[#c6a87d] text-xs font-mono text-[#F5F5F5] rounded-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#c6a87d]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#c6a87d]" />
            <span>Gallery & Visual Archive</span>
          </h2>
          <p className="text-xs font-mono text-[#969696] mt-0.5">
            Upload high-resolution photography, system architecture diagrams, and workspace assets.
          </p>
        </div>
        <button
          onClick={isAdding && !editingId ? handleCancel : handleOpenAdd}
          className="px-4 py-2 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          {isAdding && !editingId ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Uploader</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Upload Gallery Image</span>
            </>
          )}
        </button>
      </div>

      {/* SINGLE PAGE INLINE IMAGE UPLOADER */}
      {isAdding && (
        <form 
          onSubmit={handleSave} 
          className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="text-sm font-bold text-[#c6a87d] uppercase tracking-wider">
              {editingId ? 'Edit Gallery Image' : 'Upload New Gallery Image'}
            </h3>
            <button 
              type="button" 
              onClick={handleCancel}
              className="text-[#969696] hover:text-[#F5F5F5] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Image File & Live Preview */}
          <ImageUploadField
            label="Gallery Photo / Media File"
            value={form.url}
            onChange={(val) => setForm({ ...form, url: val })}
            aspectRatio="video"
            previewLabel="Gallery Image Preview"
            required
            helperText="Drag & drop your local photo (PNG/JPG/WEBP) or paste an image URL. Live preview rendered before saving."
          />

          {/* Form Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              >
                {(form.category === 'Unassigned' || !categoryOptions.includes(form.category)) && (
                  <option value={form.category} className="text-amber-400">
                    ⚠️ {form.category} (Select category below to reassign)
                  </option>
                )}
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">
                Editorial Caption
              </label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Brief descriptive note or location (e.g. 'Kathmandu workshop during architecture review')"
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5] cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-[#c6a87d] w-4 h-4 rounded-sm"
              />
              <span>Published (Live in Public Gallery)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-[#171717] hover:bg-[#202020] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
            >
              {editingId ? 'Update Gallery Image' : 'Save & Publish Image'}
            </button>
          </div>
        </form>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((img) => (
          <div 
            key={img.id} 
            className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-3 flex flex-col justify-between group hover:border-[#c6a87d]/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-sm overflow-hidden bg-[#0c0c0c] relative border border-[#1f1f1f]">
                <img 
                  src={img.url} 
                  alt={img.caption || img.altText || 'Portfolio gallery image'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      updateGalleryImage(img.id, { published: !img.published });
                      showToast(img.published ? 'Image hidden from public gallery' : 'Image published to gallery');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                      img.published 
                        ? 'bg-emerald-900/90 text-emerald-300 border border-emerald-700' 
                        : 'bg-zinc-800/90 text-zinc-400 border border-zinc-700'
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
                <p className="text-[#F5F5F5] text-xs font-medium line-clamp-2">
                  {img.caption || img.altText || 'Untitled Visual Asset'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-end">
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
                      message: `Are you sure you want to permanently delete "${img.caption || img.altText || 'this image'}"? This action cannot be undone.`,
                      confirmLabel: 'Delete',
                      destructive: true,
                      onConfirm: () => {
                        deleteGalleryImage(img.id);
                        showToast('Gallery image deleted');
                      },
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

      {galleryImages.length === 0 && (
        <div className="p-12 text-center border border-dashed border-[#262626] rounded-sm bg-[#0e0e0e] space-y-3">
          <ImageIcon className="w-8 h-8 text-[#666666] mx-auto" />
          <p className="text-xs font-mono text-[#969696]">No media assets uploaded yet.</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm"
          >
            Upload First Image
          </button>
        </div>
      )}
    </div>
  );
};
