"use client";

import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export type TxStatus = "idle" | "wallet" | "pending" | "success" | "error";

// Hook d'écriture générique : envoi → attente du receipt → refetch des données.
export function useEscrowTx(onSuccess?: () => void) {
  const w = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: w.data });

  const reverted = receipt.data?.status === "reverted";
  const done = receipt.isSuccess && !reverted;

  useEffect(() => {
    if (done) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  let status: TxStatus = "idle";
  if (w.isPending) status = "wallet";
  else if (w.error || receipt.error || reverted) status = "error";
  else if (done) status = "success";
  else if (w.data) status = "pending";

  const rawError = (w.error ?? receipt.error) as (Error & { shortMessage?: string }) | null;
  const errorMessage = reverted
    ? "La transaction a été rejetée par le contrat (revert)."
    : rawError?.shortMessage ?? rawError?.message?.split("\n")[0];

  return {
    writeContract: w.writeContract,
    hash: w.data,
    status,
    busy: status === "wallet" || status === "pending",
    errorMessage,
    reset: w.reset,
  };
}
