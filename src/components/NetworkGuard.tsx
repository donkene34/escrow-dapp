"use client";

import { sepolia } from "wagmi/chains";
import { useAccount, useSwitchChain } from "wagmi";

export function NetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === sepolia.id) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      <span>Mauvais réseau. Cette app fonctionne uniquement sur Sepolia.</span>
      <button
        onClick={() => switchChain({ chainId: sepolia.id })}
        disabled={isPending}
        className="shrink-0 rounded-md bg-red-500 px-3 py-1.5 font-medium text-white hover:bg-red-400 disabled:opacity-50"
      >
        {isPending ? "Changement…" : "Passer sur Sepolia"}
      </button>
    </div>
  );
}
