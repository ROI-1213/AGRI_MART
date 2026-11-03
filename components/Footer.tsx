import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, FileText, Download } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#e9f1f4] text-gray-800 text-sm mt-0 border-t-4 border-[#0d9749] overflow-hidden">
      {/* Agricultural Landscape Background Banner Image */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/assets/banners/footer_bg_hd.png"
          alt="Agrimart Farm Fields Background"
          fill
          priority
          unoptimized
          quality={100}
          className="object-cover object-bottom"
        />
        {/* Soft subtle translucent veil at the top so the landscape shines through brightly while guaranteeing 100% black text contrast */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
      </div>

      {/* Top Footer Section */}
      <div className="relative z-10 agri-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Profile & About */}
          <div>
            <div className="mb-4">
              <Image
                src="/assets/branding/logo.png"
                alt="Agrimart"
                width={180}
                height={50}
                unoptimized
                className="h-10 w-auto object-contain drop-shadow-xs"
              />
            </div>
            <p className="text-xs text-gray-800 leading-relaxed mb-4 font-medium">
              AGRIMART is an initiative of <strong className="text-gray-950 font-bold">Ratnagiri Impex Pvt. Ltd.</strong>, part of the Annapurna Group. Founded in 2000, we specialize in high-efficiency agricultural machinery, mechanization solutions, pest control sprayers, garden care equipment, and reliable customer service across India.
            </p>
            <div className="space-y-2">
              <a
                href="/assets/brochures/corporate_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-[#0d9749] hover:bg-[#097b3a] text-white font-bold px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Corporate Brochure
              </a>
              <br />
              <a
                href="/assets/brochures/agrimart_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> Download Agrimate Brochure
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links & Business */}
          <div>
            <h3 className="text-gray-950 font-black text-base mb-4 border-b-2 border-[#0d9749]/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-gray-800">
              <li>
                <Link href="/" className="hover:text-[#0d9749] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                    }
                  }}
                  className="hover:text-[#0d9749] transition-colors"
                >
                  All Products Catalogue
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0d9749] transition-colors">
                  About Us & Vision
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#0d9749] transition-colors">
                  Services & 750+ Dealer Network
                </Link>
              </li>
              <li>
                <Link href="/become-a-partner" className="hover:text-[#0d9749] transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/cms/buy-earn-rent" className="hover:text-[#0d9749] transition-colors">
                  Buy, Earn & Rent Program
                </Link>
              </li>
              <li>
                <Link href="/cms/knowledge-bank" className="hover:text-[#0d9749] transition-colors">
                  Knowledge Bank
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Legal */}
          <div>
            <h3 className="text-gray-950 font-black text-base mb-4 border-b-2 border-[#0d9749]/30 pb-2">
              Customer Support & Legal
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-gray-800">
              <li>
                <Link href="/faq" className="hover:text-[#0d9749] transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0d9749] transition-colors">
                  Contact Us & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#0d9749] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0d9749] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal-notice" className="hover:text-[#0d9749] transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-[#0d9749] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-[#0d9749] transition-colors">
                  Warranty & Service Guarantee
                </Link>
              </li>
            </ul>

            {/* Mobile App Download badges */}
            <div className="mt-5">
              <p className="text-xs font-bold text-gray-900 mb-2">Download Our Mobile App</p>
              <div className="flex items-center space-x-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.invenzo.ratnagiri&hl=en_IN&gl=US&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-opacity inline-block shadow-sm rounded overflow-hidden"
                >
                  <Image
                    src="/assets/branding/google_play_hd.png"
                    alt="Download on Google Play"
                    width={110}
                    height={34}
                    unoptimized
                    className="h-8 w-auto cursor-pointer"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/agrimart/id1599062786"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-opacity inline-block shadow-sm rounded overflow-hidden"
                >
                  <Image
                    src="/assets/branding/app_store_hd.png"
                    alt="Download on App Store"
                    width={110}
                    height={34}
                    unoptimized
                    className="h-8 w-auto cursor-pointer"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Information & Network */}
          <div>
            <h3 className="text-gray-950 font-black text-base mb-4 border-b-2 border-[#0d9749]/30 pb-2">
              Contact Information
            </h3>
            <div className="space-y-3 text-xs text-gray-800 font-medium">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#0d9749] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-950">Annapurna House</strong>, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#0d9749] shrink-0" />
                <span>
                  Toll Free: <a href="tel:7393938938" className="text-gray-950 hover:text-[#0d9749] font-bold">7393 938 938</a>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#0d9749] shrink-0" />
                <span>
                  Email: <a href="mailto:ask@agrimart.in" className="hover:text-[#0d9749] text-gray-900 font-semibold">ask@agrimart.in</a>
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#0d9749] shrink-0 mt-0.5" />
                <span>
                  Mon – Sat: 9:30 AM – 6:00 PM<br />
                  Sunday: Closed
                </span>
              </div>
            </div>

            {/* Pan India Network Card (Matching Image 2 Reference in Crisp Ultra-HD) */}
            <div className="mt-4 pt-3 border-t border-gray-300/80">
              <div className="rounded-xl overflow-hidden border border-gray-300/90 bg-white shadow-xs hover:shadow-md transition-all duration-300 group">
                {/* Upper: Ultra-HD India Network Map */}
                <div className="p-2 sm:p-2.5 bg-white flex items-center justify-center">
                  <Image
                    src="/assets/branding/india_network_map_hd.png"
                    alt="Agrimart Pan India Network Map"
                    width={632}
                    height={696}
                    unoptimized
                    priority
                    className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Lower: Green Network Reach Stats Banner */}
                <div className="bg-[#097b3a] py-2 px-3 grid grid-cols-2 divide-x divide-white/20 text-center select-none">
                  <div className="px-1 flex flex-col items-center justify-center">
                    <span className="text-sm sm:text-base font-black text-yellow-300 leading-none tracking-tight">
                      750+
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-white tracking-wider uppercase leading-tight mt-0.5">
                      Network Touchpoints
                    </span>
                  </div>
                  <div className="px-1 flex flex-col items-center justify-center">
                    <span className="text-sm sm:text-base font-black text-yellow-300 leading-none tracking-tight">
                      28
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-white tracking-wider uppercase leading-tight mt-0.5">
                      States Covered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Channels (Original Brand Logos) */}
            <div className="mt-5 pt-4 border-t border-gray-300/80">
              <p className="text-xs font-bold text-gray-950 mb-2.5 tracking-wide">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/agrimart20"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1877F2] hover:opacity-90 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/agrimart20"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="w-8 h-8 rounded-full hover:opacity-90 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
                  }}
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com/Agrimart3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  title="X (Twitter)"
                  className="w-8 h-8 rounded-full bg-black hover:bg-gray-800 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/agrimart20"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#0A66C2] hover:opacity-90 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/channel/UCPChKPEwHssr4WmuOxrJY9g?reload=9&view_as=subscriber"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="w-8 h-8 rounded-full bg-[#FF0000] hover:opacity-90 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md py-4 border-t border-gray-300/80 text-center text-xs text-gray-700">
        <div className="agri-container flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-medium text-gray-800">© {new Date().getFullYear()} Agrimart — Ratnagiri Impex Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-4 font-semibold">
            <Link href="/privacy-policy" className="hover:text-[#0d9749] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#0d9749] transition-colors">Terms of Use</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#0d9749] transition-colors">Enquiries</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
