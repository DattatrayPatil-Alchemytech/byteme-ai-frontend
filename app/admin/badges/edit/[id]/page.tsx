"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  getBadgeDetails,
  updateBadge,
  type AdminBadge,
  type UpdateBadgeRequest,
} from "@/lib/apiHelpers/adminBadges";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function EditBadgePage() {
  const router = useRouter();
  const params = useParams();
  const badgeId = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [badge, setBadge] = useState<AdminBadge | null>(null);
  const [formData, setFormData] = useState<UpdateBadgeRequest>({
    name: "",
    description: "",
    type: "",
    rarity: "",
    imageUrl: "",
    iconUrl: "",
    conditions: {},
    rewards: {
      b3trTokens: 0,
      points: 0,
      experience: 0,
    },
    pointsValue: 0,
    metadata: {
      category: "",
      tags: [],
      difficulty: 1,
      estimatedTime: "",
    },
  });

  const [newTag, setNewTag] = useState("");

  // Fetch badge details
  const fetchBadgeDetails = async () => {
    try {
      setIsLoading(true);
      const badgeData = await getBadgeDetails(badgeId);
      setBadge(badgeData);

      // Parse metadata if it's a string
      const metadata =
        typeof badgeData.metadata === "string"
          ? JSON.parse(badgeData.metadata)
          : badgeData.metadata;

      // Populate form data
      setFormData({
        name: badgeData.name,
        description: badgeData.description,
        type: badgeData.type,
        rarity: badgeData.rarity,
        imageUrl: badgeData.imageUrl,
        iconUrl: badgeData.iconUrl,
        conditions: badgeData.conditions,
        rewards: badgeData.rewards,
        pointsValue: badgeData.pointsValue,
        metadata: metadata,
      });
    } catch (error) {
      console.error("Error fetching badge details:", error);
      toast.error("Failed to fetch badge details");
      router.push("/admin/badges");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (
    parent: keyof UpdateBadgeRequest,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const parentValue = prev[parent] as Record<string, unknown>;
      return {
        ...prev,
        [parent]: {
          ...parentValue,
          [field]: value,
        },
      };
    });
  };

  // Handle array changes (tags)
  const handleTagsChange = (action: "add" | "remove", tag?: string) => {
    setFormData((prev) => {
      const currentTags = (prev.metadata?.tags as string[]) || [];
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          tags:
            action === "add" && tag
              ? [...currentTags, tag]
              : currentTags.filter((t) => t !== tag),
        },
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.type ||
      !formData.rarity
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);
      await updateBadge(badgeId, formData);
      toast.success("Badge updated successfully");
      router.push("/admin/badges");
    } catch (error) {
      console.error("Error updating badge:", error);
      toast.error("Failed to update badge");
    } finally {
      setIsSaving(false);
    }
  };

  // Add tag
  const handleAddTag = () => {
    const currentTags = (formData.metadata?.tags as string[]) || [];
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      handleTagsChange("add", newTag.trim());
      setNewTag("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    handleTagsChange("remove", tag);
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
            size="sm"
            onClick={() => router.push("/admin/badges")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Badge</h1>
            <p className="text-muted-foreground mt-2">
              Update badge information
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/badges")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter badge name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter badge description"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="mileage">Mileage</option>
                  <option value="carbon">Carbon</option>
                  <option value="streak">Streak</option>
                  <option value="achievement">Achievement</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="rarity">Rarity *</Label>
                <Select
                  value={formData.rarity}
                  onChange={(e) => handleInputChange("rarity", e.target.value)}
                  required
                >
                  <option value="">Select rarity</option>
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Optional notes about the badge"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="https://example.com/badge-image.png"
                required
              />
            </div>
            <div>
              <Label htmlFor="iconUrl">Icon URL *</Label>
              <Input
                id="iconUrl"
                type="url"
                value={formData.iconUrl}
                onChange={(e) => handleInputChange("iconUrl", e.target.value)}
                placeholder="https://example.com/badge-icon.png"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mileage">Mileage Required (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={(formData.conditions?.mileage as number) || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "conditions",
                      "mileage",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="1000"
                />
              </div>
              <div>
                <Label htmlFor="timeFrame">Time Frame</Label>
                <Select
                  value={(formData.conditions?.timeFrame as string) || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "conditions",
                      "timeFrame",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select time frame</option>
                  <option value="all_time">All Time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="b3trTokens">B3TR Tokens</Label>
                <Input
                  id="b3trTokens"
                  type="number"
                  value={(formData.rewards?.b3trTokens as number) || 0}
                  onChange={(e) =>
                    handleNestedChange(
                      "rewards",
                      "b3trTokens",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={(formData.rewards?.points as number) || 0}
                  onChange={(e) =>
                    handleNestedChange(
                      "rewards",
                      "points",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={(formData.rewards?.experience as number) || 0}
                  onChange={(e) =>
                    handleNestedChange(
                      "rewards",
                      "experience",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="50"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pointsValue">Points Value</Label>
              <Input
                id="pointsValue"
                type="number"
                value={formData.pointsValue}
                onChange={(e) =>
                  handleInputChange(
                    "pointsValue",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={(formData.metadata?.category as string) || ""}
                  onChange={(e) =>
                    handleNestedChange("metadata", "category", e.target.value)
                  }
                  placeholder="milestone"
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty (1-5)</Label>
                <Select
                  value={(
                    (formData.metadata?.difficulty as number) || 1
                  ).toString()}
                  onChange={(e) =>
                    handleNestedChange(
                      "metadata",
                      "difficulty",
                      parseInt(e.target.value)
                    )
                  }
                >
                  <option value="">Select difficulty</option>
                  <option value="1">1 - Very Easy</option>
                  <option value="2">2 - Easy</option>
                  <option value="3">3 - Medium</option>
                  <option value="4">4 - Hard</option>
                  <option value="5">5 - Very Hard</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                value={(formData.metadata?.estimatedTime as string) || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "metadata",
                    "estimatedTime",
                    e.target.value
                  )
                }
                placeholder="2 weeks"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.metadata?.tags as string[])?.map(
                  (tag: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/badges")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="gradient-ev-green text-white"
          >
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
