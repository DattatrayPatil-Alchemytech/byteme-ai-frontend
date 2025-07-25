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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={handleClose}
    >
      {/* Modal container: bottom drawer on mobile, centered on desktop */}
      <div
        className="relative w-full max-w-md mx-auto bg-background text-foreground rounded-t-2xl md:rounded-2xl shadow-2xl p-6 md:p-8 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          className="absolute top-3 right-3 text-muted-foreground hover:text-primary text-2xl focus:outline-none transition-colors duration-200 hover:scale-110 transform"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>

        {title && (
          <h3 className="text-xl font-bold mb-4 text-center text-foreground">
            {title}
          </h3>
        )}

        <div className="text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}
