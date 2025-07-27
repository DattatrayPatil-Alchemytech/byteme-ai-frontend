"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/auth/AuthProvider";

// Dynamically import DAppKitProvider to avoid SSR issues
const DAppKitProvider = dynamic(
  () =>
    import("@vechain/dapp-kit-react").then((mod) => ({
      default: mod.DAppKitProvider,
    })),
  {
    ssr: false,
  }
);

// Dynamically import ModalWrapper to avoid SSR issues
const ModalWrapper = dynamic(() => import("@/components/modals/ModalWrapper"), {
  ssr: false,
  loading: () => null,
});

// Inner component to access Redux dispatch
function ProvidersInner({ children }: { children: React.ReactNode }) {
  const nodeURL =
    process.env.NEXT_PUBLIC_VECHAIN_NODE_URL || "https://testnet.vechain.org/";
  const content =
    process.env.NEXT_PUBLIC_CONNECTION_CERTIFICATE_CONTENT ||
    "Sign this message to authenticate with Drive & Earn";
  return (
    <DAppKitProvider
      node={nodeURL}
      usePersistence
      requireCertificate
      connectionCertificate={{
        message: {
          purpose: "identification",
          payload: {
            type: "text",
            content: content,
          },
        },
      }}
    >
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>

      {/* Centralized Modal Management */}
      <ModalWrapper />

      {/* React Hot Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </DAppKitProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ProvidersInner>{children}</ProvidersInner>
    </Provider>
  );
}
