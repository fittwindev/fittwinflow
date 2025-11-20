import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Fitted Mobile",
  slug: "fitted-mobile",
  version: "0.1.0",
  scheme: "fittedmobile",
  orientation: "portrait",
  owner: undefined,
  jsEngine: "hermes",
  newArchEnabled: true,
  platforms: ["ios", "android", "web"],
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false
  },
  android: {
    package: "com.fitted.mobile",
    adaptiveIcon: {
      backgroundColor: "#10b8a6"
    }
  },
  web: {
    bundler: "metro"
  },
  experiments: {
    optimizedImports: true
  }
});
