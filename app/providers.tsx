"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import dynamic from "next/dynamic";

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
  return (
    <DAppKitProvider
      node="https://testnet.vechain.org/"
      logLevel={"DEBUG"}
      usePersistence
      requireCertificate // ← force certificate signing
      connectionCertificate={{
        message: {
          purpose: "identification",
          payload: { type: "text", content: "test" },
        },
      }}
    >
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>

      {/* Centralized Modal Management */}
      <ModalWrapper />
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
