"use client";

import { useAccount } from "wagmi";
import { isAddressEqual, type Address } from "viem";
import { EscrowActions } from "@/components/EscrowActions";
import { RoleBadge } from "@/components/RoleBadge";
import { StateStepper } from "@/components/StateStepper";
import { useEscrow } from "@/hooks/useEscrow";
import type { Role } from "@/hooks/useRole";
import { formatDeadline, shortAddress, timeLeft } from "@/lib/format";

function PartyRow({ role, addr, me }: { role: Role; addr?: Address; me?: Address }) {
  const isMe = !!addr && !!me && isAddressEqual(addr, me);
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <RoleBadge role={role} />
      {addr ? (
        <a
          href={`https://sepolia.etherscan.io/address/${addr}`}
          target="_blank"
          rel="noreferrer"
          title={addr}
          className="font-mono text-sm text-slate-300 hover:text-white hover:underline"
        >
          {shortAddress(addr)}
          {isMe && <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-sans text-xs text-slate-300">vous</span>}
        </a>
      ) : (
        <span className="text-slate-500">—</span>
      )}
    </div>
  );
}

export function EscrowDashboard() {
  const e = useEscrow();
  const { address: me } = useAccount();

  if (!e.enabled) return null;
  if (e.isLoading) return <p className="text-slate-400">Lecture du contrat…</p>;
  if (e.error)
    return (
      <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        Erreur de lecture : {e.error.message.split("\n")[0]}
      </p>
    );

  const left = e.deadline ? timeLeft(e.deadline) : undefined;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">État du contrat</h2>
        {e.stateIndex !== undefined ? <StateStepper stateIndex={e.stateIndex} /> : <p className="text-slate-500">—</p>}
      </section>

      <EscrowActions />

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">Montant en escrow</h2>
          <p className="text-3xl font-semibold">
            {e.balanceEth ?? "—"} <span className="text-lg text-slate-400">ETH</span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">Deadline</h2>
          <p className="font-medium capitalize">{e.deadline ? formatDeadline(e.deadline) : "—"}</p>
          {left && (
            <p className={`mt-1 text-sm ${left.expired ? "text-red-400" : "text-slate-400"}`}>{left.label}</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">Parties</h2>
        <div className="divide-y divide-slate-800">
          <PartyRow role="client" addr={e.client} me={me} />
          <PartyRow role="freelancer" addr={e.freelancer} me={me} />
          <PartyRow role="arbiter" addr={e.arbiter} me={me} />
        </div>
      </section>
    </div>
  );
}
