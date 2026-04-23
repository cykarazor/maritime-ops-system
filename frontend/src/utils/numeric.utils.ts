export function parseNumeric(value: string): number | null {
  if (value === undefined || value === null) return null;
  if (value.trim() === "") return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

export function formatNumeric(value: number | null, decimals = 2): string {
  if (value === null || value === undefined) return "";

  return value.toFixed(decimals);
}

export function normalizeDecimal(value: number | null, decimals = 2): number | null {
  if (value === null || value === undefined) return null;

  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}