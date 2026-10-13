"use client";

import { ROLE_LABELS, type Role } from "@/hooks/useRole";

const STYLES: Record<Role, string> = {
  client: "bg-blue-500/15 text-blue-300 ring-blue-500/40",
  freelancer: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40",
  arbiter: "bg-purple-500/15 text-purple-300 ring-purple-500/40",
  visitor: "bg-slate-500/15 text-slate-300 ring-slate-500/40",
};

export function RoleBadge({ role, className = "" }: { role: Role; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[role]} ${className}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
