"use client";
import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { mockUsers } from "./mockUsers";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Select } from "@/components/ui/DropdownMenu";
import type { CellContext, Row } from "@tanstack/react-table";

// Define the User type based on mockUsers structure
interface User {
  id: string;
  name: string;
  email: string;
  twitter?: string;
  linkedin?: string;
  submissionCount: number;
  totalMiles: number;
  totalRewards: number;
  tier: string;
  lastActive: string;
}

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (cell: CellContext<User, unknown>) => (
      <span className="block min-w-[120px] max-w-[200px] whitespace-normal break-words">
        {cell.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "twitter",
    header: "Twitter/X",
  },
  {
    accessorKey: "linkedin",
    header: "LinkedIn",
  },
  {
    accessorKey: "submissionCount",
    header: "Submissions",
  },
  {
    accessorKey: "totalMiles",
    header: "Miles Driven",
  },
  {
    accessorKey: "totalRewards",
    header: "Rewards",
  },
  {
    accessorKey: "tier",
    header: "Tier",
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: Row<User> }) => {
      const user = row.original;
      return (
        <div className="flex gap-2 items-center">
          <Link
            href={`/admin/users/${user.id}`}
            className="font-semibold text-foreground hover:underline cursor-pointer"
          >
            View
          </Link>
        </div>
      );
    },
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.twitter?.toLowerCase().includes(search.toLowerCase()) ||
        user.linkedin?.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter ? user.tier === tierFilter : true;
      return matchesSearch && matchesTier;
    });
  }, [search, tierFilter]);

  const tierOptions = Array.from(new Set(mockUsers.map((u) => u.tier)));

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated background gradients and shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-aurora rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 gradient-neon rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 gradient-cosmic rounded-full blur-3xl opacity-15 animate-float" />
        <div
          className="absolute w-16 h-16 border-2 border-green-400/30 rounded-full animate-spin"
          style={{ top: "35%", left: "25%", animationDuration: "8s" }}
        />
        <div
          className="absolute w-12 h-12 border-2 border-cyan-400/30 rounded-full animate-spin"
          style={{
            bottom: "40%",
            right: "25%",
            animationDuration: "12s",
            animationDirection: "reverse",
          }}
        />
        <div
          className="absolute w-20 h-20 border-2 border-emerald-400/30 rounded-full animate-spin"
          style={{ top: "65%", left: "15%", animationDuration: "15s" }}
        />
      </div>
      <div className="relative z-10 p-6 space-y-6">
        <h1
          className="text-3xl md:text-4xl font-extrabold text-gradient-ev-green animate-fade-in drop-shadow-lg tracking-tight font-sans"
          style={{
            lineHeight: "1.2",
            paddingTop: "0.25em",
            paddingBottom: "0.25em",
            overflow: "visible",
          }}
        >
          User Management
        </h1>
        <Card className="p-6 bg-white/90 backdrop-blur-md shadow-xl overflow-x-auto">
          {/* Consistent search/filter row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-primary/30 rounded-full px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-primary/5 placeholder:text-muted-foreground"
            />
            <Select
              value={tierFilter}
              onChange={setTierFilter}
              options={[...tierOptions.map((t) => ({ value: t, label: t }))]}
              placeholder="All Tiers"
              className="min-w-[140px]"
            />
          </div>
          <DataTable
            columns={columns}
            data={filteredUsers}
            isSuperAdmin={true}
          />
        </Card>
      </div>
    </div>
  );
}
