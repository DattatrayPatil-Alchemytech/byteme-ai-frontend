"use client";
//Node Modules
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "@vechain/dapp-kit-react";

//Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout, updateProfile } from "@/redux/userSlice";

//Helpers
import { getUserProfile } from "@/lib/apiHelpers/user";

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
  const pathname = usePathname() || "";
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthDone, setIsAuthDone] = useState(false);
  const { disconnect } = useWallet();

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Initial authentication check and token refresh
  useEffect(() => {
    const checkAndRefreshAuth = async () => {
      try {
        // If we have a stored token, try to refresh it to verify it's still valid
        if (accessToken) {
          const userData = await getUserProfile();
          dispatch(updateProfile(userData));
        } else {
          disconnect();
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Clear invalid token
        dispatch(logout());
        disconnect();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Only run on initial load
    if (isCheckingAuth) {
      checkAndRefreshAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Route protection logic
  useEffect(() => {
    // Don't do route protection while we're still checking auth status
    if (isCheckingAuth) return;

    // Handle protected routes
    if (isProtectedRoute) {
      // Check authentication status
      if (!isAuthenticated || !accessToken) {
        router.push("/");
        return;
      }
    }

    // Optional: Redirect authenticated users from landing page to dashboard
    // if (isAuthenticated && isPublicRoute && pathname === "/") {
    //   router.push("/dashboard");
    //   return;
    // }

    // Mark auth check as complete
    setIsAuthDone(true);
  }, [
    isCheckingAuth,
    isAuthenticated,
    accessToken,
    pathname,
    router,
    isProtectedRoute,
    isPublicRoute,
  ]);

  // Show loading state while checking authentication or during redirects
  if (isCheckingAuth || !isAuthDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Block protected routes if not authenticated (safety check)
  if (isProtectedRoute && (!isAuthenticated || !accessToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
