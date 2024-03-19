import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Animated, Modal, LayoutChangeEvent } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import AlbumItem from './AlbumItem';

interface AlbumSelectorProps {
  albums: string[];
  selectedAlbum: string;
  onAlbumSelect: (album: string) => void;
  onSelect: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const AlbumSelector: React.FC<AlbumSelectorProps> = ({ albums, selectedAlbum, onAlbumSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const albumRef = useRef<View>(null);

  const handlePress = () => {
    albumRef.current?.measureInWindow((x, y, width, height) => {
      setModalPosition({
        x,
        y: (albums.length > 3) ? y - (270 - height) : y - (height * (albums.length - 1))
      });
      setIsMenuOpen(true);
    });
  };

  return (
    <>
      <View ref={albumRef} style={styles.albumContainer}>
        <AlbumItem
          album={selectedAlbum}
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
        <Animated.View style={[styles.modalContainer, { top: modalPosition.y, left: modalPosition.x }]}>
          <ScrollView>
            {albums.map((album, index) => (
              <AlbumItem
                key={album}
                album={album}
                isFirst={index === 0}
                isLast={index === albums.length - 1}
                onSelect={() => {
                  onAlbumSelect(album);
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
  modalContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    width: "80%",
    maxHeight: 270,
  },
});