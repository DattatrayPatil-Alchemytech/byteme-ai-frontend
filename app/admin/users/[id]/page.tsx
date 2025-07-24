import { notFound } from 'next/navigation';
import { mockUsers } from '../mockUsers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
      <Card className="p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">User History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={historyColumns} data={mockUserHistory} />
        </CardContent>
      </Card>
    </div>
  );
} 