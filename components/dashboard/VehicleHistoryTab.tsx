"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/DropdownMenu";
import { mockHistory } from "@/app/(user)/dashboard/mockHistory";
import {
  getVehicleHistory,
  type VehicleHistoryResponse,
} from "@/lib/apiHelpers/userDashboard";

const VehicleHistoryTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [historyData, setHistoryData] = useState<VehicleHistoryResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  console.log("historyData ------------", historyData);

  useEffect(() => {
    setLoading(true);
    getVehicleHistory(1, 20)
      .then((data) => {
        setHistoryData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch vehicle history", err);
        setHistoryData(null);
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
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
        <div className="bg-card/90 rounded-2xl shadow-lg p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
};

export default VehicleHistoryTab;
