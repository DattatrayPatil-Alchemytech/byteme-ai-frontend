"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Badges from "@/components/dashboard/Badges";
import Leaderboard from "@/components/dashboard/Leaderboard";
import TokenStore from "@/components/dashboard/TokenStore";
import OverviewTab from "@/components/dashboard/OverviewTab";
import VehicleHistoryTab from "@/components/dashboard/VehicleHistoryTab";
import UserOrders from "@/components/dashboard/UserOrders";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state: RootState) => state.user.user);
  const [badges] = useState([
    {
      id: 1,
      type: "first-ride",
      earnedAt: "2024-01-15",
    },
    {
      id: 2,
      type: "100km",
      earnedAt: "2024-01-20",
    },
    {
      id: 3,
      type: "eco-warrior",
      earnedAt: "2024-01-25",
    },
  ]);

  const handleBadgeShare = (message: string) => {
    console.log("Sharing badge:", message);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "badges", label: "Badges", icon: "🏆" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏅" },
    { id: "history", label: "History", icon: "🕑" },
    { id: "store", label: "Store", icon: "🛍️" },
    { id: "orders", label: "Orders", icon: "🛒" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.username || "User"}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your sustainable driving progress and earn B3TR tokens
        </p>
      </div>

      {/* Desktop Tab Navigation - Hidden on mobile */}
      <div className="hidden md:flex gap-2 bg-muted/50 rounded-lg p-1 mb-8 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
              activeTab === tab.id
                ? "gradient-ev-green text-white shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "badges" && (
        <Badges badges={badges} onShare={handleBadgeShare} />
      )}
      {activeTab === "leaderboard" && <Leaderboard />}
      {activeTab === "history" && <VehicleHistoryTab />}
      {activeTab === "store" && <TokenStore />}
      {activeTab === "orders" && <UserOrders />}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-lg z-50">
        <div className="flex justify-around items-center px-2 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile to account for fixed navigation */}
      <div className="md:hidden h-20"></div>
    </div>
  );
}
