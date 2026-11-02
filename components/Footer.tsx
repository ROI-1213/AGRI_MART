import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, FileText, Download } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#142317] text-gray-200 text-sm mt-0 border-t-4 border-[#2d7d32] overflow-hidden">
      {/* Agricultural Landscape Background Image */}
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
        {/* Deep agricultural green overlay: maintains clear text readability while showcasing the scenic farm hills */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a10]/85 via-[#102214]/75 to-[#071008]/88 backdrop-blur-[0.5px]" />
      </div>

      {/* Top Footer Section */}
      <div className="relative z-10 agri-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Profile & About */}
          <div>
            <div className="mb-4">
              <Image
                src="/assets/branding/logo_footer.png"
                alt="Agrimart"
                width={180}
                height={50}
                className="h-10 w-auto object-contain brightness-110 drop-shadow-md"
              />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              AGRIMART is an initiative of <strong>Ratnagiri Impex Pvt. Ltd.</strong>, part of the Annapurna Group. Founded in 2000, we specialize in high-efficiency agricultural machinery, mechanization solutions, pest control sprayers, garden care equipment, and reliable customer service across India.
            </p>
            <div className="space-y-2">
              <a
                href="/assets/brochures/corporate_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-[#2d7d32] hover:bg-green-700 text-white px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Corporate Brochure
              </a>
              <br />
              <a
                href="/assets/brochures/agrimart_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> Download Agrimate Brochure
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links & Business */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-b border-white/20 pb-2 drop-shadow-sm">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/" className="hover:text-green-300 transition-colors">
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
                  className="hover:text-green-300 transition-colors"
                >
                  All Products Catalogue
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-300 transition-colors">
                  About Us & Vision
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-300 transition-colors">
                  Services & 750+ Dealer Network
                </Link>
              </li>
              <li>
                <Link href="/become-a-partner" className="hover:text-green-300 transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/cms/buy-earn-rent" className="hover:text-green-300 transition-colors">
                  Buy, Earn & Rent Program
                </Link>
              </li>
              <li>
                <Link href="/cms/knowledge-bank" className="hover:text-green-300 transition-colors">
                  Knowledge Bank
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Legal */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-b border-white/20 pb-2 drop-shadow-sm">
              Customer Support & Legal
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/faq" className="hover:text-green-300 transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-300 transition-colors">
                  Contact Us & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-green-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-green-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal-notice" className="hover:text-green-300 transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-green-300 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-green-300 transition-colors">
                  Warranty & Service Guarantee
                </Link>
              </li>
            </ul>

            {/* Mobile App Download badges */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-white mb-2 drop-shadow-sm">Download Our Mobile App</p>
              <div className="flex items-center space-x-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.invenzo.ratnagiri&hl=en_IN&gl=US&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-opacity inline-block"
                >
                  <Image
                    src="/assets/branding/google_play.png"
                    alt="Download on Google Play"
                    width={110}
                    height={34}
                    className="h-8 w-auto cursor-pointer"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/agrimart/id1599062786"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-opacity inline-block"
                >
                  <Image
                    src="/assets/branding/app_store.png"
                    alt="Download on App Store"
                    width={110}
                    height={34}
                    className="h-8 w-auto cursor-pointer"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Information & Network */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-b border-white/20 pb-2 drop-shadow-sm">
              Contact Information
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Annapurna House</strong>, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <span>
                  Toll Free: <a href="tel:7393938938" className="text-white hover:text-green-300 font-bold">7393 938 938</a>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <span>
                  Email: <a href="mailto:ask@agrimart.in" className="hover:text-green-300 text-gray-200">ask@agrimart.in</a>
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>
                  Mon – Sat: 9:30 AM – 6:00 PM<br />
                  Sunday: Closed
                </span>
              </div>
            </div>

            {/* Network Illustration: Pan India Network */}
            <div className="mt-4 pt-3 border-t border-white/15">
              <div className="rounded-lg overflow-hidden border border-white/20 bg-black/40 backdrop-blur-xs p-1.5 shadow-md group">
                <Image
                  src="/assets/branding/pan_india_network.jpg"
                  alt="Our Pan India Network - Serving Farmers Across India"
                  width={500}
                  height={550}
                  className="w-full h-auto object-contain rounded group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <p className="text-[11px] text-gray-300 mt-2 text-center">
                <strong className="text-white">750+ Showrooms, Dealers & Service Centres</strong> Nationwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative z-10 bg-[#071008]/90 backdrop-blur-sm py-4 border-t border-white/10 text-center text-xs text-gray-400">
        <div className="agri-container flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Agrimart — Ratnagiri Impex Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Enquiries</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
