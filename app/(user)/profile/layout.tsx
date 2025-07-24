import React from 'react';
import Header from "../Header";
import Footer from "../Footer";

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 24 }}>
      <Header />
      <nav style={{ marginBottom: 16 }}>
        <strong>User Panel Navigation</strong>
      </nav>
      <main>{children}</main>
      <Footer />
    </div>
  );
} 