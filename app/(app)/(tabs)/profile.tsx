import React from "react";
import { StyleSheet } from 'react-native';
import { useAuth } from "@/providers/AuthProvider";
import { Text, View } from "@/components/Themed";

function Profile() {
  const { me } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{me?.email || 'example@email.com'}</Text>
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
    marginBottom: 16,
    alignItems: 'center',
    alignSelf: 'center',
    width: "90%",
  },
  title: {
    fontSize: 18,
  },
});

export default Profile;