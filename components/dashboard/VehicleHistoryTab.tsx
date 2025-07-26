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
          <span className="text-lg">{value as string}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {(row as any).type?.replace("_", " ")}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value) => (
        <span className="text-sm font-medium text-muted-foreground capitalize">
          {value as string}
        </span>
      ),
    },
    {
      key: "title",
      label: "Activity",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    // {
    //   key: "description",
    //   label: "Description",
    //   render: (value) => (
    //     <span className="text-sm text-muted-foreground max-w-xs truncate">
    //       {value as string}
    //     </span>
    //   ),
    // },
    {
      key: "formattedValue",
      label: "Value",
      render: (value, row) => (
        <span
          className={`font-semibold ${
            (row as any).isPositiveChange ? "text-green-600" : "text-red-600"
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
          className={`text-sm ${
            (row as any).isPositiveChange ? "text-green-600" : "text-red-600"
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
        <span className="text-sm text-muted-foreground">{value as string}</span>
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Activity History
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Monitor your rewards, uploads, and achievements
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Activities
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by activity or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="lg:w-64">
              {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Records</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {loading ? 'Loading...' : `Showing ${filteredHistory.length} of ${totalItems} records`}
              </div>
            </div>
          </div>
          
          <div className="p-6">
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
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-4 w-20 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 w-48 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ) : totalItems > 0 ? (
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">entries per page</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * limit, totalItems)}</span> of{" "}
                  <span className="font-medium text-gray-900 dark:text-white">{totalItems}</span> records
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalItems / limit)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
