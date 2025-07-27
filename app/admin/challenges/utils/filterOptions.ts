// Challenge Filter Options - can be easily updated for future requirements

export const challengeTypes = [
  { value: "mileage", label: "Mileage" },
  { value: "carbon-saved", label: "Carbon Saved" },
  { value: "upload", label: "Upload" },
  { value: "streak", label: "Streak" },
  { value: "vehicle-count", label: "Vehicle Count" },
] as const;

export const challengeStatuses = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
] as const;

export const challengeVisibilities = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "invite-only", label: "Invite Only" },
] as const;

export const challengeDifficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

export const challengeCategories = [
  { value: "seasonal", label: "Seasonal" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "special", label: "Special" },
] as const;

// Type definitions for TypeScript
export type ChallengeType = (typeof challengeTypes)[number]["value"];
export type ChallengeStatus = (typeof challengeStatuses)[number]["value"];
export type ChallengeVisibility =
  (typeof challengeVisibilities)[number]["value"];
export type ChallengeDifficulty =
  (typeof challengeDifficulties)[number]["value"];
export type ChallengeCategory = (typeof challengeCategories)[number]["value"];

// Filter state interface
export interface ChallengeFilters {
  search: string;
  type: ChallengeType | "";
  status: ChallengeStatus | "";
  visibility: ChallengeVisibility | "";
  difficulty: ChallengeDifficulty | "";
  category: ChallengeCategory | "";
}

// Pagination interface
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API request parameters
export interface ChallengeListParams extends ChallengeFilters {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
