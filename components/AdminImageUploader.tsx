'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { RefreshCw, X, Check, FileText } from 'lucide-react';

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
  const [showManualInput, setShowManualInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
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
      if (fileInputRef.current) fileInputRef.current.value = '';
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

  const isPdf = value && (value.endsWith('.pdf') || value.includes('application/pdf'));

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-800">{label}</label>
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
        className={`flex items-center gap-3 p-2 bg-gray-50 border rounded-lg transition-colors ${
          isDragOver ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200'
        } ${compact ? 'p-1.5' : 'p-2.5'}`}
      >
        {/* Preview Container */}
        <div
          onClick={() => fileInputRef.current?.click()}
          title="Click to choose a file"
          className={`relative bg-white rounded border border-gray-300 overflow-hidden shrink-0 cursor-pointer group hover:border-emerald-500 transition-colors ${
            compact ? 'w-12 h-12' : aspect === 'banner' ? 'w-24 h-14' : 'w-16 h-16'
          }`}
        >
          {value ? (
            isPdf ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-1">
                <FileText className="w-6 h-6" />
                <span className="text-[8px] font-bold mt-0.5 uppercase">PDF</span>
              </div>
            ) : (
              <Image
                src={value}
                alt="Preview"
                fill
                unoptimized
                className="object-contain p-1 group-hover:scale-105 transition-transform"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-emerald-600">
              <UploadIcon className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Upload</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 min-w-0 space-y-1">
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
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadIcon className="w-3.5 h-3.5" />
                  <span>{value ? 'Upload New' : 'Upload File'}</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2 py-1 text-gray-500 hover:text-red-600 text-xs font-semibold rounded hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <span className="text-[11px] text-gray-500 truncate max-w-xs font-mono">
              {value ? value.split('/').pop() : placeholder}
            </span>
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const multiInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));
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
      if (multiInputRef.current) multiInputRef.current.value = '';
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
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-800 text-xs">
          Product Gallery Photos ({images.length})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-gray-400 hover:text-emerald-700 underline cursor-pointer"
        >
          {showUrlInput ? 'Hide manual URL input' : '+ Add via URL'}
        </button>
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
                ? 'Uploading photos to server...'
                : 'Click to select or drag & drop images here'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Supports selecting multiple photos at once (JPG, PNG, WebP, SVG)
            </p>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={() => multiInputRef.current?.click()}
            className="mt-1 px-4 py-2 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <UploadIcon className="w-3.5 h-3.5" />
            <span>Select Photos from Computer</span>
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
          {images.map((imgUrl, iIdx) => (
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
              </div>
              <span className="text-[10px] text-gray-500 truncate w-full font-mono text-center mb-1.5">
                {imgUrl.split('/').pop()}
              </span>
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== iIdx))}
                className="w-full py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
