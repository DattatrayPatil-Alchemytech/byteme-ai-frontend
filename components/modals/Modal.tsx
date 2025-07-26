"use client";
import React from "react";

interface ModalProps {
  show: boolean;
  title?: string;
  handleClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  show,
  title,
  handleClose,
  children,
}: ModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center backdrop-blur-sm animate-in fade-in duration-300 bg-black/40"
      onClick={handleClose}
    >
      {/* Modal container: bottom drawer on mobile, centered on desktop */}
      <div
        className="relative w-full max-w-md mx-auto bg-card border border-border rounded-t-2xl md:rounded-2xl shadow-2xl p-6 md:p-8 
                   transform transition-all duration-300 ease-out
                   animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95
                   md:animate-in md:fade-in md:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-2xl focus:outline-none transition-colors duration-200 hover:scale-110 transform focus:ring-2 focus:ring-ring rounded-sm"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>

        {title && (
          <h3 className="text-xl font-bold mb-4 text-center text-card-foreground animate-in slide-in-from-top duration-500 delay-150">
            {title}
          </h3>
        )}

        <div className="text-muted-foreground animate-in fade-in duration-500 delay-300">
          {children}
        </div>
      </div>
    </div>
  );
}
