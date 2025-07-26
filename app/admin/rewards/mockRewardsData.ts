export interface RoundSubmission {
  id: number;
  userId: number;
  name: string;
  email: string;
  vehicleModel: string;
  avatar?: string;
  kilometersSubmitted: number;
  submissionDate: string;
  rank: number;
  b3trRewards: number;
  poolSharePercentage: number;
  carbonOffset: number;
  submissionId: string;
  status: "verified" | "pending" | "rejected";
  badges: string[];
  streak: number;
  totalSubmissions: number;
  lastActive: string;
  joinDate: string;
}

export interface CurrentRound {
  id: number;
  roundNumber: number;
  startDate: string;
  endDate: string;
  totalPoolAmount: number;
  remainingPoolAmount: number;
  distributedAmount: number;
  status: "active" | "completed" | "distributing";
  totalParticipants: number;
  totalKilometers: number;
  totalSubmissions: number;
  averageKmPerUser: number;
  topPerformerKm: number;
  carbonOffsetTotal: number;
  participationRate: number;
}

export interface RewardsOverview {
  totalRoundsCompleted: number;
  totalRewardsDistributed: number;
  averageParticipants: number;
  totalCarbonOffset: number;
  topPerformerAllTime: {
    name: string;
    totalKm: number;
    totalRewards: number;
  };
}

// Mock current round data
export const mockCurrentRound: CurrentRound = {
  id: 7,
  roundNumber: 7,
  startDate: "2024-12-01",
  endDate: "2024-12-31",
  totalPoolAmount: 50000,
  remainingPoolAmount: 50000,
  distributedAmount: 0,
  status: "active",
  totalParticipants: 156,
  totalKilometers: 4567,
  totalSubmissions: 234,
  averageKmPerUser: 29.3,
  topPerformerKm: 234,
  carbonOffsetTotal: 1826,
  participationRate: 87.5,
};

// Mock rewards overview
export const mockRewardsOverview: RewardsOverview = {
  totalRoundsCompleted: 6,
  totalRewardsDistributed: 287500,
  averageParticipants: 142,
  totalCarbonOffset: 12456,
  topPerformerAllTime: {
    name: "Sarah Johnson",
    totalKm: 1456,
    totalRewards: 2890,
  },
};

// Mock user submissions for current round
export const mockRoundSubmissions: RoundSubmission[] = [
  {
    id: 1,
    userId: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    vehicleModel: "Tesla Model Y",
    kilometersSubmitted: 234,
    submissionDate: "2024-12-15",
    rank: 1,
    b3trRewards: 2870,
    poolSharePercentage: 5.74,
    carbonOffset: 93.6,
    submissionId: "R7-SUB-001",
    status: "verified",
    badges: ["Eco Warrior", "Mile Master", "Round Champion"],
    streak: 28,
    totalSubmissions: 45,
    lastActive: "2 hours ago",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    userId: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    vehicleModel: "Nissan Leaf",
    kilometersSubmitted: 187,
    submissionDate: "2024-12-14",
    rank: 2,
    b3trRewards: 2295,
    poolSharePercentage: 4.59,
    carbonOffset: 74.8,
    submissionId: "R7-SUB-002",
    status: "verified",
    badges: ["Eco Warrior", "Consistent Driver"],
    streak: 21,
    totalSubmissions: 42,
    lastActive: "1 hour ago",
    joinDate: "2024-02-03",
  },
  {
    id: 3,
    userId: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    vehicleModel: "Tesla Model 3",
    kilometersSubmitted: 156,
    submissionDate: "2024-12-13",
    rank: 3,
    b3trRewards: 1918,
    poolSharePercentage: 3.84,
    carbonOffset: 62.4,
    submissionId: "R7-SUB-003",
    status: "verified",
    badges: ["Mile Master", "Weekend Warrior"],
    streak: 15,
    totalSubmissions: 38,
    lastActive: "30 minutes ago",
    joinDate: "2024-01-28",
  },
  {
    id: 4,
    userId: 4,
    name: "Alex Rodriguez",
    email: "alex@example.com",
    vehicleModel: "Chevrolet Bolt",
    kilometersSubmitted: 145,
    submissionDate: "2024-12-12",
    rank: 4,
    b3trRewards: 1783,
    poolSharePercentage: 3.57,
    carbonOffset: 58.0,
    submissionId: "R7-SUB-004",
    status: "verified",
    badges: ["Eco Warrior"],
    streak: 12,
    totalSubmissions: 35,
    lastActive: "45 minutes ago",
    joinDate: "2024-02-10",
  },
  {
    id: 5,
    userId: 5,
    name: "Lisa Wang",
    email: "lisa@example.com",
    vehicleModel: "Ford Mustang Mach-E",
    kilometersSubmitted: 134,
    submissionDate: "2024-12-11",
    rank: 5,
    b3trRewards: 1648,
    poolSharePercentage: 3.3,
    carbonOffset: 53.6,
    submissionId: "R7-SUB-005",
    status: "verified",
    badges: ["Speed Demon"],
    streak: 18,
    totalSubmissions: 29,
    lastActive: "3 hours ago",
    joinDate: "2024-02-15",
  },
  {
    id: 6,
    userId: 6,
    name: "David Kim",
    email: "david@example.com",
    vehicleModel: "Hyundai Kona Electric",
    kilometersSubmitted: 128,
    submissionDate: "2024-12-10",
    rank: 6,
    b3trRewards: 1574,
    poolSharePercentage: 3.15,
    carbonOffset: 51.2,
    submissionId: "R7-SUB-006",
    status: "pending",
    badges: ["Eco Warrior", "Consistent Driver"],
    streak: 22,
    totalSubmissions: 27,
    lastActive: "5 hours ago",
    joinDate: "2024-01-10",
  },
  {
    id: 7,
    userId: 7,
    name: "Maria Garcia",
    email: "maria@example.com",
    vehicleModel: "Volkswagen ID.4",
    kilometersSubmitted: 119,
    submissionDate: "2024-12-09",
    rank: 7,
    b3trRewards: 1463,
    poolSharePercentage: 2.93,
    carbonOffset: 47.6,
    submissionId: "R7-SUB-007",
    status: "verified",
    badges: ["Family Driver"],
    streak: 14,
    totalSubmissions: 25,
    lastActive: "2 days ago",
    joinDate: "2024-02-01",
  },
  {
    id: 8,
    userId: 8,
    name: "James Wilson",
    email: "james@example.com",
    vehicleModel: "Tesla Model S",
    kilometersSubmitted: 112,
    submissionDate: "2024-12-08",
    rank: 8,
    b3trRewards: 1378,
    poolSharePercentage: 2.76,
    carbonOffset: 44.8,
    submissionId: "R7-SUB-008",
    status: "verified",
    badges: ["Luxury Driver", "Early Adopter"],
    streak: 11,
    totalSubmissions: 23,
    lastActive: "1 day ago",
    joinDate: "2024-01-25",
  },
  {
    id: 9,
    userId: 9,
    name: "Anna Thompson",
    email: "anna@example.com",
    vehicleModel: "BMW i4",
    kilometersSubmitted: 98,
    submissionDate: "2024-12-07",
    rank: 9,
    b3trRewards: 1206,
    poolSharePercentage: 2.41,
    carbonOffset: 39.2,
    submissionId: "R7-SUB-009",
    status: "verified",
    badges: ["Premium Driver"],
    streak: 16,
    totalSubmissions: 21,
    lastActive: "4 hours ago",
    joinDate: "2024-02-08",
  },
  {
    id: 10,
    userId: 10,
    name: "Robert Chen",
    email: "robert@example.com",
    vehicleModel: "Audi e-tron",
    kilometersSubmitted: 87,
    submissionDate: "2024-12-06",
    rank: 10,
    b3trRewards: 1070,
    poolSharePercentage: 2.14,
    carbonOffset: 34.8,
    submissionId: "R7-SUB-010",
    status: "verified",
    badges: ["Tech Enthusiast"],
    streak: 9,
    totalSubmissions: 18,
    lastActive: "6 hours ago",
    joinDate: "2024-03-01",
  },
  // Add more entries for pagination testing
  {
    id: 11,
    userId: 11,
    name: "Jennifer Martinez",
    email: "jennifer@example.com",
    vehicleModel: "Polestar 2",
    kilometersSubmitted: 76,
    submissionDate: "2024-12-05",
    rank: 11,
    b3trRewards: 935,
    poolSharePercentage: 1.87,
    carbonOffset: 30.4,
    submissionId: "R7-SUB-011",
    status: "pending",
    badges: ["Design Lover"],
    streak: 7,
    totalSubmissions: 16,
    lastActive: "8 hours ago",
    joinDate: "2024-03-15",
  },
  {
    id: 12,
    userId: 12,
    name: "Kevin Park",
    email: "kevin@example.com",
    vehicleModel: "Ioniq 5",
    kilometersSubmitted: 65,
    submissionDate: "2024-12-04",
    rank: 12,
    b3trRewards: 800,
    poolSharePercentage: 1.6,
    carbonOffset: 26.0,
    submissionId: "R7-SUB-012",
    status: "verified",
    badges: ["Innovation Fan"],
    streak: 13,
    totalSubmissions: 14,
    lastActive: "12 hours ago",
    joinDate: "2024-04-01",
  },
];

// Generate complete leaderboard for current round
export const generateMoreSubmissions = (count: number): RoundSubmission[] => {
  const submissions: RoundSubmission[] = [];
  const names = [
    "Sarah Johnson",
    "Mike Chen",
    "Emma Davis",
    "Alex Rodriguez",
    "Lisa Wang",
    "David Kim",
    "Maria Garcia",
    "James Wilson",
    "Anna Thompson",
    "Chris Johnson",
    "Amy Smith",
    "Tom Wilson",
    "Sara Lee",
    "Mark Brown",
    "Elena Rodriguez",
    "Ryan Clark",
    "Mia Anderson",
    "Kevin Park",
    "Jennifer Martinez",
    "Daniel Lee",
  ];
  const vehicles = [
    "Tesla Model 3",
    "Tesla Model Y",
    "Nissan Leaf",
    "BMW i3",
    "Chevrolet Volt",
    "Hyundai Ioniq",
    "Kia EV6",
    "Genesis GV60",
    "Ford Mustang Mach-E",
    "Polestar 2",
    "Lucid Air",
    "Rivian R1T",
    "BMW iX",
    "Audi e-tron GT",
  ];
  const badges = [
    "Eco Warrior",
    "Mile Master",
    "Consistent Driver",
    "Weekend Warrior",
    "Night Owl",
    "Early Bird",
    "Speed Demon",
    "Tech Enthusiast",
    "Green Pioneer",
  ];

  // Generate submissions with decreasing km for proper ranking
  for (let i = 0; i < count; i++) {
    const km = Math.floor(Math.random() * 50) + Math.max(200 - i * 2, 20); // Higher ranks get more km
    const rank = i + 1; // Ranking starts from 1
    const userId = i + 1;
    submissions.push({
      id: userId,
      userId: userId,
      name: names[i % names.length],
      email: `user${userId}@example.com`,
      vehicleModel: vehicles[i % vehicles.length],
      kilometersSubmitted: km,
      submissionDate: `2024-12-${String(20 - (i % 20)).padStart(2, "0")}`,
      rank,
      b3trRewards: Math.floor(km * 12.3),
      poolSharePercentage: (km / 4567) * 100,
      carbonOffset: km * 0.4,
      submissionId: `R7-SUB-${String(userId).padStart(3, "0")}`,
      status: Math.random() > 0.1 ? "verified" : "pending",
      badges: [badges[i % badges.length]],
      streak: Math.floor(Math.random() * 30) + 1,
      totalSubmissions: Math.floor(Math.random() * 40) + 10,
      lastActive: `${Math.floor(Math.random() * 24)} hours ago`,
      joinDate: "2024-05-01",
    });
  }
  return submissions;
};

export const getAllSubmissions = (): RoundSubmission[] => {
  return [...mockRoundSubmissions, ...generateMoreSubmissions(100)];
};
