'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WalletConnect from '@/components/dashboard/WalletConnect';
import Badges from '@/components/dashboard/Badges';
import Leaderboard from '@/components/dashboard/Leaderboard';
import TokenStore from '@/components/dashboard/TokenStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'user@byteme.in',
    b3trTokens: 1250,
    vehicleModel: 'Tesla Model 3',
    licensePlate: 'ABC-123',
    sustainableMiles: 1247,
    monthlyTokens: 342,
    totalDrivingSessions: 45,
    averageSessionMiles: 27.7,
    co2Saved: 0.8, // tons of CO2 saved
    currentRank: 5,
    weeklyMiles: 89,
    // New fields from documentation
    lastMiles: 25,
    lastSubmissionDate: '2024-01-28T14:30:00Z',
    dailySubmissionCount: 3,
    carbonFootprint: 0.12 // tons of CO2
  });

  // Mock data for new features
  const [badges] = useState([
    { id: 1, type: 'first-ride', earnedAt: '2024-01-15' },
    { id: 2, type: '100km', earnedAt: '2024-01-20' },
    { id: 3, type: 'eco-warrior', earnedAt: '2024-01-25' },
    { id: 4, type: 'streak-7', earnedAt: '2024-01-30' }
  ]);

  const [leaderboard] = useState({
    weekly: [
      { id: 1, name: 'Sarah Johnson', vehicleModel: 'Tesla Model Y', miles: 156, b3trTokens: 78 },
      { id: 2, name: 'Mike Chen', vehicleModel: 'Nissan Leaf', miles: 142, b3trTokens: 71 },
      { id: 3, name: 'Emma Davis', vehicleModel: 'Tesla Model 3', miles: 128, b3trTokens: 64 },
      { id: 4, name: 'Alex Rodriguez', vehicleModel: 'Chevrolet Bolt', miles: 115, b3trTokens: 58 },
      { id: 5, name: 'John Doe', vehicleModel: 'Tesla Model 3', miles: 89, b3trTokens: 45 }
    ],
    monthly: [
      { id: 1, name: 'Sarah Johnson', vehicleModel: 'Tesla Model Y', miles: 1247, b3trTokens: 623 },
      { id: 2, name: 'Mike Chen', vehicleModel: 'Nissan Leaf', miles: 1189, b3trTokens: 595 },
      { id: 3, name: 'Emma Davis', vehicleModel: 'Tesla Model 3', miles: 1156, b3trTokens: 578 },
      { id: 4, name: 'Alex Rodriguez', vehicleModel: 'Chevrolet Bolt', miles: 1089, b3trTokens: 545 },
      { id: 5, name: 'John Doe', vehicleModel: 'Tesla Model 3', miles: 1023, b3trTokens: 512 }
    ]
  });

  const [challenges] = useState([
    {
      id: 1,
      icon: '🚗',
      title: 'Weekly Mileage Challenge',
      description: 'Drive the most miles this week',
      status: 'active',
      participants: 45,
      daysLeft: 3,
      reward: 100,
      duration: '7 days',
      requirements: ['Drive at least 50 miles', 'Use eco-driving mode', 'Complete 5 trips'],
      isJoined: true
    },
    {
      id: 2,
      icon: '🌱',
      title: 'Eco Warrior Challenge',
      description: 'Maintain 90%+ eco-driving score',
      status: 'active',
      participants: 32,
      daysLeft: 7,
      reward: 75,
      duration: '14 days',
      requirements: ['Maintain eco-driving score above 90%', 'Complete 10 trips', 'Use regenerative braking'],
      isJoined: false
    }
  ]);

  const [storeProducts] = useState([
    {
      id: 1,
      name: 'Solar Phone Charger',
      description: 'Portable solar charger for your devices',
      category: 'electronics',
      price: 50,
      stock: 25,
      ecoImpact: 'Saves 2kg CO2/month',
      features: ['100% solar powered', 'Fast charging', 'Waterproof', 'Portable design']
    },
    {
      id: 2,
      name: 'Bamboo Water Bottle',
      description: 'Eco-friendly reusable water bottle',
      category: 'accessories',
      price: 30,
      stock: 50,
      ecoImpact: 'Saves 1kg CO2/month',
      features: ['Bamboo material', 'BPA free', 'Insulated', 'Leak proof']
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      description: 'Sustainable cotton t-shirt',
      category: 'clothing',
      price: 40,
      stock: 15,
      ecoImpact: 'Saves 3kg CO2 vs conventional cotton',
      features: ['100% organic cotton', 'Fair trade certified', 'Biodegradable', 'Comfortable fit']
    }
  ]);

  const [purchaseHistory] = useState([
    {
      id: 1,
      product: { name: 'Solar Phone Charger', category: 'electronics' },
      quantity: 1,
      totalCost: 50,
      date: '2024-01-28'
    },
    {
      id: 2,
      product: { name: 'Bamboo Water Bottle', category: 'accessories' },
      quantity: 2,
      totalCost: 60,
      date: '2024-01-25'
    }
  ]);

  const [mileageHistory] = useState([
    { date: '2024-01-28', miles: 25, tokens: 12.5 },
    { date: '2024-01-27', miles: 18, tokens: 9 },
    { date: '2024-01-26', miles: 32, tokens: 16 },
    { date: '2024-01-25', miles: 15, tokens: 7.5 },
    { date: '2024-01-24', miles: 28, tokens: 14 }
  ]);

//   useEffect(() => {
//     // Check if user is logged in
//     const isLoggedIn = localStorage.getItem('userLoggedIn');
//     if (!isLoggedIn) {
//       router.push('/auth/login');
//     } else {
//       // Load user data from localStorage
//       const userName = localStorage.getItem('userName');
//       const userEmail = localStorage.getItem('userEmail');
//       if (userName && userEmail) {
//         setUser(prev => ({
//           ...prev,
//           name: userName,
//           email: userEmail
//         }));
//       }
//     }
//   }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    router.push('/auth/login');
  };

  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
    setUserAddress(address);
    localStorage.setItem('userWalletAddress', address);
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setUserAddress('');
    localStorage.removeItem('userWalletAddress');
  };

  const handleJoinChallenge = (challengeId: number) => {
    // Handle challenge joining
    console.log('Joining challenge:', challengeId);
  };

  const handlePurchase = async (productId: number, quantity: number) => {
    // Handle token purchase
    console.log('Purchasing product:', productId, 'Quantity:', quantity);
  };

  const handleBadgeShare = (message: string) => {
    // Handle badge sharing
    console.log('Badge shared:', message);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gradient-ev-green">
                ByteMe AI
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <WalletConnect
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
                isConnected={isWalletConnected}
                userAddress={userAddress}
              />
              <Link href="/dashboard/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground text-lg">Track your sustainable driving progress and earn B3TR tokens</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/50 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'gradient-ev-green text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>📊</span>
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'gradient-ev-green text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>🏆</span>
            <span>Badges</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'gradient-ev-green text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>📈</span>
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
              activeTab === 'store'
                ? 'gradient-ev-green text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>🛍️</span>
            <span>Store</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">B3TR Tokens</p>
                      <p className="text-2xl font-bold text-gradient-ev-green">{user.b3trTokens.toLocaleString()}</p>
                      <p className="text-xs text-primary">Total earned</p>
                    </div>
                    <div className="p-1 bg-primary/20 rounded-lg">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sustainable Miles</p>
                      <p className="text-2xl font-bold text-gradient-ev-light">{user.sustainableMiles.toLocaleString()}</p>
                      <p className="text-xs text-success">Total driven</p>
                    </div>
                    <div className="p-1 bg-primary/20 rounded-lg">
                      <span className="text-2xl">🚗</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift gradient-ev-nature/10 border-secondary/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CO₂ Saved</p>
                      <p className="text-2xl font-bold text-gradient-ev-light">{user.co2Saved}</p>
                      <p className="text-xs text-success">tons</p>
                    </div>
                    <div className="p-1 bg-primary/20 rounded-lg">
                      <span className="text-2xl">🌱</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift gradient-ev-fresh/10 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Rank</p>
                      <p className="text-2xl font-bold text-gradient-ev-green">#{user.currentRank}</p>
                      <p className="text-xs text-primary">This week</p>
                    </div>
                    <div className="p-1 bg-primary/20 rounded-lg">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vehicle Info & Mileage History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Last Miles Submitted</p>
                        <p className="text-2xl font-bold text-gradient-ev-green">{user.lastMiles}</p>
                      </div>
                      <div className="p-1 bg-primary/20 rounded-lg">
                        <span className="text-2xl">📊</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Last Submission</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="text-lg font-semibold text-foreground">
                            {new Date(user.lastSubmissionDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                            {new Date(user.lastSubmissionDate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="p-1 bg-primary/20 rounded-lg">
                        <span className="text-2xl">📝</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Submissions</p>
                        <p className="text-2xl font-bold text-gradient-ev-light">{user.dailySubmissionCount}</p>
                      </div>
                        <div className="p-1 bg-primary/20 rounded-lg">
                        <span className="text-2xl">📝</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Carbon Footprint</p>
                        <p className="text-2xl font-bold text-gradient-ev-light">{user.carbonFootprint}</p>
                        <p className="text-xs text-success">tons CO₂</p>
                      </div>
                      <div className="p-1 bg-primary/20 rounded-lg">
                        <span className="text-2xl">🌱</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Mileage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mileageHistory.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-foreground text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                          <p className="text-muted-foreground text-xs">{entry.miles} miles</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-semibold">+{entry.tokens} B3TR</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <Badges badges={badges} onShare={handleBadgeShare} />
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <Leaderboard 
            leaderboard={leaderboard} 
            challenges={challenges}
            userRank={{ rank: user.currentRank, miles: user.weeklyMiles }}
            onJoinChallenge={handleJoinChallenge}
          />
        )}

        {/* Store Tab */}
        {activeTab === 'store' && (
          <TokenStore 
            products={storeProducts}
            userTokens={user.b3trTokens}
            onPurchase={handlePurchase}
            purchaseHistory={purchaseHistory}
          />
        )}
      </main>
    </div>
  );
}