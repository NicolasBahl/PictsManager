import {
  Camera,
  CameraCapturedPicture,
  CameraType,
  ImageType,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.getCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change your permission in your
        mobile settings
      </Text>
    );
  }

  const toggleCameraType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const takePicture = async () => {
    let options = { quality: 0.8, base64: false, exif: true };
    let newPhoto = await cameraRef.current?.takePictureAsync(options);
    if (newPhoto) setPhoto(newPhoto);
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: photo.uri }}
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
        <Entypo
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontWeight: "bold",
          }}
          onPress={() => setPhoto(null)}
          name="cross"
          size={40}
          color="#fff"
        />
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
          size={50}
          color="#fff"
        />
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCamera: {
    position: "absolute",
    top: 20,
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
});
