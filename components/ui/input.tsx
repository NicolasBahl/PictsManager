import { forwardRef } from "react";
import { StyleProp, Text, TextInput, TextStyle, View } from "react-native";

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  style?: StyleProp<TextStyle>;
}
const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ label, style, ...props }, ref) => (
    <View>
      {label && <Text>{label}</Text>}
      <TextInput
        {...props}
        style={[
          {
            borderWidth: 1,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 25,
          },
          style,
        ]}
      />
    </View>
  ),
);

export { Input };
