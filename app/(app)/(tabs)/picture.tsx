import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from "react-native";

import React, { useRef, useState } from "react";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import RatioChanger from "@/components/ui/ratioChanger";
import {
  Camera,
  CameraProps,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Icon from "@/components/ui/icon";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import type { PhotoFile } from "react-native-vision-camera/src/PhotoFile";
import ImageEditor from '@react-native-community/image-editor';
import Animated from "react-native-reanimated";

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
export default function Picture() {
  const [photo, setPhoto] = useState<PhotoFile | null>(null);

  const [ratio, setRatio] = useState("16:9");
  const [position, setPosition] = React.useState<"front" | "back">("back");
  const [flash, setFlash] = React.useState<"on" | "off">("off");
  const device = useCameraDevice(position);
  const camera = useRef<Camera>(null);

  const { hasPermission, requestPermission } = useCameraPermission();

  const zoom = useSharedValue(device?.neutralZoom);

  const zoomOffset = useSharedValue(0);
  const gesture = Gesture.Pinch()
    .onBegin(() => {
      if (zoomOffset !== undefined) {
        if (typeof zoom.value === "number") {
          zoomOffset.value = zoom.value;
        }
      }
    })
    .onUpdate((event) => {
      const z = zoomOffset.value * event.scale;
      if (device) {
        zoom.value = interpolate(
          z,
          [1, 10],
          [device?.minZoom, device?.maxZoom],
          Extrapolation.CLAMP,
        );
      }
    });

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom],
  );

  if (device == null)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Camera not available on this device
        </Text>
      </View>
    );

  const takePicture = async () => {
    if (camera.current === null) return;
    const photo = await camera.current.takePhoto({
      enableShutterSound: true,
      flash: flash,
    });
    photo.path = "file://" + photo.path;

    let width = photo.width;
    let height = photo.height;
    let offsetX = 0;
    let offsetY = 0;
    let temp = 0;

    switch (ratio) {
      case '16:9':
        width = height * 9 / 16;
        offsetX = (photo.width - width) / 2;
        break;
      case '4:3':
        temp = height;
        height = width;
        width = temp;
        break;
      case '1:1':
        width = height;
        offsetY = (photo.width - width) / 2;
        break;
    }

    let croppedPhotoUri = await ImageEditor.cropImage(photo.path, {
      offset: { x: offsetX, y: offsetY },
      size: {
        width: width,
        height: height,
      }
    });

    const croppedPhoto: PhotoFile = { ...photo, path: croppedPhotoUri.path };

    setPhoto(croppedPhoto);
  };

  const cancelPicture = () => {
    setPhoto(null);
  };

  React.useEffect(() => {
    const askPermission = async () => {
      if (!hasPermission) {
        let response = await requestPermission();
        if (!response) {
          Alert.alert("Permission denied", "You have to open your settings", [
            { text: "OK", onPress: () => Linking.openSettings() },
          ]);
        } else {
          console.log("Permission granted");
        }
      } else {
        console.log("Permission granted");
      }
    };
    askPermission();
  }, [hasPermission]);

  const screen = Dimensions.get("screen");
  const width = useSharedValue(screen.width);
  const height = useSharedValue(screen.width);
  const marginTop = useSharedValue((screen.height - screen.width) / 4.5);

  React.useEffect(() => {
    let newHeight = screen.width;
    if (ratio === '16:9') {
      newHeight = screen.width * 16 / 9;
    } else if (ratio === '4:3') {
      newHeight = screen.width * 4 / 3;
    } else if (ratio === '1:1') {
      newHeight = screen.width;
    }
    const newMarginTop = (screen.height - newHeight) / 4.5;

    width.value = withTiming(screen.width);
    height.value = withTiming(newHeight);
    marginTop.value = withTiming(newMarginTop);
  }, [ratio]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(width.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      height: withTiming(height.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      marginTop: withTiming(marginTop.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  const iconsContainerStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(marginTop.value * 2, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  const format = useCameraFormat(device, [
    { photoResolution: 'max' },
    { videoResolution: 'max' },
    { fps: 'max' },
  ]);

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.path }} style={[styles.photoPreview]} />
        <Icon
          style={[styles.icons, styles.closeButtonContainer]}
          onPress={cancelPicture}
        >
          <AntDesign name="close" color="#ffff" size={30} />
        </Icon>
        <Button
          style={styles.nextButtonContainer}
          onPress={() =>
            router.push({
              pathname: "/(app)/previewPicture",
              params: {
                uri: photo?.path,
                metadata: JSON.stringify(photo?.metadata),
                height: photo?.height,
                width: photo?.width,
              },
            })
          }
        >
          <Text style={styles.nextButtonLabel}>Next</Text>
        </Button>
      </View>
    );
  }
  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {
          flex: 1,
        },
      ]}
    >
      <GestureDetector gesture={gesture}>
        <ReanimatedCamera
          format={format}
          animatedProps={animatedProps}
          photo={true}
          ref={camera}
          zoom={zoom}
          style={[animatedStyle, styles.photoShoot]}
          device={device}
          isActive={true}
        />
      </GestureDetector>
      <Animated.View style={[iconsContainerStyle, styles.iconsContainer]}>
        <Icon
          style={styles.icons}
          onPress={() => setPosition(position === "back" ? "front" : "back")}
        >
          <MaterialIcons name={"flip-camera-ios"} size={30} color={"#fff"} />
        </Icon>
        <Icon
          style={styles.icons}
          onPress={() => setFlash(flash === "off" ? "on" : "off")}
        >
          <Ionicons
            name={flash === "on" ? "flash" : "flash-off"}
            size={30}
            color={"#fff"}
          />
        </Icon>
        <RatioChanger style={styles.icons} ratio={ratio} setState={setRatio} />
      </Animated.View>
      <TouchableOpacity onPress={takePicture} style={styles.takePictureIcon}>
        <FontAwesome name="circle-thin" size={80} color="#fff" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  takePictureIcon: {
    alignSelf: "center",
    bottom: 10,
    position: "absolute",
  },
  photoPreview: {
    flex: 1,
    resizeMode: "contain",
  },
  photoShoot: {
    position: "relative",
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
    position: "absolute",
    top: 40,
    left: 20,
  },
  icons: {
    marginVertical: 10,
  },
  iconsContainer: {
    position: "absolute",
    right: 10,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
});