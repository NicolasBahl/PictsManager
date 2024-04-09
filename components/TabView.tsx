import { Animated, Easing, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

interface TapViewProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: any) => void;
}

const TapView: React.FC<TapViewProps> = ({ options, value, onChange }) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const currentIndex = options.findIndex((option) => option.value === value);
  const nextIndex = currentIndex === -1 || currentIndex === 0 ? 1 : 0;

  useEffect(() => {
    setAnimation(new Animated.Value(currentIndex));
  }, [currentIndex]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: currentIndex,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [currentIndex, animation]);

  const toggleSelectStyle = StyleSheet.flatten([
    {
      ...styles.toggleSelect,
      left: animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "50%"],
      }),
    },
  ]);

  const handlePress = () => onChange(options[nextIndex].value);

  return (
    <View
      style={styles.toggleContainer}
      lightColor={Colors.light.lightBackground}
      darkColor={Colors.dark.lightBackground}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 2,
        }}
      >
        <Animated.View
          style={[
            toggleSelectStyle,
            {
              backgroundColor: isDarkMode
                ? Colors.dark.lighterBackground
                : Colors.light.lighterBackground,
            },
          ]}
        />
        <View style={styles.toggleTextContainer}>
          {options.map((option) => (
            <Text key={option.value}>{option.label}</Text>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TapView;

const styles = StyleSheet.create({
  toggleContainer: {
    width: "100%",
    height: 32,
    borderRadius: 8,
    padding: 2,
    marginTop: 4,
    marginBottom: 10,
  },
  toggleSelect: {
    width: "50%",
    height: "100%",
    borderRadius: 6,
    position: "absolute",
    margin: 2,
    zIndex: 1,
    left: 0,
  },
  toggleTextContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 2,
    backgroundColor: "transparent",
    zIndex: 2,
  },
});
