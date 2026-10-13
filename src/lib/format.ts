export const shortAddress = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

export const formatDeadline = (d: Date) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short" }).format(d);

// "dans 3 j 4 h" / "expirée depuis 2 h"
export function timeLeft(deadline: Date, now = Date.now()) {
  const diff = deadline.getTime() - now;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const txt = days > 0 ? `${days} j ${hours} h` : hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
  return { expired: diff <= 0, label: diff <= 0 ? `expirée depuis ${txt}` : `dans ${txt}` };
}
