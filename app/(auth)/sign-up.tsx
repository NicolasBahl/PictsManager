import React, { useState, useRef } from "react";
import { Text, ScrollView, View } from "@/components/Themed";
import { Input } from "@/components/ui/input";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LinearGradient from "react-native-linear-gradient";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useSignUpMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/AuthProvider";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema for form validation
const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof schema>;

const defaultValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUp() {
  const router = useRouter();
  const [signUp] = useSignUpMutation();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const gradientColors = isDarkMode
    ? ["#010101", "#17202b"]
    : ["#FEFEFE", "#c1cbd6"];
  const gradientColorsButton = isDarkMode
    ? ["#467599", "#9ED8DB"]
    : ["#b0ddff", "#e0eced"];

  // Handle form submission
  const onSubmit = async (data: SignUpForm) => {
    try {
      const { data: formData } = await signUp({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
      if (formData?.signUp?.token) {
        await signIn({
          token: formData.signUp.token,
        });
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0.5, y: 0.4 }}
        end={{ x: 0.5, y: 0 }}
      />
      <ScrollView
        style={styles.container}
        bounces={false}
        darkColor="transparent"
        lightColor="transparent"
      >
        <View
          style={styles.header}
          darkColor="transparent"
          lightColor="transparent"
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons
              name="arrow-back"
              size={30}
              color={isDarkMode ? Colors.dark.text : Colors.light.text}
            />
          </TouchableOpacity>
        </View>
        <View
          style={styles.logoContainer}
          darkColor="transparent"
          lightColor="transparent"
        >
          <Image
            style={[
              styles.logo,
              {
                tintColor: isDarkMode ? Colors.dark.text : Colors.light.text,
              },
            ]}
            source={require("@/assets/images/scribble.png")}
            resizeMode="contain"
          />
          <Text>PictsManager</Text>
        </View>
        <Text style={styles.title}>Create Account</Text>
        <View
          style={styles.inputContainer}
          darkColor="transparent"
          lightColor="transparent"
        >
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                value={field.value}
                onChangeText={field.onChange}
                style={styles.input}
                placeholder="Enter Email"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect={false}
                darkColor={Colors.dark.text}
                lightColor={Colors.light.text}
                darkBackgroundColor={Colors.dark.background}
                lightBackgroundColor={Colors.light.background}
              />
            )}
          />
          {errors.email && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {errors.email.message}
            </Text>
          )}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                label="Password"
                style={styles.input}
                placeholder="Enter Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                darkColor={Colors.dark.text}
                lightColor={Colors.light.text}
                darkBackgroundColor={Colors.dark.background}
                lightBackgroundColor={Colors.light.background}
              />
            )}
          />
          {errors.password && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {errors.password.message}
            </Text>
          )}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                value={field.value}
                onChangeText={field.onChange}
                label="Confirm Password"
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                darkColor={Colors.dark.text}
                lightColor={Colors.light.text}
                darkBackgroundColor={Colors.dark.background}
                lightBackgroundColor={Colors.light.background}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>
        <View
          style={styles.buttonContainer}
          darkColor="transparent"
          lightColor="transparent"
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <LinearGradient
              colors={gradientColorsButton}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View
            style={styles.changeAuthContainer}
            darkColor="transparent"
            lightColor="transparent"
          >
            <Text
              style={styles.changeAuthText}
              lightColor={Colors.light.lighterBackground}
              darkColor={Colors.dark.lighterBackground}
            >
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text
                style={styles.changeAuthButton}
                lightColor={Colors.light.primary}
                darkColor={Colors.dark.primary}
              >
                Log In
              </Text>
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
    alignSelf: "center",
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 52,
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
