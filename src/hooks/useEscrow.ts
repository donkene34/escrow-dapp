"use client";

import { useCallback } from "react";
import { useBalance, useReadContracts } from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatEther } from "viem";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  IS_PLACEHOLDER_ADDRESS,
  STATE_LABELS,
} from "@/config/contract";

const base = { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, chainId: sepolia.id } as const;
const POLL_MS = 10_000;

export function useEscrow() {
  // Pas de lecture tant que l'adresse est le placeholder
  const enabled = !IS_PLACEHOLDER_ADDRESS;

  const reads = useReadContracts({
    contracts: [
      { ...base, functionName: "client" },
      { ...base, functionName: "freelancer" },
      { ...base, functionName: "arbiter" },
      { ...base, functionName: "state" },
      { ...base, functionName: "deadline" },
    ],
    query: { enabled, refetchInterval: POLL_MS },
  });

  const balance = useBalance({
    address: CONTRACT_ADDRESS,
    chainId: sepolia.id,
    query: { enabled, refetchInterval: POLL_MS },
  });

  const [client, freelancer, arbiter, state, deadline] = reads.data ?? [];

  const stateIndex = state?.status === "success" ? Number(state.result) : undefined;
  const deadlineSec = deadline?.status === "success" ? deadline.result : undefined;

  // À appeler après chaque transaction confirmée
  const refetch = useCallback(async () => {
    await Promise.all([reads.refetch(), balance.refetch()]);
  }, [reads, balance]);

  const failed = reads.data?.find((r) => r.status === "failure");

  return {
    enabled,
    client: client?.status === "success" ? client.result : undefined,
    freelancer: freelancer?.status === "success" ? freelancer.result : undefined,
    arbiter: arbiter?.status === "success" ? arbiter.result : undefined,
    stateIndex,
    state: stateIndex !== undefined ? STATE_LABELS[stateIndex] : undefined,
    deadline: deadlineSec !== undefined ? new Date(Number(deadlineSec) * 1000) : undefined,
    balanceWei: balance.data?.value,
    balanceEth: balance.data ? formatEther(balance.data.value) : undefined,
    isLoading: enabled && (reads.isLoading || balance.isLoading),
    error: reads.error ?? balance.error ?? (failed?.status === "failure" ? failed.error : undefined),
    refetch,
  };
}
