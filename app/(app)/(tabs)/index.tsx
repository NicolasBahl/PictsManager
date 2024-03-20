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

  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleSelect = (album: string) => {
    if (!isSelectMode) {
      return;
    }
    if (selectedAlbums.includes(album)) {
      setSelectedAlbums(selectedAlbums.filter(a => a !== album));
    } else {
      setSelectedAlbums([...selectedAlbums, album]);
    }
    console.log(selectedAlbums);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Albums</Text>
        <ContextMenuButton
          style={{ position: 'absolute', right: 0 }}
          menuConfig={isSelectMode ? {
            menuTitle: '',
            menuItems: [{
              actionKey: 'selectAll',
              actionTitle: selectedAlbums.length === albums.length ? 'Unselect All' : 'Select All',
              icon: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'checkmark',
                },
              },
            }, {
              actionKey: 'delete',
              actionTitle: 'Delete',
              icon: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'trash',
                },
              },
            }, {
              actionKey: 'cancel',
              actionTitle: 'Cancel',
              icon: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'xmark',
                },
              },
            }],
          } : {
            menuTitle: '',
            menuItems: [{
              actionKey: 'select',
              actionTitle: 'Select',
              icon: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'checkmark',
                },
              },
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
          onPressMenuItem={({ nativeEvent }) => {
            if (nativeEvent.actionKey === 'select') {
              setIsSelectMode(true);
            } else if (nativeEvent.actionKey === 'cancel') {
              setIsSelectMode(false);
              setSelectedAlbums([]);
            } else if (nativeEvent.actionKey === 'selectAll') {
              if (selectedAlbums.length === albums.length) {
                setSelectedAlbums([]);
              } else {
                setSelectedAlbums(albums);
              }
            } else if (nativeEvent.actionKey === 'delete') {
              setSelectedAlbums([]);
            }
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
              {isSelectMode && (
                <Ionicons
                  name={selectedAlbums.includes(album) ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={24}
                  color="#467599"
                  style={styles.select}
                  onPress={() => handleSelect(album)}
                />
              )}
              <AlbumItem
                album={album}
                isFirst={true}
                isLast={true}
                onSelect={() => handleSelect(album)}
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
  select: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  }
});