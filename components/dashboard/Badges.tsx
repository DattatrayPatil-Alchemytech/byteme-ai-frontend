"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getUserBadges,
  type UserBadgesResponse,
  type UserBadge,
} from "@/lib/apiHelpers/userBadges";
import Link from "next/link";
import Image from "next/image";

interface BadgesProps {
  badges: unknown[]; // Keep for backward compatibility
  onShare: (message: string) => void;
}

// Get badge icon based on type
const getBadgeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "mileage":
      return "🚗";
    case "carbon_saved":
      return "🌱";
    case "upload_streak":
      return "🔥";
    case "achievement":
      return "🏆";
    default:
      return "🏅";
  }
};

// Get rarity color
const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case "common":
      return "from-gray-400 to-gray-500";
    case "uncommon":
      return "from-green-400 to-green-500";
    case "rare":
      return "from-blue-400 to-blue-500";
    case "epic":
      return "from-purple-400 to-purple-500";
    case "legendary":
      return "from-yellow-400 to-orange-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

export default function Badges({ badges, onShare }: BadgesProps) {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user badges when component mounts
  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        setIsLoading(true);
        const response: UserBadgesResponse = await getUserBadges();
        console.log("User badges API response:", response);
        setUserBadges(response.userBadges || []);
      } catch (error) {
        console.error("Error fetching user badges:", error);
        setUserBadges([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBadges();
  }, []);

  const handleShare = (badge: UserBadge) => {
    const message = `I just earned the ${badge.name} badge on ByteMe AI! 🎉`;
    onShare(message);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your Achievements
        </h2>
        <p className="text-muted-foreground">
          Track your sustainable driving milestones
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBadges.slice(0, 12).map((badge) => {
            const badgeIcon = getBadgeIcon(badge.type);
            const rarityColor = getRarityColor(badge.rarity);

            return (
              <Card
                key={badge.id}
                className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${rarityColor} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {badge.iconUrl ? (
                      <Image
                        height={32}
                        width={32}
                        src={badge.iconUrl}
                        alt={badge.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span
                        className="text-2xl"
                        style={{ display: badge.iconUrl ? "none" : "block" }}
                      >
                        {badgeIcon}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-foreground text-lg">
                    {badge.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {badge.description && (
                    <p className="text-muted-foreground text-sm mb-4">
                      {badge.description}
                    </p>
                  )}

                  {badge.formattedRewards && (
                    <div className="text-xs text-green-600 dark:text-green-400 mb-3 font-medium">
                      {badge.formattedRewards}
                    </div>
                  )}

                  {badge.difficultyDisplay && (
                    <div className="text-xs text-muted-foreground mb-3">
                      Difficulty: {badge.difficultyDisplay}
                    </div>
                  )}

                  {badge.rarity && (
                    <Badge
                      className="mb-3"
                      style={{
                        backgroundColor: badge.rarityColor + "20",
                        color: badge.rarityColor,
                        borderColor: badge.rarityColor + "40",
                      }}
                    >
                      {badge.rarity}
                    </Badge>
                  )}

                  {badge.earnedAt && (
                    <div className="text-xs text-muted-foreground mb-4">
                      Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  )}

                  {badge.isEarned && (
                    <Button
                      onClick={() => handleShare(badge)}
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      Share Achievement
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && userBadges.length === 0 && (
        <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Badges Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start uploading to earn your first badge!
            </p>
            <Button className="gradient-ev-green hover:from-emerald-600 hover:to-green-700">
              <Link href="/uploads">Upload</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
