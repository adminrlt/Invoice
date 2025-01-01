import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './common/Header';
import { Footer } from './common/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}