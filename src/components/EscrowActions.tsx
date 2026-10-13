"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TxStatus } from "@/components/TxStatus";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config/contract";
import { useEscrow } from "@/hooks/useEscrow";
import { useEscrowTx } from "@/hooks/useEscrowTx";
import { useRole } from "@/hooks/useRole";

const base = { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, chainId: sepolia.id } as const;

type Confirmable = "release" | "dispute" | "payFreelancer" | "refundClient" | "refund";

const MODALS: Record<Confirmable, { title: string; description: string; confirm: string; danger?: boolean }> = {
  release: {
    title: "Valider et libérer les fonds ?",
    description: "Les fonds seront envoyés au freelancer. Cette action est irréversible.",
    confirm: "Libérer les fonds",
  },
  dispute: {
    title: "Ouvrir un litige ?",
    description: "Le contrat sera bloqué jusqu'à la décision de l'arbitre. Les fonds ne bougent plus tant qu'il n'a pas tranché.",
    confirm: "Ouvrir le litige",
    danger: true,
  },
  payFreelancer: {
    title: "Payer le freelancer ?",
    description: "Décision d'arbitrage : les fonds seront envoyés au freelancer. Irréversible.",
    confirm: "Payer le freelancer",
  },
  refundClient: {
    title: "Rembourser le client ?",
    description: "Décision d'arbitrage : les fonds seront renvoyés au client. Irréversible.",
    confirm: "Rembourser le client",
    danger: true,
  },
  refund: {
    title: "Récupérer les fonds ?",
    description: "La deadline est dépassée sans livraison : les fonds te seront remboursés. Irréversible.",
    confirm: "Me rembourser",
    danger: true,
  },
};

const btn = "rounded-md px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50";

export function EscrowActions() {
  const e = useEscrow();
  const { role } = useRole();
  const { address, chainId } = useAccount();
  const tx = useEscrowTx(e.refetch);

  const [amount, setAmount] = useState("");
  const [confirming, setConfirming] = useState<Confirmable | null>(null);

  const s = e.stateIndex;
  if (s === undefined) return null;

  const wrongNetwork = !!address && chainId !== sepolia.id;
  const disabled = tx.busy || wrongNetwork;
  const deadlinePassed = !!e.deadline && e.deadline.getTime() < Date.now();

  // ---- Visibilité : rôle + état ----
  const canFund = role === "client" && s === 0;
  const canDeliver = role === "freelancer" && s === 1;
  const canRelease = role === "client" && s === 2;
  const canDispute = (role === "client" || role === "freelancer") && (s === 1 || s === 2);
  const canResolve = role === "arbiter" && s === 3;
  const canRefund = role === "client" && s === 1 && deadlinePassed;
  const hasAction = canFund || canDeliver || canRelease || canDispute || canResolve || canRefund;

  // ---- Montant saisi (accepte la virgule) ----
  let parsedAmount: bigint | undefined;
  try {
    const v = amount.trim().replace(",", ".");
    parsedAmount = v ? parseEther(v) : undefined;
  } catch {
    parsedAmount = undefined;
  }
  const amountValid = parsedAmount !== undefined && parsedAmount > 0n;

  // ---- Envoi des transactions ----
  const run = (kind: Confirmable) => {
    setConfirming(null);
    if (kind === "release") tx.writeContract({ ...base, functionName: "release" });
    if (kind === "dispute") tx.writeContract({ ...base, functionName: "raiseDispute" });
    if (kind === "payFreelancer") tx.writeContract({ ...base, functionName: "resolveDispute", args: [true] });
    if (kind === "refundClient") tx.writeContract({ ...base, functionName: "resolveDispute", args: [false] });
    if (kind === "refund") tx.writeContract({ ...base, functionName: "refund" });
  };

  const modal = confirming ? MODALS[confirming] : null;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">Actions</h2>

      {!address && <p className="text-sm text-slate-400">Connecte ton wallet pour agir sur le contrat.</p>}
      {address && !hasAction && (
        <p className="text-sm text-slate-400">Aucune action disponible pour ton rôle à cet état.</p>
      )}
      {wrongNetwork && <p className="mb-3 text-sm text-red-300">Passe sur Sepolia pour envoyer une transaction.</p>}

      <div className="flex flex-wrap items-center gap-3">
        {canFund && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-md border border-slate-700 bg-slate-950 px-3">
              <input
                value={amount}
                onChange={(ev) => setAmount(ev.target.value)}
                inputMode="decimal"
                placeholder="0.01"
                aria-label="Montant en ETH"
                className="w-28 bg-transparent py-2 text-sm outline-none"
              />
              <span className="text-sm text-slate-500">ETH</span>
            </div>
            <button
              disabled={disabled || !amountValid}
              onClick={() => tx.writeContract({ ...base, functionName: "fund", value: parsedAmount })}
              className={`${btn} bg-blue-600 hover:bg-blue-500`}
            >
              Financer l&apos;escrow
            </button>
          </div>
        )}

        {canDeliver && (
          <button
            disabled={disabled}
            onClick={() => tx.writeContract({ ...base, functionName: "markDelivered" })}
            className={`${btn} bg-emerald-600 hover:bg-emerald-500`}
          >
            Marquer comme livré
          </button>
        )}

        {canRelease && (
          <button disabled={disabled} onClick={() => setConfirming("release")} className={`${btn} bg-emerald-600 hover:bg-emerald-500`}>
            Valider et libérer les fonds
          </button>
        )}

        {canRefund && (
          <button disabled={disabled} onClick={() => setConfirming("refund")} className={`${btn} bg-amber-600 hover:bg-amber-500`}>
            Demander le remboursement
          </button>
        )}

        {canResolve && (
          <>
            <button disabled={disabled} onClick={() => setConfirming("payFreelancer")} className={`${btn} bg-emerald-600 hover:bg-emerald-500`}>
              Payer le freelancer
            </button>
            <button disabled={disabled} onClick={() => setConfirming("refundClient")} className={`${btn} bg-amber-600 hover:bg-amber-500`}>
              Rembourser le client
            </button>
          </>
        )}

        {canDispute && (
          <button
            disabled={disabled}
            onClick={() => setConfirming("dispute")}
            className="rounded-md border border-red-500/60 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ouvrir un litige
          </button>
        )}
      </div>

      <TxStatus status={tx.status} hash={tx.hash} error={tx.errorMessage} onDismiss={tx.reset} />

      <ConfirmModal
        open={!!modal}
        title={modal?.title ?? ""}
        description={modal?.description ?? ""}
        confirmLabel={modal?.confirm ?? ""}
        danger={modal?.danger}
        onConfirm={() => confirming && run(confirming)}
        onCancel={() => setConfirming(null)}
      />
    </section>
  );
}
