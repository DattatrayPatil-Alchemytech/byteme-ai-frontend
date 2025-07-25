"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/redux/store";
import { loginSuccess, logout } from "@/redux/userSlice";
import { refreshToken } from "@/lib/apiHelpers/user";
import toast from "react-hot-toast";
import { useWallet } from "@vechain/dapp-kit-react";

interface AuthProviderProps {
  children: React.ReactNode;
}

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/history"];
const PUBLIC_ROUTES = ["/"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { account } = useWallet();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Initial authentication check and token refresh
  useEffect(() => {
    const checkAndRefreshAuth = async () => {
      try {
        // If we have a stored token, try to refresh it to verify it's still valid
        if (accessToken && !isAuthenticated) {
          console.log("Found stored token, attempting to refresh...");
          const refreshResponse = await refreshToken();
          dispatch(loginSuccess(refreshResponse));
          console.log("Token refreshed successfully");
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Clear invalid token
        dispatch(logout());
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Only run on initial load
    if (isCheckingAuth) {
      checkAndRefreshAuth();
    }
  }, [accessToken, isAuthenticated, dispatch, isCheckingAuth]);

  // Route protection logic
  useEffect(() => {
    // Don't do route protection while we're still checking auth status
    if (isCheckingAuth) return;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // Handle protected routes
    if (isProtectedRoute) {
      // Check wallet connection first
      // if (!account) {
      //   router.push("/");
      // }

      // Check authentication status
      // if (!isAuthenticated || !accessToken) {
      //   router.push("/");
      //   return;
      // }
    }

    // Optional: Redirect authenticated users from landing page to dashboard
    // if (isAuthenticated && isPublicRoute && pathname === "/") {
    //   router.push("/dashboard");
    // }
  }, [isCheckingAuth, isAuthenticated, accessToken, account, pathname, router]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
