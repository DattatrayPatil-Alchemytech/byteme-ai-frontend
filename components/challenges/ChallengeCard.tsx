"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Edit, Send, Trash2 } from "lucide-react";
import { Challenge } from "../../lib/apiHelpers/challengesMock";

interface ChallengeCardProps {
  challenge: Challenge;
  onView: (challenge: Challenge) => void;
  onEdit: (challenge: Challenge) => void;
  onPublish: (challenge: Challenge) => void;
  onDelete: (challenge: Challenge) => void;
  getTypeIcon: (type: string) => string;
  getDifficultyColor: (difficulty: string) => string;
  getStatusColor: (status: string) => string;
}

export default function ChallengeCard({
  challenge,
  onView,
  onEdit,
  onPublish,
  onDelete,
  getTypeIcon,
  getDifficultyColor,
  getStatusColor,
}: ChallengeCardProps) {
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const now = new Date();
  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;
  const participationPercentage =
    ((challenge.currentParticipants || 0) / (challenge.maxParticipants || 1)) *
    100;

  return (
    <div className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-4">
      <div className="flex items-start space-x-3 mb-3">
        {challenge.imageUrl ? (
          <Image
            src={challenge.imageUrl}
            alt={challenge.name}
            width={60}
            height={60}
            className="w-15 h-15 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-15 h-15 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{getTypeIcon(challenge.type)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{getTypeIcon(challenge.type)}</span>
            <h3 className="font-semibold text-foreground truncate">
              {challenge.name}
            </h3>
            {challenge.metadata?.featured && (
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                Featured
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {challenge.description || "No description"}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {challenge.type}
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

      {/* Rewards */}
      {challenge.rewards && (
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-600">🪙</span>
            <span>{challenge.rewards.b3trTokens || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">⭐</span>
            <span>{challenge.rewards.points || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-600">📈</span>
            <span>{challenge.rewards.experience || 0}</span>
          </div>
        </div>
      )}

      {/* Participation Progress */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Participants</span>
          <span className="text-xs font-medium">
            {challenge.currentParticipants || 0}/
            {challenge.maxParticipants || 0}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(participationPercentage, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Objectives */}
      {challenge.objectives && Object.keys(challenge.objectives).length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 text-xs">
            {challenge.objectives.mileage && (
              <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                <Target className="w-3 h-3" />
                <span>{challenge.objectives.mileage} km</span>
              </div>
            )}
            {challenge.objectives.uploadCount && (
              <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                <Target className="w-3 h-3" />
                <span>{challenge.objectives.uploadCount} uploads</span>
              </div>
            )}
            {challenge.objectives.carbonSaved && (
              <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                <Target className="w-3 h-3" />
                <span>{challenge.objectives.carbonSaved} kg CO₂</span>
              </div>
            )}
            {challenge.objectives.streakDays && (
              <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                <Target className="w-3 h-3" />
                <span>{challenge.objectives.streakDays} days</span>
              </div>
            )}
            {challenge.objectives.socialShares && (
              <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                <Target className="w-3 h-3" />
                <span>{challenge.objectives.socialShares} shares</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Days Remaining Info */}
      {challenge.daysRemaining !== undefined && (
        <div className="mb-3 text-xs text-muted-foreground">
          {challenge.daysRemaining > 0
            ? `${challenge.daysRemaining} days remaining`
            : challenge.daysRemaining === 0
            ? "Ends today"
            : `Ended ${Math.abs(challenge.daysRemaining)} days ago`}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onView(challenge)}
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onEdit(challenge)}
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
        {challenge.status === "draft" && (
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => onPublish(challenge)}
          >
            <Send className="w-3 h-3" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(challenge)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
