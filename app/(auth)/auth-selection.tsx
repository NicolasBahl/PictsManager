import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { useRouter } from "expo-router";
import LinearGradient from 'react-native-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AuthSelection() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const gradientColors = isDarkMode ? ['#010101', '#17202b'] : ['#FEFEFE', '#dce6f0'];
  const gradientColorsButton = isDarkMode ? ['#467599', '#9ED8DB'] : ['#b0ddff', '#e0eced'];

  return (
    <View style={styles.container} darkColor="transparent" lightColor="transparent">
      <LinearGradient colors={gradientColors} style={styles.gradient} start={{ x: 0.5, y: 0.4 }} end={{ x: 0.5, y: 0 }} />
      <View style={styles.logoContainer} darkColor="transparent" lightColor="transparent">
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
      <View style={styles.buttonContainer} darkColor="transparent" lightColor="transparent">
        <TouchableOpacity style={styles.button} onPress={() => router.push("/sign-in")}>
          <LinearGradient colors={gradientColorsButton} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBorder]} onPress={() => router.push("/sign-up")}>
          <LinearGradient colors={gradientColorsButton} style={[styles.buttonGradient, styles.buttonGradientBorder]}>
            <View style={styles.innerButtonBorder} lightColor="#FEFEFE" darkColor="#010101">
              <Text style={styles.buttonText}>SIGN UP</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
  buttonBorder: {
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 52
  },
  buttonGradientBorder: {
    padding: 3,
  },
  innerButtonBorder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 52,
    width: "100%",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
});
