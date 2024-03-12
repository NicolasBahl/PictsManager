import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

import React, { useRef, useState } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import RatioChanger from "@/components/ui/ratioChanger";
import { Camera, CameraProps, useCameraDevice } from "react-native-vision-camera";
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import Icon from "@/components/ui/icon";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
export default function App() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [ratio, setRatio] = useState("16:9");
  const [position, setPosition] = React.useState<"front" | "back">("back");
  const [flash, setFlash] = React.useState<"on" | "off">("off");
  const device = useCameraDevice(position);
  const camera = useRef<Camera>(null);

  const zoom = useSharedValue(device?.neutralZoom);

  const zoomOffset = useSharedValue(0);
  const gesture = Gesture.Pinch()
    .onBegin(() => {
      if (zoomOffset !== undefined) {
        zoomOffset.value = zoom.value;
      }
    })
    .onUpdate((event) => {
      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [device?.minZoom, device?.maxZoom],
        Extrapolation.CLAMP
      );
    });

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom]
  );

  // const onPinch = React.useCallback(
  //   (event: any) => {
  //     const velocity = event.velocity / 20;

  //     let newZoom =
  //         velocity > 0
  //             ? zoom + event.scale * velocity * (Platform.OS === 'ios' ? 0.01 : 25) // prettier-ignore
  //             : zoom - event.scale * Math.abs(velocity) * (Platform.OS === 'ios' ? 0.02 : 50); // prettier-ignore

  //     if (newZoom < 0) newZoom = 0;
  //     else if (newZoom > 0.5) newZoom = 0.5;

  //     setZoom(newZoom);
  //   },
  //   [zoom, setZoom]
  // );

  // const pinchGesture = useMemo(
  //   () => Gesture.Pinch().onUpdate(onPinch),
  //   [onPinch]
  // );

  if (device == null)
    return (
      <View>
        <Text>No camera...</Text>
      </View>
    );

  const takePicture = async () => {
    if (camera.current === null) return;
    else {
      const photo = await camera.current.takePhoto({
        
        flash: flash,
      });
      setPhoto(photo.path);
    }
    // let options = { quality: 0.8, base64: false, exif: true };
    // let newPhoto = await cameraRef.current?.takePictureAsync(options);
    // if (newPhoto) setPhoto(newPhoto);
  };

  const cancelPicture = () => {
    setPhoto(null);
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.photoPreview} />
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
              // params: { uri: photo.uri },
            })
          }
        >
          <Text style={styles.nextButtonLabel}>Next</Text>
        </Button>
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <ReanimatedCamera
          animatedProps={animatedProps}
          photo={true}
          ref={camera}
          zoom={zoom}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />
      </GestureDetector>
      <Icon
        style={styles.flipCamera}
        name="flip-camera-ios"
        onPress={() => setPosition(position === "back" ? "front" : "back")}
      />
      <Icon
        style={styles.flash}
        name={flash === "on" ? "flash-on" : "flash-off"}
        onPress={() => setFlash(flash === "off" ? "on" : "off")}
      />
      <RatioChanger ratio={ratio} setState={setRatio} />

      <TouchableOpacity onPress={takePicture} style={styles.iconContainer}>
        <FontAwesome name="circle-thin" size={80} color="#fff" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );

  // React.useEffect(() => {
  //   if (ratio === "16:9") setMargin({ horizontal: 0, vertical: 0 });
  //   else if (ratio === "1:1") setMargin({ horizontal: 50, vertical: 200 });
  //   else if (ratio === "4:3") setMargin({ horizontal: 100, vertical: 300 });
  // }, [ratio]);

  // if (!permission) {
  //   return null;
  // }

  // if (!permission?.granted) {
  //   Alert.alert("No access to camera", "Please allow access to the camera", [
  //     {
  //       text: "Open Settings",
  //       onPress: () => {
  //         Linking.openSettings();
  //       },
  //       style: "cancel",
  //     },
  //   ]);
  //   return null;
  // }

  // const toggleCameraType = () => {
  //   setType(type === CameraType.back ? CameraType.front : CameraType.back);
  // };

  // return (
  //   <GestureHandlerRootView
  //     style={{
  //       flex: 1,
  //       marginLeft: margin.horizontal,
  //       marginRight: margin.horizontal,
  //       marginTop: margin.vertical,
  //       marginBottom: margin.vertical,
  //     }}
  //   >
  //     <GestureDetector gesture={pinchGesture}>
  //     <Camera
  //     style={StyleSheet.absoluteFill}

  //     isActive={true}
  //   />

  //       {/* <Camera
  //         autoFocus
  //         useCamera2Api
  //         zoom={zoom}
  //         ratio={ratio}
  //         ref={cameraRef}
  //         type={type}
  //         style={styles.container}
  //       > */}
  //         <MaterialIcons
  //           onPress={toggleCameraType}
  //           style={styles.flipCamera}
  //           name="flip-camera-ios"
  //           size={30}
  //           color="#ffff"
  //         />
  //         <RatioChanger ratio={ratio} setState={setRatio} />
  //         <View style={styles.iconContainer}>
  //           <FontAwesome
  //             onPress={takePicture}
  //             name="circle-thin"
  //             size={80}
  //             color="#fff"
  //           />
  //         </View>
  //       </Camera>
  //     </GestureDetector>
  //   </GestureHandlerRootView>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flipCamera: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  flash: {
    position: "absolute",
    top: 110,
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
