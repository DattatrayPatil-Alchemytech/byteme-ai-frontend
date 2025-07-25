"use client";
import { useParams, useRouter } from "next/navigation";
import { mockOrders, Order } from "../mockOrders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const order = mockOrders.find((o) => o.id === params.id);
  if (!order) return <div className="p-8">Order not found.</div>;

  const handleApprove = () => {
    alert(`Approve order ${order.id}`);
    // Here you would update order status in real app
  };
  const handleReject = () => {
    alert(`Reject order ${order.id}`);
    // Here you would update order status in real app
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 bg-white/90 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Order #{order.id}</h2>
            <div className="text-muted-foreground text-sm mb-1">
              Placed: {order.createdAt}
            </div>
            <div className="text-muted-foreground text-sm mb-1">
              Status: <span className="font-semibold">{order.status}</span>
            </div>
            <div className="text-muted-foreground text-sm mb-1">
              User: {order.userName}
            </div>
            <div className="text-muted-foreground text-sm mb-1">
              Product: {order.productName}
            </div>
            <div className="text-muted-foreground text-sm mb-1">
              Quantity: {order.quantity}
            </div>
            <div className="text-muted-foreground text-sm mb-1">
              Total: {order.total} B3TR
            </div>
          </div>
          <div className="flex gap-2">
            {order.status === "pending" && (
              <>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
              </>
            )}
            <Link
              href="/admin/orders"
              className="ml-2 text-blue-600 hover:underline"
            >
              Back to Orders
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Order Status History</h3>
          <ul className="space-y-2">
            {order.history.map((h, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <span
                  className={
                    h.status === "approved"
                      ? "text-green-600"
                      : h.status === "rejected"
                      ? "text-red-600"
                      : h.status === "pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }
                >
                  ●
                </span>
                <span>
                  {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                </span>
                <span className="text-muted-foreground ml-2">
                  {h.changedAt}
                </span>
                <span className="ml-2">by {h.changedBy}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
