"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  getChallengeById,
  updateChallenge,
  UpdateChallengeData,
  type ChallengeResponse,
} from "../../../../../lib/apiHelpers/challenges";
import {
  ChallengeForm,
  type ChallengeFormData,
} from "../../../../../components/challenges";

export default function EditChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const challengeId = resolvedParams.id; // Keep as string, don't convert to number

  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setIsFetching(true);
        const result = await getChallengeById(challengeId);
        setChallenge(result);
      } catch (error) {
        console.error("Error loading challenge:", error);
        alert("Error loading challenge. Please try again.");
        router.push("/admin/challenges");
      } finally {
        setIsFetching(false);
      }
    };

    if (challengeId) {
      loadChallenge();
    }
  }, [challengeId, router]);

  const handleSubmit = async (data: ChallengeFormData) => {
    try {
      setIsLoading(true);
      console.log("Edit page - submitting data:", data);
      await updateChallenge(challengeId, data as UpdateChallengeData);
      alert("Challenge updated successfully!");
      router.push("/admin/challenges");
    } catch (error) {
      console.error("Error updating challenge:", error);
      alert("Error updating challenge. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/challenges");
  };

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Edit Challenge
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Loading challenge data...
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Edit Challenge
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Challenge not found
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            Edit Challenge
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Update challenge details and settings
          </p>
        </div>
      </div>

      {/* Form */}
      <ChallengeForm
        initialData={challenge}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="edit"
      />
    </div>
  );
}
