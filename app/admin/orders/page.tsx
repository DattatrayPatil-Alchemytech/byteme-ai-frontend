'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RootState } from '@/redux/store';
import { AppDispatch } from '@/redux/store';
import { 
  setOrders, 
  setOrdersLoading, 
  setOrdersError 
} from '@/redux/adminStoreSlice';
import { getAllOrders, updateOrderStatus, Order } from '@/lib/apiHelpers/adminStore';

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, ordersLoading, ordersError, ordersTotal } = useSelector((state: RootState) => state.adminStore);

  // Local state for pagination and filtering
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLimit, setCurrentLimit] = React.useState(20);
  const [selectedStatus, setSelectedStatus] = React.useState<Order['status'] | 'all'>('all');

  // Fetch orders on component mount and when pagination/filters change
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setOrdersLoading(true));
        const response = await getAllOrders(
          currentPage, 
          currentLimit, 
          selectedStatus === 'all' ? undefined : selectedStatus
        );
        dispatch(setOrders(response));
      } catch (error) {
        console.error('Error fetching orders:', error);
        dispatch(setOrdersError(error instanceof Error ? error.message : 'Failed to fetch orders'));
        toast.error('Failed to fetch orders');
      } finally {
        dispatch(setOrdersLoading(false));
      }
    };

    fetchOrders();
  }, [dispatch, currentPage, currentLimit, selectedStatus]);

  const handleApprove = async (order: Record<string, unknown>) => {
    if (order.status === 'pending') {
      try {
        const orderId = order.id as string;
        await updateOrderStatus(orderId, 'confirmed');
        toast.success(`Order #${orderId} approved!`);
        
        // Refresh the orders list
        const response = await getAllOrders(
          currentPage, 
          currentLimit, 
          selectedStatus === 'all' ? undefined : selectedStatus
        );
        dispatch(setOrders(response));
      } catch (error) {
        console.error('Error approving order:', error);
        toast.error('Failed to approve order');
      }
    }
  };

  const handleReject = async (order: Record<string, unknown>) => {
    if (order.status === 'pending') {
      try {
        const orderId = order.id as string;
        await updateOrderStatus(orderId, 'cancelled');
        toast.error(`Order #${orderId} rejected!`);
        
        // Refresh the orders list
        const response = await getAllOrders(
          currentPage, 
          currentLimit, 
          selectedStatus === 'all' ? undefined : selectedStatus
        );
        dispatch(setOrders(response));
      } catch (error) {
        console.error('Error rejecting order:', error);
        toast.error('Failed to reject order');
      }
    }
  };

  // Transform orders data for display
  const transformedOrders = orders.map((order: Order) => {
    return {
      id: order.id,
      userName: order.user.username || `User ${order.user.id.slice(0, 8)}...`,
      userEmail: order.user.email,
      productName: order.product.name,
      productDescription: order.product.description,
      productCategory: order.product.category,
      quantity: order.quantity,
      unitPrice: parseFloat(order.unitPrice),
      totalPrice: parseFloat(order.totalPrice),
      discountAmount: order.discountAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Include original order data for reference
      originalOrder: order,
    };
  });

  // Pagination logic
  const totalPages = Math.ceil(ordersTotal / currentLimit);

  // Status options for filter
  const statusOptions: { value: Order['status'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  // Define columns for the DataTable
  const columns: Column[] = [
    { key: 'userName', label: 'User' },
    { 
      key: 'productName', 
      label: 'Product',
      render: (value, row) => (
        <div>
          <div className="font-medium text-foreground">{value as string}</div>
          <div className="text-sm text-muted-foreground">{row.productDescription as string}</div>
          <Badge variant="secondary" className="text-xs mt-1">{row.productCategory as string}</Badge>
        </div>
      )
    },
    { key: 'quantity', label: 'Qty' },
    { key: 'unitPrice', label: 'Unit Price (B3TR)', render: (value) => `$${value}` },
    { 
      key: 'totalPrice', 
      label: 'Total (B3TR)', 
      render: (value, row) => {
        const totalPrice = typeof value === 'number' ? value : 0;
        const discountAmount = typeof row.discountAmount === 'number' ? row.discountAmount : 0;
        
        return (
          <div>
            <div className="font-medium">${totalPrice}</div>
            {discountAmount > 0 && (
              <div className="text-sm text-green-600">-${discountAmount} discount</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        let variant: 'secondary' | 'success' | 'warning' | 'destructive' | 'info' = 'secondary';
        let icon = null;
        if (value === 'confirmed') { variant = 'success'; icon = <CheckCircle className="w-3 h-3 mr-1" />; }
        else if (value === 'pending') { variant = 'warning'; icon = <Eye className="w-3 h-3 mr-1" />; }
        else if (value === 'cancelled') { variant = 'destructive'; icon = <XCircle className="w-3 h-3 mr-1" />; }
        else if (value === 'delivered') { variant = 'info'; icon = <CheckCircle className="w-3 h-3 mr-1" />; }
        else if (value === 'shipped') { variant = 'info'; icon = <CheckCircle className="w-3 h-3 mr-1" />; }
        else if (value === 'processing') { variant = 'warning'; icon = <Eye className="w-3 h-3 mr-1" />; }
        else if (value === 'refunded') { variant = 'destructive'; icon = <XCircle className="w-3 h-3 mr-1" />; }
        return <Badge variant={variant} className="flex items-center">{icon}{String(value).charAt(0).toUpperCase() + String(value).slice(1)}</Badge>;
      },
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => {
        let variant: 'secondary' | 'success' | 'warning' | 'destructive' = 'secondary';
        if (value === 'paid') { variant = 'success'; }
        else if (value === 'pending') { variant = 'warning'; }
        else if (value === 'failed') { variant = 'destructive'; }
        else if (value === 'refunded') { variant = 'destructive'; }
        return <Badge variant={variant}>{String(value).charAt(0).toUpperCase() + String(value).slice(1)}</Badge>;
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

  if (ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Error loading orders</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">Error: {ordersError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage your order history and approve B3TR token purchases for eco-products.</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 items-center">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as Order['status'] | 'all');
              setCurrentPage(1); // Reset to first page when status changes
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ minWidth: 160 }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {ordersLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading orders...</span>
        </div>
      )}

      {/* Error State */}
      {ordersError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <p className="text-destructive text-sm">{ordersError}</p>
        </div>
      )}

      {/* Orders DataTable */}
      {!ordersLoading && !ordersError && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-12 mt-30">
              <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedStatus !== 'all' 
                  ? `No orders found with status "${selectedStatus}".`
                  : "There are currently no orders in your system."
                }
              </p>
              {selectedStatus !== 'all' && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedStatus('all')}
                  className="text-sm"
                >
                  View All Orders
                </Button>
              )}
            </div>
          ) : (
            <>
              <DataTable
                data={transformedOrders as unknown as Record<string, unknown>[]}
                columns={columns}
                title="Order List"
                searchable={true}
                searchPlaceholder="Search orders by user, product, or status..."
                searchInputClassName="border border-border bg-background text-foreground rounded-lg px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
                searchKeys={['userName', 'userEmail', 'productName', 'status']}
                pagination={false} // We're handling pagination manually
                emptyMessage="No orders found"
              />
              
              {/* Custom Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-end items-center mt-6 gap-2">
                  <span className="text-sm text-muted-foreground mr-2">Page</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <span className="text-sm font-semibold">{currentPage} / {totalPages}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                  <select
                    className="ml-4 border border-gray-300 rounded px-2 py-1 text-sm"
                    value={currentLimit}
                    onChange={e => {
                      setCurrentLimit(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[10, 20, 50, 100].map((l) => (
                      <option key={l} value={l}>{l} / page</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
} 