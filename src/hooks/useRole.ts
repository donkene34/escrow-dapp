"use client";

import { isAddressEqual, type Address } from "viem";
import { useAccount } from "wagmi";
import { useEscrow } from "@/hooks/useEscrow";

export type Role = "client" | "freelancer" | "arbiter" | "visitor";

export const ROLE_LABELS: Record<Role, string> = {
  client: "Client",
  freelancer: "Freelancer",
  arbiter: "Arbiter",
  visitor: "Visiteur",
};

type Parties = { client?: Address; freelancer?: Address; arbiter?: Address };

// Compare sans tenir compte de la casse (isAddressEqual). Réutilisable pour n'importe quelle adresse.
export function roleOf(addr: Address | undefined, p: Parties): Role {
  if (!addr) return "visitor"; // wallet non connecté
  if (p.client && isAddressEqual(addr, p.client)) return "client";
  if (p.freelancer && isAddressEqual(addr, p.freelancer)) return "freelancer";
  if (p.arbiter && isAddressEqual(addr, p.arbiter)) return "arbiter";
  return "visitor";
}

export function useRole() {
  const { address } = useAccount();
  const { client, freelancer, arbiter, isLoading } = useEscrow();
  return {
    role: roleOf(address, { client, freelancer, arbiter }),
    isLoading,
  };
}
