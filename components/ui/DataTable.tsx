"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  HeaderGroup,
  Header,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  isSuperAdmin?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  isSuperAdmin = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  React.useEffect(() => {
    if (typeof search === "string") setGlobalFilter(search);
  }, [search]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: onSearchChange || setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "auto",
  });

  return (
    <div className="space-y-4">
      {onSearchChange && (
        <input
          value={search ?? globalFilter}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="border rounded-full px-4 py-2 w-full sm:w-64 shadow focus:ring-2 focus:ring-primary outline-none"
        />
      )}
      <div className={
        `overflow-x-auto${!isSuperAdmin ? ' rounded-2xl shadow-lg bg-white/90 p-2' : ''}`
      }>
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-foreground">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<TData, unknown>) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-left font-semibold text-base cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "asc" ? " ▲" : " ▼"
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50 rounded-lg transition-all">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-5 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
        <div className="flex-1 text-xs text-muted-foreground">
        </div>
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar sm:gap-2 gap-1 px-1 sm:px-0 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-2 py-1 sm:px-4 sm:py-2 shadow text-sm sm:text-base font-medium disabled:text-muted-foreground disabled:bg-muted disabled:cursor-not-allowed hover:bg-primary/10 min-w-[40px]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <Button
              key={i}
              variant={table.getState().pagination.pageIndex === i ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-2 py-1 sm:px-4 sm:py-2 shadow text-sm sm:text-base font-medium min-w-[40px] ${table.getState().pagination.pageIndex === i ? '' : 'hover:bg-primary/10'} ${table.getState().pagination.pageIndex === i ? '' : 'text-foreground'}`}
              onClick={() => table.setPageIndex(i)}
              disabled={table.getState().pagination.pageIndex === i}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-2 py-1 sm:px-4 sm:py-2 shadow text-sm sm:text-base font-medium disabled:text-muted-foreground disabled:bg-muted disabled:cursor-not-allowed hover:bg-primary/10 min-w-[40px]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 