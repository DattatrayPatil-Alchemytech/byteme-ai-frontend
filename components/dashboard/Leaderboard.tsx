"use client";

import React from "react";
import LeaderboardRanking from "./LeaderboardRanking";
import ChallengeSection from "./ChallengeSection";

const Leaderboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeaderboardRanking />
        <ChallengeSection />
      </div>
    </div>
  );
};

export default Leaderboard;
