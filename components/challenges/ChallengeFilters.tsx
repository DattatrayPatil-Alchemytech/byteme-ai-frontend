"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, RotateCcw } from "lucide-react";
import {
  challengeTypes,
  challengeStatuses,
  challengeVisibilities,
  challengeDifficulties,
  type ChallengeFilters as ChallengeFiltersType,
  type PaginationState,
} from "../../app/admin/challenges/utils/filterOptions";

interface ChallengeFiltersProps {
  filters: ChallengeFiltersType;
  pagination: PaginationState;
  total: number;
  onFilterChange: (key: keyof ChallengeFiltersType, value: string) => void;
  onResetFilters: () => void;
  onLimitChange: (limit: number) => void;
}

export default function ChallengeFilters({
  filters,
  pagination,
  total,
  onFilterChange,
  onResetFilters,
  onLimitChange,
}: ChallengeFiltersProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="search" className="text-sm font-medium mb-2 block">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search"
              placeholder="Search challenges..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <Label htmlFor="type" className="text-sm font-medium mb-2 block">
            Type
          </Label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Types</option>
            {challengeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium mb-2 block">
            Status
          </Label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Statuses</option>
            {challengeStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Visibility Filter */}
        <div>
          <Label
            htmlFor="visibility"
            className="text-sm font-medium mb-2 block"
          >
            Visibility
          </Label>
          <select
            id="visibility"
            value={filters.visibility}
            onChange={(e) => onFilterChange("visibility", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Visibility</option>
            {challengeVisibilities.map((visibility) => (
              <option key={visibility.value} value={visibility.value}>
                {visibility.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <Label
            htmlFor="difficulty"
            className="text-sm font-medium mb-2 block"
          >
            Difficulty
          </Label>
          <select
            id="difficulty"
            value={filters.difficulty}
            onChange={(e) => onFilterChange("difficulty", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Difficulties</option>
            {challengeDifficulties.map((difficulty) => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, total)} of {total}{" "}
          challenges
        </p>

        {/* Items per page */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="limit" className="text-sm font-medium">
            Per page:
          </Label>
          <select
            id="limit"
            value={pagination.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
