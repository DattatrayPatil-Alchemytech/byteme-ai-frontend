import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: Record<string, unknown>) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

export interface DataTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
  actions?: Action[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  pagination?: boolean;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  className?: string;
  onRowClick?: (row: Record<string, unknown>) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable({
  data,
  columns,
  actions = [],
  title,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys = [],
  pagination = true,
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 10,
  className = "",
  onRowClick,
  loading = false,
  emptyMessage = "No data available"
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = searchable && searchTerm
    ? data.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : data;

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const renderCell = (column: Column, row: Record<string, unknown>) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    // Default rendering based on data type
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return (value as string) || '-';
  };

  if (loading) {
    return (
      <Card className={`bg-card/80 backdrop-blur-sm border-0 shadow-lg ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {(title || searchable) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-0">
          {title && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          )}
          {searchable && (
            <div className="w-full sm:w-auto">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full sm:w-64 text-sm sm:text-base"
              />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead 
                      key={column.key}
                      style={{ width: column.width }}
                      className={`${column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''} whitespace-nowrap`}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                  {actions.length > 0 && (
                    <TableHead className="w-[100px] whitespace-nowrap">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                      className="text-center py-8"
                    >
                      <div className="text-muted-foreground">
                        {emptyMessage}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((row, index) => (
                    <TableRow 
                      key={(row.id as string) || index}
                      className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.key} className="whitespace-nowrap">
                          {renderCell(column, row)}
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant={action.variant || 'ghost'}
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${action.className || ''}`}
                              >
                                {action.icon}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && filteredData.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t gap-4">
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} items
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-muted-foreground">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2 py-1 sm:px-3 sm:py-2 border border-border rounded-md bg-background text-foreground text-sm"
                  >
                    {itemsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 