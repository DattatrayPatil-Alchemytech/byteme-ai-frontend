"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { type PaginationState } from "../../app/admin/challenges/utils/filterOptions";

interface ChallengePaginationProps {
  pagination: PaginationState;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "desktop" | "mobile";
}

export default function ChallengePagination({
  pagination,
  totalPages,
  onPageChange,
  variant = "desktop",
}: ChallengePaginationProps) {
  if (totalPages <= 1) return null;

  const isMobile = variant === "mobile";
  const maxVisiblePages = isMobile ? 3 : 5;

  const getVisiblePages = () => {
    const pages = [];
    const startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div
      className={`${
        isMobile
          ? "flex flex-col items-center gap-4"
          : "flex flex-col sm:flex-row items-center justify-between gap-4"
      } mt-4 p-4 bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg`}
    >
      <div className="text-sm text-muted-foreground">
        Page {pagination.page} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {getVisiblePages().map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === pagination.page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="w-8 h-8 p-0"
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
