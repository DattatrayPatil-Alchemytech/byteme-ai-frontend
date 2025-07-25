'use client';

import React from 'react';
import { DataTable, Column, Action } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { mockOrders, Order } from './mockOrders';
import { Toaster, toast } from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>(mockOrders);

  const handleApprove = (order: Record<string, unknown>) => {
    if (order.status === 'pending') {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: 'approved',
                updatedAt: new Date().toISOString(),
                history: [
                  ...o.history,
                  {
                    status: 'approved',
                    changedAt: new Date().toISOString(),
                    changedBy: 'admin',
                  },
                ],
              }
            : o
        )
      );
      toast.dismiss(); // Dismiss any existing toasts
      toast.success(`Order #${order.id} approved!`);
    }
  };
  const handleReject = (order: Record<string, unknown>) => {
    if (order.status === 'pending') {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: 'rejected',
                updatedAt: new Date().toISOString(),
                history: [
                  ...o.history,
                  {
                    status: 'rejected',
                    changedAt: new Date().toISOString(),
                    changedBy: 'admin',
                  },
                ],
              }
            : o
        )
      );
      toast.dismiss(); // Dismiss any existing toasts
      toast.error(`Order #${order.id} rejected!`);
    }
  };

  // Define columns for the DataTable
  const columns: Column[] = [
    { key: 'userName', label: 'User' },
    { key: 'productName', label: 'Product' },
    { key: 'quantity', label: 'Qty' },
    { key: 'price', label: 'Price (B3TR)', render: (value) => `${value}` },
    { key: 'total', label: 'Total (B3TR)', render: (value) => `${value}` },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        let variant: 'secondary' | 'success' | 'warning' | 'destructive' | 'info' = 'secondary';
        let icon = null;
        if (value === 'approved') { variant = 'success'; icon = <CheckCircle className="w-3 h-3 mr-1" />; }
        else if (value === 'pending') { variant = 'warning'; icon = <Eye className="w-3 h-3 mr-1" />; }
        else if (value === 'rejected') { variant = 'destructive'; icon = <XCircle className="w-3 h-3 mr-1" />; }
        else if (value === 'delivered') { variant = 'info'; icon = <CheckCircle className="w-3 h-3 mr-1" />; }
        return <Badge variant={variant} className="flex items-center">{icon}{String(value).charAt(0).toUpperCase() + String(value).slice(1)}</Badge>;
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => {
        if (row.status === 'pending') {
          return (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(row);
                }}
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(row);
                }}
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
  ];

  // Define actions for the DataTable
  const actions: Action[] = [
    {
      label: 'Approve',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: handleApprove,
      variant: 'default',
      className: 'bg-green-600 hover:bg-green-700 text-white',
    },
    {
      label: 'Reject',
      icon: <XCircle className="h-4 w-4" />,
      onClick: handleReject,
      variant: 'destructive',
      className: '',
    },
  ];

  console.log("orders", orders)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage your order history and approve B3TR token purchases for eco-products.</p>
        </div>
      </div>
        <DataTable
          data={orders as unknown as Record<string, unknown>[]}
          columns={columns}
          title="Order List"
          searchable={true}
          searchPlaceholder="Search orders by user, product, or status..."
          searchInputClassName="border border-border bg-background text-foreground rounded-lg px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
          searchKeys={['userName', 'productName', 'status']}
          pagination={true}
          itemsPerPageOptions={[5, 10, 20, 50]}
          defaultItemsPerPage={10}
          emptyMessage="No orders found"
        />
        <Toaster position="top-right" toastOptions={{
          style: { background: 'var(--card)', color: 'var(--foreground)' },
          className: 'shadow-lg rounded-lg',
        }} />
    </div>
  );
} 