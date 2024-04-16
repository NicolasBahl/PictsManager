import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, View, ScrollView, BackgroundColor } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import { AlbumSelector } from "@/components/AlbumSelector";
import React, { useEffect, useState, useRef } from "react";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import {
  useAddPhotoMutation,
  useCreateAlbumMutation,
  useCurrentAlbumsQuery,
} from "@/graphql/generated/graphql";
import { ReactNativeFile } from "apollo-upload-client";
export default function ModalScreen() {
  const { uri, metadata } = useLocalSearchParams();
  const [imageRatio, setImageRatio] = useState(1);

  const [inputValue, setInputValue] = useState("");
  const [capturedText, setCapturedText] = useState<string[]>([]);

  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");

  const { data: albumData } = useCurrentAlbumsQuery();
  const [addPhoto, { loading }] = useAddPhotoMutation();

  const [createAlbum, {loading: loadingAlbumCreation}] = useCreateAlbumMutation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

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

  const onCancel = () => {
    router.back();
  };

  const onAddPhoto = async () => {
    const photo = new ReactNativeFile({
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    await addPhoto({
      variables: {
        data: {
          albumId: selectedAlbum ?? undefined,
          tags: capturedText,
          photo,
          metadata: metadata,
        },
      },
      onError(e) {
        console.log(JSON.stringify(e));
      },
      onCompleted() {
        router.push({
          pathname: "/(app)/(tabs)/picture",
        });
      },
    });
  };

  // Get the image ratio to set the aspect ratio of the image
  useEffect(() => {
    Image.getSize(uri.toString(), (width, height) => {
      setImageRatio(width / height);
    });
  }, [uri, metadata, selectedAlbum]);

  const inputRef = useRef<TextInput | null>(null);

  const handlePress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: uri.toString() }}
          style={[styles.image, { aspectRatio: imageRatio }]}
        />
        <Text style={styles.title}>Tags</Text>
        <View
          style={styles.tagsInputContainer}
          backgroundColor={BackgroundColor.LightBackground}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            style={styles.scrollView}
          >
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
        <Text style={styles.title}>Create an album</Text>
        <View
          style={styles.createAlbumContainer}
          backgroundColor={BackgroundColor.LightBackground}
        >
          <TextInput
            value={title}
            onChangeText={(text) => setTitle(text)}
            selectionColor={"white"}
            style={styles.createAbumInput}
            placeholder={"Write the album name"}
          />
          <Button
            style={{ width: "20%" }}
            disabled={loadingAlbumCreation}
            onPress={() =>
              createAlbum({
                variables: {
                  title,
                },
                refetchQueries: ["CurrentAlbums"],
                onCompleted: () => {
                  setTitle("");
                },
              })
            }
            variant="default"
          >
            <Text style={styles.buttonText}>Save</Text>
          </Button>
        </View>
        {albumData?.me?.albums && albumData.me?.albums?.length > 0 && (
          <>
            <Text style={styles.title}>Album</Text>
            <AlbumSelector
              albums={albumData?.me?.albums ?? []}
              selectedAlbum={
                albumData?.me.albums.find(
                  (album) => album.id === selectedAlbum,
                ) ?? albumData?.me.albums[0]
              }
              onAlbumSelect={setSelectedAlbum}
            />
          </>
        )}
        <View style={styles.buttonContainer}>
          <Button
            activeOpacity={0.5}
            style={styles.button}
            onPress={onCancel}
            variant="secondary"
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Button>

          <Button
            style={styles.button}
            disabled={loading}
            activeOpacity={0.5}
            onPress={onAddPhoto}
            variant="default"
          >
            <Text style={styles.buttonText}>Save</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
  },
  image: {
    marginTop: 20,
    width: "80%",
    borderRadius: 8,
    resizeMode: "contain",
  },
  title: {
    marginTop: 25,
    marginBottom: 4,
    fontSize: 24,
    fontWeight: "700",
    width: "80%",
  },
  buttonContainer: {
    marginTop: 25,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
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
  createAlbumContainer: {
    flexDirection: "row",
    paddingLeft: 20,
    height: 60,
    width: "80%",
    borderRadius: 8,
  },
  createAbumInput: {
    width: "80%",
    height: "100%",
  },
});
