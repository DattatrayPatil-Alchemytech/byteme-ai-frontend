"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Column } from "@/components/ui/DataTable";
import { Calendar, Users, Target, Eye, Edit, Send, Trash2 } from "lucide-react";
import { Challenge } from "../../lib/apiHelpers/challengesMock";

interface ChallengeTableColumnsProps {
  onView: (challenge: Challenge) => void;
  onEdit: (challenge: Challenge) => void;
  onPublish: (challenge: Challenge) => void;
  onDelete: (challenge: Challenge) => void;
  getTypeIcon: (type: string) => string;
  getDifficultyColor: (difficulty: string) => string;
  getStatusColor: (status: string) => string;
}

export const useChallengeTableColumns = ({
  onView,
  onEdit,
  onPublish,
  onDelete,
  getTypeIcon,
  getDifficultyColor,
  getStatusColor,
}: ChallengeTableColumnsProps): Column[] => {
  return [
    {
      key: "imageUrl",
      label: "Image",
      width: "100px",
      render: (value) => {
        const imageUrl = value as string;
        if (!imageUrl) {
          return (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
          );
        }
        return (
          <Image
            src={imageUrl}
            alt="Challenge"
            width={48}
            height={48}
            className="w-12 h-12 rounded-lg object-cover"
          />
        );
      },
    },
    {
      key: "name",
      label: "Challenge",
      render: (value, row) => {
        const challenge = row as unknown as Challenge;
        return (
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getTypeIcon(challenge.type)}</span>
              <div className="font-medium text-foreground">
                {value as string}
              </div>
              {challenge.metadata?.featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate max-w-xs">
              {challenge.description || "No description"}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {challenge.type}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      key: "rewards",
      label: "Rewards",
      render: (value) => {
        const rewards = value as Challenge["rewards"];
        if (!rewards) {
          return (
            <span className="text-sm text-muted-foreground">No rewards</span>
          );
        }
        return (
          <div className="text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">🪙</span>
              <span>{rewards.b3trTokens || 0} B3TR</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">⭐</span>
              <span>{rewards.points || 0} pts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">📈</span>
              <span>{rewards.experience || 0} XP</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "participants",
      label: "Participants",
      render: (value, row) => {
        const challenge = row as unknown as Challenge;
        const current = challenge.currentParticipants || 0;
        const max = challenge.maxParticipants || 1;
        const percentage = (current / max) * 100;
        return (
          <div className="text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>
                {current}/{max}
              </span>
            </div>
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "dates",
      label: "Duration",
      render: (value, row) => {
        const challenge = row as unknown as Challenge;
        const startDate = new Date(challenge.startDate);
        const endDate = new Date(challenge.endDate);
        const now = new Date();
        const isActive = now >= startDate && now <= endDate;
        const isUpcoming = now < startDate;

        return (
          <div className="text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </span>
            </div>
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
            {challenge.daysRemaining !== undefined && (
              <div className="text-xs text-muted-foreground mt-1">
                {challenge.daysRemaining > 0
                  ? `${challenge.daysRemaining} days left`
                  : challenge.daysRemaining === 0
                  ? "Ends today"
                  : `Ended ${Math.abs(challenge.daysRemaining)} days ago`}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "objectives",
      label: "Objectives",
      render: (value) => {
        const objectives = value as Challenge["objectives"];
        if (!objectives || Object.keys(objectives).length === 0) {
          return (
            <span className="text-sm text-muted-foreground">No objectives</span>
          );
        }
        return (
          <div className="text-sm space-y-1">
            {objectives.mileage && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.mileage} km</span>
              </div>
            )}
            {objectives.uploadCount && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.uploadCount} uploads</span>
              </div>
            )}
            {objectives.carbonSaved && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.carbonSaved} kg CO₂</span>
              </div>
            )}
            {objectives.streakDays && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.streakDays} day streak</span>
              </div>
            )}
            {objectives.socialShares && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.socialShares} shares</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge className={getStatusColor(value as string)}>
          {value as string}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => {
        const challenge = row as unknown as Challenge;
        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(challenge)}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(challenge)}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {challenge.status === "draft" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPublish(challenge)}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(challenge)}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
