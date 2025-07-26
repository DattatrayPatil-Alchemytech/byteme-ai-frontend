"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/DropdownMenu";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import {
  getVehicleHistory,
  type VehicleHistoryResponse,
  type VehicleHistoryItem,
} from "@/lib/apiHelpers/userDashboard";

const VehicleHistoryTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [historyData, setHistoryData] = useState<VehicleHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(20);

  // Fetch vehicle history data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response: VehicleHistoryResponse = await getVehicleHistory(
          currentPage,
          limit,
          search,
          vehicleFilter
        );
        setHistoryData(response.history);
        setTotalItems(response.total);
      } catch (error) {
        console.error("Failed to fetch vehicle history:", error);
        setHistoryData([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, limit, search, vehicleFilter]);

  const columns: Column[] = [
    {
      key: "typeIcon",
      label: "Type",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="text-base">{value as string}</span>
          <span className="text-xs text-muted-foreground dark:text-slate-400 capitalize">
            {(row as unknown as VehicleHistoryItem).type?.replace("_", " ")}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value) => (
        <span className="text-xs font-medium text-muted-foreground dark:text-slate-400 capitalize">
          {value as string}
        </span>
      ),
    },
    {
      key: "title",
      label: "Activity",
      render: (value) => <span className="text-sm font-medium text-foreground dark:text-white">{value as string}</span>,
    },
    // {
    //   key: "description",
    //   label: "Description",
    //   render: (value) => (
    //     <span className="text-xs text-muted-foreground dark:text-slate-400 max-w-xs truncate">
    //       {value as string}
    //     </span>
    //   ),
    // },
    {
      key: "formattedValue",
      label: "Value",
      render: (value, row) => (
        <span
          className={`text-sm font-semibold ${
            (row as unknown as VehicleHistoryItem).isPositiveChange ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {value as string}
        </span>
      ),
    },
    {
      key: "formattedValueChange",
      label: "Change",
      render: (value, row) => (
        <span
          className={`text-xs ${
            (row as unknown as VehicleHistoryItem).isPositiveChange ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {value as string}
        </span>
      ),
    },
    {
      key: "formattedCreatedAt",
      label: "Date",
      render: (value) => (
        <span className="text-xs text-muted-foreground dark:text-slate-400">{value as string}</span>
      ),
    },
  ];

  const activityOptions = useMemo(() => {
    const types = historyData.map((row) => row.type);
    return Array.from(new Set(types)).map((type) => ({
      value: type,
      label: type.replace("_", " ").toUpperCase(),
    }));
  }, [historyData]);

  // No need for client-side filtering since it's handled by backend
  const filteredHistory = useMemo(() => {
    return historyData;
  }, [historyData]);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      <div className="p-1">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground dark:text-white">
                Activity History
              </h1>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Monitor your rewards, uploads, and achievements
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-card/50 dark:bg-slate-800/50 rounded-lg shadow-sm border border-border/50 dark:border-slate-700/50 p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-medium text-foreground dark:text-slate-300 mb-1">
                Search Activities
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-muted-foreground dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by activity or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-8 pr-3 py-2 border border-border/50 dark:border-slate-600/50 rounded-md bg-background dark:bg-slate-700/50 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors text-sm"
                />
              </div>
            </div>
            
            <div className="lg:w-48">
              {/* <label className="block text-xs font-medium text-foreground dark:text-slate-300 mb-1">
                Filter by Type
              </label> */}
              {/* <Select
                value={vehicleFilter}
                onChange={setVehicleFilter}
                options={[{ value: "", label: "All Activities" }, ...activityOptions]}
                placeholder="All Activities"
                className="w-full"
              /> */}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card/50 dark:bg-slate-800/50 rounded-lg shadow-sm border border-border/50 dark:border-slate-700/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 dark:border-slate-700/30">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground dark:text-white">Activity Records</h2>
            </div>
          </div>
          
          <div className="p-4">
            {loading ? (
              <TableSkeleton rows={10} columns={6} />
            ) : (
              <DataTable
                columns={columns}
                data={filteredHistory as unknown as Record<string, unknown>[]}
                emptyMessage="No activity history found"
                pagination={false}
              />
            )}
          </div>
        </div>

        {/* Pagination */}
        {loading ? (
          <div className="mt-4 bg-card/50 dark:bg-slate-800/50 rounded-lg shadow-sm border border-border/50 dark:border-slate-700/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-16 bg-muted dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-muted dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-muted dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-3 w-40 bg-muted dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-muted dark:bg-slate-600 rounded animate-pulse"></div>
                  <div className="h-6 w-12 bg-muted dark:bg-slate-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ) : totalItems > 0 ? (
          <div className="mt-4 bg-card/50 dark:bg-slate-800/50 rounded-lg shadow-sm border border-border/50 dark:border-slate-700/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground dark:text-slate-400">Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-border/50 dark:border-slate-600/50 rounded-md px-2 py-1 text-xs bg-background dark:bg-slate-700/50 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-xs text-muted-foreground dark:text-slate-400">entries per page</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground dark:text-slate-400">
                  Showing <span className="font-medium text-foreground dark:text-white">{(currentPage - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium text-foreground dark:text-white">{Math.min(currentPage * limit, totalItems)}</span> of{" "}
                  <span className="font-medium text-foreground dark:text-white">{totalItems}</span> records
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs font-medium text-muted-foreground dark:text-slate-400 bg-background dark:bg-slate-700/50 border border-border/50 dark:border-slate-600/50 rounded-md hover:bg-muted dark:hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalItems / limit)}
                    className="px-3 py-1 text-xs font-medium text-muted-foreground dark:text-slate-400 bg-background dark:bg-slate-700/50 border border-border/50 dark:border-slate-600/50 rounded-md hover:bg-muted dark:hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VehicleHistoryTab;
