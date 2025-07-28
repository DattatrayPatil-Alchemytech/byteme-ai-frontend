"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Target, Calendar, Upload } from "lucide-react";
import { challengeTypes } from "../../app/admin/challenges/utils/filterOptions";
import { ChallengeResponse } from "../../lib/apiHelpers/challenges";

interface ChallengeFormProps {
  initialData?: ChallengeResponse | null;
  onSubmit: (data: ChallengeFormData) => Promise<void>;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export interface ChallengeFormData {
  name: string;
  description: string;
  type: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  requirements?: {
    minLevel: number;
    minMileage: number;
  };
  status?: string;
}

export default function ChallengeForm({
  initialData,
  onSubmit,
  isLoading = false,
  mode,
}: ChallengeFormProps) {
  const [formData, setFormData] = useState<ChallengeFormData>({
    name: "",
    description: "",
    type: "mileage",
    imageUrl: "",
    startDate: "",
    endDate: "",
    requirements: {
      minLevel: 1,
      minMileage: 0,
    },
    status: "draft",
  });

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      console.log("Initializing form with data:", initialData);
      console.log("Initial imageUrl:", initialData.imageUrl);

      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "mileage",
        imageUrl: initialData.imageUrl ?? "",
        startDate: initialData.startDate
          ? initialData.startDate.split("T")[0]
          : "",
        endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
        requirements: {
          minLevel: initialData.requirements?.minLevel || 1,
          minMileage: initialData.requirements?.minMileage || 0,
        },
        status: initialData.status || "draft",
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ChallengeFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRequirementChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements!,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up data before sending
    const apiData: any = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      requirements: formData.requirements,
      status: formData.status || "draft",
    };

    // Only include imageUrl if it has a value
    if (formData.imageUrl && formData.imageUrl.trim() !== "") {
      apiData.imageUrl = formData.imageUrl.trim();
    }

    console.log("Form submission data:", apiData);
    await onSubmit(apiData);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Desktop: Two Column Layout, Mobile: Single Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Challenge Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter challenge name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Challenge Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    {challengeTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe the challenge objectives and rules"
                    rows={4}
                    required
                    className="mt-1 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Challenge Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl || ""}
                    onChange={(e) => {
                      console.log("Image URL changed to:", e.target.value);
                      handleInputChange("imageUrl", e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Add an image to make your challenge more appealing
                    {formData.imageUrl && (
                      <span className="block mt-1 text-blue-600">
                        Current: {formData.imageUrl}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Duration Display */}
                {formData.startDate && formData.endDate && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Duration:{" "}
                      {Math.ceil(
                        (new Date(formData.endDate).getTime() -
                          new Date(formData.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLevel">Minimum Level</Label>
                    <Input
                      id="minLevel"
                      type="number"
                      value={formData.requirements?.minLevel || 1}
                      onChange={(e) =>
                        handleRequirementChange(
                          "minLevel",
                          Number(e.target.value)
                        )
                      }
                      placeholder="1"
                      min="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minMileage">Minimum Mileage (km)</Label>
                    <Input
                      id="minMileage"
                      type="number"
                      value={formData.requirements?.minMileage || 0}
                      onChange={(e) =>
                        handleRequirementChange(
                          "minMileage",
                          Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      min="0"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Set minimum requirements for users to participate in this
                  challenge
                </div>
              </CardContent>
            </Card>

            {/* Status (Edit mode only) */}
            {mode === "edit" && (
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="status">Challenge Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Submit Button - Full Width */}
        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={isLoading}
            className="gradient-ev-green hover-glow w-full sm:w-auto px-8"
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading
              ? "Saving..."
              : mode === "create"
              ? "Create Challenge"
              : "Update Challenge"}
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-center text-sm text-muted-foreground pb-4">
          <p>* Required fields</p>
          {mode === "create" && (
            <p className="mt-1">
              Challenge will be created in draft status. You can publish it
              later from the challenges list.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
