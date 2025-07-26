'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { getBadgesList, toggleBadgeStatus, publishBadge, type AdminBadge, type BadgesListResponse } from '@/lib/apiHelpers/adminBadges';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function AdminBadgesPage() {
  const router = useRouter();
  const [badges, setBadges] = useState<AdminBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBadges, setTotalBadges] = useState(0);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch badges data
  const fetchBadges = async () => {
    try {
      setIsLoading(true);
      const response: BadgesListResponse = await getBadgesList(1, 1000); // Get all badges for client-side filtering
      setBadges(response.badges);
      setTotalBadges(response.total);
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Failed to fetch badges');
      // Set default empty state
      setBadges([]);
      setTotalBadges(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (badgeId: string) => {
    try {
      setIsUpdating(badgeId);
      await toggleBadgeStatus(badgeId);
      toast.success('Badge status updated successfully');
      // Refresh the data
      fetchBadges();
    } catch (error) {
      console.error('Error toggling badge status:', error);
      toast.error('Failed to update badge status');
    } finally {
      setIsUpdating(null);
    }
  };

  // Handle publish badge
  const handlePublishBadge = async (badgeId: string) => {
    try {
      setIsUpdating(badgeId);
      await publishBadge(badgeId);
      toast.success('Badge published successfully');
      // Refresh the data
      fetchBadges();
    } catch (error) {
      console.error('Error publishing badge:', error);
      toast.error('Failed to publish badge');
    } finally {
      setIsUpdating(null);
    }
  };

  // Handle view badge details
  const handleViewBadge = (badgeId: string) => {
    router.push(`/admin/badges/${badgeId}`);
  };

  // Handle edit badge
  const handleEditBadge = (badgeId: string) => {
    router.push(`/admin/badges/edit/${badgeId}`);
  };

  // Handle create new badge
  const handleCreateBadge = () => {
    router.push('/admin/badges/create');
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'uncommon':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'rare':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'epic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mileage':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'carbon':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'streak':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
      case 'achievement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <div className="flex items-center space-x-3">
            <Image 
              src={badge.iconUrl || badge.imageUrl} 
              alt={badge.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-badge.png';
              }}
            />
            <div>
              <div className="font-medium text-foreground">{badge.name}</div>
              <div className="text-sm text-muted-foreground">{badge.description}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <Badge className={getTypeColor(badge.type)}>
            {badge.type}
          </Badge>
        );
      },
    },
    {
      key: 'rarity',
      label: 'Rarity',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <Badge className={getRarityColor(badge.rarity)}>
            {badge.rarity}
          </Badge>
        );
      },
    },
    {
      key: 'pointsValue',
      label: 'Points',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <span className="font-medium">{badge.pointsValue}</span>
        );
      },
    },
    {
      key: 'rewards',
      label: 'Rewards',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <div className="text-sm">
            <div>B3TR: {badge.rewards.b3trTokens}</div>
            <div>XP: {badge.rewards.experience}</div>
          </div>
        );
      },
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < badge.metadata.difficulty 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <Badge className={badge.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'}>
            {badge.isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      key: 'published',
      label: 'Published',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <Badge className={badge.isPublished ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}>
            {badge.isPublished ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewBadge(badge.id)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditBadge(badge.id)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant={badge.isActive ? "destructive" : "default"}
              onClick={() => handleToggleStatus(badge.id)}
              disabled={isUpdating === badge.id}
            >
              {isUpdating === badge.id ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                badge.isActive ? 'Disable' : 'Enable'
              )}
            </Button>
            <Button
              size="sm"
              variant={badge.isPublished ? "outline" : "default"}
              onClick={() => handlePublishBadge(badge.id)}
              disabled={isUpdating === badge.id}
            >
              {isUpdating === badge.id ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                badge.isPublished ? 'Unpublish' : 'Publish'
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  // Initial data fetch
  useEffect(() => {
    fetchBadges();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Badges Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage system badges and achievements
          </p>
        </div>
        <Button onClick={handleCreateBadge} className="gradient-ev-green text-white">
          Create Badge
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
            <span className="text-2xl">🏆</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBadges}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Badges</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges.filter(b => b.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Badges</CardTitle>
            <span className="text-2xl">❌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges.filter(b => !b.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <span className="text-2xl">📂</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(badges.map(b => b.metadata.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Badges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Badges List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={8} rows={5} />
          ) : (
            <DataTable
              data={badges as unknown as Record<string, unknown>[]}
              columns={columns}
              searchable={true}
              searchKeys={['name', 'description', 'type']}
              searchPlaceholder="Search badges by name, description, or type..."
              pagination={true}
              defaultItemsPerPage={10}
              loading={isLoading}
              emptyMessage="No badges found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 