"use client";

import React from "react";
import { type Notification } from "@/lib/apiHelpers/userDashboard";

interface NotificationDropdownProps {
  showNotifications: boolean;
  notifications: Notification[];
  onClose?: () => void;
  onRefresh?: () => Promise<void>;
  loading?: boolean;
}

export default function NotificationDropdown({
  showNotifications,
  notifications,
  onClose,
  loading = false,
}: NotificationDropdownProps) {
  if (!showNotifications) return null;

  return (
    <div className="absolute right-0 top-12 w-80 bg-card rounded-xl shadow-xl border border-border z-50 p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-lg text-foreground">
          Notifications
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close notifications"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <li className="text-muted-foreground text-center py-4">
              No notifications
            </li>
          ) : (
            notifications.map((note) => (
              <li
                key={note.id}
                className="p-3 rounded-lg transition-colors bg-muted/30 text-foreground"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm">{note.message}</p>
                    {note.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
} 