import React from 'react';

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 16 }}>
        <strong>User Panel Navigation</strong>
      </nav>
      <main>{children}</main>
    </div>
  );
} 