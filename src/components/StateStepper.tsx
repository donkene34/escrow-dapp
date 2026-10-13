const MAIN = ["Created", "Funded", "Delivered", "Released"] as const;
// state() → position dans le parcours nominal (3 = Disputed et 5 = Refunded sont hors parcours)
const MAIN_INDEX: Record<number, number | undefined> = { 0: 0, 1: 1, 2: 2, 4: 3 };

export function StateStepper({ stateIndex }: { stateIndex: number }) {
  const current = MAIN_INDEX[stateIndex];
  const isDisputed = stateIndex === 3;
  const isRefunded = stateIndex === 5;
  // Hors parcours : on considère Created et Funded franchis (un litige/remboursement suit un financement)
  const doneUpTo = current ?? (isDisputed ? 1 : 0);

  return (
    <div className="space-y-4">
      <ol className="flex items-start">
        {MAIN.map((label, i) => {
          const onPath = current !== undefined;
          const done = onPath ? i < current : i <= doneUpTo;
          const active = onPath && i === current;
          const final = active && i === MAIN.length - 1; // Released = terminé

          const circle = final || done
            ? "bg-emerald-500 border-emerald-500 text-white"
            : active
              ? "border-blue-400 bg-blue-500/20 text-blue-200 ring-4 ring-blue-500/20"
              : "border-slate-700 text-slate-500";

          return (
            <li key={label} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done || active ? "bg-emerald-500/60" : "bg-slate-700"}`} />
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${circle}`}>
                  {final || done ? "✓" : i + 1}
                </div>
                <div className={`h-0.5 flex-1 ${i === MAIN.length - 1 ? "invisible" : done ? "bg-emerald-500/60" : "bg-slate-700"}`} />
              </div>
              <span className={`mt-2 text-xs ${active ? "font-semibold text-slate-100" : "text-slate-400"}`}>{label}</span>
            </li>
          );
        })}
      </ol>

      {/* Branches hors parcours nominal */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500">↳ Hors parcours :</span>
        <span
          className={`rounded-full px-3 py-1 font-medium ring-1 ring-inset ${
            isDisputed
              ? "bg-red-500/20 text-red-300 ring-red-500/60"
              : "text-slate-600 ring-slate-800"
          }`}
        >
          Disputed
        </span>
        <span
          className={`rounded-full px-3 py-1 font-medium ring-1 ring-inset ${
            isRefunded
              ? "bg-amber-500/20 text-amber-300 ring-amber-500/60"
              : "text-slate-600 ring-slate-800"
          }`}
        >
          Refunded
        </span>
      </div>
    </div>
  );
}
