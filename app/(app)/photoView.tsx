import React, { useState, useRef } from "react";
import { Text, View, BackgroundColor } from "@/components/Themed";
import { TouchableOpacity, StyleSheet, Image, Modal, TextInput, TextInputChangeEventData, NativeSyntheticEvent, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { AlbumSelector } from "@/components/AlbumSelector";
import { useAlbumsQuery, useUpdateTagPhotoMutation, useUpdatePhotoAlbumMutation, useDeletePhotoMutation } from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

function PhotoView() {
  const { id, url, tags, albumId, albumName } = useLocalSearchParams();

  const [deletePhoto] = useDeletePhotoMutation();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [modalVisible, setModalVisible] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [capturedText, setCapturedText] = useState<string[]>(Array.isArray(tags) ? tags : tags ? tags.split(', ') : []);

  const inputRef = useRef<TextInput | null>(null);

  const [updateTagPhoto] = useUpdateTagPhotoMutation();

  const { me } = useAuth();

  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(Array.isArray(albumId) ? albumId[0] : albumId || null);
  const { data: albumData } = useAlbumsQuery({
    variables: {
      where: {
        isWritableAlbum: true,
      },
    },
  });

  const [updatePhotoAlbum] = useUpdatePhotoAlbumMutation();

  const removeText = (index: number) => {
    const newTextArray = capturedText.filter((_, i) => i !== index);
    setCapturedText(newTextArray);
  };
  const handleInputChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    setInputValue(e.nativeEvent.text);

    // Check if the last character is a space
    if (e.nativeEvent.text.slice(-1) === " ") {
      // Add the text before the space to the capturedText array
      setCapturedText([...capturedText, e.nativeEvent.text.trim()]);
      setInputValue(""); // Reset input value if needed
    }
  };

  const handlePress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSave = async () => {
    await updateTagPhoto({
      variables: {
        id: id as string,
        tags: capturedText,
      },
    });
    await updatePhotoAlbum({
      variables: {
        id: id as string,
        albumId: selectedAlbum as string,
      },
      refetchQueries: ["Photos"],
    });
    setModalVisible(false);
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deletePhoto({
              variables: {
                id: id as string,
              },
              refetchQueries: ["Photos"],
            });
            router.back();
          },
          style: "destructive",
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={30}
            color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: url as string }}
        style={[styles.image, {
          backgroundColor: isDarkMode ? "black" : "white",
        }]}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons
            name="information-circle-outline"
            size={30}
            color={isDarkMode ? Colors.dark.primary : Colors.light.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons
            name="trash-outline"
            size={30}
            color={"#C64940"}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.modalViewParent}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={[styles.modalView, {
            backgroundColor: isDarkMode ? "black" : "white",
          }]}>
            <Text style={styles.title}>Tags</Text>
            <View
              style={styles.tagsInputContainer}
              backgroundColor={BackgroundColor.LightBackground}
            >
              <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.scrollView}>
                {capturedText.map((text, index) => (
                  <TouchableOpacity
                    onPress={() => removeText(index)}
                    key={index}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: isDarkMode
                          ? Colors.dark[BackgroundColor.LighterBackground]
                          : Colors.light[BackgroundColor.LighterBackground],
                      },
                    ]}
                  >
                    <Text style={styles.tagText}>{text}</Text>
                  </TouchableOpacity>
                ))}
                <TextInput
                  ref={inputRef}
                  style={styles.textInput}
                  onChange={handleInputChange}
                  value={inputValue}
                  autoComplete="off"
                  autoCorrect={false}
                />
              </TouchableOpacity>
            </View>
            {albumData?.albums && albumData?.albums?.length > 0 && (
              <>
                <Text style={styles.title}>Album</Text>
                <AlbumSelector
                  albums={albumData?.albums ?? []}
                  selectedAlbum={albumData.albums.find((album) => album.id === selectedAlbum) ?? albumData.albums[0]}
                  onAlbumSelect={setSelectedAlbum}
                  userId={me?.id as string}
                />
              </>
            )}
            <View style={styles.buttonContainer}>
              <Button
                activeOpacity={0.5}
                style={styles.button}
                onPress={() => setModalVisible(false)}
                variant="secondary"
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Button>
              <Button
                style={styles.button}
                activeOpacity={0.5}
                onPress={handleSave}
                variant="default"
              >
                <Text style={styles.buttonText}>Save</Text>
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
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
  image: {
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
    flex: 1,
    resizeMode: "contain",
  },
  footer: {
    bottom: 0,
    marginBottom: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalViewParent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "transparent"
  },
  modalView: {
    width: "100%",
    maxHeight: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 35,
    paddingTop: 10,
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 25,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "transparent",
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  tagsInputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    height: 100,
    width: "80%",
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 2,
  },
  scrollView: {
    flexWrap: "wrap",
    borderRadius: 8,
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },
  tag: {
    borderRadius: 4,
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 4,
    height: 30,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  textInput: {
    flex: 1,
  },
  title: {
    marginTop: 25,
    marginBottom: 4,
    fontSize: 24,
    fontWeight: "700",
    width: "80%",
  },
});

export default PhotoView;