"use client";
import { notFound } from "next/navigation";
import { use, useEffect } from "react";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Calendar,
  BadgeCheck,
  Wallet,
  User,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getUserDetails, type AdminUser, toggleUserStatus} from "@/lib/apiHelpers/adminUsers";


export default function UserViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // All hooks must be called before any early returns
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [toggleLoading, setToggleLoading] = useState(false);

  const resolvedParams = use(params);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await getUserDetails(resolvedParams.id);
        setUser(userData);
        
        // // Fetch vehicle data and console log the response
        // try {
        //   const vehicleData = await getUserVehicles(resolvedParams.id);
        //   console.log('Vehicle API Response:', vehicleData);
        // } catch (vehicleErr) {
        //   console.error('Failed to fetch vehicles:', vehicleErr);
        // }
        //  try {
        //   const uploadData = await getUserUploads(resolvedParams.id);
        //   console.log('Vehicle API Response:', uploadData);
        // } catch (uploadErr) {
        //   console.error('Failed to fetch vehicles:', uploadErr);
        // }
        
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [resolvedParams.id]);



  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/admin/users")} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Details</h1>
            <p className="text-muted-foreground">Loading user information...</p>
          </div>
        </div>
        <TableSkeleton rows={8} columns={6} />
      </div>
    );
  }

  if (error || !user) {
    return notFound();
  }

  // Dashboard summary data for this user
  const summary = {
    tokens: user.b3trBalance,
    miles: user.totalMileage,
    co2: user.totalCarbonSaved,
    tier: user.currentTier,
  };



  const handleBack = () => {
    router.push("/admin/users");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
          <p className="text-muted-foreground">
            View and manage user information
          </p>
        </div>
      </div>
      {/* User Basic Details Card - Top of Page */}
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 text-foreground">
            <User className="text-primary" size={32} />
            <span className="text-2xl font-extrabold text-gradient-ev-green tracking-tight">
              {user.email}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="text-primary" size={20} />
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="text-primary" size={20} />
              <span className="font-mono text-xs">
                {user.walletAddress}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-primary" size={20} />
              <span
                className={
                  user.isActive
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={async () => {
                  setToggleLoading(true);
                  try {
                    await toggleUserStatus(user.id);
                    // Refetch user details
                    const updated = await getUserDetails(user.id);
                    setUser(updated);
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (err) {
                    // Optionally show error
                  } finally {
                    setToggleLoading(false);
                  }
                }}
                disabled={toggleLoading}
                className={`ml-2 px-3 py-1 rounded text-xs font-semibold border transition-colors duration-150 ${
                  user.isActive
                    ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                    : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                } ${toggleLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {toggleLoading
                  ? "Updating..."
                  : user.isActive
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              <span>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-primary" size={20} />
              <span className="capitalize">{user.currentTier} Tier</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* User Overview Summary Cards with dashboard icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
        {[
          {
            value: summary.tokens.toFixed(2),
            label: "B3TR Balance",
            icon: "⚡",
          },
          {
            value: summary.miles.toLocaleString(),
            label: "Total Mileage",
            icon: "🚗",
          },
          {
            value: summary.co2.toFixed(1),
            label: "Carbon Saved (kg)",
            icon: "🌱",
          },
          {
            value: summary.tier.charAt(0).toUpperCase() + summary.tier.slice(1),
            label: "Current Tier",
            icon: "🏆",
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="bg-card/80 backdrop-blur-sm border-0 shadow-lg flex flex-col items-center p-6 hover:shadow-xl transition-all"
          >
            <CardContent className="flex flex-col items-center p-0">
              <div className="text-3xl font-extrabold text-gradient-ev-green animate-pulse">
                {item.value}
              </div>
              <div className="text-muted-foreground text-sm">{item.label}</div>
              <div className="mt-2 p-2 bg-primary/20 rounded-lg text-2xl">
                {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Vehicles section - commented out as requested
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full mb-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="flex gap-4 min-w-[600px] sm:min-w-0">
              {mockUserHistory.slice(0, 20).map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="flex-shrink-0 bg-card/80 border-0 shadow p-4 flex flex-col items-center min-w-[160px] max-w-[180px] w-full transition-transform transition-shadow duration-300 hover:scale-[1.03] hover:shadow-2xl"
                >
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-muted rounded-md mb-2 border border-muted">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.vehicle}
                      width={96}
                      height={96}
                      className="w-full h-full rounded-md"
                    />
                  </div>
                  <div className="font-semibold text-center text-base truncate w-full text-foreground">
                    {vehicle.vehicle}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-center capitalize">
                    {vehicle.type} EV
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="Search vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-border bg-background text-foreground rounded-full px-5 py-3 w-full sm:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted/60 placeholder:text-muted-foreground"
            />
            <Select
              value={vehicleFilter}
              onChange={setVehicleFilter}
              options={[...vehicleOptions]}
              placeholder="All Vehicles"
              className="bg-background text-foreground border border-border hover:bg-muted/60"
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered as unknown as Record<string, unknown>[]}
          />
        </CardContent>
      </Card>
      */}
    </div>
  );
}
