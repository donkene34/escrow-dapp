"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ActiveRole } from "@/components/ActiveRole";

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔐</span>
          <span className="font-semibold">Freelance Escrow</span>
          <span className="hidden rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400 sm:inline">Sepolia</span>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ActiveRole />
          {/* Gère connexion/déconnexion, adresse tronquée (0x1234…abcd) et solde ETH */}
          <ConnectButton
            label="Connecter le wallet"
            showBalance={{ smallScreen: false, largeScreen: true }}
            accountStatus="address"
            chainStatus="icon"
          />
        </div>
      </div>
    </header>
  );
}
