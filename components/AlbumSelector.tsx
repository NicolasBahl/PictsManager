import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Modal,
  LayoutChangeEvent,
} from "react-native";
import AlbumItem from "./AlbumItem";
import { Album } from "@/graphql/generated/graphql";
interface AlbumSelectorProps {
  albums: Pick<Album, "id" | "title">[];
  selectedAlbum: Pick<Album, "id" | "title">;
  onAlbumSelect: (album: string | null) => void;
  onSelect?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const AlbumSelector: React.FC<AlbumSelectorProps> = ({
  albums,
  selectedAlbum,
  onAlbumSelect,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const albumRef = useRef<View>(null);

  const handlePress = () => {
    albumRef.current?.measureInWindow((x, y, width, height) => {
      setModalPosition({
        x,
        y:
          albums.length > 3
            ? y - (270 - height)
            : y - height * (albums.length - 1),
      });
      setIsMenuOpen(true);
    });
  };

  return (
    <>
      <View ref={albumRef} style={styles.albumContainer}>
        <AlbumItem
          album={
            albums.find((album) => album.id === selectedAlbum.id)
              ? selectedAlbum
              : albums[0]
          }
          isFirst={true}
          isLast={true}
          onSelect={handlePress}
        />
      </View>
      <Modal
        visible={isMenuOpen}
        transparent
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            { top: modalPosition.y, left: modalPosition.x },
          ]}
        >
          <ScrollView>
            {albums.map((album, index) => (
              <AlbumItem
                key={album.id}
                album={album}
                isFirst={index === 0}
                isLast={index === albums.length - 1}
                onSelect={() => {
                  onAlbumSelect(album.id);

                  setIsMenuOpen(false);
                }}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  albumContainer: {
    alignContent: "center",
    alignItems: "center",
    width: "80%",
  },
  firstAlbum: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastAlbum: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  oneAlbum: {
    borderRadius: 8,
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
    marginLeft: 8,
  },
  modalContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    width: "80%",
    maxHeight: 270,
  },
});
