import { configStore } from "$lib/stores/config.svelte";
import type { User } from "$lib/stores/user.svelte";

export type LogType = "breast" | "bottle" | "nappy" | "pump";
export type Side = "Left" | "Right" | "Both";
export type Scale = "None" | "Small" | "Medium" | "Large";

export interface LogPayload {
  user: User;
  type: LogType;
  side?: Side;
  duration?: number;
  amount_before?: number;
  amount_after?: number;
  poop?: Scale;
  pee?: Scale;
  notes?: string;
  timestamp?: string;
}

export type SubmitResult = { success: true } | { success: false; message: string };

export interface LogEntry {
  timestamp: string; // ISO date string (serialized from GAS Date)
  user: string;
  type: string;
  side: string;
  duration: number | string;
  amountBefore: number | string;
  amountAfter: number | string;
  poop: string;
  pee: string;
  notes: string;
}

export type FetchLogsResult = { success: true; data: LogEntry[] } | { success: false; message: string };

export const submitLog = async (data: LogPayload): Promise<SubmitResult> => {
  const { appsScriptUrl, secret, isConfigured } = configStore;

  if (!isConfigured) {
    return { success: false, message: "App not configured. Please set the URL and secret in Settings." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ ...data, secret }),
      signal: controller.signal,
    });

    const json = (await response.json()) as { status: string; message?: string };

    if (json.status === "ok") {
      return { success: true };
    }

    return { success: false, message: json.message ?? "Unknown error from server." };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, message: "Request timed out. Check your connection." };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network error. Please try again.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchLatestLogs = async (limit = 20): Promise<FetchLogsResult> => {
  const { appsScriptUrl, secret, isConfigured } = configStore;

  if (!isConfigured) {
    return { success: false, message: "App not configured. Please set the URL and secret in Settings." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);

  try {
    const url = `${appsScriptUrl}?secret=${encodeURIComponent(secret)}&limit=${limit}`;
    const response = await fetch(url, { signal: controller.signal });
    const json = (await response.json()) as { status: string; message?: string; data?: LogEntry[] };

    if (json.status === "ok" && json.data) {
      return { success: true, data: json.data };
    }

    return { success: false, message: json.message ?? "Unknown error from server." };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, message: "Request timed out. Check your connection." };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network error. Please try again.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
