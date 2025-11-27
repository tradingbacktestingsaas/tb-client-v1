export const getRawDataBadgeColor = (key: string) => {
  const k = key.toLowerCase();

  // Red-ish: loss / worst / negative stats
  if (k.includes("loss") || k.includes("worst") || k.includes("drawdown")) {
    return "bg-red-500/10 text-red-300 border-red-500/40";
  }

  // Green-ish: profit / growth / best / wins
  if (
    k.includes("profit") ||
    k.includes("growth") ||
    k.includes("best") ||
    k.includes("won") ||
    k.includes("win")
  ) {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
  }

  // Blue-ish: totals, volumes, lots
  if (
    k.includes("total") ||
    k.includes("lots") ||
    k.includes("volume") ||
    k.includes("deposits") ||
    k.includes("withdrawals") ||
    k.includes("commission") ||
    k.includes("swap")
  ) {
    return "bg-sky-500/10 text-sky-300 border-sky-500/40";
  }

  // Purple-ish: dates / time
  if (k.includes("date") || k.includes("time")) {
    return "bg-violet-500/10 text-violet-300 border-violet-500/40";
  }

  // Fallback: subtle gray
  return "bg-slate-500/10 text-slate-300 border-slate-500/40";
};
