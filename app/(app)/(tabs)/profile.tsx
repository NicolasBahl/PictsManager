import React from "react";
import { Alert, StyleSheet } from "react-native";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useUpdatePasswordMutation } from "@/graphql/generated/graphql";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdatePasswordForm = z.infer<typeof schema>;

function Profile() {
  const { me, signOut } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdatePasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const [updatePassword] = useUpdatePasswordMutation();

  const onSubmit = async (data: UpdatePasswordForm) => {
    try {
      await updatePassword({
        variables: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      });
      Alert.alert("Password updated successfully");
      reset();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{me?.email || "example@email.com"}</Text>
      </View>
      <View style={styles.listParams}>
        <Text style={styles.titleParams}>Change password:</Text>
        <Controller
          control={control}
          name="oldPassword"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
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
          )}
        />
        {errors.oldPassword && (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              marginVertical: 8,
            }}
          >
            {errors.oldPassword.message}
          </Text>
        )}
        <Controller
          control={control}
          name="newPassword"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
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
          )}
        />
        {errors.newPassword && (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              marginVertical: 8,
            }}
          >
            {errors.newPassword.message}
          </Text>
        )}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
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
          )}
        />
        {errors.confirmPassword && (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              marginVertical: 8,
            }}
          >
            {errors.confirmPassword.message}
          </Text>
        )}
        <Button
          disabled={!isValid}
          style={styles.buttonParams}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonTitleParams}>Confirm</Text>
        </Button>
        <Button
          style={styles.buttonParams}
          onPress={signOut}
          variant="destructive"
        >
          <Text style={styles.buttonTitleParams}>Disconnect</Text>
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
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
  },
  title: {
    fontSize: 18,
  },
  listParams: {
    marginBottom: 16,
    width: "90%",
    alignSelf: "center",
  },
  titleParams: {
    marginTop: 40,
    fontSize: 20,
  },
  inputParams: {
    marginTop: 10,
    padding: 10,
  },
  buttonParams: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    padding: 0,
    height: 40,
  },
  buttonTitleParams: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Profile;
