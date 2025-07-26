// Mock data store for development/testing purposes

interface UserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  twitterUsername?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isNew?: boolean;
}

interface LoginResponse {
  user: UserData;
  accessToken: string;
}

interface SignatureVerificationData {
  purpose: string;
  payload: {
    type: string;
    content: string;
  };
  signature: string;
  signer: string;
  domain: string;
  timestamp: number;
}

// Mock users database
const MOCK_USERS: Record<string, UserData> = {
  "0x595c73ec5279a3833ba535753bfd762da6bbac1d": {
    id: "user_1",
    email: "",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    role: "user",
    twitterUsername: "johndoe_vet",
    description: "VeChain enthusiast and developer",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  "0x123456789abcdef123456789abcdef123456789a": {
    id: "user_2",
    email: "alice.smith@vechain.com",
    name: "Alice Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    role: "admin",
    twitterUsername: "alicesmith_vet",
    description: "VeChain core contributor",
    createdAt: "2024-01-10T08:15:00Z",
    updatedAt: "2024-01-22T16:20:00Z",
  },
  "0xabcdef123456789abcdef123456789abcdef1234": {
    id: "user_3",
    email: "bob.wilson@vechain.com",
    name: "Bob Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    role: "user",
    twitterUsername: "bobwilson_vet",
    description: "Blockchain researcher and VeChain advocate",
    createdAt: "2024-01-12T12:00:00Z",
    updatedAt: "2024-01-21T09:30:00Z",
  },
};

// Mock active sessions (signer -> token mapping)
const MOCK_SESSIONS: Record<string, string> = {};

// Helper function to simulate API delay
const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Generate mock token
const generateMockToken = (signer: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `mock_token_${signer.slice(-8)}_${timestamp}_${randomStr}`;
};

// Mock verify login function
export const mockVerifyLogin = async (
  signatureData: SignatureVerificationData
): Promise<LoginResponse> => {
  await mockDelay();

  const { signer } = signatureData;

  // Check if user exists, if not create a new one
  let user = MOCK_USERS[signer];

  if (!user) {
    // Create new user based on signer
    user = {
      id: `user_${signer.slice(-8)}`,
      email: `${signer.slice(2, 10)}@vechain.com`,
      name: `User ${signer.slice(-4)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signer}`,
      role: Math.random() > 0.9 ? "admin" : "user", // 10% chance of admin
      twitterUsername: `user_${signer.slice(-6)}`,
      description: "VeChain wallet user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    MOCK_USERS[signer] = user;
  }

  // Generate access token
  const accessToken = generateMockToken(signer);

  // Store session
  MOCK_SESSIONS[signer] = accessToken;

  return {
    user,
    accessToken,
  };
};

// Mock refresh token function
export const mockRefreshToken = async (
  currentToken: string
): Promise<LoginResponse> => {
  await mockDelay();

  // Find user by current token
  const signerEntry = Object.entries(MOCK_SESSIONS).find(
    ([_, token]) => token === currentToken
  );

  if (!signerEntry) {
    throw new Error("Invalid token");
  }

  const [signer] = signerEntry;
  const user = MOCK_USERS[signer];

  if (!user) {
    throw new Error("User not found");
  }

  // Generate new token
  const newAccessToken = generateMockToken(signer);

  // Update session
  MOCK_SESSIONS[signer] = newAccessToken;

  // Update user's updatedAt timestamp
  const updatedUser = {
    ...user,
    updatedAt: new Date().toISOString(),
  };

  MOCK_USERS[signer] = updatedUser;

  return {
    user: updatedUser,
    accessToken: newAccessToken,
  };
};

// Mock get current user function
export const mockGetCurrentUser = async (token: string): Promise<UserData> => {
  await mockDelay();

  // Find user by token
  const signerEntry = Object.entries(MOCK_SESSIONS).find(
    ([_, sessionToken]) => sessionToken === token
  );

  if (!signerEntry) {
    throw new Error("Invalid token");
  }

  const [signer] = signerEntry;
  const user = MOCK_USERS[signer];

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Mock update user profile function
export const mockUpdateUserProfile = async (
  token: string,
  userData: Partial<UserData>
): Promise<UserData> => {
  await mockDelay();

  // Find user by token
  const signerEntry = Object.entries(MOCK_SESSIONS).find(
    ([_, sessionToken]) => sessionToken === token
  );

  if (!signerEntry) {
    throw new Error("Invalid token");
  }

  const [signer] = signerEntry;
  const currentUser = MOCK_USERS[signer];

  if (!currentUser) {
    throw new Error("User not found");
  }

  // Update user data
  const updatedUser = {
    ...currentUser,
    ...userData,
    id: currentUser.id, // Don't allow ID changes
    updatedAt: new Date().toISOString(),
  };

  // Save updated user
  MOCK_USERS[signer] = updatedUser;

  return updatedUser;
};

// Mock logout function
export const mockLogoutUser = async (
  token: string
): Promise<{ success: boolean; message: string }> => {
  await mockDelay();

  // Find and remove session
  const signerEntry = Object.entries(MOCK_SESSIONS).find(
    ([_, sessionToken]) => sessionToken === token
  );

  if (signerEntry) {
    const [signer] = signerEntry;
    delete MOCK_SESSIONS[signer];
  }

  return {
    success: true,
    message: "Logged out successfully",
  };
};

// Utility function to get all mock users (for admin purposes)
export const getAllMockUsers = (): UserData[] => {
  return Object.values(MOCK_USERS);
};

// Utility function to check if token is valid
export const isValidMockToken = (token: string): boolean => {
  return Object.values(MOCK_SESSIONS).includes(token);
};

// Export types and mock data for external use
export type { UserData, LoginResponse, SignatureVerificationData };
export { MOCK_USERS, MOCK_SESSIONS };
