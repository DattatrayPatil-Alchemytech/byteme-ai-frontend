"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface RoundSubmission {
  id: number;
  userId: number;
  name: string;
  vehicleModel: string;
  rank: number;
  kilometersSubmitted: number;
  b3trRewards: number;
  poolSharePercentage: number;
  carbonOffset: number;
  status: "verified" | "pending" | "rejected";
  badges: string[];
}

interface ParticipantsTableProps {
  currentSubmissions: RoundSubmission[];
  startIndex: number;
  endIndex: number;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  setCurrentPage: (page: number) => void;
  handleViewUserDetails: (userId: number) => void;
  getRankColor: (rank: number) => string;
  getRankIcon: (rank: number) => string;
  getStatusColor: (status: string) => string;
}

export default function ParticipantsTable({
  currentSubmissions,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  totalCount,
  setCurrentPage,
  handleViewUserDetails,
  getRankColor,
  getRankIcon,
  getStatusColor,
}: ParticipantsTableProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <span className="flex items-center">
            <span className="text-2xl mr-2">👥</span>
            Round Participants
          </span>
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of{" "}
            {totalCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile View - Clickable Cards */}
        <div className="block md:hidden space-y-3">
          {currentSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => handleViewUserDetails(submission.userId)}
            >
              {/* Header Row - Rank, Name, Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(
                      submission.rank
                    )} flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5`}
                  >
                    {submission.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate leading-tight">
                      {submission.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {submission.vehicleModel}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(
                    submission.status
                  )}`}
                >
                  {submission.status}
                </span>
              </div>

              {/* Stats - 3 Columns */}
              <div className="flex justify-between text-xs">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">
                    {submission.kilometersSubmitted > 1000
                      ? `${(submission.kilometersSubmitted / 1000).toFixed(1)}k`
                      : submission.kilometersSubmitted}
                  </div>
                  <div className="text-muted-foreground text-xs">km</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">
                    {submission.b3trRewards > 1000
                      ? `${(submission.b3trRewards / 1000).toFixed(1)}k`
                      : submission.b3trRewards}
                    <span className="text-muted-foreground">
                      {" "}
                      ({submission.poolSharePercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">B3TR</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {submission.carbonOffset.toFixed(1)}kg
                  </div>
                  <div className="text-muted-foreground text-xs">CO2</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-center py-4 px-4 font-medium text-muted-foreground">
                      Rank
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      Participant
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      Vehicle
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      Kilometers
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      B3TR Rewards
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      Pool Share
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      Carbon Offset
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-border/50 hover:bg-muted/50"
                    >
                      <td className="py-4 px-4 align-middle">
                        <div className="flex justify-center">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(
                              submission.rank
                            )} flex items-center justify-center text-sm font-bold text-white`}
                          >
                            {getRankIcon(submission.rank)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {submission.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            User ID: {submission.userId}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        {submission.vehicleModel}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-blue-600">
                          {submission.kilometersSubmitted.toLocaleString()} km
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-purple-600">
                          {submission.b3trRewards.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-emerald-600">
                          {submission.poolSharePercentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-green-600">
                          {submission.carbonOffset.toFixed(1)} kg
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          onClick={() =>
                            handleViewUserDetails(submission.userId)
                          }
                          variant="outline"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination - Mobile Optimized */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Results Info */}
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            <span className="block sm:hidden">
              {startIndex + 1}-{Math.min(endIndex, totalCount)} of {totalCount}
            </span>
            <span className="hidden sm:block">
              Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of{" "}
              {totalCount} participants
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="px-3 h-9"
            >
              <span className="block sm:hidden">‹</span>
              <span className="hidden sm:block">Previous</span>
            </Button>

            <div className="flex items-center gap-1">
              {/* Mobile: Show current page and adjacent pages only */}
              <div className="flex sm:hidden items-center gap-1">
                {currentPage > 1 && (
                  <Button
                    onClick={() => setCurrentPage(1)}
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0"
                  >
                    1
                  </Button>
                )}

                {currentPage > 2 && (
                  <span className="text-muted-foreground px-1">...</span>
                )}

                <Button
                  onClick={() => setCurrentPage(currentPage)}
                  variant="default"
                  size="sm"
                  className="w-9 h-9 p-0"
                >
                  {currentPage}
                </Button>

                {currentPage < totalPages - 1 && (
                  <span className="text-muted-foreground px-1">...</span>
                )}

                {currentPage < totalPages && (
                  <Button
                    onClick={() => setCurrentPage(totalPages)}
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0"
                  >
                    {totalPages}
                  </Button>
                )}
              </div>

              {/* Desktop: Show more pages */}
              <div className="hidden sm:flex items-center gap-1">
                {/* Show first few pages */}
                {[...Array(Math.min(3, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-9 h-9 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {/* Show ellipsis and current page area if needed */}
                {currentPage > 3 && totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground px-2">...</span>
                    {currentPage > 3 && currentPage < totalPages - 2 && (
                      <Button
                        onClick={() => setCurrentPage(currentPage)}
                        variant="default"
                        size="sm"
                        className="w-9 h-9 p-0"
                      >
                        {currentPage}
                      </Button>
                    )}
                  </>
                )}

                {/* Show last page if needed */}
                {totalPages > 3 && (
                  <>
                    {totalPages > 5 && (
                      <span className="text-muted-foreground px-2">...</span>
                    )}
                    <Button
                      onClick={() => setCurrentPage(totalPages)}
                      variant={
                        currentPage === totalPages ? "default" : "outline"
                      }
                      size="sm"
                      className="w-9 h-9 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="px-3 h-9"
            >
              <span className="block sm:hidden">›</span>
              <span className="hidden sm:block">Next</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
