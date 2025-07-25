"use client";
import { useState } from "react";
import { mockOrders, Order, OrderStatus } from "./mockOrders";
import { DataTable } from "@/components/ui/DataTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const statusOptions: OrderStatus[] = [
  "pending",
  "approved",
  "rejected",
  "delivered",
];

const columns = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ getValue }: any) => (
      <Link
        href={`/admin/orders/${getValue()}`}
        className="text-blue-600 hover:underline"
      >
        {getValue()}
      </Link>
    ),
  },
  { accessorKey: "userName", header: "User" },
  { accessorKey: "productName", header: "Product" },
  { accessorKey: "quantity", header: "Qty" },
  { accessorKey: "price", header: "Price (B3TR)" },
  { accessorKey: "total", header: "Total (B3TR)" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "createdAt", header: "Date" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }: { row: any; table: any }) => {
      const order: Order = row.original;
      const approve = table.options.meta?.approveOrder;
      const reject = table.options.meta?.rejectOrder;
      return (
        <div className="flex gap-2 items-center">
          <Link
            href={`/admin/orders/${order.id}`}
            className="text-green-700 hover:underline font-semibold"
          >
            View
          </Link>
          {order.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="default"
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => approve(order.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="px-2 py-1"
                onClick={() => reject(order.id)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.userName.toLowerCase().includes(search.toLowerCase()) ||
      order.productName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Approve/Reject handlers
  const approveOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "approved",
              updatedAt: new Date().toISOString(),
              history: [
                ...o.history,
                {
                  status: "approved",
                  changedAt: new Date().toISOString(),
                  changedBy: "admin",
                },
              ],
            }
          : o
      )
    );
    setNotification(`Order #${id} approved.`);
    setTimeout(() => setNotification(""), 3000);
  };
  const rejectOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "rejected",
              updatedAt: new Date().toISOString(),
              history: [
                ...o.history,
                {
                  status: "rejected",
                  changedAt: new Date().toISOString(),
                  changedBy: "admin",
                },
              ],
            }
          : o
      )
    );
    setNotification(`Order #${id} rejected.`);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-aurora rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 gradient-neon rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 gradient-cosmic rounded-full blur-3xl opacity-15 animate-float" />
        <div
          className="absolute w-16 h-16 border-2 border-green-400/30 rounded-full animate-spin"
          style={{ top: "35%", left: "25%", animationDuration: "8s" }}
        />
        <div
          className="absolute w-12 h-12 border-2 border-cyan-400/30 rounded-full animate-spin"
          style={{
            bottom: "40%",
            right: "25%",
            animationDuration: "12s",
            animationDirection: "reverse",
          }}
        />
        <div
          className="absolute w-20 h-20 border-2 border-emerald-400/30 rounded-full animate-spin"
          style={{ top: "65%", left: "15%", animationDuration: "15s" }}
        />
      </div>
      <div className="relative z-10 p-6 space-y-6">
        <h1
          className="text-3xl md:text-4xl font-extrabold text-gradient-ev-green animate-fade-in drop-shadow-lg tracking-tight font-sans"
          style={{
            lineHeight: "1.2",
            paddingTop: "0.25em",
            paddingBottom: "0.25em",
            overflow: "visible",
          }}
        >
          Order Management
        </h1>
        <Card className="p-6 bg-white/90 backdrop-blur-md shadow-xl overflow-x-auto">
          {/* Notification Banner */}
          {notification && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4 animate-fade-in">
              {notification}
            </div>
          )}
          {/* Filters/Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by user or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-primary/30 rounded-full px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-primary/5 placeholder:text-muted-foreground"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-primary/30 rounded-full px-5 py-3 w-full md:w-48 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-primary/5"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <DataTable
            columns={columns.map((col) => {
              if (col.id === "actions") {
                return {
                  ...col,
                  cell: ({ row }: { row: any }) => {
                    const order: Order = row.original;
                    return (
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-green-700 hover:underline font-semibold"
                        >
                          View
                        </Link>
                        {order.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => approveOrder(order.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="px-2 py-1"
                              onClick={() => rejectOrder(order.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  },
                };
              }
              return col;
            })}
            data={filteredOrders}
          />
        </Card>
      </div>
    </div>
  );
}
