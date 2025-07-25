export interface MockUser {
  id: string;
  name: string;
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
    id: '1', name: 'Alice Green', email: 'alice@example.com', twitter: '@alice', linkedin: 'alice-linkedin', submissionCount: 42, totalMiles: 1200, totalRewards: 350, tier: 'Gold', lastActive: '2024-06-01',
  },
  {
    id: '2', name: 'Bob Blue', email: 'bob@example.com', twitter: '@bob', linkedin: 'bob-linkedin', submissionCount: 30, totalMiles: 800, totalRewards: 200, tier: 'Silver', lastActive: '2024-05-30',
  },
  {
    id: '3', name: 'Carol Sun', email: 'carol@example.com', twitter: '@carol', linkedin: 'carol-linkedin', submissionCount: 55, totalMiles: 2000, totalRewards: 500, tier: 'Platinum', lastActive: '2024-06-02',
  },
  // 47 more users
  ...Array.from({ length: 47 }, (_, i) => {
    const idx = i + 4;
    const tiers = ['Gold', 'Silver', 'Platinum', 'Bronze'];
    const tier = tiers[idx % tiers.length];
    return {
      id: idx.toString(),
      name: `User ${idx} Name`,
      email: `user${idx}@example.com`,
      twitter: `@user${idx}`,
      linkedin: `user${idx}-linkedin`,
      submissionCount: 10 + (idx * 2) % 60,
      totalMiles: 500 + (idx * 37) % 3000,
      totalRewards: 100 + (idx * 13) % 600,
      tier,
      lastActive: `2024-05-${(idx % 28 + 1).toString().padStart(2, '0')}`,
    };
  })
]; 