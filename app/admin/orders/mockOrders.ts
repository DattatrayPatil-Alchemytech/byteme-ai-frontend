export type OrderStatus = "pending" | "approved" | "rejected" | "delivered";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  history: Array<{
    status: OrderStatus;
    changedAt: string;
    changedBy: string; // admin/user
  }>;
}

export const mockOrders: Order[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Alice Green",
    productId: "p1",
    productName: "Eco Car Charger",
    quantity: 1,
    price: 450,
    total: 450,
    status: "pending",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-01T10:00:00Z", changedBy: "user" }
    ]
  },
  {
    id: "2",
    userId: "u2",
    userName: "Bob Blue",
    productId: "p2",
    productName: "Bio Car Wash Kit",
    quantity: 2,
    price: 120,
    total: 240,
    status: "approved",
    createdAt: "2024-06-02T11:00:00Z",
    updatedAt: "2024-06-02T12:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-02T11:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-02T12:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "3",
    userId: "u3",
    userName: "Carol Sun",
    productId: "p1",
    productName: "Eco Car Charger",
    quantity: 1,
    price: 450,
    total: 450,
    status: "rejected",
    createdAt: "2024-06-03T09:30:00Z",
    updatedAt: "2024-06-03T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-03T09:30:00Z", changedBy: "user" },
      { status: "rejected", changedAt: "2024-06-03T10:00:00Z", changedBy: "admin" }
    ]
  }
]; 