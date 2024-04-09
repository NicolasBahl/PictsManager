import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ScrollView, Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import {
  AlbumPermission,
  useAddAccessUserMutation,
  useAlbumQuery,
  useRemoveAccessUserMutation,
  useUpdateAlbumMutation,
} from "@/graphql/generated/graphql";
import TapView from "@/components/TabView";

function AlbumSettings() {
  const { albumId } = useLocalSearchParams();

  const [userEmail, setUserEmail] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { data } = useAlbumQuery({
    variables: {
      albumId: albumId as string,
    },
  });

  const [addAccess, { loading }] = useAddAccessUserMutation();

  const [selectedPermission, setSelectedPermission] = useState<AlbumPermission>(
    data?.album?.permission ?? AlbumPermission.CanRead,
  );

  const [editAlbum, { loading: editLoading }] = useUpdateAlbumMutation({
    refetchQueries: ["Album", "Albums", "Photos"],
  });

  const [removeAccess] = useRemoveAccessUserMutation();

  useEffect(() => {
    if (data?.album?.title) {
      setAlbumTitle(data.album.title);
    }
  }, [data?.album?.title]);

  useEffect(() => {
    if (data?.album?.permission) {
      setSelectedPermission(data.album.permission);
    }
  }, [data?.album?.permission]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView keyboardShouldPersistTaps="always" bounces={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.back}>
              <Ionicons
                name="chevron-back"
                size={30}
                color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
              />
              <Text
                style={styles.backText}
                lightColor={Colors.light.primary}
                darkColor={Colors.dark.primary}
              >
                {albumTitle}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.listSettings}>
            <Text style={styles.textSettings}>Name of the album:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.dark.lightBackground
                      : Colors.light.lightBackground,
                    color: isDarkMode ? Colors.dark.text : Colors.light.text,
                  },
                ]}
                value={albumTitle}
                onChangeText={(text) => setAlbumTitle(text)}
              />
              <TouchableOpacity
                disabled={editLoading || albumTitle === data?.album?.title}
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor:
                      albumTitle === data?.album?.title
                        ? "gray"
                        : isDarkMode
                          ? Colors.dark.primary
                          : Colors.light.primary,
                    opacity: editLoading ? 0.5 : 1,
                  },
                ]}
                onPress={() =>
                  editAlbum({
                    variables: {
                      updateAlbumId: albumId as string,
                      title: albumTitle,
                    },
                  })
                }
              >
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={isDarkMode ? Colors.dark.text : Colors.light.text}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textSettings}>User can:</Text>
            <TapView
              onChange={(value: AlbumPermission) => {
                setSelectedPermission(value);
                editAlbum({
                  variables: {
                    updateAlbumId: albumId as string,
                    permission: value,
                  },
                });
              }}
              options={[
                { label: "View", value: AlbumPermission.CanRead },
                { label: "Write", value: AlbumPermission.CanWrite },
              ]}
              value={selectedPermission}
            />
            <Text style={styles.textSettings}>
              All users who have access to your album:
            </Text>
            <ScrollView
              style={styles.usersList}
              lightColor={Colors.light.lightBackground}
              darkColor={Colors.dark.lightBackground}
            >
              {data?.album?.accessByUsers.map((user, index) => (
                <View
                  key={index}
                  style={styles.userContainer}
                  lightColor={Colors.light.lighterBackground}
                  darkColor={Colors.dark.lighterBackground}
                >
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={isDarkMode ? Colors.dark.text : Colors.light.text}
                    style={styles.userIcon}
                  />
                  <Text
                    style={styles.userEmail}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {user.email}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      removeAccess({
                        variables: {
                          removeAccessUserId: albumId as string,
                          userEmail: user.email,
                        },
                        refetchQueries: ["Album", "Albums"],
                      })
                    }
                    style={styles.userDelete}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={isDarkMode ? Colors.dark.text : Colors.light.text}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <Text style={styles.textSettings}>Add a user:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.dark.lightBackground
                      : Colors.light.lightBackground,
                    color: isDarkMode ? Colors.dark.text : Colors.light.text,
                  },
                ]}
                onChangeText={(text) => setUserEmail(text)}
                placeholder="Enter user email"
                keyboardType="email-address"
                autoComplete="email"
              />
              <TouchableOpacity
                disabled={loading}
                onPress={async () => {
                  addAccess({
                    variables: {
                      addAccessUserId: albumId as string,
                      userEmail: userEmail,
                    },
                    refetchQueries: ["Album", "Albums"],
                    onError: (error) => {
                      Alert.alert(error.message);
                    },
                    onCompleted: () => {
                      Alert.alert("User added successfully");
                      setUserEmail("");
                    },
                  });
                }}
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.dark.primary
                      : Colors.light.primary,
                  },
                ]}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={isDarkMode ? Colors.dark.text : Colors.light.text}
                />
              </TouchableOpacity>
            </View>
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
  header: {
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
  backText: {
    fontSize: 17,
    marginTop: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 4,
    width: "90%",
    alignSelf: "center",
  },
  listSettings: {
    alignSelf: "center",
    width: "90%",
  },
  textSettings: {
    fontSize: 16,
    marginTop: 16,
  },
  usersList: {
    marginTop: 4,
    height: 200,
    borderRadius: 8,
    padding: 4,
    marginBottom: 10,
  },
  userContainer: {
    height: 50,
    width: "100%",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userIcon: {
    marginLeft: 10,
  },
  userEmail: {
    marginLeft: 10,
    fontSize: 16,
    width: "70%",
    flexShrink: 1,
    overflow: "hidden",
  },
  userDelete: {
  userDelete: {
    position: "absolute",
    right: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
    height: 40,
  },
  input: {
    borderRadius: 8,
    padding: 8,
    marginRight: 4,
    flex: 4,
  },
  confirmButton: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default AlbumSettings;
