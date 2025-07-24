"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { mockHistory } from "./mockHistory";

const columns: ColumnDef<(typeof mockHistory)[0]>[] = [
  {
    accessorKey: "user",
    header: "User",
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

const UserHistoryPage = () => {
  const [search, setSearch] = useState("");

  // Filter logic (simple search by user)
  const filtered = mockHistory.filter((row) =>
    row.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User History</h1>
      <DataTable
        columns={columns}
        data={filtered}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search user..."
      />
    </main>
  );
};

export default UserHistoryPage;
