import Colors from "@/constants/Colors";
import { useApolloClient } from "@apollo/client";
import React, { createContext, ReactElement, useEffect, useState } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useMeLazyQuery, User } from "@/graphql/generated/graphql";
import { Text } from "@/components/Themed";
import { router } from "expo-router";

type Me = Pick<User, "id" | "email">;

interface AuthContextType {
  me: Me | null;
  refreshMe: () => void;

  setMe(me: any): any;

  byPass: boolean;
  byPassSignIn(): void;

  signIn(
    { token, user }: { token: string; user?: any },
    provider?: string
  ): Promise<void>;

  signOut(): Promise<void>;
}

const AuthContext = createContext({} as AuthContextType);

export function useAuth() {
  const value = React.useContext(AuthContext);
  if (!value && process.env.NODE_ENV !== "production") {
    throw new Error("useAuth must be wrapped in a <AuthProvider />");
  }

  return value!;
}

export const AuthProvider = ({ children }: { children?: ReactElement }) => {
  const [networkError, setNetworkError] = useState(false);
  const [byPass, setByPass] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  const client = useApolloClient();
  const [authCheckQuery] = useMeLazyQuery({
    fetchPolicy: "network-only",
  });

  async function signIn(
    { token, user }: { token: string; user: any },
    provider?: string
  ) {
    await SecureStore.setItemAsync("token", token);
    const me = await refreshMe();

    router.replace("/");
  }

  // TODO: remove this function
  // NOTE: this is a temporary function to bypass the sign in screen
  async function byPassSignIn() {
    setByPass(true);
    router.replace("/");
  }

  async function signOut() {
    // await signOutMutation();
    await SecureStore.deleteItemAsync("token");
    await client?.clearStore();
    setMe(null);
  }

  async function refreshMe() {
    const { data, loading, error } = await authCheckQuery();
    if (error?.message?.includes("Network")) {
      setNetworkError(true);
    } else {
      setNetworkError(false);
      setMe(data?.me ? data?.me : null);
    }

    setIsReady(true);
    return data?.me;
  }

  useEffect(() => {
    refreshMe();

    return () => {};
  }, []);

  useEffect(() => {
    let timer: any;
    if (networkError) {
      timer = setInterval(() => {
        refreshMe();
      }, 1000); // 1s
    }
    return () => clearInterval(timer);
  }, [networkError]);

  if (!isReady)
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors?.light.background }}
      ></View>
    );

  // if (networkError) {
  //   // center text to avoid layout shift
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: Colors?.light.background,
  //         justifyContent: "center",
  //       }}
  //     >
  //       <View style={{ alignItems: "center" }}>
  //         <Text>Il semble y avoir un problème de connexion.</Text>
  //         <Text>Veuillez réessayer.</Text>
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <AuthContext.Provider
      value={{
        me,
        signIn,
        signOut,
        setMe,
        refreshMe,
        byPass,
        byPassSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
