export type User = "Mum" | "Dad";

const STORAGE_KEY = "feed-tracker:user";

function createUserStore() {
  let current = $state<User>("Mum");

  function init(): void {
    if (typeof localStorage === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as User | null;
    if (stored === "Mum" || stored === "Dad") {
      current = stored;
    }
  }

  function set(user: User): void {
    current = user;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, user);
    }
  }

  return {
    get current() {
      return current;
    },
    init,
    set,
  };
}

export const userStore = createUserStore();
