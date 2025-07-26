'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats, getSystemAnalytics, type DashboardStats, type SystemAnalytics, type UserGrowthData, type VehicleTypeData, type UploadStatusData } from '@/lib/apiHelpers/adminDashboard';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminDashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<SystemAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic chart configurations based on analytics data
  const getUserGrowthChart = () => {
    if (!analyticsData?.userGrowth?.length) {
      return {
        options: {
          chart: {
            type: 'area' as const,
            toolbar: { show: false },
            background: 'transparent'
          },
          colors: ['#10B981'],
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
            categories: ['No Data'],
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
        series: [{ name: 'User Growth', data: [0] }]
      };
    }

    const categories = analyticsData.userGrowth.map((item: UserGrowthData) => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ).reverse();
    
    const data = analyticsData.userGrowth.map((item: UserGrowthData) => parseInt(item.count)).reverse();

    return {
      options: {
        chart: {
          type: 'area' as const,
          toolbar: { show: false },
          background: 'transparent'
        },
        colors: ['#10B981'],
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
          categories,
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
      series: [{ name: 'User Growth', data }]
    };
  };

  const getVehicleTypesChart = () => {
    console.log('getVehicleTypesChart called with:', analyticsData);
    if (!analyticsData?.vehicleTypes?.length) {
      return {
        options: {
          chart: {
            type: 'donut' as const,
            background: 'transparent'
          },
          colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
          labels: ['No Data'],
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
                    label: 'Total Vehicles',
                    formatter: () => '0'
                  }
                }
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: (value: number) => `${value} vehicles`
            }
          }
        },
        series: [1]
      };
    }

    const labels = analyticsData.vehicleTypes.map((item: VehicleTypeData) => item.type);
    const data = analyticsData.vehicleTypes.map((item: VehicleTypeData) => parseInt(item.count));

    return {
      options: {
        chart: {
          type: 'donut' as const,
          background: 'transparent'
        },
        colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
        labels,
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
                  label: 'Total Vehicles',
                  formatter: () => data.reduce((sum: number, val: number) => sum + val, 0).toString()
                }
              }
            }
          }
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: (value: number) => `${value} vehicles`
          }
        }
      },
      series: data
    };
  };

  const getUploadStatusChart = () => {
    if (!analyticsData?.uploadStatus?.length) {
      return {
        options: {
          chart: {
            type: 'bar' as const,
            toolbar: { show: false },
            background: 'transparent'
          },
          colors: ['#F59E0B', '#EF4444', '#10B981'],
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: '60%'
            }
          },
          dataLabels: { enabled: false },
          xaxis: {
            categories: ['No Data'],
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
              formatter: (value: number) => `${value} uploads`
            }
          }
        },
        series: [{ name: 'Uploads', data: [0] }]
      };
    }

    const categories = analyticsData.uploadStatus.map((item: UploadStatusData) => item.status);
    const data = analyticsData.uploadStatus.map((item: UploadStatusData) => parseInt(item.count));
    
    return {
      options: {
        chart: {
          type: 'bar' as const,
          toolbar: { show: false },
          background: 'transparent'
        },
        colors: ['#F59E0B', '#EF4444', '#10B981'],
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: '60%'
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories,
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
            formatter: (value: number) => `${value} uploads`
          }
        }
      },
      series: [{ name: 'Uploads', data }]
    };
  };

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
              try {
          setIsLoading(true);
          
          try {
            const stats = await getDashboardStats();
            setDashboardStats(stats);
          } catch (statsError) {
            console.error('Stats API Error:', statsError);
            setDashboardStats({
              totalUsers: 0,
              activeUsers: 0,
              totalVehicles: 0,
              totalEvMiles: 0,
              totalCarbonSaved: 0,
              totalTokensDistributed: 0,
              weeklyRewardsDistributed: 0,
              totalUploads: 0,
              pendingUploads: 0,
              totalOrders: 0,
              pendingOrders: 0
            });
          }
          
          // Fetch analytics separately
          try {
            const analytics = await getSystemAnalytics();
            setAnalyticsData(analytics);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (analyticsError) {
            setAnalyticsData({
              userGrowth: [],
              vehicleTypes: [],
              uploadStatus: []
            });
          }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        // Instead of showing error, set default values with 0
        setDashboardStats({
          totalUsers: 0,
          activeUsers: 0,
          totalVehicles: 0,
          totalEvMiles: 0,
          totalCarbonSaved: 0,
          totalTokensDistributed: 0,
          weeklyRewardsDistributed: 0,
          totalUploads: 0,
          pendingUploads: 0,
          totalOrders: 0,
          pendingOrders: 0
        });
        
        // Set default analytics data
        setAnalyticsData({
          userGrowth: [],
          vehicleTypes: [],
          uploadStatus: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
                      Welcome back,  Admin! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Here&apos;s your comprehensive overview of ByteMe AI platform performance.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}



      {/* Global Stats Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(dashboardStats?.totalUsers || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500">Active: {(dashboardStats?.activeUsers || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-xl">
                  <span className="text-3xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total EV Miles</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {(dashboardStats?.totalEvMiles || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-500">Sustainable driving</p>
                </div>
                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <span className="text-3xl">🚗</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tokens</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {(dashboardStats?.totalTokensDistributed || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-500">B3TR distributed</p>
                </div>
                <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <span className="text-3xl">⚡</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carbon Saved</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {(dashboardStats?.totalCarbonSaved || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-500">kg CO2 saved</p>
                </div>
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                  <span className="text-3xl">🌱</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Stats */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold text-green-600">{(dashboardStats?.totalVehicles || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Registered EVs</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Uploads</p>
                <p className="text-2xl font-bold text-orange-600">{(dashboardStats?.totalUploads || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">All submissions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Pending Uploads</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboardStats?.pendingUploads || 0}</p>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Weekly Rewards</p>
                <p className="text-2xl font-bold text-blue-600">{(dashboardStats?.weeklyRewardsDistributed || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">B3TR distributed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-purple-600">{(dashboardStats?.totalOrders || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pending: {dashboardStats?.pendingOrders || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth Chart */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={getUserGrowthChart().options}
                  series={getUserGrowthChart().series}
                  type="area"
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Vehicle Types Chart */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Vehicle Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={getVehicleTypesChart().options}
                  series={getVehicleTypesChart().series}
                  type="donut"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Upload Status Chart */}
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Upload Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={getUploadStatusChart().options}
                  series={getUploadStatusChart().series}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}


    </div>
  );
} 