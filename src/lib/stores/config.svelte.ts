const DEPLOYMENT_ID_KEY = "feed-tracker:deployment-id";
const SECRET_KEY = "feed-tracker:secret";

const GAS_BASE = "https://script.google.com/macros/s";

export interface AppConfig {
  deploymentId: string;
  secret: string;
}

/** Extract just the deployment ID from either a bare ID or a pasted full URL. */
export const parseDeploymentId = (input: string): string => {
  const trimmed = input.trim();
  const match = trimmed.match(/\/macros\/s\/([^/]+)\/exec/);
  return match ? match[1] : trimmed;
};

function createConfigStore() {
  let deploymentId = $state("");
  let secret = $state("");

  function init(): void {
    if (typeof localStorage === "undefined") return;
    deploymentId = localStorage.getItem(DEPLOYMENT_ID_KEY) ?? "";
    secret = localStorage.getItem(SECRET_KEY) ?? "";
  }

  function save(config: AppConfig): void {
    deploymentId = parseDeploymentId(config.deploymentId);
    secret = config.secret.trim();
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(DEPLOYMENT_ID_KEY, deploymentId);
    localStorage.setItem(SECRET_KEY, secret);
  }

  return {
    get deploymentId() {
      return deploymentId;
    },
    get appsScriptUrl() {
      return deploymentId ? `${GAS_BASE}/${deploymentId}/exec` : "";
    },
    get secret() {
      return secret;
    },
    get isConfigured() {
      return deploymentId.length > 0 && secret.length > 0;
    },
    init,
    save,
  };
}

export const configStore = createConfigStore();
