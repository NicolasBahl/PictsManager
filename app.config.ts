import { ExpoConfig, ConfigContext } from "expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "picts-manager",
  name: "Picts Manager",
  extra: {
    apiUrl: process.env.API_URL ?? "http://localhost:4000",
  },
});
