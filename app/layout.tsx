import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'AGRIMART — Agricultural Machinery, Sprayers & Farm Equipment',
  description: 'Farm equipment, weed cutters, chain saws, chaff cutters, sprayers, and genuine agricultural machinery by Ratnagiri Impex Pvt. Ltd.',
  icons: {
    icon: '/assets/branding/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/branding/favicon.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
