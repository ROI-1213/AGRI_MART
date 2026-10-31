'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import faqsData from '@/data/import/faqs.json';
import { FAQItem } from '@/types';

export default function FAQPage() {
  const faqs = faqsData as unknown as FAQItem[];
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Frequently Asked Questions</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-[#2d7d32] text-xs font-bold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Frequently Asked Questions (FAQ)
          </h1>
          <div className="w-16 h-1 bg-[#2d7d32] mx-auto mt-2 mb-3"></div>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">
            Find immediate answers regarding Agrimart E-kart orders, mobile OTP authentication, payment modes, warranty, and nationwide delivery.
          </p>

          {/* Search box */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQ questions..."
                className="w-full bg-white border border-gray-300 rounded-md py-2.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-green-600 focus:outline-none shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900 hover:text-[#2d7d32] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400 font-mono text-xs">0{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isOpen ? 'rotate-180 text-green-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    <p>{faq.answer}</p>
                    {faq.category && (
                      <span className="inline-block mt-3 text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">
                        Category: {faq.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="font-bold text-sm text-gray-900 mb-1">
            Didn&apos;t find what you were looking for?
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Our support engineers are ready to assist you by phone or email.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="agri-btn-primary text-xs py-2 px-5">
              Contact Support
            </Link>
            <a href="tel:7393938938" className="agri-btn-secondary text-xs py-2 px-5">
              Call 7393 938 938
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
