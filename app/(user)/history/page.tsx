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
    <main className="p-0 sm:p-8">
      <h1 className="text-3xl font-extrabold mb-4 flex items-center gap-2 text-foreground animate-fade-in">
        Vehicle Driving Records
      </h1>
      {/* Vehicle Cards Section */}
      <div className="w-full mb-6 overflow-x-auto">
        <div className="flex gap-4 min-w-[600px] sm:min-w-0">
          {mockHistory.slice(0, 20).map(vehicle => (
            <div
              key={vehicle.id}
              className="flex-shrink-0 bg-white/90 border border-border rounded-2xl shadow-lg p-4 flex flex-col items-center min-w-[160px] max-w-[180px] w-full transition-transform transition-shadow duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md mb-2 border border-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.vehicle}
                  className="w-full h-full rounded-md"
                  loading="lazy"
                />
              </div>
              <div className="font-semibold text-center text-base truncate w-full text-foreground">{vehicle.vehicle}</div>
              <div className="text-xs text-muted-foreground mt-1 text-center capitalize">{vehicle.type} EV</div>
            </div>
          ))}
        </div>
      </div>
      {/* End Vehicle Cards Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vehicle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-full pl-3 pr-10 py-2 w-full sm:w-64 focus:ring-2 focus:ring-primary/30 transition shadow"
        />
        <Select
          value={vehicleFilter}
          onChange={setVehicleFilter}
          options={[{ value: "", label: "All Vehicles" }, ...vehicleOptions]}
          placeholder="All Vehicles"
        />
      </div>
      <div className="bg-white/90 rounded-2xl shadow-lg p-4 transition-transform transition-shadow duration-300 hover:scale-[1.01] hover:shadow-2xl">
        <DataTable
          columns={columns}
          data={filtered}
        />
      </div>
    </main>
  );
};

export default VehicleHistoryPage;
