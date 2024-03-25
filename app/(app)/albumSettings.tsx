import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function AlbumSettings() {
  const { album } = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const animation = useRef(new Animated.Value(0)).current;
  const [isEdit, setIsEdit] = useState(false);

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: isEdit ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePress = () => {
    setIsEdit(!isEdit);
    startAnimation();
  };

  const toggleSelectStyle = {
    ...styles.toggleSelect,
    left: animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '50%'],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={30} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
          <Text style={styles.backText} lightColor={Colors.light.primary} darkColor={Colors.dark.primary}>{album}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.listSettings}>
        <Text style={styles.textSettings}>User can:</Text>
        <View style={styles.toggleContainer} lightColor={Colors.light.lightBackground} darkColor={Colors.dark.lightBackground}>
          <TouchableOpacity activeOpacity={1} onPress={handlePress} style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 2 }}>
            <Animated.View style={toggleSelectStyle} />
            <View style={styles.toggleTextContainer}>
              <Text>View</Text>
              <Text>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    width: "90%",
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  back: {
    flexDirection: "row",
    marginLeft: -6,
  },
  backText: {
    fontSize: 17,
    marginTop: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
    width: "90%",
    alignSelf: 'center',
  },
  listSettings: {
    alignSelf: 'center',
    width: "90%",
  },
  textSettings: {
    fontSize: 16,
    marginTop: 16,
  },
  toggleContainer: {
    width: "100%",
    height: 32,
    borderRadius: 8,
    padding: 2,
    marginTop: 4,
  },
  toggleSelect: {
    width: "50%",
    height: "100%",
    borderRadius: 6,
    position: 'absolute',
    margin: 2,
    zIndex: 1,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  toggleTextContainer: {
    width: "100%",
    height: "100%",
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: 'transparent',
  },
});

export default AlbumSettings;