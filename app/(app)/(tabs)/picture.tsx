import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

import React, { useRef, useState } from "react";
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Button } from "@/components/ui/button";
import RatioChanger from "@/components/ui/ratioChanger";
import {
  Camera,
  CameraProps,
  useCameraDevice,
  useCameraFormat,
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
import { Feather } from '@expo/vector-icons';

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

      setPhoto({ uri: path, width: width, height: height });
    }
  };

  const cancelPicture = () => {
    setPhoto(null);
  };

  const navigation = useNavigation();

  React.useEffect(() => {
    navigation?.setOptions({ tabBarStyle: { display: tarBar === "off" ? 'none' : 'display' } });
  }, [tarBar]);

  const format = useCameraFormat(
    device,
    hdr === "on"
      ? [
          { photoResolution: { width: 2000, height: 2000 } },
          { pixelFormat: "yuv" },
        ]
      : [{ photoResolution: { width: 0, height: 0 } }]
  );

  const getMargins = (ratio: string) => {
    if (ratio === "16:9") {
      return { marginHorizontal: 0, marginVertical: 0 };
    } else if (ratio === "4:3") {
      return { marginHorizontal: 10, marginVertical: 20 };
    } else if (ratio === "1:1") {
      return { marginHorizontal: 40, marginVertical: 40 };
    }
    return { marginHorizontal: 0, marginVertical: 0 };
  };

  const { marginHorizontal, marginVertical } = getMargins(ratio);

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
          marginHorizontal,
          marginVertical,
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
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "flex-end",
          marginRight: 20,
          marginTop: 40,
        }}
      >
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
          <Ionicons name={flash === "on" ? 'flash' : "flash-off"} size={30} color={"#fff"}/>
        </Icon>
        <Icon
          style={styles.icons}
         
          onPress={() => setHdr(hdr === "off" ? "on" : "off")}
        >
          <MaterialIcons name={hdr === "on" ? "hdr-on" : "hdr-off"} size={30} color={"#fff"} />
        </Icon>

        <Icon
          style={styles.icons}
          onPress={() => setTarBar(tarBar === "off" ? "on" : "off")}
        >
          <Feather name={tarBar === "off" ? "eye-off" : "eye"} size={30} color="#fff" />
        </Icon>
        <RatioChanger style={styles.icons} ratio={ratio} setState={setRatio} />
      </View>
      
      <TouchableOpacity onPress={takePicture} style={styles.iconContainer}>
        <FontAwesome name="circle-thin" size={80} color="#fff" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
    bottom: 25,
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
  icons: {
    marginVertical: 10,
  },
});
