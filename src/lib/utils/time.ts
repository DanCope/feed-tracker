/**
 * Returns a human-readable relative time string.
 * @param date - ISO date string or Date object
 * @param now  - Current timestamp in ms; pass a reactive $state value for live updates
 */
export const relativeTime = (date: string | Date, now: number = Date.now()): string => {
  const ms = now - new Date(date).getTime();
  const minutes = Math.floor(ms / 60_000);
  const hours = Math.floor(ms / 3_600_000);

  if (ms < 60_000) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return "yesterday";
  return `${Math.floor(hours / 24)}d ago`;
};
