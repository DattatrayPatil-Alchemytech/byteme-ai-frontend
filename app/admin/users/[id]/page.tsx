"use client";
import { notFound } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import { mockUsers } from "../mockUsers";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useState, useMemo } from "react";
import { Select } from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  Wallet,
  User,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// More mock user history data for a richer table and carousel
const mockUserHistory = [
  {
    id: "1",
    vehicle: "Car A",
    submissionCount: 12,
    milesDriven: 3200,
    carbonImpact: 0.8,
    rewards: 150,
    imageHash: "0xabc123",
    date: "2024-07-01",
    image: "/assets/car-ev.jpg",
    type: "4-Wheel",
  },
  {
    id: "2",
    vehicle: "Bike B",
    submissionCount: 8,
    milesDriven: 2100,
    carbonImpact: 0.5,
    rewards: 90,
    imageHash: "0xdef456",
    date: "2024-07-02",
    image: "/assets/bike-ev.jpg",
    type: "2-Wheel",
  },
  {
    id: "3",
    vehicle: "Three Wheeler C",
    submissionCount: 5,
    milesDriven: 1500,
    carbonImpact: 0.3,
    rewards: 60,
    imageHash: "0xghi789",
    date: "2024-07-03",
    image: "/assets/threewheeler-ev.jpg",
    type: "3-Wheel",
  },
  {
    id: "4",
    vehicle: "Car D",
    submissionCount: 10,
    milesDriven: 2800,
    carbonImpact: 0.7,
    rewards: 120,
    imageHash: "0xjkl012",
    date: "2024-07-04",
    image: "/assets/car-ev.jpg",
    type: "4-Wheel",
  },
  {
    id: "5",
    vehicle: "Bike E",
    submissionCount: 7,
    milesDriven: 1800,
    carbonImpact: 0.4,
    rewards: 80,
    imageHash: "0xlmn345",
    date: "2024-07-05",
    image: "/assets/bike-ev.jpg",
    type: "2-Wheel",
  },
  {
    id: "6",
    vehicle: "Three Wheeler F",
    submissionCount: 6,
    milesDriven: 1600,
    carbonImpact: 0.35,
    rewards: 70,
    imageHash: "0xopq678",
    date: "2024-07-06",
    image: "/assets/threewheeler-ev.jpg",
    type: "3-Wheel",
  },
];

// Define user details interface
interface UserDetails {
  phone?: string;
  address?: string;
  registrationDate?: string;
  status?: string;
  wallet?: string;
}

// Add more mock user details for demonstration
const userDetailsMap: Record<string, UserDetails> = {
  "1": {
    phone: "+1 555-123-4567",
    address: "123 Green Lane, Eco City, CA",
    registrationDate: "2023-01-15",
    status: "Active",
    wallet: "0xA1B2C3D4E5F6G7H8I9J0",
  },
  "2": {
    phone: "+1 555-987-6543",
    address: "456 Blue Ave, Clean Town, NY",
    registrationDate: "2023-03-22",
    status: "Inactive",
    wallet: "0xB2C3D4E5F6G7H8I9J0A1",
  },
  "3": {
    phone: "+1 555-222-3333",
    address: "789 Solar Rd, Sunville, TX",
    registrationDate: "2023-05-10",
    status: "Active",
    wallet: "0xC3D4E5F6G7H8I9J0A1B2",
  },
};

export default function UserViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // All hooks must be called before any early returns
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const router = useRouter();

  // Vehicle options for dropdown - moved before early return
  const vehicleOptions = useMemo(() => {
    const names = mockUserHistory.map((row) => row.vehicle);
    return Array.from(new Set(names)).map((v) => ({ value: v, label: v }));
  }, []);

  const resolvedParams = use(params);
  const user = mockUsers.find((u) => u.id === resolvedParams.id);
  if (!user) return notFound();

  const userDetails = userDetailsMap[user.id] || ({} as UserDetails);

  // Mock dashboard summary data for this user
  const summary = {
    tokens: user.totalRewards,
    miles: user.totalMiles,
    co2: (user.totalMiles * 0.00025).toFixed(2), // Example: 0.25kg/km
    rank: user.tier === "Platinum" ? 1 : user.tier === "Gold" ? 2 : 3,
  };

  // Filtered history
  const filtered = mockUserHistory.filter((row) => {
    const matchesSearch = row.vehicle
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = vehicleFilter ? row.vehicle === vehicleFilter : true;
    return matchesSearch && matchesFilter;
  });

  const columns: Column[] = [
    {
      key: "vehicle",
      label: "Vehicle",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    { key: "submissionCount", label: "Submission Count" },
    { key: "milesDriven", label: "Miles Driven" },
    { key: "carbonImpact", label: "Carbon Impact (tCO₂)" },
    { key: "rewards", label: "Rewards (B3TR)" },
    {
      key: "imageHash",
      label: "Image Hash",
      render: (value) => (
        <span className="font-mono text-xs">{value as string}</span>
      ),
    },
    { key: "date", label: "Date" },
  ];

  const handleBack = () => {
    router.push("/admin/users");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
          <p className="text-muted-foreground">
            View and manage user information
          </p>
        </div>
      </div>
      {/* User Basic Details Card - Top of Page */}
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 text-foreground">
            <User className="text-primary" size={32} />
            <span className="text-2xl font-extrabold text-gradient-ev-green tracking-tight">
              {user.name}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="text-primary" size={20} />
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-primary" size={20} />
              <span>{userDetails.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-primary" size={20} />
              <span>{userDetails.address || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              <span>{userDetails.registrationDate || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-primary" size={20} />
              <span
                className={
                  userDetails.status === "Active"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {userDetails.status || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="text-primary" size={20} />
              <span className="font-mono text-xs">
                {userDetails.wallet || "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* User Overview Summary Cards with dashboard icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
        {[
          {
            value: summary.tokens.toLocaleString(),
            label: "B3TR Tokens",
            icon: "⚡",
          },
          {
            value: summary.miles.toLocaleString(),
            label: "Sustainable Miles",
            icon: "🚗",
          },
          {
            value: summary.co2,
            label: "CO₂ Saved (t)",
            icon: "🌱",
          },
          {
            value: `#${summary.rank}`,
            label: "Current Rank",
            icon: "🏆",
          },
        ].map((item, idx) => (
          <Card
            key={item.label}
            className="bg-card/80 backdrop-blur-sm border-0 shadow-lg flex flex-col items-center p-6 hover:shadow-xl transition-all"
          >
            <CardContent className="flex flex-col items-center p-0">
              <div className="text-3xl font-extrabold text-gradient-ev-green animate-pulse">
                {item.value}
              </div>
              <div className="text-muted-foreground text-sm">{item.label}</div>
              <div className="mt-2 p-2 bg-primary/20 rounded-lg text-2xl">
                {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full mb-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="flex gap-4 min-w-[600px] sm:min-w-0">
              {mockUserHistory.slice(0, 20).map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="flex-shrink-0 bg-card/80 border-0 shadow p-4 flex flex-col items-center min-w-[160px] max-w-[180px] w-full transition-transform transition-shadow duration-300 hover:scale-[1.03] hover:shadow-2xl"
                >
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-muted rounded-md mb-2 border border-muted">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.vehicle}
                      width={96}
                      height={96}
                      className="w-full h-full rounded-md"
                    />
                  </div>
                  <div className="font-semibold text-center text-base truncate w-full text-foreground">
                    {vehicle.vehicle}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-center capitalize">
                    {vehicle.type} EV
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="Search vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-border bg-background text-foreground rounded-full px-5 py-3 w-full sm:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted/60 placeholder:text-muted-foreground"
            />
            <Select
              value={vehicleFilter}
              onChange={setVehicleFilter}
              options={[...vehicleOptions]}
              placeholder="All Vehicles"
              className="bg-background text-foreground border border-border hover:bg-muted/60"
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered as unknown as Record<string, unknown>[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
