"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getBadgeDetails,
  // toggleBadgeStatus,
  publishBadge,
  type AdminBadge,
} from "@/lib/apiHelpers/adminBadges";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Type for badge metadata
interface BadgeMetadata {
  category?: string;
  tags?: string[];
  difficulty?: number;
  estimatedTime?: string;
  [key: string]: unknown;
}

export default function BadgeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const badgeId = params.id as string;

  const [badge, setBadge] = useState<AdminBadge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch badge details
  const fetchBadgeDetails = async () => {
    try {
      setIsLoading(true);
      const badgeData = await getBadgeDetails(badgeId);
      setBadge(badgeData);
    } catch (error) {
      console.error("Error fetching badge details:", error);
      toast.error("Failed to fetch badge details");
      router.push("/admin/badges");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async () => {
    if (!badge) return;

    try {
      setIsUpdating(true);
      // await toggleBadgeStatus(badge.id);
      toast.success("Badge status updated successfully");
      // Refresh badge data
      fetchBadgeDetails();
    } catch (error) {
      console.error("Error toggling badge status:", error);
      toast.error("Failed to update badge status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle publish badge
  const handlePublishBadge = async () => {
    if (!badge) return;

    try {
      setIsPublishing(true);
      await publishBadge(badge.id);
      toast.success("Badge published successfully");
      // Refresh badge data
      fetchBadgeDetails();
    } catch (error) {
      console.error("Error publishing badge:", error);
      toast.error("Failed to publish badge");
    } finally {
      setIsPublishing(false);
    }
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "uncommon":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
      case "epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200";
      case "legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "mileage":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
      case "carbon":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      case "streak":
        return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200";
      case "achievement":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (badgeId) {
      fetchBadgeDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badgeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!badge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Badge Not Found
          </h2>
          <Button onClick={() => router.push("/admin/badges")}>
            Back to Badges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/badges")}
            className="flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Badges</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{badge.name}</h1>
            <p className="text-muted-foreground mt-1">Badge Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/badges/edit/${badge.id}`)}
          >
            Edit Badge
          </Button>
          <Button
            variant={badge.status === "active" ? "destructive" : "default"}
            onClick={handleToggleStatus}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : badge.status === "active" ? (
              "Disable Badge"
            ) : (
              "Enable Badge"
            )}
          </Button>
          <Button
            variant={badge.isPublished ? "outline" : "default"}
            onClick={handlePublishBadge}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : badge.isPublished ? (
              "Unpublish Badge"
            ) : (
              "Publish Badge"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badge Image and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Badge Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <Image
                  src={badge.imageUrl}
                  width={128}
                  height={128}
                  alt={badge.name}
                  className="w-32 h-32 mx-auto rounded-lg object-cover border-4 border-border"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-badge.png";
                  }}
                />
              </div>
              <div className="space-y-2">
                <Badge className={getRarityColor(badge.rarity)}>
                  {badge.rarity}
                </Badge>
                <Badge className={getTypeColor(badge.type)}>{badge.type}</Badge>
                <Badge
                  className={
                    badge.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                  }
                >
                  {badge.status === "active" ? "Active" : "Inactive"}
                </Badge>
                <Badge
                  className={
                    badge.isPublished
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }
                >
                  {badge.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badge Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-foreground">{badge.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-foreground">{badge.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <p className="text-foreground">
                  {badge.status}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {badge.rewards.b3trTokens}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    B3TR Tokens
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {badge.rewards.points}
                  </div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {badge.rewards.experience}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Experience
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Points Value
                </label>
                <p className="text-foreground font-semibold">
                  {badge.pointsValue}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {badge.conditions.mileage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Mileage Required:
                    </span>
                    <span className="font-medium">
                      {badge.conditions.mileage.toLocaleString()} km
                    </span>
                  </div>
                )}
                {badge.conditions.timeFrame && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Frame:</span>
                    <span className="font-medium">
                      {badge.conditions.timeFrame}
                    </span>
                  </div>
                )}
                {Object.entries(badge.conditions).map(([key, value]) => {
                  if (key !== "mileage" && key !== "timeFrame") {
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key}:
                        </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Metadata
                </label>
                <p className="text-foreground">
                  {typeof badge.metadata === 'string' 
                    ? badge.metadata 
                    : JSON.stringify(badge.metadata, null, 2)
                  }
                </p>
              </div>
              {typeof badge.metadata === 'object' && badge.metadata !== null && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Category
                    </label>
                    <p className="text-foreground">
                      {(badge.metadata as BadgeMetadata).category || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray((badge.metadata as BadgeMetadata).tags) && 
                        (badge.metadata as BadgeMetadata).tags?.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Difficulty
                      </label>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < ((badge.metadata as BadgeMetadata).difficulty || 0)
                                ? "bg-yellow-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {((badge.metadata as BadgeMetadata).difficulty || 0)}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Estimated Time
                      </label>
                      <p className="text-foreground">
                        {(badge.metadata as BadgeMetadata).estimatedTime || 'N/A'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {new Date(badge.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(badge.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
