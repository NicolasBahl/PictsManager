import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
