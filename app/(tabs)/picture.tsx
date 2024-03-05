import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >(undefined);
  const cameraRef = useRef<Camera>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);

  useEffect(() => {
    (async () => {
      await checkCameraPermission();
    })();
  }, []);

  const checkCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionsAsync();
    if (cameraPermission.granted) {
      setHasCameraPermission(true);
    } else {
      setHasCameraPermission(false);
    }
  };

  if (hasCameraPermission === false) {
    Alert.alert("No access to camera", "Please allow access to the camera", [
      {
        text: "Open Settings",
        onPress: () => {
          Linking.openSettings();
        },
        style: "cancel",
      },
    ]);
  }

  const toggleCameraType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const takePicture = async () => {
    let options = { quality: 0.8, base64: false, exif: true };
    let newPhoto = await cameraRef.current?.takePictureAsync(options);
    if (newPhoto) setPhoto(newPhoto);
  };

  const cancelPicture = () => {
    setPhoto(null);
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
        <TouchableOpacity
          onPress={cancelPicture}
          style={styles.closeButtonContainer}
        >
          <AntDesign name="close" color="#ffff" size={30} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButtonContainer}>
          <Link href="/modal" asChild>
            <Text style={styles.nextButtonLabel}>Next</Text>
          </Link>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Camera ref={cameraRef} type={type} style={styles.container}>
      <MaterialIcons
        onPress={toggleCameraType}
        style={styles.flipCamera}
        name="flip-camera-ios"
        size={30}
        color="#ffff"
      />
      <View style={styles.iconContainer}>
        <FontAwesome
          onPress={takePicture}
          name="circle-thin"
          size={80}
          color="#fff"
        />
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCamera: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  iconContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPreview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  nextButtonContainer: {
    backgroundColor: "#08aaff",
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#08aaff",
    paddingHorizontal: 30,
    paddingVertical: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonLabel: { color: "#fff", fontWeight: "bold" },
  closeButtonContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "rgba(255,255,255, 0.25)",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
