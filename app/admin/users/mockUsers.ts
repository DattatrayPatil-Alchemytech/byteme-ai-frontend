export interface MockUser {
  id: string;
  email: string;
  twitter?: string;
  linkedin?: string;
  submissionCount: number;
  totalMiles: number;
  totalRewards: number;
  tier: string;
  lastActive: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'alice@example.com',
    twitter: '@alice',
    linkedin: 'alice-linkedin',
    submissionCount: 42,
    totalMiles: 1200,
    totalRewards: 350,
    tier: 'Gold',
    lastActive: '2024-06-01',
  },
  {
    id: '2',
    email: 'bob@example.com',
    twitter: '@bob',
    linkedin: 'bob-linkedin',
    submissionCount: 30,
    totalMiles: 800,
    totalRewards: 200,
    tier: 'Silver',
    lastActive: '2024-05-30',
  },
  {
    id: '3',
    email: 'carol@example.com',
    twitter: '@carol',
    linkedin: 'carol-linkedin',
    submissionCount: 55,
    totalMiles: 2000,
    totalRewards: 500,
    tier: 'Platinum',
    lastActive: '2024-06-02',
  },
]; 