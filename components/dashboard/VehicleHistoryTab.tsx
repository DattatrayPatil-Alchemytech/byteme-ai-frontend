"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/DropdownMenu";
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
        const response: VehicleHistoryResponse = await getVehicleHistory(currentPage, limit, search);
        setHistoryData(response.history);
        setTotalItems(response.total);
      } catch (error) {
        console.error('Failed to fetch vehicle history:', error);
        setHistoryData([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, limit, search]);

  console.log("historyData ------------", historyData);

  // Remove the debounce effect since we're now using backend search
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setCurrentPage(1); // Reset to first page when searching
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [search]);

  const columns: Column[] = [
    {
      key: "typeIcon",
      label: "Type",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{value as string}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {(row as any).type?.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      key: "title",
      label: "Activity",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "formattedValue",
      label: "Value",
      render: (value, row) => (
        <span className={`font-semibold ${(row as any).isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
          {value as string}
        </span>
      ),
    },
    {
      key: "formattedValueChange",
      label: "Change",
      render: (value, row) => (
        <span className={`text-sm ${(row as any).isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
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
    {
      key: "actionButtonText",
      label: "Actions",
      render: (value, row) => (
        <button className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors">
          {value as string}
        </button>
      ),
    },
  ];

  const activityOptions = useMemo(() => {
    const types = historyData.map((row) => row.type);
    return Array.from(new Set(types)).map((type) => ({ 
      value: type, 
      label: type.replace('_', ' ').toUpperCase() 
    }));
  }, [historyData]);

  // Handle activity filter (client-side for now, can be moved to backend later)
  const filteredHistory = useMemo(() => {
    let filtered = historyData;
    
    if (vehicleFilter) {
      filtered = filtered.filter((row) => row.type === vehicleFilter);
    }
    
    return filtered;
  }, [historyData, vehicleFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your Activity History
          </h2>
          <p className="text-muted-foreground">
            Track your rewards and activities
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
          Your Activity History
        </h2>
        <p className="text-muted-foreground">
          Track your rewards and activities
        </p>
      </div>

      {/* Activity History Title, Count, and Search/Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activity History</h2>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredHistory.length} of ${totalItems} records`}
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border bg-background text-foreground rounded-lg px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
          />
          <Select
            value={vehicleFilter}
            onChange={setVehicleFilter}
            options={[{ value: "", label: "All Activities" }, ...activityOptions]}
            placeholder="All Activities"
            className="bg-background text-foreground border border-border"
          />
        </div>
      </div>

      <div className="bg-card/90 rounded-2xl shadow-lg p-4 transition-transform transition-shadow duration-300 hover:scale-[1.01] hover:shadow-2xl">
        <DataTable
          columns={columns}
          data={filteredHistory as unknown as Record<string, unknown>[]}
          emptyMessage="No vehicle history found"
          pagination={false} // Disable built-in pagination since we're using backend pagination
        />
      </div>

      {/* Backend Pagination Controls */}
      {loading ? (
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
      ) : totalItems > 0 ? (
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
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} records
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
                disabled={currentPage >= Math.ceil(totalItems / limit)}
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
};

export default VehicleHistoryTab;
