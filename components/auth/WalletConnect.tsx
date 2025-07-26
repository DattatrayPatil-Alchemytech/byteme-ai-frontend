import {
  useWallet,
  useWalletModal,
  WalletButton,
} from "@vechain/dapp-kit-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

//components
import { Button } from "../ui/button";
import toast from "react-hot-toast";

//redux
import { closeModal, openModal } from "@/redux/modalSlice";
import { loginSuccess, loginStart, loginFailure } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

//api
import { verifyLogin } from "@/lib/apiHelpers/user";
import { RootState } from "@/redux/store";

export function WalletConnect({ title = "Get Started" }) {
  const { account, connectionCertificate } = useWallet();
  const { open } = useWalletModal();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (connectionCertificate && account && !user.isAuthenticated) {
      dispatch(loginStart());

      try {
        // Validate required fields
        if (!connectionCertificate.signature) {
          throw new Error("No signature available in connection certificate");
        }

        // Convert VeChain connection certificate to our signature format
        const signatureData = {
          purpose: connectionCertificate.purpose,
          payload: connectionCertificate.payload,
          signature: connectionCertificate.signature,
          signer: account, // wallet address
          domain: connectionCertificate.domain,
          timestamp: connectionCertificate.timestamp,
        };

        // Call our login API
        const loginResponse = await verifyLogin(signatureData);

        // Update Redux with user data and token
        dispatch(loginSuccess(loginResponse));

        // Show success message
        toast.success(`Welcome back, ${loginResponse.user.name}!`);

        // Navigate to dashboard
        router.push("/dashboard");

        // Optional: Open profile completion modal for new users
        if (loginResponse?.user) {
          dispatch(
            openModal({
              modalType: "USER_MODAL",
              title: "Welcome! Complete Your Profile",
            })
          );
        }
      } catch (error) {
        console.error("Login failed:", error);

        // Dispatch login failure
        dispatch(
          loginFailure(error instanceof Error ? error.message : "Login failed")
        );

        // Toast error is already handled by the API middleware
        // but we can add a custom message here if needed
        toast.error("Login failed. Please try connecting your wallet again.");
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  // Handle wallet connection and login
  useEffect(() => {
    handleLogin();
  }, [connectionCertificate, account, dispatch, router]);

  const handleWalletConnect = () => {
    dispatch(closeModal());
    open();
  };

  return account ? (
    <div className="w-full">
      <WalletButton />
    </div>
  ) : (
    <Button
      onClick={handleWalletConnect}
      disabled={isLoggingIn}
      size="lg"
      className="w-full gradient-ev-green hover-glow text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingIn ? "Connecting..." : title}
    </Button>
  );
}

export default WalletConnect;
