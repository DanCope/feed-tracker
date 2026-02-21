import type { LogEntry } from "$lib/services/api";
import { fetchLatestLogs } from "$lib/services/api";
import { configStore } from "$lib/stores/config.svelte";

const CACHE_KEY = "feed-tracker:latest-logs";
const TTL_MS = 30_000;

function createLatestStore() {
  let entries = $state<LogEntry[]>([]);
  let isLoading = $state(false);
  let lastFetchedAt = $state(0);

  const lastBreastFeed = $derived(entries.find((e) => e.type === "breast") ?? null);
  const lastBottleFeed = $derived(entries.find((e) => e.type === "bottle") ?? null);
  const lastNappyChange = $derived(entries.find((e) => e.type === "nappy") ?? null);

  function init(): void {
    if (typeof localStorage === "undefined") return;
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return;
    try {
      entries = JSON.parse(cached) as LogEntry[];
    } catch {
      // ignore corrupt cache
    }
  }

  async function refresh(): Promise<void> {
    if (!configStore.isConfigured) return;
    if (Date.now() - lastFetchedAt < TTL_MS) return;

    isLoading = entries.length === 0;
    const result = await fetchLatestLogs(20);

    if (result.success) {
      entries = result.data;
      lastFetchedAt = Date.now();
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
      }
    }

    isLoading = false;
  }

  return {
    get entries() {
      return entries;
    },
    get isLoading() {
      return isLoading;
    },
    get lastBreastFeed() {
      return lastBreastFeed;
    },
    get lastBottleFeed() {
      return lastBottleFeed;
    },
    get lastNappyChange() {
      return lastNappyChange;
    },
    init,
    refresh,
  };
}

export const latestStore = createLatestStore();
