import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Escrow dApp",
  // Project ID WalletConnect (cloud.reown.com). "demo" = fallback, pas de connexion mobile.
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC || undefined),
  },
  ssr: true,
});
