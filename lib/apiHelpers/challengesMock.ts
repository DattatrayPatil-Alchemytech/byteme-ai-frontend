import {
  ChallengeType,
  ChallengeStatus,
  ChallengeVisibility,
  ChallengeDifficulty,
  ChallengeCategory,
} from "../../app/admin/challenges/utils/filterOptions";

// Mock Challenges Data
export interface Challenge {
  id: number;
  name: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  visibility: ChallengeVisibility;
  imageUrl: string;
  bannerUrl: string;
  objectives: {
    mileage?: number;
    uploadCount?: number;
    streakDays?: number;
    socialShares?: number;
    carbonSaved?: number;
    vehicleCount?: number;
  };
  rewards: {
    b3trTokens: number;
    points: number;
    experience: number;
  };
  leaderboardRewards: {
    first: {
      b3trTokens: number;
      points: number;
    };
    second: {
      b3trTokens: number;
      points: number;
    };
    third: {
      b3trTokens: number;
      points: number;
    };
  };
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  requirements: {
    minLevel: number;
    minMileage: number;
  };
  metadata: {
    category: ChallengeCategory;
    tags: string[];
    estimatedTime: string;
    featured: boolean;
  };
  notes: string;
  status: ChallengeStatus;
  createdAt: string;
}

export const mockChallenges: Challenge[] = [
  {
    id: 1,
    name: "Weekend Warrior",
    description: "Drive 500 km over the weekend and earn bonus rewards!",
    type: "mileage",
    difficulty: "medium",
    visibility: "public",
    imageUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=300&fit=crop",
    objectives: {
      mileage: 500,
      uploadCount: 10,
    },
    rewards: {
      b3trTokens: 50,
      points: 200,
      experience: 100,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 100,
        points: 500,
      },
      second: {
        b3trTokens: 75,
        points: 300,
      },
      third: {
        b3trTokens: 50,
        points: 200,
      },
    },
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    maxParticipants: 100,
    currentParticipants: 78,
    requirements: {
      minLevel: 5,
      minMileage: 1000,
    },
    metadata: {
      category: "weekly",
      tags: ["weekend", "mileage"],
      estimatedTime: "1 week",
      featured: true,
    },
    notes: "Created for weekend engagement",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Upload Master",
    description: "Upload 50 photos this month and become an Upload Master!",
    type: "upload",
    difficulty: "hard",
    visibility: "public",
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=300&fit=crop",
    objectives: {
      uploadCount: 50,
    },
    rewards: {
      b3trTokens: 100,
      points: 400,
      experience: 250,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 200,
        points: 800,
      },
      second: {
        b3trTokens: 150,
        points: 600,
      },
      third: {
        b3trTokens: 100,
        points: 400,
      },
    },
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    maxParticipants: 200,
    currentParticipants: 156,
    requirements: {
      minLevel: 3,
      minMileage: 500,
    },
    metadata: {
      category: "monthly",
      tags: ["upload", "photography", "content"],
      estimatedTime: "1 month",
      featured: false,
    },
    notes: "Monthly upload challenge for content creators",
    status: "active",
    createdAt: "2023-12-25",
  },
  {
    id: 3,
    name: "Daily Streaker",
    description: "Maintain a 30-day upload streak and win exclusive rewards!",
    type: "streak",
    difficulty: "hard",
    visibility: "invite-only",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop",
    objectives: {
      streakDays: 30,
      uploadCount: 30,
    },
    rewards: {
      b3trTokens: 150,
      points: 600,
      experience: 400,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 300,
        points: 1200,
      },
      second: {
        b3trTokens: 225,
        points: 900,
      },
      third: {
        b3trTokens: 150,
        points: 600,
      },
    },
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    maxParticipants: 50,
    currentParticipants: 32,
    requirements: {
      minLevel: 10,
      minMileage: 2000,
    },
    metadata: {
      category: "special",
      tags: ["streak", "daily", "consistency"],
      estimatedTime: "30 days",
      featured: true,
    },
    notes: "Premium challenge for dedicated users",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    name: "Social Butterfly",
    description: "Share your achievements on social media 20 times!",
    type: "upload",
    difficulty: "easy",
    visibility: "public",
    imageUrl:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=300&fit=crop",
    objectives: {
      socialShares: 20,
    },
    rewards: {
      b3trTokens: 30,
      points: 100,
      experience: 50,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 60,
        points: 200,
      },
      second: {
        b3trTokens: 45,
        points: 150,
      },
      third: {
        b3trTokens: 30,
        points: 100,
      },
    },
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    maxParticipants: 1000,
    currentParticipants: 245,
    requirements: {
      minLevel: 1,
      minMileage: 0,
    },
    metadata: {
      category: "seasonal",
      tags: ["social", "sharing", "community"],
      estimatedTime: "ongoing",
      featured: false,
    },
    notes: "Year-long social engagement challenge",
    status: "active",
    createdAt: "2023-12-15",
  },
  {
    id: 5,
    name: "Green Commuter",
    description: "Complete 1000 km of eco-friendly commuting this quarter!",
    type: "mileage",
    difficulty: "medium",
    visibility: "public",
    imageUrl:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=300&fit=crop",
    objectives: {
      mileage: 1000,
    },
    rewards: {
      b3trTokens: 80,
      points: 350,
      experience: 180,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 160,
        points: 700,
      },
      second: {
        b3trTokens: 120,
        points: 525,
      },
      third: {
        b3trTokens: 80,
        points: 350,
      },
    },
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    maxParticipants: 150,
    currentParticipants: 89,
    requirements: {
      minLevel: 5,
      minMileage: 1500,
    },
    metadata: {
      category: "seasonal",
      tags: ["green", "commuting", "eco-friendly"],
      estimatedTime: "3 months",
      featured: true,
    },
    notes: "Quarterly eco-commuting challenge",
    status: "active",
    createdAt: "2023-12-20",
  },
  {
    id: 6,
    name: "Night Owl Driver",
    description: "Complete 200 km of night driving and earn bonus tokens!",
    type: "mileage",
    difficulty: "easy",
    visibility: "public",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop",
    objectives: {
      mileage: 200,
    },
    rewards: {
      b3trTokens: 40,
      points: 150,
      experience: 75,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 80,
        points: 300,
      },
      second: {
        b3trTokens: 60,
        points: 225,
      },
      third: {
        b3trTokens: 40,
        points: 150,
      },
    },
    startDate: "2024-02-15",
    endDate: "2024-02-29",
    maxParticipants: 80,
    currentParticipants: 12,
    requirements: {
      minLevel: 3,
      minMileage: 300,
    },
    metadata: {
      category: "weekly",
      tags: ["night", "driving", "special"],
      estimatedTime: "2 weeks",
      featured: false,
    },
    notes: "Night driving challenge for adventurous drivers",
    status: "draft",
    createdAt: "2024-02-01",
  },
  {
    id: 7,
    name: "Carbon Saver Champion",
    description:
      "Save 100kg of CO2 emissions through eco-friendly travel choices!",
    type: "carbon-saved",
    difficulty: "medium",
    visibility: "public",
    imageUrl:
      "https://images.unsplash.com/photo-1569163139394-de44aa02c369?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1569163139394-de44aa02c369?w=800&h=300&fit=crop",
    objectives: {
      carbonSaved: 100,
    },
    rewards: {
      b3trTokens: 75,
      points: 300,
      experience: 150,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 150,
        points: 600,
      },
      second: {
        b3trTokens: 112,
        points: 450,
      },
      third: {
        b3trTokens: 75,
        points: 300,
      },
    },
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    maxParticipants: 200,
    currentParticipants: 145,
    requirements: {
      minLevel: 3,
      minMileage: 500,
    },
    metadata: {
      category: "monthly",
      tags: ["carbon", "environment", "eco-friendly"],
      estimatedTime: "1 month",
      featured: true,
    },
    notes: "Environmental awareness challenge for carbon reduction",
    status: "active",
    createdAt: "2024-02-15",
  },
  {
    id: 8,
    name: "Fleet Manager Pro",
    description: "Register and manage 5 different vehicles in your fleet!",
    type: "vehicle-count",
    difficulty: "easy",
    visibility: "public",
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=300&fit=crop",
    objectives: {
      vehicleCount: 5,
    },
    rewards: {
      b3trTokens: 60,
      points: 250,
      experience: 120,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 120,
        points: 500,
      },
      second: {
        b3trTokens: 90,
        points: 375,
      },
      third: {
        b3trTokens: 60,
        points: 250,
      },
    },
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    maxParticipants: 500,
    currentParticipants: 287,
    requirements: {
      minLevel: 1,
      minMileage: 0,
    },
    metadata: {
      category: "seasonal",
      tags: ["vehicles", "fleet", "management"],
      estimatedTime: "ongoing",
      featured: false,
    },
    notes: "Vehicle registration and management challenge",
    status: "active",
    createdAt: "2023-12-01",
  },
  {
    id: 9,
    name: "Summer Sprint Cancelled",
    description: "This challenge was cancelled due to low participation.",
    type: "mileage",
    difficulty: "hard",
    visibility: "private",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop",
    objectives: {
      mileage: 2000,
    },
    rewards: {
      b3trTokens: 200,
      points: 800,
      experience: 400,
    },
    leaderboardRewards: {
      first: {
        b3trTokens: 400,
        points: 1600,
      },
      second: {
        b3trTokens: 300,
        points: 1200,
      },
      third: {
        b3trTokens: 200,
        points: 800,
      },
    },
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    maxParticipants: 50,
    currentParticipants: 8,
    requirements: {
      minLevel: 15,
      minMileage: 5000,
    },
    metadata: {
      category: "seasonal",
      tags: ["summer", "sprint", "cancelled"],
      estimatedTime: "3 months",
      featured: false,
    },
    notes: "Challenge cancelled due to insufficient registration",
    status: "cancelled",
    createdAt: "2024-05-01",
  },
];
