"use client";
import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { mockUsers } from "./mockUsers";
import Link from "next/link";
import { Eye } from "lucide-react";
// import { Select } from "@/components/ui/DropdownMenu";

const columns: Column[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "submissionCount",
    label: "Submissions",
  },
  {
    key: "totalMiles",
    label: "Miles Driven",
  },
  {
    key: "totalRewards",
    label: "Rewards",
  },
  {
    key: "tier",
    label: "Tier",
  },
  {
    key: "lastActive",
    label: "Last Active",
  },
  {
    key: "actions",
    label: "Actions",
    render: (value, row) => {
      const user = row as { id: string };
      return (
        <div className="flex gap-2 items-center justify-center">
          <Link
            href={`/admin/users/${user.id}`}
            className="flex items-center gap-1 font-semibold text-foreground hover:underline cursor-pointer"
          >
            <Eye className="w-4 h-4" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage your users and their details
          </p>
        </div>
      </div>
      {/* User List Title, Count, and Search/Filter Row (Product Page Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User List</h2>
          <p className="text-muted-foreground">{filteredUsers.length} items</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search users by name, email, Twitter, or LinkedIn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border bg-background text-foreground rounded-lg px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {/* Users DataTable */}
      <div className="bg-muted/40 rounded-2xl p-0 md:p-2 overflow-x-auto border border-border">
        <DataTable
          columns={columns}
          data={filteredUsers as unknown as Record<string, unknown>[]}
        />
      </div>
    </div>
  );
}
