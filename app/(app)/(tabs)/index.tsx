import React, { useRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Text, ScrollView, View } from '@/components/Themed';
import SearchBar from '@/components/SearchBar';
import AlbumItem from '@/components/AlbumItem';

export default function Albums() {
  const searchBarRef = useRef(null);

  const albums = ['Landscape', 'Nature', 'City', 'People', 'Animals', 'Food', 'Art', 'Other', 'Car', 'Travel', 'Architecture', 'Fashion', 'Sport', 'Technology', 'Business', 'Education', 'Health', 'Science', 'Music', 'Film', 'Books', 'Games', 'Hobbies', 'Family', 'Friends', 'Love', 'Selfie'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Albums</Text>
      </View>
      <ScrollView>
        <View style={styles.searchBar}>
          <SearchBar
            ref={searchBarRef}
            placeholder="Search albums"
            onChangeText={(text) => console.log(text)}
          />
        </View>
        <View style={styles.albumContainer}>
          {albums.map((album, index) => (
            <View key={album} style={styles.album}>
              <AlbumItem
                album={album}
                isFirst={true}
                isLast={true}
                onSelect={() => console.log(album)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 14,
  },
  albumContainer: {
    alignSelf: 'center',
    width: "90%",
  },
  album: {
    marginBottom: 8,
  },
});