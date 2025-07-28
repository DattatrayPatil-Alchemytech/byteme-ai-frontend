"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  createChallenge,
  CreateChallengeData,
} from "../../../../lib/apiHelpers/challenges";
import {
  ChallengeForm,
  type ChallengeFormData,
} from "../../../../components/challenges";

export default function CreateChallengePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ChallengeFormData) => {
    try {
      setIsLoading(true);
      console.log("Create page - submitting data:", data);
      await createChallenge(data as CreateChallengeData);
      alert("Challenge created successfully!");
      router.push("/admin/challenges");
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Error creating challenge. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/challenges");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Create Challenge
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Set up a new challenge for users
          </p>
        </div>
      </div>

      {/* Form */}
      <ChallengeForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
}
