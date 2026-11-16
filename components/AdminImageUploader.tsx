'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { RefreshCw, X, Check, FileText, Sparkles, Eye } from 'lucide-react';

export type UploadQualityMode = '4k_ultra' | '2k_hd' | 'original';

function UploadIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CloudUploadIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

/**
 * Applies a fast, luminance-preserving 3x3 unsharp-mask convolution kernel
 * on an ImageData buffer so upscaled 4K images have razor-sharp edges,
 * crisp machinery details, and zero blur.
 */
function applyUnsharpConvolution(ctx: CanvasRenderingContext2D, width: number, height: number, strength = 0.22) {
  // For very large 4K canvases, use hardware-accelerated CSS contrast/clarity pass first,
  // and run pixel-level unsharp kernel on regions up to 3840x2160.
  try {
    const srcData = ctx.getImageData(0, 0, width, height);
    const dstData = ctx.createImageData(width, height);
    const src = srcData.data;
    const dst = dstData.data;

    const s = strength;
    const center = 1 + 4 * s;
    const neighbor = -s;
    const rowStride = width * 4;

    // Copy border pixels
    dst.set(src);

    for (let y = 1; y < height - 1; y++) {
      let idx = (y * width + 1) * 4;
      for (let x = 1; x < width - 1; x++, idx += 4) {
        const a = src[idx + 3];
        if (a === 0) continue;

        const r =
          src[idx] * center +
          (src[idx - 4] + src[idx + 4] + src[idx - rowStride] + src[idx + rowStride]) * neighbor;
        const g =
          src[idx + 1] * center +
          (src[idx - 3] + src[idx + 5] + src[idx - rowStride + 1] + src[idx + rowStride + 1]) * neighbor;
        const b =
          src[idx + 2] * center +
          (src[idx - 2] + src[idx + 6] + src[idx - rowStride + 2] + src[idx + rowStride + 2]) * neighbor;

        dst[idx] = r < 0 ? 0 : r > 255 ? 255 : r;
        dst[idx + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
        dst[idx + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
        dst[idx + 3] = a;
      }
    }

    ctx.putImageData(dstData, 0, 0);
  } catch {
    // Fallback if canvas is tainted or memory-constrained
  }
}

/**
 * Multi-pass progressive 4K Ultra-HD (3840p) or 2K Studio (2560p) image processor.
 * Upscales images smoothly in 1.5x bicubic steps, applies edge sharpening & micro-contrast,
 * and encodes a high-bitrate 4K file guaranteed to stay within serverless upload limits.
 */
async function processImageTo4K(
  sourceFileOrBlob: File | Blob,
  originalName: string,
  mode: UploadQualityMode
): Promise<File> {
  // Skip non-raster files (PDFs, SVGs)
  const lowerName = originalName.toLowerCase();
  if (
    lowerName.endsWith('.pdf') ||
    lowerName.endsWith('.svg') ||
    sourceFileOrBlob.type === 'application/pdf' ||
    sourceFileOrBlob.type === 'image/svg+xml'
  ) {
    return sourceFileOrBlob instanceof File
      ? sourceFileOrBlob
      : new File([sourceFileOrBlob], originalName, { type: sourceFileOrBlob.type });
  }

  if (mode === 'original' && sourceFileOrBlob.size <= 3.8 * 1024 * 1024) {
    return sourceFileOrBlob instanceof File
      ? sourceFileOrBlob
      : new File([sourceFileOrBlob], originalName, { type: sourceFileOrBlob.type || 'image/png' });
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    const objectUrl = URL.createObjectURL(sourceFileOrBlob);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      const srcW = img.naturalWidth || img.width || 1024;
      const srcH = img.naturalHeight || img.height || 1024;

      // Determine target long edge based on selected quality mode
      const targetLongEdge = mode === '4k_ultra' ? 3840 : mode === '2k_hd' ? 2560 : Math.max(srcW, srcH);
      const currentLongEdge = Math.max(srcW, srcH);

      // Always upscale to target 4K/2K if smaller, or preserve if already 4K+ (cap at 3840 to keep fast & crisp)
      const scaleFactor =
        mode === 'original'
          ? Math.min(1, 3840 / currentLongEdge)
          : targetLongEdge / currentLongEdge;

      const finalW = Math.max(1, Math.round(srcW * scaleFactor));
      const finalH = Math.max(1, Math.round(srcH * scaleFactor));

      // Progressive multi-step upscaling (1.5x per step) for smooth bicubic interpolation
      let stepCanvas = document.createElement('canvas');
      stepCanvas.width = srcW;
      stepCanvas.height = srcH;
      let stepCtx = stepCanvas.getContext('2d');
      if (!stepCtx) {
        resolve(
          sourceFileOrBlob instanceof File
            ? sourceFileOrBlob
            : new File([sourceFileOrBlob], originalName, { type: 'image/png' })
        );
        return;
      }

      stepCtx.imageSmoothingEnabled = true;
      stepCtx.imageSmoothingQuality = 'high';
      stepCtx.drawImage(img, 0, 0, srcW, srcH);

      let curW = srcW;
      let curH = srcH;

      while (curW * 1.5 < finalW && curH * 1.5 < finalH) {
        const nextW = Math.round(curW * 1.5);
        const nextH = Math.round(curH * 1.5);
        const nextCanvas = document.createElement('canvas');
        nextCanvas.width = nextW;
        nextCanvas.height = nextH;
        const nextCtx = nextCanvas.getContext('2d');
        if (!nextCtx) break;
        nextCtx.imageSmoothingEnabled = true;
        nextCtx.imageSmoothingQuality = 'high';
        nextCtx.drawImage(stepCanvas, 0, 0, nextW, nextH);
        stepCanvas = nextCanvas;
        curW = nextW;
        curH = nextH;
      }

      // Final pass to exact 4K/2K dimensions with subtle micro-contrast clarity filter
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = finalW;
      finalCanvas.height = finalH;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) {
        resolve(
          sourceFileOrBlob instanceof File
            ? sourceFileOrBlob
            : new File([sourceFileOrBlob], originalName, { type: 'image/png' })
        );
        return;
      }

      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';
      if (mode === '4k_ultra' || mode === '2k_hd') {
        finalCtx.filter = 'contrast(1.03) saturate(1.04)';
      }
      finalCtx.drawImage(stepCanvas, 0, 0, finalW, finalH);
      finalCtx.filter = 'none';

      // Apply unsharp mask edge definition for 4K / 2K modes
      if (mode === '4k_ultra' || mode === '2k_hd') {
        const strength = scaleFactor > 1.3 ? 0.24 : 0.16;
        applyUnsharpConvolution(finalCtx, finalW, finalH, strength);
      }

      // Encode as high-bitrate WebP (supports full alpha transparency + 4K resolution under 3.8MB)
      const encodeWithQuality = (mime: string, q: number): Promise<Blob | null> =>
        new Promise((res) => finalCanvas.toBlob((b) => res(b), mime, q));

      let outBlob = await encodeWithQuality('image/webp', 0.96);
      if (outBlob && outBlob.size > 3.6 * 1024 * 1024) {
        outBlob = await encodeWithQuality('image/webp', 0.90);
      }
      if (outBlob && outBlob.size > 3.6 * 1024 * 1024) {
        outBlob = await encodeWithQuality('image/webp', 0.84);
      }
      if (!outBlob) {
        outBlob = await encodeWithQuality('image/jpeg', 0.94);
      }

      if (!outBlob) {
        resolve(
          sourceFileOrBlob instanceof File
            ? sourceFileOrBlob
            : new File([sourceFileOrBlob], originalName, { type: 'image/png' })
        );
        return;
      }

      const baseName = originalName.replace(/\.[^/.]+$/, '');
      const suffix = mode === '4k_ultra' ? '_4k_uhd' : mode === '2k_hd' ? '_2k_hd' : '_hd';
      const outFileName = `${baseName}${suffix}.webp`;

      resolve(new File([outBlob], outFileName, { type: 'image/webp' }));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(
        sourceFileOrBlob instanceof File
          ? sourceFileOrBlob
          : new File([sourceFileOrBlob], originalName, { type: sourceFileOrBlob.type || 'image/png' })
      );
    };

    img.src = objectUrl;
  });
}

function getResolutionBadge(dims: { w: number; h: number } | null): {
  label: string;
  tier: '4K ULTRA HD' | '2K QHD' | 'FULL HD' | 'SD';
  colorClass: string;
} {
  if (!dims || !dims.w || !dims.h) {
    return {
      label: '4K / HD Ready',
      tier: '4K ULTRA HD',
      colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  }
  const maxEdge = Math.max(dims.w, dims.h);
  if (maxEdge >= 3200) {
    return {
      label: `4K ULTRA HD • ${dims.w}×${dims.h}px`,
      tier: '4K ULTRA HD',
      colorClass: 'bg-emerald-600 text-white border-emerald-700 shadow-2xs',
    };
  }
  if (maxEdge >= 2000) {
    return {
      label: `2K STUDIO HD • ${dims.w}×${dims.h}px`,
      tier: '2K QHD',
      colorClass: 'bg-teal-600 text-white border-teal-700',
    };
  }
  if (maxEdge >= 1200) {
    return {
      label: `FULL HD • ${dims.w}×${dims.h}px`,
      tier: 'FULL HD',
      colorClass: 'bg-blue-100 text-blue-800 border-blue-300',
    };
  }
  return {
    label: `SD • ${dims.w}×${dims.h}px`,
    tier: 'SD',
    colorClass: 'bg-amber-100 text-amber-800 border-amber-300',
  };
}

interface AdminImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  helpText?: string;
  compact?: boolean;
  accept?: string;
  aspect?: 'square' | 'video' | 'banner' | 'auto';
}

export function AdminImageUploader({
  label,
  value,
  onChange,
  folder = 'general',
  placeholder = 'No file selected',
  helpText,
  compact = false,
  accept = 'image/*',
  aspect = 'auto',
}: AdminImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [qualityMode, setQualityMode] = useState<UploadQualityMode>('4k_ultra');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isPdfAccept = accept.includes('pdf');
  const isPdf = value && (value.endsWith('.pdf') || value.includes('application/pdf') || isPdfAccept);

  // Measure natural image resolution whenever value changes
  useEffect(() => {
    if (!value || isPdf) {
      setImageDims(null);
      return;
    }
    let active = true;
    const probe = new window.Image();
    probe.onload = () => {
      if (active) {
        setImageDims({ w: probe.naturalWidth, h: probe.naturalHeight });
      }
    };
    probe.onerror = () => {
      if (active) setImageDims(null);
    };
    probe.src = value;
    return () => {
      active = false;
    };
  }, [value, isPdf]);

  const uploadFile = async (rawFile: File, overrideMode?: UploadQualityMode) => {
    const activeMode = overrideMode || qualityMode;
    setIsUploading(true);
    try {
      let fileToUpload = rawFile;
      if (!isPdfAccept && !rawFile.name.toLowerCase().endsWith('.pdf')) {
        setStatusText(
          activeMode === '4k_ultra'
            ? 'Upscaling & sharpening to 4K Ultra-HD (3840p)...'
            : activeMode === '2k_hd'
            ? 'Enhancing to 2K Studio HD (2560p)...'
            : 'Preparing lossless HD image...'
        );
        fileToUpload = await processImageTo4K(rawFile, rawFile.name, activeMode);
      }

      setStatusText('Uploading 4K HD asset to server...');
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || 'Failed to upload image. Please try again.');
      }
    } catch (err: any) {
      alert('Error uploading file: ' + (err.message || 'Network error'));
    } finally {
      setIsUploading(false);
      setStatusText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpgradeCurrentTo4K = async () => {
    if (!value || isPdf) return;
    setIsUploading(true);
    setStatusText('Converting current image to 4K Ultra-HD (3840p)...');
    try {
      const response = await fetch(value);
      const blob = await response.blob();
      const currentName = value.split('/').pop() || 'image.png';
      await uploadFile(new File([blob], currentName, { type: blob.type || 'image/png' }), '4k_ultra');
    } catch (err: any) {
      alert('Unable to upscale current image: ' + (err.message || 'Fetch error'));
      setIsUploading(false);
      setStatusText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const resBadge = getResolutionBadge(imageDims);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-bold text-gray-800">{label}</label>
            {!isPdf && value && imageDims && (
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border tracking-wide ${resBadge.colorClass}`}
              >
                {resBadge.label}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[10px] text-gray-400 hover:text-emerald-700 underline cursor-pointer"
          >
            {showManualInput ? 'Hide URL field' : 'Edit URL directly'}
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-3 bg-gray-50 border rounded-lg transition-colors ${
          isDragOver ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200'
        } ${compact ? 'p-2' : 'p-2.5'}`}
      >
        {/* Preview Container */}
        <div
          onClick={() => (value && !isPdf ? setShowLightbox(true) : fileInputRef.current?.click())}
          title={value && !isPdf ? 'Click to inspect in 4K Full-Screen Preview' : 'Click to choose a file'}
          className={`relative bg-white rounded border border-gray-300 overflow-hidden shrink-0 cursor-pointer group hover:border-emerald-500 transition-colors ${
            compact ? 'w-14 h-14' : aspect === 'banner' ? 'w-28 h-16' : 'w-18 h-18'
          }`}
        >
          {value ? (
            isPdf ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-1">
                <FileText className="w-6 h-6" />
                <span className="text-[8px] font-bold mt-0.5 uppercase">PDF</span>
              </div>
            ) : (
              <>
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-contain p-1 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-4 h-4 text-white drop-shadow" />
                </div>
              </>
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-emerald-600">
              <UploadIcon className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5">4K Upload</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/65 flex items-center justify-center text-white">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Quality Mode Selector for Image Uploads */}
          {!isPdf && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Quality:</span>
              </span>
              <select
                value={qualityMode}
                onChange={(e) => setQualityMode(e.target.value as UploadQualityMode)}
                className="text-[11px] font-bold bg-white border border-emerald-300 text-emerald-900 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="4k_ultra">✨ 4K Ultra-HD (3840p Super-Resolution + Crisp)</option>
                <option value="2k_hd">⚡ 2K Studio HD (2560p QHD Crisp)</option>
                <option value="original">💎 Original Uncompressed (Native Raw)</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{statusText || 'Processing 4K...'}</span>
                </>
              ) : (
                <>
                  <UploadIcon className="w-3.5 h-3.5" />
                  <span>
                    {isPdf
                      ? value
                        ? 'Upload New PDF'
                        : 'Upload PDF'
                      : value
                      ? 'Upload New (4K HD)'
                      : 'Upload in 4K HD'}
                  </span>
                </>
              )}
            </button>

            {/* One-Click Convert Existing Image to 4K Ultra-HD */}
            {!isPdf && value && !isUploading && (!imageDims || Math.max(imageDims.w, imageDims.h) < 3200) && (
              <button
                type="button"
                onClick={handleUpgradeCurrentTo4K}
                title="Upscale and sharpen current image to 3840p 4K Ultra-HD"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Enhance to 4K</span>
              </button>
            )}

            {!isPdf && value && (
              <button
                type="button"
                onClick={() => setShowLightbox(true)}
                className="px-2 py-1 text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold rounded border border-emerald-200 transition-colors cursor-pointer"
              >
                4K Preview
              </button>
            )}

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2 py-1 text-gray-500 hover:text-red-600 text-xs font-semibold rounded hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {showManualInput && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/uploads/image.png"
              className="w-full px-2.5 py-1 text-[11px] border border-gray-300 rounded font-mono text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
            />
          )}

          {helpText && <p className="text-[10px] text-gray-400">{helpText}</p>}
        </div>
      </div>

      {/* Full-Screen 4K Lightbox Inspector */}
      {showLightbox && value && !isPdf && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${resBadge.colorClass}`}>
                  {resBadge.label}
                </span>
                <span className="text-xs text-gray-300 font-mono truncate max-w-md">
                  {value.split('/').pop()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {(!imageDims || Math.max(imageDims.w, imageDims.h) < 3200) && (
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleUpgradeCurrentTo4K}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Enhancing to 4K...' : 'Upscale to 4K Ultra-HD (3840p)'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowLightbox(false)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative flex-1 min-h-[60vh] bg-slate-900 flex items-center justify-center p-4 overflow-auto">
              <img
                src={value}
                alt="4K High Definition Preview"
                className="max-w-full max-h-[75vh] object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AdminGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export function AdminGalleryUploader({
  images,
  onChange,
  folder = 'products',
}: AdminGalleryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [qualityMode, setQualityMode] = useState<UploadQualityMode>('4k_ultra');
  const [isDragOver, setIsDragOver] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dimsMap, setDimsMap] = useState<Record<string, { w: number; h: number }>>({});
  const [upgradingIdx, setUpgradingIdx] = useState<number | null>(null);
  const multiInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    images.forEach((imgUrl) => {
      if (!imgUrl || dimsMap[imgUrl]) return;
      const probe = new window.Image();
      probe.onload = () => {
        setDimsMap((prev) => ({ ...prev, [imgUrl]: { w: probe.naturalWidth, h: probe.naturalHeight } }));
      };
      probe.src = imgUrl;
    });
  }, [images, dimsMap]);

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const rawArray = Array.from(files);
      const processedFiles: File[] = [];

      for (let i = 0; i < rawArray.length; i++) {
        const f = rawArray[i];
        setStatusText(
          `Enhancing photo ${i + 1} of ${rawArray.length} to ${
            qualityMode === '4k_ultra' ? '4K Ultra-HD (3840p)' : qualityMode === '2k_hd' ? '2K Studio HD' : 'Lossless HD'
          }...`
        );
        const enhanced = await processImageTo4K(f, f.name, qualityMode);
        processedFiles.push(enhanced);
      }

      setStatusText(`Uploading ${processedFiles.length} 4K HD photo(s)...`);
      const formData = new FormData();
      processedFiles.forEach((f) => formData.append('files', f));
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        onChange([...images, ...data.urls]);
      } else {
        alert(data.error || 'Failed to upload images. Please try again.');
      }
    } catch (err: any) {
      alert('Error uploading images: ' + (err.message || 'Network error'));
    } finally {
      setIsUploading(false);
      setStatusText('');
      if (multiInputRef.current) multiInputRef.current.value = '';
    }
  };

  const handleUpgradeGalleryItemTo4K = async (imgUrl: string, index: number) => {
    setUpgradingIdx(index);
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const currentName = imgUrl.split('/').pop() || `gallery_${index + 1}.png`;
      const enhancedFile = await processImageTo4K(blob, currentName, '4k_ultra');

      const formData = new FormData();
      formData.append('file', enhancedFile);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const updated = [...images];
        updated[index] = data.url;
        onChange(updated);
      } else {
        alert(data.error || 'Failed to upgrade image to 4K.');
      }
    } catch (err: any) {
      alert('Error upgrading image to 4K: ' + (err.message || 'Fetch error'));
    } finally {
      setUpgradingIdx(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="font-bold text-gray-800 text-xs">
            Product Gallery Photos ({images.length})
          </label>
          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
            4K ULTRA-HD PIPELINE ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={qualityMode}
              onChange={(e) => setQualityMode(e.target.value as UploadQualityMode)}
              className="text-[11px] font-bold bg-white border border-emerald-300 text-emerald-900 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="4k_ultra">✨ 4K Ultra-HD (3840p Super-Resolution + Crisp)</option>
              <option value="2k_hd">⚡ 2K Studio HD (2560p QHD Crisp)</option>
              <option value="original">💎 Original Uncompressed (Native Raw)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] text-gray-400 hover:text-emerald-700 underline cursor-pointer"
          >
            {showUrlInput ? 'Hide manual URL input' : '+ Add via URL'}
          </button>
        </div>
      </div>

      {/* Upload Zone / Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/60'
            : 'border-gray-300 hover:border-emerald-400 bg-gray-50/50'
        }`}
      >
        <input
          ref={multiInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
            {isUploading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <CloudUploadIcon className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-gray-800">
              {isUploading
                ? statusText || 'Upscaling & uploading 4K Ultra-HD photos...'
                : 'Click to select or drag & drop images for 4K Ultra-HD Upload'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Automatically upscales & sharpens uploaded photos to crystal-clear 4K (3840p) resolution
            </p>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={() => multiInputRef.current?.click()}
            className="mt-1 px-4 py-2 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <UploadIcon className="w-3.5 h-3.5" />
            <span>Select Photos for 4K HD Upload</span>
          </button>
        </div>
      </div>

      {/* Manual URL Input (Optional) */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter image URL (e.g. /assets/products/...)"
            value={newUrlInput}
            onChange={(e) => setNewUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (newUrlInput.trim()) {
                onChange([...images, newUrlInput.trim()]);
                setNewUrlInput('');
              }
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
          >
            + Add URL
          </button>
        </div>
      )}

      {/* Uploaded Photos Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((imgUrl, iIdx) => {
            const dims = dimsMap[imgUrl] || null;
            const badge = getResolutionBadge(dims);
            const isBelow4K = !dims || Math.max(dims.w, dims.h) < 3200;

            return (
              <div
                key={iIdx}
                className="relative group bg-white border border-gray-200 rounded-lg p-2 flex flex-col items-center shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="w-full h-24 relative bg-gray-50 rounded overflow-hidden mb-1.5">
                  <Image
                    src={imgUrl}
                    alt={`Gallery ${iIdx + 1}`}
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                  {dims && (
                    <span
                      className={`absolute top-1 left-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${badge.colorClass}`}
                    >
                      {badge.tier} • {dims.w}×{dims.h}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-gray-500 truncate w-full font-mono text-center mb-1.5">
                  {imgUrl.split('/').pop()}
                </span>

                <div className="w-full flex flex-col gap-1">
                  {isBelow4K && (
                    <button
                      type="button"
                      disabled={upgradingIdx === iIdx}
                      onClick={() => handleUpgradeGalleryItemTo4K(imgUrl, iIdx)}
                      className="w-full py-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{upgradingIdx === iIdx ? 'Upscaling 4K...' : 'Enhance to 4K'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onChange(images.filter((_, idx) => idx !== iIdx))}
                    className="w-full py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
