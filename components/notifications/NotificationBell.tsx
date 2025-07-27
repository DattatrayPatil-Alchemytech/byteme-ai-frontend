"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications, type Notification } from "@/lib/apiHelpers/userDashboard";

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ 
  className = "" 
}: NotificationBellProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications(1, 20);
      setNotifications(response.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={bellRef}
        className="relative p-2 rounded-full hover:bg-primary/10 transition"
        onClick={() => setShowNotifications((v) => !v)}
        aria-label="Show notifications"
        disabled={loading}
      >
        <Bell className="w-6 h-6 text-primary" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
      <NotificationDropdown
        showNotifications={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onRefresh={fetchNotifications}
        loading={loading}
      />
    </div>
  );
} 