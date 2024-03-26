import React, { useRef, useState } from "react";
import {ActivityIndicator, StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, ScrollView, View } from "@/components/Themed";
import SearchBar from "@/components/SearchBar";
import AlbumItem from "@/components/AlbumItem";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { Album, useAlbumsQuery } from "@/graphql/generated/graphql";

export default function Albums() {
  const searchBarRef = useRef(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  const { data: albums, loading } = useAlbumsQuery({
    variables: {
      where: {
        title: searchText ?? undefined,
      },
    },
  });

  const [selectedAlbums, setSelectedAlbums] = useState<
    Pick<Album, "title" | "id">[]
  >([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleSelect = (album: Album) => {
    if (!isSelectMode) {
      router.push({
        pathname: "/(app)/albumDetails",
        params: { albumTitle: album.title, albumId: album.id },
      });
      return;
    }
    if (selectedAlbums.includes(album)) {
      setSelectedAlbums(selectedAlbums.filter((a) => a !== album));
    } else {
      setSelectedAlbums([...selectedAlbums, album]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Albums</Text>
        <ContextMenuButton
          style={{ position: "absolute", right: 0 }}
          menuConfig={
            isSelectMode
              ? {
                  menuTitle: "",
                  menuItems: [
                    {
                      actionKey: "selectAll",
                      actionTitle:
                        selectedAlbums.length === albums?.albums.length
                          ? "Unselect All"
                          : "Select All",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: "checkmark",
                        },
                      },
                    },
                    {
                      actionKey: "delete",
                      actionTitle: "Delete",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: "trash",
                        },
                      },
                    },
                    {
                      actionKey: "cancel",
                      actionTitle: "Cancel",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: "xmark",
                        },
                      },
                    },
                  ],
                }
              : {
                  menuTitle: "",
                  menuItems: [
                    {
                      actionKey: "select",
                      actionTitle: "Select",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: "checkmark",
                        },
                      },
                    },
                    {
                      menuTitle: "Sort",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: "arrow.up.arrow.down",
                        },
                      },
                      menuItems: [
                        {
                          actionKey: "sort-name",
                          actionTitle: "Name",
                          icon: {
                            type: "IMAGE_SYSTEM",
                            imageValue: {
                              systemName: "textformat.abc",
                            },
                          },
                        },
                        {
                          actionKey: "sort-date",
                          actionTitle: "Date",
                          icon: {
                            type: "IMAGE_SYSTEM",
                            imageValue: {
                              systemName: "calendar",
                            },
                          },
                        },
                        {
                          actionKey: "sort-size",
                          actionTitle: "Size",
                          icon: {
                            type: "IMAGE_SYSTEM",
                            imageValue: {
                              systemName: "square.grid.2x2",
                            },
                          },
                        },
                      ],
                    },
                  ],
                }
          }
          onPressMenuItem={({ nativeEvent }) => {
            if (nativeEvent.actionKey === "select") {
              setIsSelectMode(true);
            } else if (nativeEvent.actionKey === "cancel") {
              setIsSelectMode(false);
              setSelectedAlbums([]);
            } else if (nativeEvent.actionKey === "selectAll") {
              if (selectedAlbums.length === albums?.albums.length) {
                setSelectedAlbums([]);
              } else {
                setSelectedAlbums(albums?.albums || []);
              }
            } else if (nativeEvent.actionKey === "delete") {
              setSelectedAlbums([]);
            }
          }}
        >
          <Ionicons
            name="ellipsis-horizontal-circle"
            size={28}
            color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
          />
        </ContextMenuButton>
      </View>
      <ScrollView>
        <View style={styles.searchBar}>
          <SearchBar
            ref={searchBarRef}
            placeholder="Search albums"
            onChangeText={(text) => setSearchText(text)}
          />
          {loading && <ActivityIndicator style={styles.loader} size={"large"} color={"#08aaff"}/>}
        </View>
        <View style={styles.albumContainer}>
          {albums &&
            albums?.albums.map((album) => (
              <View key={album.id} style={styles.album}>
                {isSelectMode && (
                  <Ionicons
                    name={
                      selectedAlbums.includes(album)
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={24}
                    color={
                      isDarkMode ? Colors.dark.primary : Colors.light.primary
                    }
                    style={styles.select}
                    onPress={() => handleSelect(album as Album)}
                  />
                )}
                <AlbumItem
                  album={album}
                  isFirst={true}
                  isLast={true}
                  onSelect={() => handleSelect(album as Album)}
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
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    marginBottom: 14,
  },
  albumContainer: {
    alignSelf: "center",
    width: "90%",
  },
  album: {
    marginBottom: 8,
  },
  select: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  loader: {
    marginVertical: 20
  }
});
