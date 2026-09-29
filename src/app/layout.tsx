'use client';

import React, { useState } from 'react';
import { usePathname } from '../lib/navigation';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/navigation/Footer';
import { Toast } from '../components/ui/Toast';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (pathname === '/login') {
    return (
      <div className="min-h-screen w-full bg-[#F9FAFB] text-[#151c27] antialiased">
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-row overflow-hidden bg-[#F9FAFB] text-[#151c27] antialiased">
      {/* Shared Left Sidebar (Desktop static lg:flex w-[280px] + Mobile Drawer < lg) */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto custom-scroll flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </div>

      {/* Global Feedback Toast */}
      <Toast />
    </div>
  );
}
