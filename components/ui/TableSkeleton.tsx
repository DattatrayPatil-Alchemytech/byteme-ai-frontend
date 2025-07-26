import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 8, className = "" }: TableSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Table Header */}
      <div className="bg-muted/40 rounded-t-2xl p-4 border-b border-border">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="h-4 bg-muted rounded"
              style={{ width: `${Math.random() * 40 + 60}px` }}
            />
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-muted/20">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            <div className="flex gap-4 items-center">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-muted rounded"
                  style={{ 
                    width: colIndex === 0 ? '120px' : 
                           colIndex === 1 ? '180px' : 
                           colIndex === columns - 1 ? '60px' : 
                           `${Math.random() * 60 + 80}px` 
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 