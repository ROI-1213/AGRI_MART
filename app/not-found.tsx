import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0d9749] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-6">
          The requested product or document could not be located in our catalog.
        </p>
        <Link
          href="/products"
          className="inline-block bg-[#0d9749] hover:bg-[#097b3a] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-lg transition-colors shadow-xs"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
