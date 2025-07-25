"use client";
import { Provider } from "react-redux";
import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
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
      </DAppKitProvider>
    </Provider>
  );
}
