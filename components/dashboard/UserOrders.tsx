'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import { RootState } from '@/redux/store';
import { AppDispatch } from '@/redux/store';
import { getOrders, Order } from '@/lib/apiHelpers/storeProducts';
import toast from 'react-hot-toast';
import { setOrders, setOrdersError, setOrdersLoading } from '@/redux/ordersSlice';

export default function UserOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, ordersLoading, ordersError, ordersTotal } = useSelector((state: RootState) => state.orders);

  // Local state for pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLimit, setCurrentLimit] = React.useState(10);

  // Fetch orders on component mount and when pagination changes
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setOrdersLoading(true));
        const response = await getOrders(currentPage, currentLimit);
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
  }, [dispatch, currentPage, currentLimit]);

  // Pagination logic
  const totalPages = Math.ceil(ordersTotal / currentLimit);

  // Get status icon and color
  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { icon: <Clock className="w-4 h-4" />, color: 'warning', label: 'Pending' };
      case 'confirmed':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'success', label: 'Confirmed' };
      case 'shipped':
        return { icon: <Truck className="w-4 h-4" />, color: 'info', label: 'Shipped' };
      case 'delivered':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'success', label: 'Delivered' };
      case 'cancelled':
        return { icon: <XCircle className="w-4 h-4" />, color: 'destructive', label: 'Cancelled' };
      default:
        return { icon: <Clock className="w-4 h-4" />, color: 'secondary', label: status };
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Orders</h2>
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
            <h2 className="text-2xl font-bold text-foreground">My Orders</h2>
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
          <h2 className="text-2xl font-bold text-foreground">My Orders</h2>
          <p className="text-muted-foreground">Track your purchase history and order status</p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t made any purchases yet. Start shopping to see your orders here!
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard?tab=store'} 
              className="gradient-ev-green hover:from-emerald-600 hover:to-green-700"
            >
              Browse Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // const statusInfo = getStatusInfo(order.status);
            // const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);
            
            return (
              <Card key={order.id} className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
                <CardContent className="p-6">
                    Orders Details
                  {/* <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"> */}
                    {/* Order Info */}
                    {/* <div className="flex-1"> */}
                      {/* <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg mb-1">
                            {order.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Order #{order.id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary text-lg">
                            {parseFloat(order.totalPrice)} B3TR
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {order.quantity}
                          </div>
                        </div>
                      </div> */}

                      {/* Product Details */}
                      {/* <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.product.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {order.product.category}
                          </Badge>
                          {order.product.isEcoFriendly && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              Eco-Friendly
                            </Badge>
                          )}
                        </div>
                      </div> */}

                      {/* Shipping Address */}
                      {/* {order.shippingAddress && (
                        <div className="flex items-start space-x-2 mb-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-muted-foreground">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>
                      )} */}

                      {/* Status and Payment */}
                      {/* <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {statusInfo.icon}
                          <Badge variant={statusInfo.color as any} className="text-xs">
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={paymentStatusColor as any} className="text-xs">
                            Payment: {order.paymentStatus}
                          </Badge>
                        </div>
                      </div> */}

                      {/* Customer Notes */}
                      {/* {order.customerNotes && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Notes:</span> {order.customerNotes}
                          </p>
                        </div>
                      )} */}
                    {/* </div> */}

                    {/* Order Date */}
                    {/* <div className="lg:text-right">
                      <div className="text-sm text-muted-foreground">
                        Ordered on
                      </div>
                      <div className="font-medium text-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div> */}
                  {/* </div> */}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
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
            {[5, 10, 20, 50].map((l) => (
              <option key={l} value={l}>{l} / page</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 