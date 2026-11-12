'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import AuthModal from '@/components/AuthModal';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'otp' | 'register' | 'b2b' | 'admin'>('signin');

  const handleOpenAuth = (mode: 'signin' | 'otp' | 'register' | 'b2b' | 'admin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col w-full">
        {!isAdminRoute && <Header onOpenAuth={handleOpenAuth} />}
        <main className="flex-1 w-full">{children}</main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <MobileBottomNav />}
      </div>
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </CartProvider>
  );
}
