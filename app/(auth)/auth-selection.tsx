import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { useRouter } from "expo-router";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AuthSelection() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={[styles.logo, {
            tintColor: isDarkMode ? Colors.dark.text : Colors.light.text
          }]}
          source={require("@/assets/images/scribble.png")}
          resizeMode="contain"
        />
        <Text>PictsManager</Text>
      </View>
      <Text style={styles.welcome}>Welcome!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonLogin]} onPress={() => router.push("/sign-in")}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSignup]}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    marginTop: 100,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 78,
    height: 78,
  },
  welcome: {
    marginTop: 80,
    fontSize: 48,
    fontWeight: "bold",
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 150,
    alignSelf: "center",
  },
  button: {
    height: 52,
    width: 208,
    borderRadius: 52,
    marginBottom: 8,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  buttonLogin: {
    backgroundColor: "#9ED8DB",
  },
  buttonSignup: {
    borderColor: "#9ED8DB",
    borderWidth: 3,
  }
});
