"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { adminLogout } from "@/redux/adminSlice";
import { RootState } from "@/redux/store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, admin } = useSelector(
    (state: RootState) => state.admin
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: "📊", path: "/admin/dashboard" },
    { id: "users", label: "Users", icon: "👥", path: "/admin/users" },
    { id: "badges", label: "Badges", icon: "🏅", path: "/admin/badges" },
    { id: "orders", label: "Orders", icon: "📦", path: "/admin/orders" },
    { id: "products", label: "Products", icon: "🛍️", path: "/admin/products" },
    {
      id: "challenges",
      label: "Challenges",
      icon: "🎯",
      path: "/admin/challenges",
    },
    { id: "rewards", label: "Rewards", icon: "🏆", path: "/admin/rewards" },
    { id: "settings", label: "Settings", icon: "⚙️", path: "/admin/settings" },
  ];

  // Check if we're on the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Only check login status if not on login page
    if (!isLoginPage && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router, isLoginPage, isAuthenticated]);

  const handleLogout = () => {
    // Clear admin data from Redux
    dispatch(adminLogout());
    router.push("/admin/login");
  };

  const getActiveTab = () => {
    if (pathname === "/admin" || pathname === "/admin/dashboard")
      return "overview";
    if (pathname?.startsWith("/admin/users")) return "users";
    if (pathname?.startsWith("/admin/orders")) return "orders";
    if (pathname?.startsWith("/admin/products")) return "products";
    if (pathname?.startsWith("/admin/badges")) return "badges";
    if (pathname?.startsWith("/admin/challenges")) return "challenges";
    if (pathname?.startsWith("/admin/rewards")) return "rewards";
    if (pathname?.startsWith("/admin/settings")) return "settings";
    return "";
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Sidebar - Only show if not on login page */}
      {!isLoginPage && (
        <>
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/90 backdrop-blur-xl border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ByteMe AI
                </h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-1 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      getActiveTab() === item.id
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Footer - Always at bottom */}
              <div className="p-3 border-t border-border/50 mt-auto bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm">
                {/* Admin Profile Card */}
                <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-2 mb-2 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-4 translate-x-4"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-md flex items-center justify-center shadow-lg shadow-green-500/25">
                          <span className="text-white text-xs font-bold">
                            {admin?.username?.charAt(0).toUpperCase() || "A"}
                          </span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white dark:border-slate-900 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="capitalize mx-2 text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {admin?.username || "Admin"}
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="w-1 h-1 mt-1 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Online
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                      <ThemeToggle className="!border !border-gray-400 rounded-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 group-hover:scale-105" />
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="relative group">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full h-10 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/50 dark:hover:to-pink-900/50 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-sm font-medium">Sign Out</span>
                    </div>
                  </Button>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main Content */}
      <div className={isLoginPage ? "" : "lg:ml-64"}>
        {/* Top Bar - Only show if not on login page */}
        {!isLoginPage && (
          <header className="bg-card/90 backdrop-blur-xl border-b border-border p-4 lg:hidden shadow-sm sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <ThemeToggle className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50" />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  title="Logout"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <main className={isLoginPage ? "" : "p-6"}>{children}</main>
      </div>
    </div>
  );
}
