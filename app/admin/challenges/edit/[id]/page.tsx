"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Save,
  Upload,
  Calendar,
  Target,
  Trophy,
} from "lucide-react";
import {
  getChallengeById,
  // updateChallenge, // Removed unused import
} from "../../../../../lib/apiHelpers/challenges";

const challengeTypes = ["mileage", "upload", "streak", "social"];
const difficulties = ["easy", "medium", "hard"];
const visibilities = ["public", "private", "premium"];
const categories = ["seasonal", "weekly", "monthly", "special"];

export default function EditChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const challengeId = Number(resolvedParams.id);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "mileage",
    difficulty: "medium",
    visibility: "public",
    imageUrl: "",
    bannerUrl: "",
    // Objectives
    mileage: "",
    uploadCount: "",
    streakDays: "",
    socialShares: "",
    // Rewards
    b3trTokens: "",
    points: "",
    experience: "",
    // Leaderboard rewards
    firstB3tr: "",
    firstPoints: "",
    secondB3tr: "",
    secondPoints: "",
    thirdB3tr: "",
    thirdPoints: "",
    // Dates and participants
    startDate: "",
    endDate: "",
    maxParticipants: "",
    // Requirements
    minLevel: "",
    minMileage: "",
    // Metadata
    category: "weekly",
    tags: "",
    estimatedTime: "",
    featured: false,
    notes: "",
    status: "draft",
  });

  useEffect(() => {
    // Load challenge data
    const loadChallenge = async () => {
      try {
        const result = await getChallengeById(challengeId);
        const challenge = result.challenge;

        setFormData({
          name: challenge.name,
          description: challenge.description,
          type: challenge.type,
          difficulty: challenge.difficulty,
          visibility: challenge.visibility,
          imageUrl: challenge.imageUrl,
          bannerUrl: challenge.bannerUrl,
          // Objectives
          mileage: challenge.objectives.mileage?.toString() || "",
          uploadCount: challenge.objectives.uploadCount?.toString() || "",
          streakDays: challenge.objectives.streakDays?.toString() || "",
          socialShares: challenge.objectives.socialShares?.toString() || "",
          // Rewards
          b3trTokens: challenge.rewards.b3trTokens.toString(),
          points: challenge.rewards.points.toString(),
          experience: challenge.rewards.experience.toString(),
          // Leaderboard rewards
          firstB3tr: challenge.leaderboardRewards.first.b3trTokens.toString(),
          firstPoints: challenge.leaderboardRewards.first.points.toString(),
          secondB3tr: challenge.leaderboardRewards.second.b3trTokens.toString(),
          secondPoints: challenge.leaderboardRewards.second.points.toString(),
          thirdB3tr: challenge.leaderboardRewards.third.b3trTokens.toString(),
          thirdPoints: challenge.leaderboardRewards.third.points.toString(),
          // Dates and participants
          startDate: challenge.startDate,
          endDate: challenge.endDate,
          maxParticipants: challenge.maxParticipants.toString(),
          // Requirements
          minLevel: challenge.requirements.minLevel.toString(),
          minMileage: challenge.requirements.minMileage.toString(),
          // Metadata
          category: challenge.metadata.category,
          tags: challenge.metadata.tags.join(", "),
          estimatedTime: challenge.metadata.estimatedTime,
          featured: challenge.metadata.featured,
          notes: challenge.notes,
          status: challenge.status,
        });
      } catch (error) {
        console.error("Error loading challenge:", error);
      }
    };

    loadChallenge();
  }, [challengeId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Build challenge object
    const challengeData = {
      id: challengeId,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      difficulty: formData.difficulty,
      visibility: formData.visibility,
      imageUrl: formData.imageUrl,
      bannerUrl: formData.bannerUrl,
      objectives: {
        ...(formData.mileage && { mileage: Number(formData.mileage) }),
        ...(formData.uploadCount && {
          uploadCount: Number(formData.uploadCount),
        }),
        ...(formData.streakDays && { streakDays: Number(formData.streakDays) }),
        ...(formData.socialShares && {
          socialShares: Number(formData.socialShares),
        }),
      },
      rewards: {
        b3trTokens: Number(formData.b3trTokens),
        points: Number(formData.points),
        experience: Number(formData.experience),
      },
      leaderboardRewards: {
        first: {
          b3trTokens: Number(formData.firstB3tr),
          points: Number(formData.firstPoints),
        },
        second: {
          b3trTokens: Number(formData.secondB3tr),
          points: Number(formData.secondPoints),
        },
        third: {
          b3trTokens: Number(formData.thirdB3tr),
          points: Number(formData.thirdPoints),
        },
      },
      startDate: formData.startDate,
      endDate: formData.endDate,
      maxParticipants: Number(formData.maxParticipants),
      requirements: {
        minLevel: Number(formData.minLevel),
        minMileage: Number(formData.minMileage),
      },
      metadata: {
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        estimatedTime: formData.estimatedTime,
        featured: formData.featured,
      },
      notes: formData.notes,
      status: formData.status,
    };

    console.log("Updating challenge:", challengeData);
    alert("Challenge updated successfully!");
    router.push("/admin/challenges");
  };

  const handleBack = () => {
    router.push("/admin/challenges");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Edit Challenge
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Update challenge information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Basic Information */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Challenge Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter challenge name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleSelectChange("type", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {challengeTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter challenge description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        handleSelectChange("difficulty", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() +
                            difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility *</Label>
                    <select
                      value={formData.visibility}
                      onChange={(e) =>
                        handleSelectChange("visibility", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {visibilities.map((visibility) => (
                        <option key={visibility} value={visibility}>
                          {visibility.charAt(0).toUpperCase() +
                            visibility.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleSelectChange("category", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Target Mileage (km)</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      type="number"
                      min="0"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uploadCount">Upload Count</Label>
                    <Input
                      id="uploadCount"
                      name="uploadCount"
                      type="number"
                      min="0"
                      value={formData.uploadCount}
                      onChange={handleInputChange}
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="streakDays">Streak Days</Label>
                    <Input
                      id="streakDays"
                      name="streakDays"
                      type="number"
                      min="0"
                      value={formData.streakDays}
                      onChange={handleInputChange}
                      placeholder="e.g., 7"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialShares">Social Shares</Label>
                    <Input
                      id="socialShares"
                      name="socialShares"
                      type="number"
                      min="0"
                      value={formData.socialShares}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Completion Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="b3trTokens">B3TR Tokens *</Label>
                    <Input
                      id="b3trTokens"
                      name="b3trTokens"
                      type="number"
                      min="0"
                      value={formData.b3trTokens}
                      onChange={handleInputChange}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Points *</Label>
                    <Input
                      id="points"
                      name="points"
                      type="number"
                      min="0"
                      value={formData.points}
                      onChange={handleInputChange}
                      placeholder="200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience *</Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="100"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Rewards */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Leaderboard Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      🥇 First Place
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="firstB3tr"
                        type="number"
                        min="0"
                        value={formData.firstB3tr}
                        onChange={handleInputChange}
                        placeholder="B3TR Tokens"
                      />
                      <Input
                        name="firstPoints"
                        type="number"
                        min="0"
                        value={formData.firstPoints}
                        onChange={handleInputChange}
                        placeholder="Points"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      🥈 Second Place
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="secondB3tr"
                        type="number"
                        min="0"
                        value={formData.secondB3tr}
                        onChange={handleInputChange}
                        placeholder="B3TR Tokens"
                      />
                      <Input
                        name="secondPoints"
                        type="number"
                        min="0"
                        value={formData.secondPoints}
                        onChange={handleInputChange}
                        placeholder="Points"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      🥉 Third Place
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="thirdB3tr"
                        type="number"
                        min="0"
                        value={formData.thirdB3tr}
                        onChange={handleInputChange}
                        placeholder="B3TR Tokens"
                      />
                      <Input
                        name="thirdPoints"
                        type="number"
                        min="0"
                        value={formData.thirdPoints}
                        onChange={handleInputChange}
                        placeholder="Points"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Duration & Participation */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Duration & Participation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      placeholder="100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minLevel">Min Level</Label>
                    <Input
                      id="minLevel"
                      name="minLevel"
                      type="number"
                      min="0"
                      value={formData.minLevel}
                      onChange={handleInputChange}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minMileage">Min Mileage</Label>
                    <Input
                      id="minMileage"
                      name="minMileage"
                      type="number"
                      min="0"
                      value={formData.minMileage}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Time</Label>
                    <Input
                      id="estimatedTime"
                      name="estimatedTime"
                      value={formData.estimatedTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 1 week"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="weekend, mileage, bonus"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Images */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Challenge Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Challenge Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {formData.imageUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4">
                      <Image
                        src={formData.imageUrl}
                        alt="Challenge preview"
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bannerUrl">Banner Image URL</Label>
                  <Input
                    id="bannerUrl"
                    name="bannerUrl"
                    value={formData.bannerUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images here, or click to browse
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Additional Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleSelectChange("status", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-border"
                  />
                  <Label htmlFor="featured">Featured Challenge</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Internal notes about this challenge"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-ev-green hover-glow"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Update Challenge</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
