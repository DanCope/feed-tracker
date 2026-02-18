export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "feed-tracker:theme";

function createThemeStore() {
  let preference = $state<ThemePreference>("system");

  function applyToDocument(pref: ThemePreference): void {
    if (typeof document === "undefined") return;
    if (pref === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", pref);
    }
  }

  function init(): void {
    if (typeof localStorage === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      preference = stored;
    }
    applyToDocument(preference);
  }

  function set(pref: ThemePreference): void {
    preference = pref;
    applyToDocument(pref);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, pref);
    }
  }

  return {
    get preference() {
      return preference;
    },
    init,
    set,
  };
}

export const themeStore = createThemeStore();
