import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Text, View, ScrollView } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function AlbumSettings() {
  const { album } = useLocalSearchParams();

  const users = ['thibaut.ruscher@epitech.eu', 'adrien.marion@epitech.eu', 'nicolas.bahl@epitech.eu', 'mevie.didierjean@epitech.eu'];

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const animation = useRef(new Animated.Value(0)).current;
  const [isEdit, setIsEdit] = useState(false);

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: isEdit ? 0 : 1,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
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
            <Animated.View style={[toggleSelectStyle, { backgroundColor: isDarkMode ? Colors.dark.lighterBackground : Colors.light.lighterBackground }]} />
            <View style={styles.toggleTextContainer}>
              <Text>View</Text>
              <Text>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.textSettings}>All users who have access to your album:</Text>
        <ScrollView style={styles.usersList} lightColor={Colors.light.lightBackground} darkColor={Colors.dark.lightBackground}>
          {users.map((user, index) => (
            <View key={index} style={styles.userContainer} lightColor={Colors.light.lighterBackground} darkColor={Colors.dark.lighterBackground}>
              <Ionicons name="person" size={24} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} style={styles.userIcon} />
              <Text style={styles.userEmail} ellipsizeMode="tail" numberOfLines={1}>{user}</Text>
              <TouchableOpacity style={styles.userDelete}>
                <Ionicons name="close" size={20} color={isDarkMode ? Colors.dark.text : Colors.light.text} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
    marginBottom: 10,
  },
  toggleSelect: {
    width: "50%",
    height: "100%",
    borderRadius: 6,
    position: 'absolute',
    margin: 2,
    zIndex: 1,
    left: 0,
  },
  toggleTextContainer: {
    width: "100%",
    height: "100%",
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  usersList: {
    marginTop: 4,
    height: 200,
    borderRadius: 8,
    padding: 4,
  },
  userContainer: {
    height: 50,
    width: "100%",
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userIcon: {
    marginLeft: 10,
  },
  userEmail: {
    marginLeft: 10,
    fontSize: 16,
    width: "70%",
    flexShrink: 1,
    overflow: 'hidden',
  },
  userDelete: {
    position: 'absolute',
    right: 10,
  },
});

export default AlbumSettings;