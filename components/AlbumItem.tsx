import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { Album } from "@/graphql/generated/graphql";
import { Ionicons } from '@expo/vector-icons';

interface AlbumItemProps {
  album: Pick<Album, "title" | "id">;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  shared?: boolean;
}

const AlbumItem: React.FC<AlbumItemProps> = ({
  album,
  isFirst,
  isLast,
  onSelect,
  shared = false,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onSelect}
      style={[
        styles.albumContainer,
        isFirst ? styles.firstAlbum : {},
        isLast ? styles.lastAlbum : {},
        {
          backgroundColor: isDarkMode
            ? Colors.dark.lightBackground
            : Colors.light.lightBackground,
        },
      ]}
    >
      <Image
        source={require("@/assets/images/placeholder.jpg")}
        style={styles.albumIcon}
      />
      <Text style={[styles.albumName]}>{album && album.title}</Text>
      {shared &&
        <Ionicons
          name="people-sharp"
          size={24}
          color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
          style={styles.shared}
        />
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  albumContainer: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    width: "100%",
  },
  firstAlbum: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastAlbum: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  albumIcon: {
    width: 72,
    height: 72,
    borderRadius: 4,
    margin: 4,
    resizeMode: "cover",
  },
  albumName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  shared: {
    position: "absolute",
    right: 16,
  }
});

export default AlbumItem;
