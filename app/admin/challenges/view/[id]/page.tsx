"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Target,
  Trophy,
  Users,
  Star,
  MapPin,
} from "lucide-react";
import { Challenge } from "../../../../../lib/apiHelpers/challengesMock";
import { getChallengeById } from "../../../../../lib/apiHelpers/challenges";

export default function ViewChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const challengeId = Number(resolvedParams.id);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    // Load challenge data
    const loadChallenge = async () => {
      try {
        const result = await getChallengeById(challengeId);
        setChallenge(result.challenge);
      } catch (error) {
        console.error("Error loading challenge:", error);
      }
    };

    loadChallenge();
  }, [challengeId]);

  const handleBack = () => {
    router.push("/admin/challenges");
  };

  const handleEdit = () => {
    router.push(`/admin/challenges/edit/${challengeId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "draft":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mileage":
        return "🚗";
      case "upload":
        return "📸";
      case "streak":
        return "🔥";
      case "social":
        return "👥";
      default:
        return "🎯";
    }
  };

  if (!challenge) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Challenge Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested challenge could not be found
            </p>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const now = new Date();
  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;
  const isExpired = now > endDate;
  const participationPercentage =
    (challenge.currentParticipants / challenge.maxParticipants) * 100;

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-2 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(challenge.type)}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                  {challenge.name}
                </h1>
              </div>
              {challenge.metadata.featured && (
                <Badge variant="secondary" className="self-start">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {challenge.description}
            </p>
          </div>
        </div>
        <Button
          onClick={handleEdit}
          className="gradient-ev-green hover-glow w-full sm:w-auto"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Challenge
        </Button>
      </div>

      {/* Banner Image */}
      {challenge.bannerUrl && (
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <div className="relative h-64">
            <Image
              src={challenge.bannerUrl}
              alt={challenge.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-2">
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <Badge className={getStatusColor(challenge.status)}>
                  {challenge.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    isActive
                      ? "border-green-500 text-green-600"
                      : isUpcoming
                      ? "border-blue-500 text-blue-600"
                      : "border-red-500 text-red-600"
                  }`}
                >
                  {isActive ? "Active" : isUpcoming ? "Upcoming" : "Expired"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Challenge Details */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Challenge Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Type
                  </Label>
                  <p className="text-lg font-semibold capitalize">
                    {challenge.type}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Category
                  </Label>
                  <p className="text-lg font-semibold capitalize">
                    {challenge.metadata.category}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Visibility
                  </Label>
                  <p className="text-lg font-semibold capitalize">
                    {challenge.visibility}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Estimated Time
                  </Label>
                  <p className="text-lg font-semibold">
                    {challenge.metadata.estimatedTime}
                  </p>
                </div>
              </div>

              {challenge.metadata.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {challenge.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Objectives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {challenge.objectives.mileage && (
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">
                        Target Mileage
                      </p>
                      <p className="text-lg sm:text-xl font-bold truncate">
                        {challenge.objectives.mileage} km
                      </p>
                    </div>
                  </div>
                )}
                {challenge.objectives.uploadCount && (
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full flex-shrink-0">
                      <span className="text-lg">📸</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">
                        Upload Target
                      </p>
                      <p className="text-lg sm:text-xl font-bold truncate">
                        {challenge.objectives.uploadCount} uploads
                      </p>
                    </div>
                  </div>
                )}
                {challenge.objectives.streakDays && (
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full flex-shrink-0">
                      <span className="text-lg">🔥</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">
                        Streak Target
                      </p>
                      <p className="text-lg sm:text-xl font-bold truncate">
                        {challenge.objectives.streakDays} days
                      </p>
                    </div>
                  </div>
                )}
                {challenge.objectives.socialShares && (
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full flex-shrink-0">
                      <span className="text-lg">👥</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">
                        Social Shares
                      </p>
                      <p className="text-lg sm:text-xl font-bold truncate">
                        {challenge.objectives.socialShares} shares
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Completion Rewards */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Completion Rewards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-xl flex-shrink-0">🪙</span>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">
                        B3TR Tokens
                      </p>
                      <p className="text-lg font-bold truncate">
                        {challenge.rewards.b3trTokens}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-xl flex-shrink-0">⭐</span>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">Points</p>
                      <p className="text-lg font-bold truncate">
                        {challenge.rewards.points}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-xl flex-shrink-0">📈</span>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">
                        Experience
                      </p>
                      <p className="text-lg font-bold truncate">
                        {challenge.rewards.experience}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Rewards */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Leaderboard Rewards
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥇</span>
                      <span className="font-semibold">First Place</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {challenge.leaderboardRewards.first.b3trTokens} B3TR +{" "}
                        {challenge.leaderboardRewards.first.points} pts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥈</span>
                      <span className="font-semibold">Second Place</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {challenge.leaderboardRewards.second.b3trTokens} B3TR +{" "}
                        {challenge.leaderboardRewards.second.points} pts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥉</span>
                      <span className="font-semibold">Third Place</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {challenge.leaderboardRewards.third.b3trTokens} B3TR +{" "}
                        {challenge.leaderboardRewards.third.points} pts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {challenge.notes && (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{challenge.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Image */}
          {challenge.imageUrl && (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Image
                  src={challenge.imageUrl}
                  alt={challenge.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Duration */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Duration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Start Date
                </Label>
                <p className="text-lg font-semibold">
                  {startDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  End Date
                </Label>
                <p className="text-lg font-semibold">
                  {endDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Created
                </Label>
                <p className="text-lg font-semibold">
                  {new Date(challenge.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Participation */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Participation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Participants
                  </Label>
                  <span className="text-sm font-medium">
                    {challenge.currentParticipants}/{challenge.maxParticipants}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(participationPercentage, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {participationPercentage.toFixed(1)}% capacity
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <Label className="text-sm font-medium text-muted-foreground">
                  Requirements
                </Label>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Min Level:</span>
                    <span className="text-sm font-medium">
                      {challenge.requirements.minLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Min Mileage:</span>
                    <span className="text-sm font-medium">
                      {challenge.requirements.minMileage} km
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <label className={className}>{children}</label>;
}
