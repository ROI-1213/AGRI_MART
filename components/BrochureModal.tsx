'use client';

import React from 'react';
import { X, FileText, ExternalLink, FileCheck } from 'lucide-react';
import { Product } from '@/types';

interface BrochureModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  brochureTitle?: string;
  initialLanguage?: string;
  brochureUrl?: string;
}

export default function BrochureModal({
  product,
  isOpen,
  onClose,
  brochureTitle,
  initialLanguage = 'English',
  brochureUrl
}: BrochureModalProps) {
  if (!isOpen) return null;

  const fileBasename = (brochureUrl || '').split('/').pop() || '';
  const directDocumentUrl = brochureUrl?.startsWith('/uploads/')
    ? brochureUrl
    : (fileBasename ? `/uploads/product_brochure/1/${fileBasename}` : (brochureUrl || ''));

  const ext = (directDocumentUrl || '').split('?')[0].split('.').pop()?.toLowerCase() || '';
  const isImageBrochure = ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      {/* Backdrop click handler */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col h-[94vh] print:h-auto print:shadow-none print:rounded-none">
        
        {/* Clean Sticky Header */}
        <div className="bg-[#0d9749] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 shrink-0 print:hidden select-none border-b border-green-700">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-white/90 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold tracking-tight line-clamp-1">
                {brochureTitle || `${product.name} Brochure`}
              </h3>
              <p className="text-[11px] text-white/80 hidden sm:block">
                Language: <strong>{initialLanguage}</strong> • Official Ratnagiri Impex Document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Area: Original Document ONLY */}
        <div className="flex-1 overflow-hidden bg-[#525659] flex flex-col">
          {directDocumentUrl ? (
            <div className="flex-1 flex flex-col h-full relative">
              {isImageBrochure ? (
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={directDocumentUrl}
                    alt={brochureTitle || product.name}
                    className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded"
                  />
                </div>
              ) : (
                <iframe
                  src={`${directDocumentUrl}#toolbar=1&navpanes=0&view=FitH`}
                  className="w-full flex-1 border-0 h-full min-h-[75vh]"
                  title={brochureTitle || product.name}
                />
              )}

              {/* Bottom Helpful Info Bar */}
              <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between text-gray-600 gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-green-600" />
                  <span>
                    Official Document: <strong>{fileBasename}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={directDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in new tab</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white p-8 text-center text-gray-600">
              <p className="font-semibold text-sm">No original brochure document available for this product.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
