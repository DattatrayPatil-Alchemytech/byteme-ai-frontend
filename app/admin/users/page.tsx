"use client";
import { useState, useMemo, useEffect } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import {
  getUsersList,
  type AdminUser,
  type UsersListResponse,
} from "@/lib/apiHelpers/adminUsers";
import Link from "next/link";
import { Eye } from "lucide-react";
// import { Select } from "@/components/ui/DropdownMenu";

const columns: Column[] = [
  {
    key: "walletAddress",
    label: "Wallet Address",
    render: (value: unknown) => (
      <span className="font-mono text-sm">
        {value && typeof value === "string"
          ? `${value.slice(0, 6)}...${value.slice(-4)}`
          : "N/A"}
      </span>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (value: unknown) => (
      <span>{value && typeof value === "string" ? value : "N/A"}</span>
    ),
  },
  {
    key: "totalMileage",
    label: "Total Mileage",
    render: (value: unknown) => (
      <span>
        {value && typeof value === "number" ? value.toLocaleString() : "N/A"}
      </span>
    ),
  },
  {
    key: "totalCarbonSaved",
    label: "Carbon Saved",
    render: (value: unknown) => (
      <span>
        {value && typeof value === "number" ? `${value.toFixed(1)} kg` : "N/A"}
      </span>
    ),
  },
  {
    key: "b3trBalance",
    label: "B3TR Balance",
    render: (value: unknown) => (
      <span className="font-semibold text-green-600">
        {value && typeof value === "number" ? value.toFixed(2) : "N/A"}
      </span>
    ),
  },
  {
    key: "currentTier",
    label: "Tier",
    render: (value: unknown) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "platinum"
            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            : value === "gold"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            : value === "silver"
            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        }`}
      >
        {value && typeof value === "string"
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : "N/A"}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    render: (value: unknown) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "lastLogin",
    label: "Last Login",
    render: (value: unknown) => (
      <span className="text-sm text-muted-foreground">
        {value && typeof value === "string"
          ? new Date(value).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (value: unknown, row: Record<string, unknown>) => {
      const user = row as { id: string };
      return (
        <div className="flex items-center justify-center w-full">
          <Link
            href={`/admin/users/${user.id}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 group"
            title="View User Details"
          >
            <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
          </Link>
        </div>
      );
    },
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(10);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response: UsersListResponse = await getUsersList(
          currentPage,
          limit,
          search
        );
        setUsers(response.users);
        setTotalUsers(response.total);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit, search]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Handle tier filter (client-side for now, can be moved to backend later)
  const filteredUsers = useMemo(() => {
    if (!tierFilter) return users;
    return users.filter((user) => user.currentTier === tierFilter);
  }, [users, tierFilter]);

  const tierOptions = Array.from(new Set(users.map((u) => u.currentTier)));

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
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredUsers.length} of ${totalUsers} users`}
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border bg-background text-foreground rounded-lg px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
          />
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="border border-border bg-background text-foreground rounded-lg px-5 py-3 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted"
          >
            <option value="">All Tiers</option>
            {tierOptions.map((tier) => (
              <option key={tier} value={tier}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Users DataTable */}
      <div className="bg-muted/40 rounded-2xl p-0 md:p-2 overflow-x-auto border border-border">
        {isLoading ? (
          <TableSkeleton rows={10} columns={9} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredUsers as unknown as Record<string, unknown>[]}
            emptyMessage="No users found"
            pagination={false} // Disable built-in pagination since we're using backend pagination
          />
        )}
      </div>

      {/* Backend Pagination Controls */}
      {isLoading ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
            <div className="flex gap-1">
              <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : totalUsers > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing limit
              }}
              className="border border-border bg-background text-foreground rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
            </span>

            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-border bg-background text-foreground rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalUsers / limit)}
                className="px-3 py-1 text-sm border border-border bg-background text-foreground rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
