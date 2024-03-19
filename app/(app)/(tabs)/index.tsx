import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, ScrollView, View } from '@/components/Themed';
import SearchBar from '@/components/SearchBar';
import AlbumItem from '@/components/AlbumItem';
import { ContextMenuButton } from 'react-native-ios-context-menu';

export default function Albums() {
  const searchBarRef = useRef(null);

  const albums = ['Landscape', 'Nature', 'City', 'People', 'Animals', 'Food', 'Art', 'Other', 'Car', 'Travel', 'Architecture', 'Fashion', 'Sport', 'Technology', 'Business', 'Education', 'Health', 'Science', 'Music', 'Film', 'Books', 'Games', 'Hobbies', 'Family', 'Friends', 'Love', 'Selfie'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Albums</Text>
        <ContextMenuButton
          style={{ position: 'absolute', right: 0 }}
          menuConfig={{
            menuTitle: '',
            menuItems: [{
              actionKey: 'select',
              actionTitle: 'Select',
              icon: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'checkmark',
                },
              }
            }, {
              menuTitle: 'Sort',
              icon: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'arrow.up.arrow.down',
                },
              },
              menuItems: [{
                actionKey: 'sort-name',
                actionTitle: 'Name',
                icon: {
                  type: 'IMAGE_SYSTEM',
                  imageValue: {
                    systemName: 'textformat.abc',
                  },
                }
              }, {
                actionKey: 'sort-date',
                actionTitle: 'Date',
                icon: {
                  type: 'IMAGE_SYSTEM',
                  imageValue: {
                    systemName: 'calendar',
                  },
                }
              }, {
                actionKey: 'sort-size',
                actionTitle: 'Size',
                icon: {
                  type: 'IMAGE_SYSTEM',
                  imageValue: {
                    systemName: 'square.grid.2x2',
                  },
                }
              }]
            }],
          }}
        >
          <Ionicons name="ellipsis-horizontal-circle" size={28} color="#467599" />
        </ContextMenuButton>
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
    alignSelf: 'center',
    width: "90%",
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