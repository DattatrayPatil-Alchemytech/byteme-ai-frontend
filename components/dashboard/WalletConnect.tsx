'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  userAddress: string;
}

export default function WalletConnect({ onConnect, onDisconnect, isConnected, userAddress }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      onConnect(mockAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/20 rounded-lg border border-success/30">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success font-mono">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="gradient-ev-green hover:from-emerald-600 hover:to-green-700 text-white border-0"
      size="sm"
    >
      {isConnecting ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Connect Wallet</span>
        </div>
      )}
    </Button>
  );
} 