import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ScrollView, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

function AlbumDetails() {
  const { album } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={30} color="#467599" />
        <Text style={styles.backText}>All albums</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.titleAlbum}>{album}</Text>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    marginTop: 60,
    paddingLeft: 16,
    flexDirection: "row",
  },
  backText: {
    fontSize: 17,
    color: "#467599",
    marginTop: 4,
  },
  titleAlbum: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 24,
    alignSelf: 'flex-start',
  },
});

export default AlbumDetails;