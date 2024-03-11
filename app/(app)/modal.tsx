import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "../../components/ui/button";
import { useState } from "react";
export default function ModalScreen() {
  const { uri } = useLocalSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [capturedText, setCapturedText] = useState<string[]>([]);

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

  return (
    <View style={styles.container}>
      <Image source={{ uri: uri.toString() }} style={styles.image} />
      <Text style={styles.title}>Tags</Text>
      <View style={styles.tagsInputContainer}>
        <View style={styles.scrollView}>
          {capturedText.map((text, index) => (
            <TouchableOpacity
              onPress={() => removeText(index)}
              key={index}
              style={styles.tag}
            >
              <Text style={styles.tagText}>{text}</Text>
            </TouchableOpacity>
          ))}
          <TextInput
            style={styles.textInput}
            onChange={handleInputChange}
            value={inputValue}
          />
        </View>
      </View>
      <Text style={styles.title}>Album</Text>
      <View style={styles.albumContainer}>
        <Image
          source={require("@/assets/images/placeholder.jpg")}
          style={{
            width: 85,
            height: 85,
            borderRadius: 8,
            marginHorizontal: 10,
            resizeMode: "cover",
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Paysage</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Button>
        <Button style={styles.saveButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Save</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    marginTop: 60,
    width: 268,
    height: 390,
    borderRadius: 10,
    resizeMode: "cover",
  },
  title: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  cancelButton: {
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "#7c7672",
    borderRadius: 10,
  },
  saveButton: {
    marginLeft: 20,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#08aaff",
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tagsInputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "#7c7672",
    height: 100,
    width: 350,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  scrollView: {
    flexWrap: "wrap",
    borderRadius: 10,
    backgroundColor: "#7c7672",
    flexDirection: "row",
  },
  tag: {
    backgroundColor: "#C6C6C6",
    borderRadius: 2,
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 8,
    marginHorizontal: 2,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 5,
    fontWeight: "300",
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
  albumContainer: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#7c7672",
    height: 100,
    width: 350,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
});
