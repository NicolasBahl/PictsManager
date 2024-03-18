import React, { useRef } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Text } from '@/components/Themed';
import SearchBar from '@/components/SearchBar';

export default function Albums() {
  const searchBarRef = useRef(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Albums</Text>
      </View>
      <SearchBar
        ref={searchBarRef}
        placeholder="Search albums"
        onChangeText={(text) => console.log(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});