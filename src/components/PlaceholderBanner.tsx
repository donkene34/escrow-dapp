import { IS_PLACEHOLDER_ADDRESS } from "@/config/contract";

export function PlaceholderBanner() {
  if (!IS_PLACEHOLDER_ADDRESS) return null;
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      ⚠️ Adresse du contrat non configurée. Renseigne <code>CONTRACT_ADDRESS</code> et{" "}
      <code>CONTRACT_ABI</code> dans <code>src/config/contract.ts</code>.
    </div>
  );
}
