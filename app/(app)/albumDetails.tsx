import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import SearchBar from '@/components/SearchBar';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { ContextMenuButton } from 'react-native-ios-context-menu';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function AlbumDetails() {
  const { albumTitle,albumId } = useLocalSearchParams();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const images = [
    'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-james-wheeler-414612.jpg&fm=jpg',
    'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
    'https://imgupscaler.com/images/samples/animal-after.webp',
    'https://kinsta.com/fr/wp-content/uploads/sites/4/2020/09/jpeg.jpg'
  ];
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const numColumns = 3;
  const imageSize = (Dimensions.get('window').width * 0.9 - (numColumns + 1) * 4) / numColumns;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={30} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
          <Text style={styles.backText} lightColor={Colors.light.primary} darkColor={Colors.dark.primary}>All albums</Text>
        </TouchableOpacity>
        <ContextMenuButton
          style={{ position: 'absolute', right: 0 }}
          menuConfig={isSelectMode ? {
            menuTitle: '',
            menuItems: [{
              actionKey: 'selectAll',
              actionTitle: selectedImages.length === images.length ? 'Unselect All' : 'Select All',
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
                actionKey: 'sort-date-asc',
                actionTitle: 'Date Asc',
                icon: {
                  type: 'IMAGE_SYSTEM',
                  imageValue: {
                    systemName: 'calendar',
                  },
                }
              }, {
                actionKey: 'sort-date-desc',
                actionTitle: 'Date Desc',
                icon: {
                  type: 'IMAGE_SYSTEM',
                  imageValue: {
                    systemName: 'calendar.badge.minus',
                  },
                }
              }]
            }, {
              actionKey: 'settings',
              actionTitle: 'Settings',
              icon: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'gear',
                },
              },
            }],
          }}
          onPressMenuItem={({ nativeEvent }) => {
            switch (nativeEvent.actionKey) {
              case 'select':
                setIsSelectMode(true);
                break;
              case 'selectAll':
                if (selectedImages.length === images.length) {
                  setSelectedImages([]);
                } else {
                  setSelectedImages(images);
                }
                break;
              case 'delete':
                setSelectedImages([]);
                setIsSelectMode(false);
                break;
              case 'cancel':
                setSelectedImages([]);
                setIsSelectMode(false);
                break;
              case 'sort-date-asc':
                break;
              case 'sort-date-desc':
                break;
              case 'settings':
                router.push({ pathname: '/(app)/albumSettings', params: { albumId } });
                break;
            }
          }}
        >
          <Ionicons name="ellipsis-horizontal-circle" size={28} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
        </ContextMenuButton>
      </View>
      <Text style={styles.titleAlbum}>{albumTitle}</Text>
      <SearchBar />
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <View
            onTouchEnd={() => {
              if (isSelectMode) {
                setSelectedImages(prev => {
                  if (prev.includes(item)) {
                    return prev.filter(i => i !== item);
                  } else {
                    return [...prev, item];
                  }
                });
              }
            }}
          >
            <Image source={{ uri: item }} style={{ ...styles.image, width: imageSize, height: imageSize }} />
            {isSelectMode && (
              <Ionicons
                name={selectedImages.includes(item) ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
                style={styles.imageIcon}
              />
            )}
          </View>
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
  header: {
    marginTop: 60,
    width: "90%",
    alignSelf: 'center',
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
  titleAlbum: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
    width: "90%",
    alignSelf: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 8,
  },
  imageIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  image: {
    margin: 2,
  },
});

export default AlbumDetails;