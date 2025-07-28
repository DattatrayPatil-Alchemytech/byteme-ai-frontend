"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Target,
  Trophy,
  Users,
  Star,
  MapPin,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { ChallengeResponse } from "../../lib/apiHelpers/challenges";
import {
  getDifficultyColor,
  getStatusColor,
  getTypeIcon,
} from "./utils/challengeHelpers";

interface ChallengeDetailsProps {
  challenge: ChallengeResponse;
  onEdit?: () => void;
  onBack?: () => void;
  showActions?: boolean;
}

export default function ChallengeDetails({
  challenge,
  onEdit,
  onBack,
  showActions = true,
}: ChallengeDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeStatus = () => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (now < startDate) return { status: "Upcoming", color: "blue" };
    if (now >= startDate && now <= endDate)
      return { status: "Active", color: "green" };
    return { status: "Expired", color: "red" };
  };

  const timeStatus = getTimeStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      {showActions && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {challenge.name}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Challenge Details
              </p>
            </div>
          </div>
          {onEdit && challenge.canBeEdited && (
            <Button onClick={onEdit} className="gradient-ev-green hover-glow">
              <Edit className="w-4 h-4 mr-2" />
              Edit Challenge
            </Button>
          )}
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Challenge Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {challenge.imageUrl ? (
                  <Image
                    src={challenge.imageUrl}
                    alt={challenge.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-3xl">
                      {getTypeIcon(challenge.type)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{challenge.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline">{challenge.type}</Badge>
                    <Badge className={getStatusColor(challenge.status)}>
                      {challenge.status}
                    </Badge>
                    {challenge.metadata?.featured && (
                      <Badge variant="secondary">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">
                  {challenge.description || "No description provided"}
                </p>
              </div>

              {challenge.metadata?.tags &&
                challenge.metadata.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.metadata.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Category
                  </h4>
                  <p className="font-medium">
                    {challenge.metadata?.category || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Visibility
                  </h4>
                  <p className="font-medium">{challenge.visibility}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Estimated Time
                  </h4>
                  <p className="font-medium">
                    {challenge.metadata?.estimatedTime || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Time Status
                  </h4>
                  <Badge
                    variant="outline"
                    className={`${
                      timeStatus.color === "green"
                        ? "border-green-500 text-green-600"
                        : timeStatus.color === "blue"
                        ? "border-blue-500 text-blue-600"
                        : "border-red-500 text-red-600"
                    }`}
                  >
                    {timeStatus.status}
                  </Badge>
                </div>
              </div>

              {challenge.daysRemaining !== undefined && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Time Remaining
                  </h4>
                  <p className="font-medium">
                    {challenge.daysRemaining > 0
                      ? `${challenge.daysRemaining} days left`
                      : challenge.daysRemaining === 0
                      ? "Ends today"
                      : `Ended ${Math.abs(challenge.daysRemaining)} days ago`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Start Date
              </h4>
              <p className="font-medium">{formatDate(challenge.startDate)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                End Date
              </h4>
              <p className="font-medium">{formatDate(challenge.endDate)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Duration
              </h4>
              <p className="font-medium">{challenge.formattedDuration}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Progress
              </h4>
              <p className="font-medium">
                {challenge.progressPercentage}% Complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Participants</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {challenge.currentParticipants}
              </div>
              <div className="text-sm text-muted-foreground">Current</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {challenge.completedParticipants}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground">
                {challenge.maxParticipants}
              </div>
              <div className="text-sm text-muted-foreground">Maximum</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Participation</span>
              <span>
                {(
                  (challenge.currentParticipants / challenge.maxParticipants) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (challenge.currentParticipants /
                      challenge.maxParticipants) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Completion Rate */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Completion Rate</span>
              <span>{challenge.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(challenge.completionRate, 100)}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectives */}
      {challenge.objectives && Object.keys(challenge.objectives).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Objectives</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {challenge.objectives.mileage && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Mileage Goal</div>
                    <div className="text-sm text-muted-foreground">
                      {challenge.objectives.mileage} km
                    </div>
                  </div>
                </div>
              )}
              {challenge.objectives.uploadCount && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Upload Count</div>
                    <div className="text-sm text-muted-foreground">
                      {challenge.objectives.uploadCount} uploads
                    </div>
                  </div>
                </div>
              )}
              {challenge.objectives.carbonSaved && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Carbon Saved</div>
                    <div className="text-sm text-muted-foreground">
                      {challenge.objectives.carbonSaved} kg CO₂
                    </div>
                  </div>
                </div>
              )}
              {challenge.objectives.streakDays && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded">
                    <Target className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Streak Days</div>
                    <div className="text-sm text-muted-foreground">
                      {challenge.objectives.streakDays} days
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Completion Rewards */}
          {challenge.rewards && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Completion Rewards</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {challenge.rewards.b3trTokens}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    B3TR Tokens
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {challenge.rewards.points}
                  </div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {challenge.rewards.experience}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Experience
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Rewards */}
          {challenge.leaderboardRewards && (
            <div>
              <h4 className="font-medium mb-3">Leaderboard Rewards</h4>
              <div className="space-y-3">
                {["first", "second", "third"].map((position, index) => {
                  const reward =
                    challenge.leaderboardRewards![
                      position as keyof typeof challenge.leaderboardRewards
                    ];
                  return (
                    <div
                      key={position}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className={`w-16 justify-center ${
                            index === 0
                              ? "border-yellow-500 text-yellow-600"
                              : index === 1
                              ? "border-gray-500 text-gray-600"
                              : "border-orange-500 text-orange-600"
                          }`}
                        >
                          {index + 1}
                          {index === 0 ? "st" : index === 1 ? "nd" : "rd"}
                        </Badge>
                        <span className="font-medium capitalize">
                          {position} Place
                        </span>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-yellow-600">
                          🪙 {reward.b3trTokens}
                        </span>
                        <span className="text-blue-600">
                          ⭐ {reward.points}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements */}
      {challenge.requirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Minimum Level
                </h4>
                <p className="font-medium">
                  Level {challenge.requirements.minLevel}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Minimum Mileage
                </h4>
                <p className="font-medium">
                  {challenge.requirements.minMileage} km
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Challenge Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">
                {challenge.isActive ? "✅" : "❌"}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {challenge.isPublished ? "✅" : "❌"}
              </div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {challenge.isFull ? "✅" : "❌"}
              </div>
              <div className="text-sm text-muted-foreground">Full</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {challenge.canBeEdited ? "✅" : "❌"}
              </div>
              <div className="text-sm text-muted-foreground">Editable</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(challenge.createdAt)}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {formatDate(challenge.updatedAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
