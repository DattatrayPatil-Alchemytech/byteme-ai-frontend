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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center backdrop-blur-sm animate-in fade-in duration-300"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={handleClose}
    >
      {/* Modal container: bottom drawer on mobile, centered on desktop */}
      <div
        className="relative w-full max-w-md mx-auto bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 md:p-8 
                   transform transition-all duration-300 ease-out
                   animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95
                   md:animate-in md:fade-in md:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none transition-colors duration-200 hover:scale-110 transform"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>

        {title && (
          <h3 className="text-xl font-bold mb-4 text-center text-gray-800 animate-in slide-in-from-top duration-500 delay-150">
            {title}
          </h3>
        )}

        <div className="text-gray-600 animate-in fade-in duration-500 delay-300">
          {children}
        </div>
      </div>
    </div>
  );
}
