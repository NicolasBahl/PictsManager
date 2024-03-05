import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { createUploadLink } from "apollo-upload-client";
import Constants from "expo-constants";

import { useColorScheme } from "@/components/useColorScheme";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { setContext } from "@apollo/client/link/context";
import { AuthProvider } from "@/providers/AuthProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

const httpLink = createUploadLink({
  uri: `${Constants?.expoConfig?.extra?.apiUrl}/graphql`,
  headers: { "Apollo-Require-Preflight": "true" },
});

const authMiddleware = setContext(async (req, { headers }) => {
  const token = await SecureStore?.getItemAsync?.("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache({});

const client = new ApolloClient({
  link: authMiddleware?.concat?.(httpLink),
  cache,
});
