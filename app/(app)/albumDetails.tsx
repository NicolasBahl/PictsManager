import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text, View } from "@/components/Themed";
import SearchBar from "@/components/SearchBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ContextMenuButton } from "react-native-ios-context-menu";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import {
  Photo,
  useDeletePhotoMutation,
  usePhotosQuery,
} from "@/graphql/generated/graphql";
import { Skeleton } from "moti/skeleton";
import { useDebounceValue } from "usehooks-ts";

function AlbumDetails() {
  const { albumTitle, albumId } = useLocalSearchParams();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [text, setText] = useDebounceValue('', 500);
  const [selectedImages, setSelectedImages] = useState<Pick<Photo, "id">[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const { data: photosData, loading } = usePhotosQuery({
    variables: {
      where: {
        albumId: albumId as string,
        search: text,
      },
    },
  });

  const [deletePhoto] = useDeletePhotoMutation();

  const onChangeText = (text: string) => {
    setText(text);
  };

  const numColumns = 3;
  const imageSize =
    (Dimensions.get("window").width * 0.9 - (numColumns + 1) * 4) / numColumns;

  const ImageItem = ({ item }: { item: Pick<Photo, "media" | "id"> }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <View
        onTouchEnd={() => {
          if (isSelectMode) {
            setSelectedImages((prev) => {
              if (prev.includes(item)) {
                return prev.filter((i) => i.id !== item.id);
              } else {
                return [...prev, item];
              }
            });
          }
        }}
      >
        <Skeleton
          show={isLoading}
          colorMode={isDarkMode ? "dark" : "light"}
          radius={"square"}
        >
          <Image
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            source={{ uri: item.media.url || "" }}
            style={{
              ...styles.image,
              width: imageSize,
              height: imageSize,
            }}
          />
        </Skeleton>
        {isSelectMode && (
          <Ionicons
            name={
              selectedImages.includes(item)
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={24}
            color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
            style={styles.imageIcon}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={30}
            color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
          />
          <Text
            style={styles.backText}
            lightColor={Colors.light.primary}
            darkColor={Colors.dark.primary}
          >
            All albums
          </Text>
        </TouchableOpacity>
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
                      selectedImages.length === photosData?.photos.length
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
                        actionKey: "sort-date-asc",
                        actionTitle: "Date Asc",
                        icon: {
                          type: "IMAGE_SYSTEM",
                          imageValue: {
                            systemName: "calendar",
                          },
                        },
                      },
                      {
                        actionKey: "sort-date-desc",
                        actionTitle: "Date Desc",
                        icon: {
                          type: "IMAGE_SYSTEM",
                          imageValue: {
                            systemName: "calendar.badge.minus",
                          },
                        },
                      },
                    ],
                  },
                  {
                    actionKey: "settings",
                    actionTitle: "Settings",
                    icon: {
                      type: "IMAGE_SYSTEM",
                      imageValue: {
                        systemName: "gear",
                      },
                    },
                  },
                ],
              }
          }
          onPressMenuItem={({ nativeEvent }) => {
            switch (nativeEvent.actionKey) {
              case "select":
                setIsSelectMode(true);
                break;
              case "selectAll":
                if (selectedImages.length === photosData?.photos.length) {
                } else {
                  setSelectedImages(photosData?.photos ?? []);
                }
                break;
              case "delete":
                selectedImages.map((image) => {
                  deletePhoto({
                    variables: {
                      id: image.id,
                    },
                    refetchQueries: ["Photos"],
                  });
                });
                setIsSelectMode(false);
                break;
              case "cancel":
                setSelectedImages([]);
                setIsSelectMode(false);
                break;
              case "sort-date-asc":
                break;
              case "sort-date-desc":
                break;
              case "settings":
                router.push({
                  pathname: "/(app)/albumSettings",
                  params: { albumId },
                });
                break;
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
      <Text style={styles.titleAlbum}>{albumTitle}</Text>
      <SearchBar onChangeText={onChangeText} />
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size={"large"}
          color={"#08aaff"}
        />
      )}
      <View style={styles.imageContainerParent}>
        {photosData && photosData.photos.length > 0 ? (
          <FlatList
            data={photosData?.photos ?? []}
            renderItem={({ item }) => (
              <View
                onTouchEnd={() => {
                  if (isSelectMode) {
                    setSelectedImages((prev) => {
                      if (prev.includes(item)) {
                        return prev.filter((i) => i.id !== item.id);
                      } else {
                        return [...prev, item];
                      }
                    });
                  } else {
                    router.push({
                      pathname: "/(app)/photoView",
                      params: {
                        id: item.id,
                        url: item.media.url ?? "",
                        tags: item.tags.map((tag: { name: string }) => tag.name).join(', '),
                        albumId: albumId,
                        albumName: albumTitle,
                      },
                    });
                  }
                }}
              >
                <Image
                  source={{ uri: item.media.url || "" }}
                  style={{ ...styles.image, width: imageSize, height: imageSize }}
                />
                {isSelectMode && (
                  <Ionicons
                    name={
                      selectedImages.includes(item)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={24}
                    color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
                    style={styles.imageIcon}
                  />
                )}
              </View>
            )}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            style={styles.imageContainer}
          />
        ) : (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text
              style={{
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }}
            >
              {text ? "No photos found 😢" : "No photos in this album 😢"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    width: "90%",
    alignSelf: "center",
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
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 4,
    width: "90%",
    alignSelf: "center",
  },
  imageContainerParent: {
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 8,
    width: "90%",
  },
  imageIcon: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  image: {
    margin: 2,
  },
  loader: {
    marginVertical: 20,
  },
});

export default AlbumDetails;
