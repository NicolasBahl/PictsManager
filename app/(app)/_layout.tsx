import {
  Redirect,
  Stack,
  useGlobalSearchParams,
  usePathname,
  useRootNavigationState,
} from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function AppLayout() {
  const rootNavigationState = useRootNavigationState();

  const { me, byPass } = useAuth();

  // Ensure router navigation ready before rendering
  if (!rootNavigationState?.key) return null;

  if (!me && !byPass) return <Redirect href={"/auth-selection"} />;

  return <AppLayoutNav />;
}

function AppLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="previewPicture" />
      <Stack.Screen name="albumDetails" options={{ headerShown: false }} />
      <Stack.Screen name="albumSettings" options={{ headerShown: false }} />
      <Stack.Screen name="photoView" options={{ headerShown: false }} />
    </Stack>
  );
}
