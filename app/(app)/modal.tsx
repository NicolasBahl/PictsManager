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
import { AlbumSelector } from "@/components/AlbumSelector";
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
        <AlbumSelector
          albums={albums}
          selectedAlbum={selectedAlbum}
          onAlbumSelect={setSelectedAlbum}
          onSelect={() => { }}
        />
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
});
