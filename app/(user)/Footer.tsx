import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-lg border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gradient-ev-green mb-4 md:mb-0">
            ByteMe AI
          </Link>
          <p className="text-muted-foreground text-sm">
            © 2025 ByteMe AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 