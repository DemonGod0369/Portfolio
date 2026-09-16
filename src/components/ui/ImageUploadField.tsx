import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';
  required?: boolean;
  id?: string;
  previewLabel?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText = 'PNG, JPG, WEBP, SVG or URL link.',
  aspectRatio = 'auto',
  required = false,
  id,
  previewLabel = 'Live Preview',
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize / compress helper for smooth localStorage and instantaneous rendering
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setIsProcessing(true);
    setImgError(false);
    setImgLoaded(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // If SVG or small image, use directly
      if (file.type === 'image/svg+xml' || file.size < 800 * 1024) {
        onChange(result);
        setIsProcessing(false);
        return;
      }

      // Resize large bitmaps using HTMLCanvas to keep responsive
      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
          onChange(compressedDataUrl);
        } else {
          onChange(result);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        onChange(result);
        setIsProcessing(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
    setImgError(false);
    setImgLoaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'h-[64px] sm:h-[72px] aspect-square';
      case 'portrait':
        return 'h-[64px] sm:h-[72px] aspect-[3/4]';
      case 'video':
        return 'h-[64px] sm:h-[72px] aspect-[16/9]';
      case 'wide':
        return 'h-[64px] sm:h-[72px] aspect-[21/9]';
      default:
        return 'h-[64px] sm:h-[72px] max-w-[140px]';
    }
  };

  return (
    <div className="space-y-1.5" id={id}>
      <div className="flex flex-row items-center justify-between gap-2">
        <label className="block text-xs font-mono text-[#c6a87d] font-semibold uppercase tracking-wider truncate">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="flex items-center gap-1 text-[10px] font-mono shrink-0">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2 py-0.5 rounded-sm flex items-center gap-1 transition-colors ${
              inputMode === 'upload'
                ? 'bg-[#c6a87d] text-[#080808] font-bold'
                : 'bg-[#171717] text-[#969696] hover:text-[#F5F5F5]'
            }`}
          >
            <Upload className="w-2.5 h-2.5" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2 py-0.5 rounded-sm flex items-center gap-1 transition-colors ${
              inputMode === 'url'
                ? 'bg-[#c6a87d] text-[#080808] font-bold'
                : 'bg-[#171717] text-[#969696] hover:text-[#F5F5F5]'
            }`}
          >
            <LinkIcon className="w-2.5 h-2.5" />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Compact Grid: Controls on Left (7 cols) + Side Preview on Right (5 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-2 bg-[#0d0d0d] border border-[#262626] rounded-sm">
        {/* Left Side: Upload Zone / URL Input */}
        <div className="sm:col-span-7 flex flex-col justify-between space-y-1.5 min-h-[64px] sm:min-h-[72px]">
          {inputMode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-sm px-3 py-2 flex items-center justify-center gap-2.5 text-center cursor-pointer transition-all h-[42px] sm:h-[46px] ${
                dragOver
                  ? 'border-[#c6a87d] bg-[#c6a87d]/10'
                  : 'border-[#262626] hover:border-[#c6a87d]/60 bg-[#111111] hover:bg-[#141414]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />

              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#c6a87d] animate-spin" />
                  <span className="text-[11px] font-mono text-[#F5F5F5]">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-left">
                  <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center shrink-0 text-[#c6a87d]">
                    <Upload className="w-3 h-3" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[11px] font-mono text-[#F5F5F5] font-medium">
                      Drag & drop or <span className="text-[#c6a87d] underline underline-offset-2">browse</span>
                    </p>
                    <p className="text-[9px] font-mono text-[#666666]">
                      PNG, JPG, WEBP, SVG
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1 h-[42px] sm:h-[46px] flex flex-col justify-center">
              <div className="relative">
                <input
                  type="url"
                  value={value}
                  onChange={(e) => {
                    setImgError(false);
                    onChange(e.target.value);
                  }}
                  placeholder="https://example.com/image.png"
                  className="w-full px-2.5 py-1.5 bg-[#111111] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d] font-mono pl-7 h-[34px]"
                />
                <LinkIcon className="w-3 h-3 text-[#666666] absolute left-2 top-2.5" />
              </div>
            </div>
          )}

          {/* Status & Helper notes */}
          <div className="flex items-center justify-between text-[9px] font-mono text-[#666666] pt-0.5">
            <span className="truncate max-w-[200px]">{helperText}</span>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-red-400 hover:text-red-300 flex items-center gap-0.5 transition-colors shrink-0 ml-2"
                title="Remove current image"
              >
                <X className="w-2.5 h-2.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: COMPACT LIVE PREVIEW */}
        <div className="sm:col-span-5 bg-[#080808] border border-[#262626] rounded-sm p-1.5 flex flex-col justify-between min-h-[64px] sm:min-h-[72px]">
          <div className="flex items-center justify-between pb-1 border-b border-[#1c1c1c]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#c6a87d] font-bold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#c6a87d] animate-pulse"></span>
              {previewLabel}
            </span>
            {value && !imgError && (
              <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-2 h-2" />
                <span>Ready</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-center py-1">
            <div
              className={`${getAspectClass()} rounded-sm overflow-hidden bg-[#111111] border border-[#1f1f1f] relative flex items-center justify-center p-1 mx-auto`}
            >
              {value ? (
                <>
                  <img
                    src={value}
                    alt="Preview before save"
                    className="w-full h-full object-contain rounded-sm transition-opacity duration-200"
                    onError={() => setImgError(true)}
                    onLoad={() => {
                      setImgError(false);
                      setImgLoaded(true);
                    }}
                  />
                  {imgError && (
                    <div className="absolute inset-0 bg-[#141414] p-1 flex flex-col items-center justify-center text-center">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[8px] font-mono text-amber-300">Invalid</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-1 flex flex-col items-center justify-center text-center text-[#555555]">
                  <ImageIcon className="w-4 h-4 stroke-[1.5]" />
                  <span className="text-[8px] font-mono mt-0.5">No image</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[8px] font-mono text-[#666666] flex items-center justify-between pt-0.5 border-t border-[#1c1c1c]/50">
            <span>{aspectRatio}</span>
            {value && (
              <span className="truncate max-w-[80px] text-[#888888]">
                {value.startsWith('data:') ? 'Local' : 'URL'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
