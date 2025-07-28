"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { type ChallengeFilters } from "../../app/admin/challenges/utils/filterOptions";

interface ChallengeEmptyStateProps {
  filters: ChallengeFilters;
  onResetFilters: () => void;
  variant?: "desktop" | "mobile";
}

export default function ChallengeEmptyState({
  filters,
  onResetFilters,
  variant = "desktop",
}: ChallengeEmptyStateProps) {
  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  const isMobile = variant === "mobile";

  return (
    <div
      className={`bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg ${
        isMobile ? "p-6" : "p-8"
      } text-center`}
    >
      <div className={`${isMobile ? "text-4xl" : "text-6xl"} mb-4`}>🎯</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No Challenges Found
      </h3>
      <p className={`text-muted-foreground mb-4 ${isMobile ? "text-sm" : ""}`}>
        {hasActiveFilters
          ? isMobile
            ? "No challenges match your filters."
            : "No challenges match your current filters. Try adjusting your search criteria."
          : isMobile
          ? "Create your first challenge."
          : "Get started by creating your first challenge."}
      </p>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={onResetFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
