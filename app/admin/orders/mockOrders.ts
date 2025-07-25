export type OrderStatus = "pending" | "approved" | "rejected";

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
  },
  {
    id: "4",
    userId: "u4",
    userName: "David Red",
    productId: "p3",
    productName: "Solar Garden Lights",
    quantity: 3,
    price: 35,
    total: 105,
    status: "pending",
    createdAt: "2024-06-04T10:00:00Z",
    updatedAt: "2024-06-04T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-04T10:00:00Z", changedBy: "user" }
    ]
  },
  {
    id: "5",
    userId: "u5",
    userName: "Eva White",
    productId: "p4",
    productName: "Eco-Friendly Water Bottle",
    quantity: 1,
    price: 20,
    total: 20,
    status: "approved",
    createdAt: "2024-06-05T10:00:00Z",
    updatedAt: "2024-06-05T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-05T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-05T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "6",
    userId: "u6",
    userName: "Frank Black",
    productId: "p5",
    productName: "Organic Cotton Tote Bag",
    quantity: 2,
    price: 25,
    total: 50,
    status: "rejected",
    createdAt: "2024-06-06T10:00:00Z",
    updatedAt: "2024-06-06T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-06T10:00:00Z", changedBy: "user" },
      { status: "rejected", changedAt: "2024-06-06T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "7",
    userId: "u7",
    userName: "Grace Blue",
    productId: "p6",
    productName: "Wind Turbine Kit",
    quantity: 1,
    price: 200,
    total: 200,
    status: "pending",
    createdAt: "2024-06-07T10:00:00Z",
    updatedAt: "2024-06-07T12:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-07T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-07T11:00:00Z", changedBy: "admin" },
      { status: "pending", changedAt: "2024-06-07T12:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "8",
    userId: "u8",
    userName: "Henry Green",
    productId: "p7",
    productName: "Compost Bin",
    quantity: 1,
    price: 40,
    total: 40,
    status: "pending",
    createdAt: "2024-06-08T10:00:00Z",
    updatedAt: "2024-06-08T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-08T10:00:00Z", changedBy: "user" }
    ]
  },
  {
    id: "9",
    userId: "u9",
    userName: "Ivy Violet",
    productId: "p8",
    productName: "Beeswax Food Wraps",
    quantity: 4,
    price: 19,
    total: 76,
    status: "approved",
    createdAt: "2024-06-09T10:00:00Z",
    updatedAt: "2024-06-09T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-09T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-09T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "10",
    userId: "u10",
    userName: "Jack Orange",
    productId: "p9",
    productName: "Electric Bike Charger",
    quantity: 1,
    price: 150,
    total: 150,
    status: "pending",
    createdAt: "2024-06-10T10:00:00Z",
    updatedAt: "2024-06-10T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-10T10:00:00Z", changedBy: "user" }
    ]
  },
  {
    id: "11",
    userId: "u11",
    userName: "Kate Silver",
    productId: "p10",
    productName: "Recycled Paper Notebook",
    quantity: 2,
    price: 9,
    total: 18,
    status: "approved",
    createdAt: "2024-06-11T10:00:00Z",
    updatedAt: "2024-06-11T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-11T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-11T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "12",
    userId: "u12",
    userName: "Leo Gold",
    productId: "p11",
    productName: "Solar Garden Lights",
    quantity: 1,
    price: 35,
    total: 35,
    status: "pending",
    createdAt: "2024-06-12T10:00:00Z",
    updatedAt: "2024-06-12T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-12T10:00:00Z", changedBy: "user" }
    ]
  },
  {
    id: "13",
    userId: "u13",
    userName: "Mona Pink",
    productId: "p12",
    productName: "Hemp Face Mask",
    quantity: 3,
    price: 16,
    total: 48,
    status: "rejected",
    createdAt: "2024-06-13T10:00:00Z",
    updatedAt: "2024-06-13T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-13T10:00:00Z", changedBy: "user" },
      { status: "rejected", changedAt: "2024-06-13T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "14",
    userId: "u14",
    userName: "Nina Brown",
    productId: "p13",
    productName: "Bamboo Cutlery Set",
    quantity: 2,
    price: 23,
    total: 46,
    status: "pending",
    createdAt: "2024-06-14T10:00:00Z",
    updatedAt: "2024-06-14T12:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-14T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-14T11:00:00Z", changedBy: "admin" },
      { status: "pending", changedAt: "2024-06-14T12:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "15",
    userId: "u15",
    userName: "Oscar Gray",
    productId: "p14",
    productName: "Organic Soap Bar",
    quantity: 5,
    price: 7,
    total: 35,
    status: "pending",
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2024-06-15T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-15T10:00:00Z", changedBy: "user" }
    ]
  },
  {
    id: "16",
    userId: "u16",
    userName: "Paul White",
    productId: "p15",
    productName: "Solar Panel Kit",
    quantity: 1,
    price: 600,
    total: 600,
    status: "approved",
    createdAt: "2024-06-16T10:00:00Z",
    updatedAt: "2024-06-16T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-16T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-16T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "17",
    userId: "u17",
    userName: "Quinn Black",
    productId: "p16",
    productName: "Recycled Glass Vase",
    quantity: 1,
    price: 46,
    total: 46,
    status: "pending",
    createdAt: "2024-06-17T10:00:00Z",
    updatedAt: "2024-06-17T10:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-17T10:00:00Z", changedBy: "user" }
    ]
  },
  {
    id: "18",
    userId: "u18",
    userName: "Rita Blue",
    productId: "p17",
    productName: "Bamboo Coffee Cup",
    quantity: 2,
    price: 17,
    total: 34,
    status: "approved",
    createdAt: "2024-06-18T10:00:00Z",
    updatedAt: "2024-06-18T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-18T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-18T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "19",
    userId: "u19",
    userName: "Sam Green",
    productId: "p18",
    productName: "Organic Cotton Sheets",
    quantity: 1,
    price: 90,
    total: 90,
    status: "rejected",
    createdAt: "2024-06-19T10:00:00Z",
    updatedAt: "2024-06-19T11:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-19T10:00:00Z", changedBy: "user" },
      { status: "rejected", changedAt: "2024-06-19T11:00:00Z", changedBy: "admin" }
    ]
  },
  {
    id: "20",
    userId: "u20",
    userName: "Tina Red",
    productId: "p19",
    productName: "Solar Phone Case",
    quantity: 1,
    price: 50,
    total: 50,
    status: "pending",
    createdAt: "2024-06-20T10:00:00Z",
    updatedAt: "2024-06-20T12:00:00Z",
    history: [
      { status: "pending", changedAt: "2024-06-20T10:00:00Z", changedBy: "user" },
      { status: "approved", changedAt: "2024-06-20T11:00:00Z", changedBy: "admin" },
      { status: "pending", changedAt: "2024-06-20T12:00:00Z", changedBy: "admin" }
    ]
  }
]; 