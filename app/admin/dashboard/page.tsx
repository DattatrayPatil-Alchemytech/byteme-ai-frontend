'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminDashboardPage() {
  const [adminUsername, setAdminUsername] = useState('');

  // Comprehensive Global Stats
  const [globalStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    newUsersThisMonth: 156,
    totalMiles: 45678,
    totalTokens: 23450,
    pendingSubmissions: 23,
    totalRewards: 15600,
    monthlyGrowth: 12.5,
    weeklyGrowth: 8.3,
    averageMilesPerUser: 36.7,
    totalVehicles: 1342,
    carbonOffset: 18234, // kg CO2
    totalTransactions: 8923,
    averageTokensPerUser: 18.8,
    platformRevenue: 45600, // USD
    userRetentionRate: 87.3,
    dailyActiveUsers: 234,
    weeklyActiveUsers: 567,
    monthlyActiveUsers: 892
  });

  // Top 10 Users with more detailed data
  const [topUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      vehicleModel: 'Tesla Model Y',
      totalMiles: 1247,
      totalTokens: 623,
      rank: 1,
      lastActive: '2 hours ago',
      joinDate: '2024-01-15',
      badges: ['Eco Warrior', 'Mile Master', 'Early Adopter'],
      carbonOffset: 498,
      submissions: 45,
      streak: 28
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      vehicleModel: 'Nissan Leaf',
      totalMiles: 1189,
      totalTokens: 595,
      rank: 2,
      lastActive: '1 hour ago',
      joinDate: '2024-02-03',
      badges: ['Eco Warrior', 'Consistent Driver'],
      carbonOffset: 476,
      submissions: 42,
      streak: 21
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma@example.com',
      vehicleModel: 'Tesla Model 3',
      totalMiles: 1156,
      totalTokens: 578,
      rank: 3,
      lastActive: '30 minutes ago',
      joinDate: '2024-01-28',
      badges: ['Mile Master', 'Weekend Warrior'],
      carbonOffset: 462,
      submissions: 38,
      streak: 15
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex@example.com',
      vehicleModel: 'Chevrolet Bolt',
      totalMiles: 1089,
      totalTokens: 545,
      rank: 4,
      lastActive: '45 minutes ago',
      joinDate: '2024-02-10',
      badges: ['Eco Warrior'],
      carbonOffset: 436,
      submissions: 35,
      streak: 12
    },
    {
      id: 5,
      name: 'John Doe',
      email: 'john@example.com',
      vehicleModel: 'Tesla Model 3',
      totalMiles: 1023,
      totalTokens: 512,
      rank: 5,
      lastActive: '1 day ago',
      joinDate: '2024-01-20',
      badges: ['Early Adopter'],
      carbonOffset: 409,
      submissions: 32,
      streak: 8
    },
    {
      id: 6,
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      vehicleModel: 'Ford Mustang Mach-E',
      totalMiles: 987,
      totalTokens: 494,
      rank: 6,
      lastActive: '3 hours ago',
      joinDate: '2024-02-15',
      badges: ['Speed Demon'],
      carbonOffset: 395,
      submissions: 29,
      streak: 18
    },
    {
      id: 7,
      name: 'David Kim',
      email: 'david@example.com',
      vehicleModel: 'Hyundai Kona Electric',
      totalMiles: 945,
      totalTokens: 473,
      rank: 7,
      lastActive: '5 hours ago',
      joinDate: '2024-01-10',
      badges: ['Eco Warrior', 'Consistent Driver'],
      carbonOffset: 378,
      submissions: 27,
      streak: 22
    },
    {
      id: 8,
      name: 'Maria Garcia',
      email: 'maria@example.com',
      vehicleModel: 'Volkswagen ID.4',
      totalMiles: 912,
      totalTokens: 456,
      rank: 8,
      lastActive: '2 days ago',
      joinDate: '2024-02-01',
      badges: ['Family Driver'],
      carbonOffset: 365,
      submissions: 25,
      streak: 14
    },
    {
      id: 9,
      name: 'James Wilson',
      email: 'james@example.com',
      vehicleModel: 'Tesla Model S',
      totalMiles: 876,
      totalTokens: 438,
      rank: 9,
      lastActive: '1 day ago',
      joinDate: '2024-01-25',
      badges: ['Luxury Driver', 'Early Adopter'],
      carbonOffset: 350,
      submissions: 23,
      streak: 11
    },
    {
      id: 10,
      name: 'Anna Thompson',
      email: 'anna@example.com',
      vehicleModel: 'BMW i4',
      totalMiles: 834,
      totalTokens: 417,
      rank: 10,
      lastActive: '4 hours ago',
      joinDate: '2024-02-08',
      badges: ['Premium Driver'],
      carbonOffset: 334,
      submissions: 21,
      streak: 16
    }
  ]);

  // Last Claims with detailed information
  const [lastClaims] = useState([
    {
      id: 1,
      user: 'Sarah Johnson',
      email: 'sarah@example.com',
      claimType: 'Odometer Submission',
      miles: 25,
      tokens: 12.5,
      status: 'approved',
      time: '2 minutes ago',
      vehicle: 'Tesla Model Y',
      carbonOffset: 10,
      submissionId: 'SUB-2024-001'
    },
    {
      id: 2,
      user: 'Mike Chen',
      email: 'mike@example.com',
      claimType: 'Badge Achievement',
      badge: 'Eco Warrior',
      tokens: 50,
      status: 'approved',
      time: '5 minutes ago',
      vehicle: 'Nissan Leaf',
      carbonOffset: 0,
      submissionId: 'BADGE-2024-001'
    },
    {
      id: 3,
      user: 'Emma Davis',
      email: 'emma@example.com',
      claimType: 'Token Purchase',
      item: 'Solar Phone Charger',
      tokens: 50,
      status: 'completed',
      time: '10 minutes ago',
      vehicle: 'Tesla Model 3',
      carbonOffset: 0,
      submissionId: 'PURCHASE-2024-001'
    },
    {
      id: 4,
      user: 'Alex Rodriguez',
      email: 'alex@example.com',
      claimType: 'Odometer Submission',
      miles: 18,
      tokens: 9,
      status: 'pending',
      time: '15 minutes ago',
      vehicle: 'Chevrolet Bolt',
      carbonOffset: 7.2,
      submissionId: 'SUB-2024-002'
    },
    {
      id: 5,
      user: 'Lisa Wang',
      email: 'lisa@example.com',
      claimType: 'Weekly Bonus',
      bonus: 'Perfect Week',
      tokens: 25,
      status: 'approved',
      time: '20 minutes ago',
      vehicle: 'Ford Mustang Mach-E',
      carbonOffset: 0,
      submissionId: 'BONUS-2024-001'
    },
    {
      id: 6,
      user: 'David Kim',
      email: 'david@example.com',
      claimType: 'Odometer Submission',
      miles: 32,
      tokens: 16,
      status: 'approved',
      time: '25 minutes ago',
      vehicle: 'Hyundai Kona Electric',
      carbonOffset: 12.8,
      submissionId: 'SUB-2024-003'
    },
    {
      id: 7,
      user: 'Maria Garcia',
      email: 'maria@example.com',
      claimType: 'Referral Bonus',
      referral: 'New User Signup',
      tokens: 100,
      status: 'approved',
      time: '30 minutes ago',
      vehicle: 'Volkswagen ID.4',
      carbonOffset: 0,
      submissionId: 'REFERRAL-2024-001'
    },
    {
      id: 8,
      user: 'James Wilson',
      email: 'james@example.com',
      claimType: 'Odometer Submission',
      miles: 15,
      tokens: 7.5,
      status: 'pending',
      time: '35 minutes ago',
      vehicle: 'Tesla Model S',
      carbonOffset: 6,
      submissionId: 'SUB-2024-004'
    },
    {
      id: 9,
      user: 'Anna Thompson',
      email: 'anna@example.com',
      claimType: 'Badge Achievement',
      badge: 'Premium Driver',
      tokens: 75,
      status: 'approved',
      time: '40 minutes ago',
      vehicle: 'BMW i4',
      carbonOffset: 0,
      submissionId: 'BADGE-2024-002'
    },
    {
      id: 10,
      user: 'John Doe',
      email: 'john@example.com',
      claimType: 'Odometer Submission',
      miles: 28,
      tokens: 14,
      status: 'approved',
      time: '45 minutes ago',
      vehicle: 'Tesla Model 3',
      carbonOffset: 11.2,
      submissionId: 'SUB-2024-005'
    }
  ]);

  // Chart configurations with proper TypeScript types
  const userGrowthChart = {
    options: {
      chart: {
        type: 'area' as const,
        toolbar: { show: false },
        background: 'transparent'
      },
      colors: ['#10B981', '#34D399'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth' as const,
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#6B7280' } }
      },
      yaxis: {
        labels: { style: { colors: '#6B7280' } }
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 5
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => `${value} users`
        }
      }
    },
    series: [
      {
        name: 'Total Users',
        data: [450, 520, 610, 720, 850, 920, 1050, 1120, 1180, 1247]
      },
      {
        name: 'Active Users',
        data: [320, 380, 450, 520, 610, 680, 750, 820, 870, 892]
      }
    ]
  };

  const milesChart = {
    options: {
      chart: {
        type: 'bar' as const,
        toolbar: { show: false },
        background: 'transparent'
      },
      colors: ['#10B981'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%'
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#6B7280' } }
      },
      yaxis: {
        labels: { 
          style: { colors: '#6B7280' },
          formatter: (value: number) => `${value}k`
        }
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 5
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => `${value}k miles`
        }
      }
    },
    series: [
      {
        name: 'Total Miles',
        data: [2.1, 2.8, 3.2, 3.8, 4.2, 4.8, 5.1, 5.6, 6.2, 6.8, 7.3, 7.8]
      }
    ]
  };

  const tokensDistributionChart = {
    options: {
      chart: {
        type: 'donut' as const,
        background: 'transparent'
      },
      colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
      labels: ['Eco Warriors', 'Mile Masters', 'Early Adopters', 'Consistent Drivers', 'Others'],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Tokens',
                formatter: () => '23,450 B3TR'
              }
            }
          }
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => `${value} B3TR`
        }
      }
    },
    series: [45, 25, 15, 10, 5]
  };

  const weeklyActivityChart = {
    options: {
      chart: {
        type: 'line' as const,
        toolbar: { show: false },
        background: 'transparent'
      },
      colors: ['#F59E0B', '#10B981'],
      stroke: {
        curve: 'smooth' as const,
        width: 3
      },
      markers: {
        size: 6,
        colors: ['#F59E0B', '#10B981'],
        strokeColors: '#1F2937',
        strokeWidth: 2
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: { style: { colors: '#6B7280' } }
      },
      yaxis: {
        labels: { style: { colors: '#6B7280' } }
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 5
      },
      tooltip: {
        theme: 'dark'
      }
    },
    series: [
      {
        name: 'Submissions',
        data: [45, 52, 38, 67, 89, 76, 54]
      },
      {
        name: 'Tokens Earned',
        data: [225, 260, 190, 335, 445, 380, 270]
      }
    ]
  };

  useEffect(() => {
    // Get admin username from localStorage
    const username = localStorage.getItem('adminUsername');
    if (username) {
      setAdminUsername(username);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {adminUsername}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Here&apos;s your comprehensive overview of ByteMe AI platform performance.
        </p>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-green-600">
                  {globalStats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-green-500">+{globalStats.monthlyGrowth}% this month</p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Miles</p>
                <p className="text-3xl font-bold text-blue-600">
                  {globalStats.totalMiles.toLocaleString()}
                </p>
                <p className="text-xs text-blue-500">Sustainable driving</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <span className="text-3xl">🚗</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                <p className="text-3xl font-bold text-purple-600">
                  {globalStats.totalTokens.toLocaleString()}
                </p>
                <p className="text-xs text-purple-500">B3TR distributed</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <span className="text-3xl">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Carbon Offset</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {globalStats.carbonOffset.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-500">kg CO2 saved</p>
              </div>
              <div className="p-4 bg-emerald-100 rounded-xl">
                <span className="text-3xl">🌱</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{globalStats.activeUsers}</p>
              <p className="text-xs text-gray-500">Daily: {globalStats.dailyActiveUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Pending Submissions</p>
              <p className="text-2xl font-bold text-yellow-600">{globalStats.pendingSubmissions}</p>
              <p className="text-xs text-gray-500">Awaiting review</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-blue-600">{globalStats.userRetentionRate}%</p>
              <p className="text-xs text-gray-500">Monthly average</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
              <p className="text-2xl font-bold text-purple-600">${globalStats.platformRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total earnings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={userGrowthChart.options}
              series={userGrowthChart.series}
              type="area"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Miles Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Monthly Miles Driven</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={milesChart.options}
              series={milesChart.series}
              type="bar"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tokens Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Token Distribution by User Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={tokensDistributionChart.options}
              series={tokensDistributionChart.series}
              type="donut"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={weeklyActivityChart.options}
              series={weeklyActivityChart.series}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Users */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Top 10 Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Miles</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tokens</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Carbon Offset</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Badges</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{user.vehicleModel}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-600">{user.totalMiles.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-purple-600">{user.totalTokens}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-600">{user.carbonOffset} kg</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.badges.map((badge, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{user.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Last Claims */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Claims & Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lastClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {claim.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{claim.user}</p>
                    <p className="text-sm text-gray-600">{claim.claimType}</p>
                    <p className="text-xs text-gray-500">ID: {claim.submissionId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    {claim.miles && (
                      <span className="text-sm font-semibold text-blue-600">+{claim.miles} miles</span>
                    )}
                    {claim.tokens && (
                      <span className="text-sm font-semibold text-purple-600">+{claim.tokens} B3TR</span>
                    )}
                    {claim.badge && (
                      <span className="text-sm font-semibold text-yellow-600">🏆 {claim.badge}</span>
                    )}
                    {claim.bonus && (
                      <span className="text-sm font-semibold text-green-600">🎁 {claim.bonus}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                    <span className="text-xs text-gray-500">{claim.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 