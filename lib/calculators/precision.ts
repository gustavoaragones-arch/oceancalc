/** Round for display / stable output (avoids float noise). */
export function formatNumber(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}
