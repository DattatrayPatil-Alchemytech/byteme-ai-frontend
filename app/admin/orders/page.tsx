'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Column, Action } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { mockOrders, Order } from './mockOrders';
import { Toaster, toast } from 'react-hot-toast';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = React.useState<Order[]>(mockOrders);
  const [notification, setNotification] = React.useState<string>("");

  // Action handlers
  const handleView = (order: Record<string, unknown>) => {
    router.push(`/admin/orders/${order.id}`);
  };
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
      toast.error(`Order #${order.id} rejected!`);
    }
  };

  // Define columns for the DataTable
  const columns: Column[] = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value) => (
        <Link href={`/admin/orders/${value}`} className="text-blue-600 hover:underline">
          {value as string}
        </Link>
      ),
    },
    { key: 'userName', label: 'User' },
    { key: 'productName', label: 'Product' },
    { key: 'quantity', label: 'Qty' },
    { key: 'price', label: 'Price (B3TR)', render: (value) => `₿${value}` },
    { key: 'total', label: 'Total (B3TR)', render: (value) => `₿${value}` },
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
  ];

  // Define actions for the DataTable
  const actions: Action[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
      variant: 'ghost',
    },
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
      <Card className="p-6 bg-white/90 backdrop-blur-md shadow-xl overflow-x-auto">
        <DataTable
          data={orders as unknown as Record<string, unknown>[]}
          columns={columns}
          actions={actions}
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
      </Card>
    </div>
  );
} 