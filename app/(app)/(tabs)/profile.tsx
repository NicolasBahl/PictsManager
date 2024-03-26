import React from "react";
import { StyleSheet } from 'react-native';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

function Profile() {
  const { me } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{me?.email || 'example@email.com'}</Text>
      </View>
      <View style={styles.listParams}>
        <Text style={styles.titleParams}>Change password:</Text>
        <Input
          style={styles.inputParams}
          placeholder="Old password"
          secureTextEntry={true}
          textContentType="password"
          autoComplete="password"
          lightColor={Colors.light.text}
          darkColor={Colors.dark.text}
          lightBackgroundColor={Colors.light.lightBackground}
          darkBackgroundColor={Colors.dark.lightBackground}
        />
        <Input
          style={styles.inputParams}
          placeholder="New password"
          secureTextEntry={true}
          textContentType="newPassword"
          autoComplete="password-new"
          lightColor={Colors.light.text}
          darkColor={Colors.dark.text}
          lightBackgroundColor={Colors.light.lightBackground}
          darkBackgroundColor={Colors.dark.lightBackground}
        />
        <Input
          style={styles.inputParams}
          placeholder="Confirm new password"
          secureTextEntry={true}
          textContentType="newPassword"
          autoComplete="password-new"
          lightColor={Colors.light.text}
          darkColor={Colors.dark.text}
          lightBackgroundColor={Colors.light.lightBackground}
          darkBackgroundColor={Colors.dark.lightBackground}
        />
        <Button style={styles.buttonParams} onPress={() => { }}>
          <Text style={styles.buttonTitleParams}>Confirm</Text>
        </Button>
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
  listParams: {
    marginTop: 50,
    marginBottom: 16,
    width: "90%",
    alignSelf: 'center',
  },
  titleParams: {
    fontSize: 20,
  },
  inputParams: {
    marginTop: 10,
    padding: 10,
  },
  buttonParams: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    padding: 0,
    height: 40,
  },
  buttonTitleParams: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Profile;