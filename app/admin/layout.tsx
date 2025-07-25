'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'products', label: 'Products', icon: '🛍️', path: '/admin/products' },
    { id: 'rewards', label: 'Rewards', icon: '🏆', path: '/admin/rewards' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Only check login status if not on login page
    if (!isLoginPage) {
      const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
      const username = localStorage.getItem('adminUsername');
      
      if (isAdminLoggedIn !== 'true') {
        router.push('/admin/login');
        return;
      }
      
      if (username) {
        setAdminUsername(username);
      }
    }
  }, [router, isLoginPage]);

  const handleLogout = () => {
    // Clear all admin-related data
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminWalletAddress');
    localStorage.removeItem('adminSession');
    
    // Clear any other potential admin data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('admin')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    router.push('/admin/login');
  };

  const getActiveTab = () => {
    const currentItem = sidebarItems.find(item => item.path === pathname);
    return currentItem ? currentItem.id : 'overview';
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Sidebar - Only show if not on login page */}
      {!isLoginPage && (
        <>
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/90 backdrop-blur-xl border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ByteMe AI
                </h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      getActiveTab() === item.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Footer - Always at bottom */}
              <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{adminUsername}</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <ThemeToggle />
                  <span className="text-xs text-muted-foreground">Theme</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main Content */}
      <div className={isLoginPage ? '' : 'lg:ml-64'}>
        {/* Top Bar - Only show if not on login page */}
        {!isLoginPage && (
          <header className="bg-card/90 backdrop-blur-xl border-b border-border p-4 lg:hidden shadow-sm sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  title="Logout"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <main className={isLoginPage ? '' : 'p-6'}>
          {children}
        </main>
      </div>
    </div>
  );
} 