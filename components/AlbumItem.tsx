import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from "@/components/Themed";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface AlbumItemProps {
  album: string;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ album, isFirst, isLast, onSelect }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onSelect}
      style={[
        styles.albumContainer,
        isFirst ? styles.firstAlbum : {},
        isLast ? styles.lastAlbum : {},
        {
          backgroundColor: isDarkMode ? Colors.dark.lightBackground : Colors.light.lightBackground
        }
      ]}
    >
      <Image
        source={require("@/assets/images/placeholder.jpg")}
        style={styles.albumIcon}
      />
      <Text style={styles.albumName}>{album}</Text>
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
    marginLeft: 8
  },
});

export default AlbumItem;