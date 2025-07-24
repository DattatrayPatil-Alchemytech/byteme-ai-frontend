'use client';
import { notFound } from 'next/navigation';
import { mockUsers } from '../mockUsers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Select } from '@/components/ui/DropdownMenu';

// Mock user history data (reuse or import if you have a common one)
const mockUserHistory = [
  {
    id: '1',
    vehicle: 'Car A',
    submissionCount: 12,
    milesDriven: 3200,
    carbonImpact: 0.8,
    rewards: 150,
    imageHash: '0xabc123',
    date: '2024-07-01',
    image: '/assets/car-ev.jpg',
    type: '4-Wheel',
  },
  {
    id: '2',
    vehicle: 'Bike B',
    submissionCount: 8,
    milesDriven: 2100,
    carbonImpact: 0.5,
    rewards: 90,
    imageHash: '0xdef456',
    date: '2024-07-02',
    image: '/assets/bike-ev.jpg',
    type: '2-Wheel',
  },
  {
    id: '3',
    vehicle: 'Three Wheeler C',
    submissionCount: 5,
    milesDriven: 1500,
    carbonImpact: 0.3,
    rewards: 60,
    imageHash: '0xghi789',
    date: '2024-07-03',
    image: '/assets/threewheeler-ev.jpg',
    type: '3-Wheel',
  },
];

const historyColumns = [
  { accessorKey: 'vehicle', header: 'Vehicle' },
  { accessorKey: 'submissionCount', header: 'Submission Count' },
  { accessorKey: 'milesDriven', header: 'Miles Driven' },
  { accessorKey: 'carbonImpact', header: 'Carbon Impact (tCO₂)' },
  { accessorKey: 'rewards', header: 'Rewards (B3TR)' },
  { accessorKey: 'imageHash', header: 'Image Hash' },
  { accessorKey: 'date', header: 'Date' },
];

export default function UserViewPage({ params }: { params: { id: string } }) {
  const user = mockUsers.find(u => u.id === params.id);
  if (!user) return notFound();

  // State for search and filter
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');

  // Vehicle options for dropdown
  const vehicleOptions = useMemo(() => {
    const names = mockUserHistory.map((row) => row.vehicle);
    return Array.from(new Set(names)).map((v) => ({ value: v, label: v }));
  }, []);

  // Filtered history
  const filtered = mockUserHistory.filter((row) => {
    const matchesSearch = row.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = vehicleFilter ? row.vehicle === vehicleFilter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <div className="flex-1 space-y-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{user.email}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-4 text-base">
              <div><span className="font-semibold">Tier:</span> {user.tier}</div>
              <div><span className="font-semibold">Total Miles:</span> {user.totalMiles}</div>
              <div><span className="font-semibold">Total Rewards:</span> {user.totalRewards}</div>
              <div><span className="font-semibold">Submissions:</span> {user.submissionCount}</div>
              <div><span className="font-semibold">Last Active:</span> {user.lastActive}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`mailto:${user.email}`}>Email</Link>
              </Button>
              {user.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://twitter.com/${user.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">Twitter/X</a>
                </Button>
              )}
              {user.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
      {/* Vehicle Card Carousel */}
      <div className="w-full mb-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="flex gap-4 min-w-[600px] sm:min-w-0">
          {mockUserHistory.slice(0, 20).map((vehicle: typeof mockUserHistory[0]) => (
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
      {/* Search and Filter */}
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
          options={[{ value: '', label: 'All Vehicles' }, ...vehicleOptions]}
          placeholder="All Vehicles"
        />
      </div>
      <div className="bg-white/90 rounded-2xl shadow-lg p-4 transition-transform transition-shadow duration-300 hover:scale-[1.01] hover:shadow-2xl">
        <DataTable columns={historyColumns} data={filtered} />
      </div>
    </div>
  );
} 