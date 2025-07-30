"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  processPendingRewards,
  verifyBlockchainTransactions,
} from "@/lib/apiHelpers/rewards";

export default function DistributeActions() {
  const [isDistributing, setIsDistributing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDistribute = async () => {
    try {
      toast.loading("Processing pending rewards...");
      await processPendingRewards();
      toast.success("Rewards distributed successfully!");
    } catch (e) {
      toast.error("Failed to distribute rewards");
    } finally {
      toast.dismiss();
    }
  };

  const handleSyncBlockchain = async () => {
    setIsSyncing(true);
    try {
      toast.loading("Syncing with blockchain...");
      await verifyBlockchainTransactions();
      toast.success("Blockchain sync successful!");
    } catch (e) {
      toast.error("Blockchain sync failed");
    } finally {
      setIsSyncing(false);
      toast.dismiss();
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <span className="text-2xl mr-2">⚡</span>
          Distribution Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
          <Button
            onClick={handleDistribute}
            disabled={isDistributing || isSyncing}
            className="gradient-ev-green hover:from-emerald-600 hover:to-green-700 whitespace-nowrap"
          >
            {isDistributing ? "Distributing..." : "Distribute Rewards"}
          </Button>
          <Button
            onClick={handleSyncBlockchain}
            disabled={isDistributing || isSyncing}
            className="gradient-ev-green hover:from-blue-600 hover:to-blue-700 whitespace-nowrap"
          >
            {isSyncing ? "Syncing..." : "Sync with Blockchain"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
