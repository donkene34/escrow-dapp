import type { TxStatus as Status } from "@/hooks/useEscrowTx";

type Props = { status: Status; hash?: `0x${string}`; error?: string; onDismiss: () => void };

export function TxStatus({ status, hash, error, onDismiss }: Props) {
  if (status === "idle") return null;

  const link = hash && (
    <a
      href={`https://sepolia.etherscan.io/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      className="ml-2 underline"
    >
      Voir sur Etherscan
    </a>
  );

  const view = {
    wallet: { cls: "border-blue-500/40 bg-blue-500/10 text-blue-200", msg: "Confirme la transaction dans ton wallet…" },
    pending: { cls: "border-amber-500/40 bg-amber-500/10 text-amber-200", msg: "Transaction envoyée, en attente de confirmation…" },
    success: { cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200", msg: "Transaction confirmée ✓" },
    error: { cls: "border-red-500/40 bg-red-500/10 text-red-200", msg: error ?? "Échec de la transaction." },
  }[status];

  return (
    <div className={`mt-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${view.cls}`}>
      <span>
        {view.msg}
        {link}
      </span>
      {(status === "success" || status === "error") && (
        <button onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Fermer">✕</button>
      )}
    </div>
  );
}
