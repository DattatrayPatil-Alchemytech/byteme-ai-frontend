import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

//components
import { Button } from "../ui/button";
import { Copy, Wallet } from "lucide-react";
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
}

export function WalletConnect({
  title = "Get Started",
  disabled = false,
}: WalletConnectProps) {
  const { account, connectionCertificate: certificate } = useWallet();
  const { open } = useWalletModal();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

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
        dispatch(closeModal());
      } catch (error) {
        console.error("Login failed:", error);

        // Dispatch login failure
        dispatch(
          loginFailure(error instanceof Error ? error.message : "Login failed")
        );

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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account || "");
    toast.success("Wallet address copied to clipboard!");
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return account ? (
    <div className="w-full flex gap-2">
      <Button
        variant="outline"
        disabled={disabled}
        className="flex-1 justify-start bg-background border-2 border-primary/30 hover:border-primary/50 hover:bg-accent/50 text-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="h-4 w-4 mr-2 text-primary" />
        <span className="font-mono text-sm font-medium">
          {formatAddress(account)}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyAddress}
        disabled={disabled}
        className="px-3 border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Copy className="h-4 w-4 text-primary" />
      </Button>
    </div>
  ) : (
    <Button
      onClick={open}
      disabled={user.isLoading || disabled}
      size="lg"
      className="w-full gradient-ev-green hover-glow text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {user.isLoading || disabled ? (
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
