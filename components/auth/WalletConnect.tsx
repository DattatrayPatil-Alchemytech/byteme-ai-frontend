import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

//components
import { Button } from "../ui/button";
import toast from "react-hot-toast";

//redux
import { closeModal, openModal } from "@/redux/modalSlice";
import { loginSuccess, loginStart, loginFailure } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

//api
import {
  verifySignature,
  type SignatureVerificationPayload,
} from "@/lib/apiHelpers/user";
import { RootState } from "@/redux/store";

interface WalletConnectProps {
  title?: string;
  disabled?: boolean;
  cbTitle?: string;
  cb?: () => void;
  className?: string;
}

export function WalletConnect({
  title = "Connect Wallet",
  disabled = false,
  cbTitle = "Go To Dashboard",
  cb,
  className = "",
}: WalletConnectProps) {
  const { account, connectionCertificate: certificate } = useWallet();
  const { open } = useWalletModal();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { disconnect } = useWallet();

  const handleLogin = async () => {
    if (certificate && account && !user.isAuthenticated) {
      dispatch(loginStart());

      try {
        // Validate required fields
        if (!certificate.signature) {
          throw new Error("No signature available in connection certificate");
        }
        // Create signature verification payload according to required structure
        const signaturePayload: SignatureVerificationPayload = {
          certificate,
        };
        // Call our signature verification API
        const loginResponse = await verifySignature(signaturePayload);

        dispatch(loginSuccess(loginResponse));
        const message = loginResponse?.user?.username
          ? `👋 Welcome back, ${loginResponse.user.username}!`
          : " 🎉 Welcome to Drive & Earn!";
        toast.success(message);
        if (!loginResponse?.user?.email || !loginResponse?.user?.username) {
          setTimeout(() => {
            dispatch(
              openModal({
                modalType: "USER_MODAL",
                title: "Welcome! Complete Your Profile",
              })
            );
          }, 300);
        }
        //close if any modal
        dispatch(closeModal());
        router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);

        // Dispatch login failure
        dispatch(
          loginFailure(error instanceof Error ? error.message : "Login failed")
        );
        disconnect();

        // Toast error is already handled by the API middleware
        // but we can add a custom message here if needed
        toast.error("Login failed. Please try connecting your wallet again.");
      }
    }
  };

  // Handle wallet connection and login
  useEffect(() => {
    handleLogin();
  }, [certificate]);

  const handleCB = () => {
    if (cb) {
      cb();
    } else {
      router.push("/dashboard");
    }
  };

  if (account && user.isAuthenticated) {
    return (
      <Button
        onClick={handleCB}
        size="lg"
        className={
          className ||
          `w-full gradient-ev-green hover-glow text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`
        }
      >
        {cbTitle}
      </Button>
    );
  }

  return (
    <Button
      onClick={open}
      disabled={user.isLoading || disabled}
      size="lg"
      className={
        className ||
        "w-full gradient-ev-green hover-glow text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {user.isLoading || disabled || (account && !user.isAuthenticated) ? (
        <>
          <span className="inline-block animate-spin mr-2">⏳</span>
          Connecting...
        </>
      ) : (
        title
      )}
    </Button>
  );
}

export default WalletConnect;
