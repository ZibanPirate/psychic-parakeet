import { Environment } from "@parakeet/api/src/config/dto";

/**
 * Get the current environment
 */
export const getEnv: () => Environment = () => {
  switch (location.hostname) {
    case "localhost":
      return "development";
    default:
      return "production";
  }
};

const frontendPort = 8080;
const apiPort = 7070;
const environments: Environment[] = ["development", "production"];
const e = environments.indexOf(getEnv());

/**
 * Configuration object, containing global configuration and variable based on current environment
 */
export const config = {
  api: {
    url: [`http://localhost:${apiPort}`, "https://api_parakeet.zakiii.com"][e],
  },
  web: {
    port: frontendPort,
    url: [`http://localhost:${frontendPort}`, "https://parakeet.zakiii.com"][e],
  },
};
