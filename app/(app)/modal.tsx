import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
} from "react-native";
import { Text, View, ScrollView, BackgroundColor } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "../../components/ui/button";
import { useEffect, useState, useRef } from "react";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
export default function ModalScreen() {
  const { uri } = useLocalSearchParams();
  const [imageRatio, setImageRatio] = useState(1);

  const [inputValue, setInputValue] = useState("");
  const [capturedText, setCapturedText] = useState<string[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('Landscapes');
  const albums = ['Landscape', 'Nature', 'City', 'People', 'Animals', 'Food', 'Art', 'Other', 'Car', 'Travel', 'Architecture', 'Fashion', 'Sport', 'Technology', 'Business', 'Education', 'Health', 'Science', 'Music', 'Film', 'Books', 'Games', 'Hobbies', 'Family', 'Friends', 'Love', 'Selfie'];

  const albumRef = useRef<TouchableOpacity>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const removeText = (index: number) => {
    const newTextArray = capturedText.filter((_, i) => i !== index);
    setCapturedText(newTextArray);
  };
  const handleInputChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
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

  // Get the image ratio to set the aspect ratio of the image
  useEffect(() => {
    Image.getSize(uri.toString(), (width, height) => {
      setImageRatio(width / height);
    });
  }, [uri]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: uri.toString() }} style={[styles.image, { aspectRatio: imageRatio }]} />
        <Text style={styles.title}>Tags</Text>
        <View style={styles.tagsInputContainer} backgroundColor={BackgroundColor.LightBackground}>
          <View style={styles.scrollView} backgroundColor={BackgroundColor.LightBackground}>
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
              style={styles.textInput}
              onChange={handleInputChange}
              value={inputValue}
              autoComplete="off"
              autoCorrect={false}
            />
          </View>
        </View>
        <Text style={styles.title}>Album</Text>
        <TouchableOpacity
          ref={albumRef}
          onPress={() => {
            if (albumRef.current) {
              albumRef.current.measure((x, y, width, height, pageX, pageY) => {
                setModalPosition({
                  x: pageX,
                  y: (albums.length > 3) ? pageY - (270 - height) : pageY - (height * (albums.length - 1))
                });
                setIsMenuOpen(true);
              });
            }
          }}
          style={[styles.albumContainer, styles.oneAlbum]}
        >
          <Image
            source={require("@/assets/images/placeholder.jpg")}
            style={styles.albumIcon}
          />
          <Text style={styles.albumName}>{selectedAlbum}</Text>
        </TouchableOpacity>
        <Modal
          visible={isMenuOpen}
          transparent
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <Animated.View style={[styles.modalContainer, { top: modalPosition.y, left: modalPosition.x }]}>
            <ScrollView>
              {albums.map((album, index) => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={album}
                  onPress={() => {
                    setSelectedAlbum(album);
                    setIsMenuOpen(false);
                  }}
                  style={[
                    styles.albumContainer,
                    index === 0 ? styles.firstAlbum : {},
                    index === albums.length - 1 ? styles.lastAlbum : {},
                  ]}
                >
                  <Image
                    source={require("@/assets/images/placeholder.jpg")}
                    style={styles.albumIcon}
                  />
                  <Text style={styles.albumName}>{album}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Modal>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={onCancel} variant="secondary">
            <Text style={styles.buttonText}>Cancel</Text>
          </Button>
          <Button style={styles.button} onPress={onCancel} variant="default">
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
  modalContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxHeight: 270,
  },
  button: {
    flex: 1,
    padding: 8,
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
  },
  tag: {
    borderRadius: 4,
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 4,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  textInput: {
    flex: 1,
  },
  albumContainer: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    width: "80%",
    backgroundColor: "#d9d9d9",
  },
  firstAlbum: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastAlbum: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  oneAlbum: {
    borderRadius: 8,
  },
  albumIcon: {
    width: 72,
    height: 72,
    borderRadius: 4,
    margin: 4,
    resizeMode: "cover",
  },
  albumName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8
  },
});
