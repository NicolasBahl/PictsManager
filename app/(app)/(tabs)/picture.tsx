import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import React, { useMemo, useRef, useState } from "react";
import { MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [type, setType] = useState(CameraType.back);

  const cameraRef = useRef<Camera>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [zoom, setZoom] = useState(0);

  const onPinch = React.useCallback(
    (event: any) => {
      const velocity = event.velocity / 20;

      let newZoom =
        velocity > 0
          ? zoom + event.scale * velocity * (Platform.OS === 'ios' ? 0.01 : 25) // prettier-ignore
          : zoom - event.scale * Math.abs(velocity) * (Platform.OS === 'ios' ? 0.02 : 50); // prettier-ignore

      if (newZoom < 0) newZoom = 0;
      else if (newZoom > 0.5) newZoom = 0.5;

      setZoom(newZoom);
    },
    [zoom, setZoom]
  );

  const pinchGesture = useMemo(
    () => Gesture.Pinch().onUpdate(onPinch),
    [onPinch]
  );

  const getCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
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
  };

  React.useEffect(() => {
    getCameraPermission();
  }, []);

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
        <Button
          style={styles.nextButtonContainer}
          onPress={() =>
            router.push({
              pathname: "/(app)/modal",
              params: { uri: photo.uri },
            })
          }
        >
          <Text style={styles.nextButtonLabel}>Next</Text>
        </Button>
      </View>
    );
  }

  const Ration = () => {
    const [showMore, setShowMore] = useState(false);
    const options = ["16:9", "1:1", "4:3"];
    const [defaultRatio, setDefaultRatio] = useState("16:9");
    const height = showMore ? 150 : 0;

    return (
      <View
        style={{
          position: "absolute",
          top: 90,
          right: 18,
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          height,
          borderRadius: 40,
          width: 35,
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 50,
            width: "100%",
            height: 35,
            padding: 5,
            marginBottom: 5,
          }}
          onPress={() => setShowMore(!showMore)}
        >
          <Text style={{ textAlign: "center", color: "black", fontSize: 10 }}>
            {defaultRatio}
          </Text>
        </TouchableOpacity>
        {showMore &&
          options
            .filter((option, index) => option !== defaultRatio)
            .map((otion, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 50,
                    width: "100%",
                    height: 35,
                    padding: 5,
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    setDefaultRatio(otion);
                    setShowMore(false);
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: "black", fontSize: 10 }}
                  >
                    {otion}
                  </Text>
                </TouchableOpacity>
              );
            })}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pinchGesture}>
        <Camera
          zoom={zoom}
          ratio={"16:9"}
          ref={cameraRef}
          type={type}
          style={styles.container}
        >
          <MaterialIcons
            onPress={toggleCameraType}
            style={styles.flipCamera}
            name="flip-camera-ios"
            size={30}
            color="#ffff"
          />
          <Ration />
          <View style={styles.iconContainer}>
            <FontAwesome
              onPress={takePicture}
              name="circle-thin"
              size={80}
              color="#fff"
            />
          </View>
        </Camera>
      </GestureDetector>
    </GestureHandlerRootView>
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
