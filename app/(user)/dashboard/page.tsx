"use client";

import { useState } from "react";
import Image from "next/image";
import Badges from "@/components/dashboard/Badges";
import Leaderboard from "@/components/dashboard/Leaderboard";
import TokenStore from "@/components/dashboard/TokenStore";
import OverviewTab from "@/components/dashboard/OverviewTab";
import { DataTable, Column } from "@/components/ui/DataTable";
import { mockHistory } from "./mockHistory";
import { useMemo } from "react";
import { Select } from "@/components/ui/DropdownMenu";

function VehicleHistoryTab() {
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const columns: Column[] = [
    {
      key: "vehicle",
      label: "Vehicle",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    { key: "submissionCount", label: "Submission Count" },
    { key: "milesDriven", label: "Miles Driven" },
    { key: "carbonImpact", label: "Carbon Impact (tCO₂)" },
    { key: "rewards", label: "Rewards (B3TR)" },
    {
      key: "imageHash",
      label: "Image Hash",
      render: (value) => (
        <span className="font-mono text-xs">{value as string}</span>
      ),
    },
    { key: "date", label: "Date" },
  ];
  const vehicleOptions = useMemo(() => {
    const names = mockHistory.map((row) => row.vehicle);
    return Array.from(new Set(names)).map((v) => ({ value: v, label: v }));
  }, []);
  const filtered = mockHistory.filter((row) => {
    const matchesSearch = row.vehicle
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = vehicleFilter ? row.vehicle === vehicleFilter : true;
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your Vehicle History
        </h2>
        <p className="text-muted-foreground">
          Track your vehicle driving records
        </p>
      </div>
      <div className="w-full mb-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="flex gap-4 min-w-[600px] sm:min-w-0">
          {mockHistory.slice(0, 20).map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex-shrink-0 bg-card/90 border border-border rounded-2xl shadow-lg p-4 flex flex-col items-center min-w-[160px] max-w-[180px] w-full transition-transform transition-shadow duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md mb-2 border border-muted">
                <Image
                  src={vehicle.image}
                  alt={vehicle.vehicle}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-md"
                />
              </div>
              <div className="font-semibold text-center text-base truncate w-full text-foreground">
                {vehicle.vehicle}
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center capitalize">
                {vehicle.type} EV
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-border bg-background text-foreground rounded-full px-5 py-3 w-full sm:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
        />
        <Select
          value={vehicleFilter}
          onChange={setVehicleFilter}
          options={[{ value: "", label: "All Vehicles" }, ...vehicleOptions]}
          placeholder="All Vehicles"
          className="bg-background text-foreground border border-border"
        />
      </div>
      <div className="bg-card/90 rounded-2xl shadow-lg p-4 transition-transform transition-shadow duration-300 hover:scale-[1.01] hover:shadow-2xl">
        <DataTable
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user] = useState({
    name: "John Doe",
    email: "user@byteme.in",
    b3trTokens: 1250,
    vehicleModel: "Tesla Model 3",
    licensePlate: "ABC-123",
    sustainableMiles: 1247,
    monthlyTokens: 342,
    totalDrivingSessions: 45,
    averageSessionMiles: 27.7,
    co2Saved: 0.8, // tons of CO2 saved
    currentRank: 5,
    weeklyMiles: 89,
    // New fields from documentation
    lastMiles: 25,
    lastSubmissionDate: "2024-01-28T14:30:00Z",
    dailySubmissionCount: 3,
    carbonFootprint: 0.12, // tons of CO2
  });

  // Mock data for new features
  const [badges] = useState([
    { id: 1, type: "first-ride", earnedAt: "2024-01-15" },
    { id: 2, type: "100km", earnedAt: "2024-01-20" },
    { id: 3, type: "eco-warrior", earnedAt: "2024-01-25" },
    { id: 4, type: "streak-7", earnedAt: "2024-01-30" },
  ]);

  const handleBadgeShare = (message: string) => {
    // Handle badge sharing
    console.log("Badge shared:", message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your sustainable driving progress and earn B3TR tokens
        </p>
      </div>

      {/* Desktop Tab Navigation - Hidden on mobile */}
      <div className="hidden md:flex gap-2 bg-muted/50 rounded-lg p-1 mb-8 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
            activeTab === "overview"
              ? "gradient-ev-green text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>📊</span>
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
            activeTab === "badges"
              ? "gradient-ev-green text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>🏆</span>
          <span>Badges</span>
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
            activeTab === "leaderboard"
              ? "gradient-ev-green text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>📈</span>
          <span>Leaderboard</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
            activeTab === "history"
              ? "gradient-ev-green text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>🕑</span>
          <span>History</span>
        </button>
        <button
          onClick={() => setActiveTab("store")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
            activeTab === "store"
              ? "gradient-ev-green text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>🛍️</span>
          <span>Store</span>
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && <OverviewTab />}

      {/* Badges Tab */}
      {activeTab === "badges" && (
        <Badges badges={badges} onShare={handleBadgeShare} />
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && <Leaderboard />}

      {/* History Tab */}
      {activeTab === "history" && <VehicleHistoryTab />}

      {/* Store Tab */}
      {activeTab === "store" && <TokenStore />}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-lg z-50">
        <div className="flex justify-around items-center px-2 py-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
              activeTab === "overview"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-xs font-medium">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("badges")}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
              activeTab === "badges"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl">🏆</span>
            <span className="text-xs font-medium">Badges</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
              activeTab === "leaderboard"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl">📈</span>
            <span className="text-xs font-medium">Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
              activeTab === "history"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl">🕑</span>
            <span className="text-xs font-medium">History</span>
          </button>

          <button
            onClick={() => setActiveTab("store")}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
              activeTab === "store"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl">🛍️</span>
            <span className="text-xs font-medium">Store</span>
          </button>
        </div>
      </div>

      {/* Bottom padding for mobile to account for fixed navigation */}
      <div className="md:hidden h-20"></div>
    </div>
  );
}
