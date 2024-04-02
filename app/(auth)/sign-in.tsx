import React, { useState } from "react";
import { StyleSheet, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { View, Text, ScrollView } from "@/components/Themed";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useAuth();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container} bounces={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={30} color={isDarkMode ? Colors.dark.text : Colors.light.text} />
          </TouchableOpacity>
        </View>
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
        <Text style={styles.createAccount}>Login</Text>
        <View style={styles.inputContainer}>
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
            darkBackgroundColor={Colors.dark.lightBackground}
            lightBackgroundColor={Colors.light.lightBackground}
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
            darkBackgroundColor={Colors.dark.lightBackground}
            lightBackgroundColor={Colors.light.lightBackground}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={async () => await signIn({ variables: { email: email, password: password } })}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  createAccount: {
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
    backgroundColor: "#9ED8DB",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});
