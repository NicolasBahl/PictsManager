import React from "react";
import { Text, View } from "@/components/Themed";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

function PhotoView() {
  const { id, url, tags, albumId, albumName } = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={30}
            color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: url as string }}
        style={[styles.image, {
          backgroundColor: isDarkMode ? "black" : "white",
        }]}
      />
      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons
            name="information-circle-outline"
            size={30}
            color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="trash-outline"
            size={30}
            color={"#C64940"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
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
  image: {
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
    flex: 1,
    resizeMode: "contain",
  },
  footer: {
    bottom: 0,
    marginBottom: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  }
});

export default PhotoView;