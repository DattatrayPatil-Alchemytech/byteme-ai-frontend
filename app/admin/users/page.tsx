'use client';
import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { mockUsers } from './mockUsers';
import { Card } from '@/components/ui/card';
import { SearchFilter } from '../../../components/ui/SearchFilter';

const columns = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'twitter',
    header: 'Twitter/X',
  },
  {
    accessorKey: 'linkedin',
    header: 'LinkedIn',
  },
  {
    accessorKey: 'submissionCount',
    header: 'Submissions',
  },
  {
    accessorKey: 'totalMiles',
    header: 'Miles Driven',
  },
  {
    accessorKey: 'totalRewards',
    header: 'Rewards',
  },
  {
    accessorKey: 'tier',
    header: 'Tier',
  },
  {
    accessorKey: 'lastActive',
    header: 'Last Active',
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.twitter?.toLowerCase().includes(search.toLowerCase()) ||
        user.linkedin?.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter ? user.tier === tierFilter : true;
      return matchesSearch && matchesTier;
    });
  }, [search, tierFilter]);

  const tierOptions = Array.from(new Set(mockUsers.map((u) => u.tier)));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            filterLabel="Tier"
            filterValue={tierFilter}
            filterOptions={tierOptions}
            onFilterChange={setTierFilter}
          />
        </div>
        <DataTable columns={columns} data={filteredUsers} />
      </Card>
    </div>
  );
} 