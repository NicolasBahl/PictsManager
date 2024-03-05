import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/graphql/generated/graphql";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";

export default function SignIn() {
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

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Sign In
      </Text>
      <Input
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 16 }}
      />
      <Input
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        style={{ marginTop: 16 }}
        onPress={async () => {
          await signIn({
            variables: {
              email: email,
              password: password,
            },
          });
        }}
      >
        Sign In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
