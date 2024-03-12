import { ExpoConfig, ConfigContext } from "expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "picts-manager",
  name: "Picts Manager",
  extra: {
    apiUrl: process.env.API_URL ?? "http://localhost:4000",
    eas: {
      projectId: "e9810629-0500-42f0-b2df-15b69854d4bd",
    },
  },
  plugins: [
    [
      "react-native-vision-camera",
      {
        cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",
      },
    ],
  ],
  android: {
    package: "com.epitech.pictsmanager",
  },
  ios: {
    bundleIdentifier: "com.epitech.pictsmanager",
  },
});
