import React, { useState, useRef } from "react";
import { StyleSheet, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { View, Text, ScrollView } from "@/components/Themed";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LinearGradient from 'react-native-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useAuth();

  const passwordRef = useRef(null);

  const [signIn, { loading }] = useSignInMutation({
    onCompleted: async (data) => {
      if (data?.signIn?.token) {
        authContext?.signIn(data?.signIn);
      }
    },
    onError: (e) => {
      console.log(e);
      if (e?.message?.includes("invalid")) {
        Alert?.alert("Erreur", "Email ou mot de passe incorrect");
      } else {
        Alert?.alert("Erreur", "Une erreur est survenue, veuillez réessayer");
      }
    },
  });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const gradientColors = isDarkMode ? ['#010101', '#17202b'] : ['#FEFEFE', '#dce6f0'];
  const gradientColorsButton = isDarkMode ? ['#467599', '#9ED8DB'] : ['#b0ddff', '#e0eced'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={gradientColors} style={styles.gradient} start={{ x: 0.5, y: 0.4 }} end={{ x: 0.5, y: 0 }} />
      <ScrollView style={styles.container} bounces={false} darkColor="transparent" lightColor="transparent">
        <View style={styles.header} darkColor="transparent" lightColor="transparent">
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={30} color={isDarkMode ? Colors.dark.text : Colors.light.text} />
          </TouchableOpacity>
        </View>
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
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer} darkColor="transparent" lightColor="transparent">
          <Input
            value={email}
            label="Email"
            style={styles.input}
            onChangeText={setEmail}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            darkColor={Colors.dark.text}
            lightColor={Colors.light.text}
            darkBackgroundColor={Colors.dark.background}
            lightBackgroundColor={Colors.light.background}
            returnKeyType="next"
            onSubmitEditing={() => (passwordRef.current as any)?.focus()}
          />
          <Input
            value={password}
            label="Password"
            onChangeText={setPassword}
            placeholder="Enter Password"
            secureTextEntry
            autoComplete="password"
            autoCapitalize="none"
            autoCorrect={false}
            darkColor={Colors.dark.text}
            lightColor={Colors.light.text}
            darkBackgroundColor={Colors.dark.background}
            lightBackgroundColor={Colors.light.background}
            ref={passwordRef}
            returnKeyType="done"
            onSubmitEditing={async () => await signIn({ variables: { email: email, password: password } })}
          />
        </View>
        <View style={styles.buttonContainer} darkColor="transparent" lightColor="transparent">
          <TouchableOpacity style={styles.button} onPress={async () => await signIn({ variables: { email: email, password: password } })}>
            <LinearGradient colors={gradientColorsButton} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>LOG IN</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.changeAuthContainer} darkColor="transparent" lightColor="transparent">
            <Text style={styles.changeAuthText} lightColor={Colors.light.lighterBackground} darkColor={Colors.dark.lighterBackground}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text style={styles.changeAuthButton} lightColor={Colors.light.primary} darkColor={Colors.dark.primary}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    position: "absolute",
    marginTop: 60,
    width: "90%",
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  back: {
    flexDirection: "row",
    marginLeft: -6,
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
  title: {
    marginTop: 80,
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "center",
  },
  inputContainer: {
    alignSelf: "center",
    width: "90%",
    marginTop: 40,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    alignSelf: "center",
    marginTop: 100,
  },
  button: {
    height: 52,
    width: 208,
    borderRadius: 52,
    marginBottom: 8,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#9ED8DB",
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 52
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  changeAuthContainer: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "center",
  },
  changeAuthText: {
    fontSize: 14,
  },
  changeAuthButton: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});
