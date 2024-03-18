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
import { router, useNavigation } from "expo-router";
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
} from "react-native-reanimated";
import Icon from "@/components/ui/icon";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
export default function Picture() {
  const [photo, setPhoto] = useState<{
    uri: string;
    width: number;
    height: number;
  } | null>(null);

  const [ratio, setRatio] = useState("16:9");
  const [position, setPosition] = React.useState<"front" | "back">("back");
  const [flash, setFlash] = React.useState<"on" | "off">("off");
  const [hdr, setHdr] = React.useState<"on" | "off">("off");
  const device = useCameraDevice(position);
  const [tarBar, setTarBar] = useState("off");
  const camera = useRef<Camera>(null);

  const { hasPermission, requestPermission } = useCameraPermission();

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
        enableShutterSound: true,
        flash: flash,
      });
      const { path, width, height } = photo;
      console.log(photo);
      setPhoto({ uri: path, width: width, height: height });
    }
  };

  const cancelPicture = () => {
    setPhoto(null);
  };

  React.useEffect(() => {
    const askPermission = async () => {
      if (hasPermission === false) {
        let response = await requestPermission();
        if (response === false) {
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

  const navigation = useNavigation();

  React.useEffect(() => {
    navigation?.setOptions({
      tabBarStyle: { display: tarBar === "off" ? "none" : "display" },
    });
  }, [tarBar]);

  const screen = Dimensions.get("screen");
  const format = useCameraFormat(
    device,
    hdr === "on"
      ? [
          { photoResolution: { width: 2000, height: 2000 } },
        ]
      : [
          { photoAspectRatio: screen.height / screen.width },
        ]
  );

  const changePhotoRation = (ratio: string) => {
    if (ratio === "16:9") {
      return { marginVertical: 0 };
    }
    if (ratio === "4:3") {
      return { marginVertical: 100 };
    }
    if (ratio === "1:1") {
      return { marginVertical: 200 };
    }
    return { marginVertical: 0 };
  };

  const { marginVertical } = changePhotoRation(ratio);

  if (photo) {
    return (
      <View style={[styles.container, { marginVertical }]}>
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
              params: {
                width: photo.width,
                height: photo.height,
                uri: photo.uri,
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
          marginVertical: marginVertical,
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
          style={[StyleSheet.absoluteFillObject]}
          device={device}
          isActive={true}
        />
      </GestureDetector>
      <View style={styles.iconsContainer}>
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
        <Icon
          style={styles.icons}
          onPress={() => setHdr(hdr === "off" ? "on" : "off")}
        >
          <MaterialIcons
            name={hdr === "on" ? "hdr-on" : "hdr-off"}
            size={30}
            color={"#fff"}
          />
        </Icon>

        <Icon
          style={styles.icons}
          onPress={() => setTarBar(tarBar === "off" ? "on" : "off")}
        >
          <Feather
            name={tarBar === "off" ? "eye-off" : "eye"}
            size={30}
            color="#fff"
          />
        </Icon>
        <RatioChanger style={styles.icons} ratio={ratio} setState={setRatio} />
      </View>

      <TouchableOpacity
        onPress={takePicture}
        style={[styles.takePictureIcon, { bottom: tarBar === "off" ? 20 : 20 }]}
      >
        <FontAwesome name="circle-thin" size={80} color="#fff" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  takePictureIcon: {
    alignSelf: "center", 
  },
  photoPreview: {
    flex: 1,
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
  icons: {
    marginVertical: 10,
  },
  iconsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginRight: 20,
    marginTop: 40,
  },
});
