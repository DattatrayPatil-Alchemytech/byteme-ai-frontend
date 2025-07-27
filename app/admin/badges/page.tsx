/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { getBadgesList, publishBadge, deleteBadge, type AdminBadge, type BadgesListResponse } from '@/lib/apiHelpers/adminBadges';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Globe } from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

export default function AdminBadgesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [badges, setBadges] = useState<AdminBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBadges, setTotalBadges] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    badgeId: string | null;
    badgeName: string;
  }>({
    isOpen: false,
    badgeId: null,
    badgeName: '',
  });

  // Fetch badges data
  const fetchBadges = async () => {
    try {
      setIsLoading(true);
      const response: BadgesListResponse = await getBadgesList(currentPage, limit, search);
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

  // Handle delete badge
  const handleDeleteBadge = async (badgeId: string) => {
    try {
      setIsUpdating(badgeId);
      await deleteBadge(badgeId);
      toast.success('Badge deleted successfully');
      // Refresh the data
      fetchBadges();
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast.error('Failed to delete badge');
    } finally {
      setIsUpdating(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (badgeId: string, badgeName: string) => {
    setDeleteModal({
      isOpen: true,
      badgeId,
      badgeName,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      badgeId: null,
      badgeName: '',
    });
  };

  // Parse metadata - handles both JSON string and object
  const parseMetadata = (metadata: string | object) => {
    try {
      if (typeof metadata === 'string') {
        return JSON.parse(metadata);
      } else if (typeof metadata === 'object' && metadata !== null) {
        return metadata;
      } else {
        return { category: 'Unknown', tags: [], difficulty: 0 };
      }
    } catch (error) {
      console.error('Error parsing metadata:', error);
      return { category: 'Unknown', tags: [], difficulty: 0 };
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

  // Handle edit badge
  const handleEditBadge = (badgeId: string) => {
    router.push(`/admin/badges/edit/${badgeId}`);
  };

  // Handle create new badge
  const handleCreateBadge = () => {
    router.push('/admin/badges/create');
  };


  // Get type color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mileage':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'carbon_saved':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'upload_streak':
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
            {/* <Image 
              height={'50'}
              width={'50'}
              src={badge.iconUrl || badge.imageUrl} 
              alt={badge.name}
              className="w-8 h-8 rounded-full object-cover"
            /> */}
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
          <Badge style={{ backgroundColor: badge.rarityColor + '20', color: badge.rarityColor, borderColor: badge.rarityColor + '40' }}>
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
      key: 'earnedCount',
      label: 'Earned',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        return (
          <span className="font-medium text-green-600 dark:text-green-400">{badge.earnedCount}</span>
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
            <div>{badge.formattedRewards}</div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown, row: Record<string, unknown>) => {
        const badge = row as unknown as AdminBadge;
        const isActive = badge.status === 'active';
        return (
          <Badge className={isActive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'}>
            {isActive ? 'Active' : 'Inactive'}
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
              onClick={() => handleEditBadge(badge.id)}
              title="Edit Badge"
              disabled={isUpdating === badge.id}
            >
              {isUpdating === badge.id ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePublishBadge(badge.id)}
              title={badge.isPublished ? "Unpublish Badge" : "Publish Badge"}
              disabled={isUpdating === badge.id}
            >
              {isUpdating === badge.id ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => openDeleteModal(badge.id, badge.name)}
              title="Delete Badge"
              disabled={isUpdating === badge.id}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Fetch badges data when page, limit, or search changes
  useEffect(() => {
    fetchBadges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, search]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Badges Management</h1>
          <p className="text-muted-foreground">
            Manage system badges and achievements
          </p>
        </div>
        <Button onClick={handleCreateBadge} className="gradient-ev-green text-white">
          Create Badge
        </Button>
      </div>

      {/* Badges List Title, Count, and Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Badges List</h2>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${badges.length} of ${totalBadges} badges`}
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search badges by name, description, type, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border bg-background text-foreground rounded-lg px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
          />
        </div>
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
            <div className="text-2xl font-bold">{badges.filter(b => b.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Badges</CardTitle>
            <span className="text-2xl">❌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges.filter(b => b.status !== 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <span className="text-2xl">📂</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(badges.map(b => {
                const metadata = parseMetadata(b.metadata);
                return metadata.category;
              })).size}
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Badges Table */}
      <div className="bg-muted/40 rounded-2xl p-0 md:p-2 overflow-x-auto border border-border">
        {isLoading ? (
          <TableSkeleton columns={8} rows={5} />
        ) : (
          <DataTable
            data={badges as unknown as Record<string, unknown>[]}
            columns={columns}
            emptyMessage="No badges found"
            pagination={false} // Disable built-in pagination since we're using backend pagination
          />
        )}
      </div>

      {/* Backend Pagination Controls */}
      {isLoading ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
            <div className="flex gap-1">
              <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : totalBadges > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing limit
              }}
              className="border border-border bg-background text-foreground rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, totalBadges)} of {totalBadges} badges
            </span>

            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-border bg-background text-foreground rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalBadges / limit)}
                className="px-3 py-1 text-sm border border-border bg-background text-foreground rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => deleteModal.badgeId && handleDeleteBadge(deleteModal.badgeId)}
        title="Delete Badge"
        message="Are you sure you want to delete this badge? This action will permanently remove the badge from the system."
        itemName={deleteModal.badgeName}
        isLoading={isUpdating === deleteModal.badgeId}
      />
    </div>
  );
} 