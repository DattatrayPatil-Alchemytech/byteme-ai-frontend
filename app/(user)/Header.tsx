'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Mock notifications (replace with real data or context as needed)
const notifications = [
  { id: 1, message: 'Your vehicle registration is approved!', read: false },
  { id: 2, message: 'New badge earned: Eco Warrior!', read: true },
];

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userWalletAddress');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gradient-ev-green"
            >
              ByteMe AI
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 relative">
            {userName && (
              <span className="text-sm text-muted-foreground hidden md:block">
                Welcome, {userName}
              </span>
            )}
            
            <ThemeToggle />
            
            <Link
              href="/uploads"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Upload Odometer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </Link>
            
            {/* Notification Bell */}
            <button
              ref={bellRef}
              className="relative p-2 rounded-full hover:bg-primary/10 transition"
              onClick={() => setShowNotifications(v => !v)}
              aria-label="Show notifications"
            >
              <Bell className="w-6 h-6 text-primary" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-muted z-50 p-4 animate-fade-in">
                <div className="font-bold text-lg mb-2 text-foreground">Notifications</div>
                <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <li className="text-muted-foreground">No notifications</li>
                  ) : (
                    notifications.map(note => (
                      <li key={note.id} className={note.read ? "text-gray-400" : "font-medium text-foreground"}>
                        {note.message}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
            {/* Profile Icon Link */}
            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
              title="Profile"
            >
              <svg
                className="w-7 h-7 rounded-full border border-muted bg-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Logout"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 