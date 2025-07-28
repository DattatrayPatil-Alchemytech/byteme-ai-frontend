"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  getChallengeById,
  type ChallengeResponse,
} from "../../../../../lib/apiHelpers/challenges";
import { ChallengeDetails } from "../../../../../components/challenges";

export default function ViewChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const challengeId = resolvedParams.id; // Keep as string, don't convert to number

  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setIsLoading(true);
        const result = await getChallengeById(challengeId);
        setChallenge(result);
      } catch (error) {
        console.error("Error loading challenge:", error);
        alert("Error loading challenge. Please try again.");
        router.push("/admin/challenges");
      } finally {
        setIsLoading(false);
      }
    };

    if (challengeId) {
      loadChallenge();
    }
  }, [challengeId, router]);

  const handleBack = () => {
    router.push("/admin/challenges");
  };

  const handleEdit = () => {
    router.push(`/admin/challenges/edit/${challengeId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Challenge Details
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Loading challenge data...
          </p>
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Challenge Details
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Challenge not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChallengeDetails
      challenge={challenge}
      onEdit={handleEdit}
      onBack={handleBack}
      showActions={true}
    />
  );
}
