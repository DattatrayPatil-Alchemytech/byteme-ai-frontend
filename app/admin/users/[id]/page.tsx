"use client";
import { notFound } from "next/navigation";
import { mockUsers } from "../mockUsers";
import { DataTable } from "@/components/ui/DataTable";
import { useState, useMemo, useRef } from "react";
import { Select } from "@/components/ui/DropdownMenu";
import { mockHistory } from "@/app/(user)/dashboard/mockHistory";
import { ColumnDef } from "@tanstack/react-table";
import { Search, X, Eye, Mail, Phone, MapPin, Calendar, BadgeCheck, Wallet, User } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

const historyColumns = [
  { accessorKey: "vehicle", header: "Vehicle" },
  { accessorKey: "submissionCount", header: "Submission Count" },
  { accessorKey: "milesDriven", header: "Miles Driven" },
  { accessorKey: "carbonImpact", header: "Carbon Impact (tCO₂)" },
  { accessorKey: "rewards", header: "Rewards (B3TR)" },
  { accessorKey: "imageHash", header: "Image Hash" },
  { accessorKey: "date", header: "Date" },
];

// Add more mock user details for demonstration
const userDetailsMap: Record<string, any> = {
  '1': {
    phone: '+1 555-123-4567',
    address: '123 Green Lane, Eco City, CA',
    registrationDate: '2023-01-15',
    status: 'Active',
    wallet: '0xA1B2C3D4E5F6G7H8I9J0',
  },
  '2': {
    phone: '+1 555-987-6543',
    address: '456 Blue Ave, Clean Town, NY',
    registrationDate: '2023-03-22',
    status: 'Inactive',
    wallet: '0xB2C3D4E5F6G7H8I9J0A1',
  },
  '3': {
    phone: '+1 555-222-3333',
    address: '789 Solar Rd, Sunville, TX',
    registrationDate: '2023-05-10',
    status: 'Active',
    wallet: '0xC3D4E5F6G7H8I9J0A1B2',
  },
};

export default function UserViewPage({ params }: { params: { id: string } }) {
  const user = mockUsers.find((u) => u.id === params.id);
  if (!user) return notFound();
  const userDetails = userDetailsMap[user.id] || {};

  // Mock dashboard summary data for this user
  const summary = {
    tokens: user.totalRewards,
    miles: user.totalMiles,
    co2: (user.totalMiles * 0.00025).toFixed(2), // Example: 0.25kg/km
    rank: user.tier === 'Platinum' ? 1 : user.tier === 'Gold' ? 2 : 3,
  };

  // State for search and filter
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(
    mockUserHistory[0]?.vehicle || ""
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  // Vehicle options for dropdown
  const vehicleOptions = useMemo(() => {
    const names = mockUserHistory.map((row) => row.vehicle);
    return Array.from(new Set(names)).map((v) => ({ value: v, label: v }));
  }, []);

  // Filtered history
  const filtered = mockHistory.filter((row) => {
    const matchesSearch = row.vehicle
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = vehicleFilter ? row.vehicle === vehicleFilter : true;
    return matchesSearch && matchesFilter;
  });

  const columns: ColumnDef<(typeof mockHistory)[number]>[] = [
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: (info) => (
        <span className="font-medium">{info.getValue() as string}</span>
      ),
    },
    { accessorKey: "submissionCount", header: "Submission Count" },
    { accessorKey: "milesDriven", header: "Miles Driven" },
    { accessorKey: "carbonImpact", header: "Carbon Impact (tCO₂)" },
    { accessorKey: "rewards", header: "Rewards (B3TR)" },
    {
      accessorKey: "imageHash",
      header: "Image Hash",
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue() as string}</span>
      ),
    },
    { accessorKey: "date", header: "Date" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* User Basic Details Card - Top of Page */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-white/90 rounded-xl shadow p-6 border border-muted mb-8 animate-fade-in">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <User className="text-primary" size={32} />
          <span className="text-2xl font-extrabold text-gradient-ev-green tracking-tight">{user.name}</span>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 items-center w-full md:w-auto justify-between">
          <div className="flex items-center gap-2"><Mail className="text-primary" size={20} /><span className="font-semibold">{user.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="text-primary" size={20} /><span>{userDetails.phone || '—'}</span></div>
          <div className="flex items-center gap-2"><MapPin className="text-primary" size={20} /><span>{userDetails.address || '—'}</span></div>
          <div className="flex items-center gap-2"><Calendar className="text-primary" size={20} /><span>{userDetails.registrationDate || '—'}</span></div>
          <div className="flex items-center gap-2"><BadgeCheck className="text-primary" size={20} /><span className={userDetails.status === 'Active' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{userDetails.status || '—'}</span></div>
          <div className="flex items-center gap-2"><Wallet className="text-primary" size={20} /><span className="font-mono text-xs">{userDetails.wallet || '—'}</span></div>
        </div>
      </div>
      {/* User Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
        <div className="rounded-xl bg-white/90 shadow flex flex-col items-center p-6 border border-muted hover:shadow-lg transition-all">
          <div className="text-3xl font-extrabold text-gradient-ev-green animate-pulse">{summary.tokens.toLocaleString()}</div>
          <div className="text-muted-foreground text-sm">B3TR Tokens</div>
          <div className="mt-2 text-emerald-500"><Search size={28} /></div>
        </div>
        <div className="rounded-xl bg-white/90 shadow flex flex-col items-center p-6 border border-muted hover:shadow-lg transition-all">
          <div className="text-3xl font-extrabold text-gradient-ev-green animate-pulse">{summary.miles.toLocaleString()}</div>
          <div className="text-muted-foreground text-sm">Sustainable Miles</div>
          <div className="mt-2 text-emerald-500"><Eye size={28} /></div>
        </div>
        <div className="rounded-xl bg-white/90 shadow flex flex-col items-center p-6 border border-muted hover:shadow-lg transition-all">
          <div className="text-3xl font-extrabold text-gradient-ev-green animate-pulse">{summary.co2}</div>
          <div className="text-muted-foreground text-sm">CO₂ Saved (t)</div>
          <div className="mt-2 text-green-600"><X size={28} /></div>
        </div>
        <div className="rounded-xl bg-white/90 shadow flex flex-col items-center p-6 border border-muted hover:shadow-lg transition-all">
          <div className="text-3xl font-extrabold text-gradient-ev-green animate-pulse">#{summary.rank}</div>
          <div className="text-muted-foreground text-sm">Current Rank</div>
          <div className="mt-2 text-yellow-500"><Eye size={28} /></div>
        </div>
      </div>
      <div className="w-full mb-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="flex gap-4 min-w-[600px] sm:min-w-0">
          {mockHistory.slice(0, 20).map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex-shrink-0 bg-white/90 border border-border rounded-2xl shadow-lg p-4 flex flex-col items-center min-w-[160px] max-w-[180px] w-full transition-transform transition-shadow duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md mb-2 border border-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.vehicle}
                  className="w-full h-full rounded-md"
                  loading="lazy"
                />
              </div>
              <div className="font-semibold text-center text-base truncate w-full text-foreground">
                {vehicle.vehicle}
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center capitalize">
                {vehicle.type} EV
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-primary/30 rounded-full px-5 py-3 w-full sm:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-primary/5 placeholder:text-muted-foreground"
        />
        <Select
          value={vehicleFilter}
          onChange={setVehicleFilter}
          options={[{ value: "", label: "All Vehicles" }, ...vehicleOptions]}
          placeholder="All Vehicles"
        />
      </div>
      <div className="bg-white/90 rounded-2xl shadow-lg p-4 transition-transform transition-shadow duration-300 hover:scale-[1.01] hover:shadow-2xl">
        <DataTable columns={columns} data={filtered} />
      </div>
      <CardContent className="space-y-4 p-0">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-lg font-medium text-foreground/90 border-b border-muted pb-3 mb-3">
          <div><span className="font-semibold text-primary">Tier:</span> {user.tier}</div>
          <div><span className="font-semibold text-primary">Total Miles:</span> {user.totalMiles}</div>
          <div><span className="font-semibold text-primary">Total Rewards:</span> {user.totalRewards}</div>
          <div><span className="font-semibold text-primary">Submissions:</span> {user.submissionCount}</div>
          <div><span className="font-semibold text-primary">Last Active:</span> {user.lastActive}</div>
        </div>
      </CardContent>
    </div>
  );
}
