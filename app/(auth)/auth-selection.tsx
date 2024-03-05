import React from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export default function AuthSelection() {
  const router = useRouter();
  const { byPassSignIn } = useAuth();
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/adaptive-icon.png")}
      />
      <Button title="Login" onPress={() => router.push("/sign-in")} />
      <View style={{ height: 20 }} />
      <Button
        title="Register"
        onPress={() => alert("Register button pressed")}
      />
      <View style={{ height: 20 }} />
      <Button title="Bypass Login" onPress={() => byPassSignIn()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  logo: {
    width: 128,
    height: 128,
    alignSelf: "center",
    marginBottom: 40,
  },
});
