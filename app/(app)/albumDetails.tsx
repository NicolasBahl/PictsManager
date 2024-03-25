import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import SearchBar from '@/components/SearchBar';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

function AlbumDetails() {
  const { album } = useLocalSearchParams();
  const router = useRouter();

  const images = [
    'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-james-wheeler-414612.jpg&fm=jpg',
    'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
    'https://imgupscaler.com/images/samples/animal-after.webp',
    'https://kinsta.com/fr/wp-content/uploads/sites/4/2020/09/jpeg.jpg'
  ];

  const numColumns = 3;
  const imageSize = (Dimensions.get('window').width * 0.9 - (numColumns + 1) * 4) / numColumns;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={30} color="#467599" />
        <Text style={styles.backText}>All albums</Text>
      </TouchableOpacity>
      <Text style={styles.titleAlbum}>{album}</Text>
      <SearchBar />
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ ...styles.image, width: imageSize, height: imageSize }} />
        )}
        keyExtractor={item => item}
        numColumns={numColumns}
        style={styles.imageContainer}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    marginTop: 60,
    paddingLeft: 16,
    flexDirection: "row",
  },
  backText: {
    fontSize: 17,
    color: "#467599",
    marginTop: 4,
  },
  titleAlbum: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 24,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 8,
  },
  image: {
    margin: 2,
  },
});

export default AlbumDetails;