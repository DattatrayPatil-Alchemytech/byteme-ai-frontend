"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Code, Settings, Wallet, Database, Shield, Globe } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/modals/Modal";
import contractABI from "@/lib/contractABI.json";
export default function AdminSettingsPage() {
  const [showABIModal, setShowABIModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<string>("");

  // Environment variables
  const network = process.env.NEXT_PUBLIC_VECHAIN_NETWORK || "vechain_testnet";
  const deployer = process.env.NEXT_PUBLIC_VECHAIN_DEPLOYER || "";
  const explorerUrl = process.env.NEXT_PUBLIC_VECHAIN_EXPLORER_URL || "";
  const inspectorUrl = process.env.NEXT_PUBLIC_VECHAIN_INSPECTOR_URL || "";
  const governanceUrl = process.env.NEXT_PUBLIC_VECHAIN_GOVERNANCE || "";
  const appId = process.env.NEXT_PUBLIC_VECHAIN_APP_ID || "";
  
  const contracts = {
    "EVDrive V2": process.env.NEXT_PUBLIC_CONTRACT_EVDRIVE_V2 || "",
    "Reward Token": process.env.NEXT_PUBLIC_CONTRACT_REWARD_TOKEN || "",
    "X2Earn Rewards Pool": process.env.NEXT_PUBLIC_CONTRACT_X2EARN_REWARDS_POOL || "",
    "X2Earn Apps": process.env.NEXT_PUBLIC_CONTRACT_X2EARN_APPS || "",
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`, {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.error("Copy failed:", error);
    }
  };

  const openExplorerLink = (address: string) => {
    const url = `${explorerUrl}accounts/${address}`;
    window.open(url, "_blank");
  };

  const openGovernancePortal = (appId?: string) => {
    const url = `${governanceUrl}${appId || ''}`;
    window.open(url, "_blank");
  };

  const openInspector = () => {
    window.open(inspectorUrl, "_blank");
  };

  const handleViewABI = (contractName: string) => {
    setSelectedContract(contractName);
    setShowABIModal(true);
  };

  // Contract ABI - only available for EVDrive V2
  const getContractABI = (contractName: string) => {
    if (contractName === "EVDrive V2") {
      return JSON.stringify(contractABI, null, 2);
    }
    return "ABI not available for this contract";
  };

  const hasABI = (contractName: string) => {
    return contractName === "EVDrive V2";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage blockchain configuration and contract settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Network & Configuration */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg">Network Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Network</p>
                  <p className="font-medium capitalize text-sm sm:text-base">{network.replace('_', ' ')}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{network}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">Deployer Address</p>
                  <p className="font-mono text-xs sm:text-sm truncate">{deployer}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(deployer, "Deployer Address")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openExplorerLink(deployer)}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">App ID</p>
                  <p className="font-mono text-xs truncate">{appId}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(appId, "App ID")}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-9 sm:h-10"
                onClick={() => {openGovernancePortal()}}
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Go to VeChain Dashboard
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-sm h-9 sm:h-10"
                onClick={() => {openGovernancePortal(`/apps/${appId}`)}}
              >
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Governance Portal
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-sm h-9 sm:h-10"
                onClick={openInspector}
              >
                <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                VeChain Inspector
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Smart Contracts */}
        <Card className="mt-4 sm:mt-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-lg">Smart Contracts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(contracts).map(([name, address]) => (
                <div key={name} className="p-3 sm:p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate mr-2">{name}</h3>
                    <Badge variant="outline" className="text-xs flex-shrink-0">Contract</Badge>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="bg-muted/50 rounded p-2 overflow-hidden">
                      <p className="font-mono text-xs text-muted-foreground break-all">
                        {address}
                      </p>
                    </div>
                    
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(address, name)}
                        className="flex-1 h-8 text-xs"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Copy</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openExplorerLink(address)}
                        className="flex-1 h-8 text-xs"
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Explorer</span>
                      </Button>
                      {hasABI(name) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewABI(name)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">ABI</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ABI Modal */}
        <Modal
          show={showABIModal}
          title={`${selectedContract} - Contract ABI`}
          handleClose={() => setShowABIModal(false)}
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Contract ABI for {selectedContract}
              </p>
              {hasABI(selectedContract) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(getContractABI(selectedContract), "Contract ABI")}
                  className="self-start sm:self-auto"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Copy ABI
                </Button>
              )}
            </div>
            
            <div className="bg-muted rounded-lg p-2 sm:p-4 max-h-64 sm:max-h-96 overflow-y-auto">
              <pre className="text-xs text-foreground font-mono whitespace-pre-wrap break-all">
                {getContractABI(selectedContract)}
              </pre>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowABIModal(false)}
                className="text-sm"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
} 