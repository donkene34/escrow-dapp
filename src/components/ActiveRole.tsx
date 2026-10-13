"use client";

import { RoleBadge } from "@/components/RoleBadge";
import { useRole } from "@/hooks/useRole";

// Badge du rôle de l'utilisateur connecté (affiché dans le header)
export function ActiveRole() {
  const { role, isLoading } = useRole();
  if (isLoading) return <span className="text-xs text-slate-500">…</span>;
  return <RoleBadge role={role} />;
}
