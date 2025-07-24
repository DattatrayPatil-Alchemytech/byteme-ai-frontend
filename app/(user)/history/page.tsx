"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { mockHistory } from "./mockHistory";
import { useMemo } from "react";
import { Select } from "@/components/ui/DropdownMenu";

const columns: ColumnDef<(typeof mockHistory)[number]>[] = [
  {
    accessorKey: "vehicle",
    header: "Vehicle",
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "submissionCount",
    header: "Submission Count",
  },
  {
    accessorKey: "milesDriven",
    header: "Miles Driven",
  },
  {
    accessorKey: "carbonImpact",
    header: "Carbon Impact (tCO₂)",
  },
  {
    accessorKey: "rewards",
    header: "Rewards (B3TR)",
  },
  {
    accessorKey: "imageHash",
    header: "Image Hash",
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

const VehicleHistoryPage = () => {
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  // Get unique vehicle names for filter dropdown
  const vehicleOptions = useMemo(() => {
    const names = mockHistory.map((row) => row.vehicle);
    return Array.from(new Set(names)).map((v) => ({ value: v, label: v }));
  }, []);

  // Filter logic
  const filtered = mockHistory.filter((row) => {
    const matchesSearch = row.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = vehicleFilter ? row.vehicle === vehicleFilter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4 flex items-center gap-2 animate-fade-in">
        Vehicle Driving Records
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vehicle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded pl-3 pr-10 py-2 w-full sm:w-64 focus:ring-2 focus:ring-primary/30 transition"
        />
        <Select
          value={vehicleFilter}
          onChange={setVehicleFilter}
          options={[{ value: "", label: "All Vehicles" }, ...vehicleOptions]}
          placeholder="All Vehicles"
        />
      </div>
      <DataTable
        columns={columns}
        data={filtered}
      />
    </main>
  );
};

export default VehicleHistoryPage;
