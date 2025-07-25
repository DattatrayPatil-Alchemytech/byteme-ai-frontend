import {
  useWallet,
  useWalletModal,
  WalletButton,
} from "@vechain/dapp-kit-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "../ui/button";

export function WalletConnect() {
  const { account, connectionCertificate } = useWallet();
  const { open } = useWalletModal();
  const router = useRouter();

  // 4. When connectionCertificate arrives, POST it back to your backend
  useEffect(() => {
    if (connectionCertificate) {
    }
  }, [connectionCertificate]);

  return account ? (
    <WalletButton />
  ) : (
    <Button
      onClick={open}
      size="lg"
      className="gradient-ev-green hover-glow text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      Get Started
    </Button>
  );
}

export default WalletConnect;
