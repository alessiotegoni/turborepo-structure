// https://www.youtube.com/watch?v=UtJJCAfrjIg&list=PLsXDmrmFV_AS14tZCBin6m9NIS_VCUKe2&index=5
// https://docs.expo.dev/tutorial/eas/multiple-app-variants/

import type { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.alessiotegoni.beeto.dev";
  }

  if (IS_PREVIEW) {
    return "com.alessiotegoni.beeto.preview";
  }

  return "com.alessiotegoni.beeto";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Beeto (Dev)";
  }

  if (IS_PREVIEW) {
    return "Beeto (Preview)";
  }

  return "Beeto: Event Management App";
};

export default ({ config }: ConfigContext) =>
  ({
    ...config,
    name: getAppName(),
    slug: "beeto",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "beeto2",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
      bundleIdentifier: getUniqueIdentifier(),
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      package: getUniqueIdentifier(),
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          android: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 76,
          },
        },
      ],
      "expo-secure-store",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "2ff56fa9-857d-40d3-b4be-0a4eed5a3dc7",
      },
    },
    owner: "alessiolonghys",
  }) satisfies ExpoConfig;
