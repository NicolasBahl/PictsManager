import { forwardRef } from "react";
import { StyleProp, Text, TextInput, TextStyle, View } from "react-native";
import { useColorScheme } from '@/components/useColorScheme';

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  style?: StyleProp<TextStyle>;
  lightColor?: string;
  darkColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
}

const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      label,
      style,
      lightColor,
      darkColor,
      lightBackgroundColor,
      darkBackgroundColor,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const color = isDarkMode ? darkColor : lightColor;
    const backgroundColor = isDarkMode ? darkBackgroundColor : lightBackgroundColor;

    return (
      <View>
        {label && <Text>{label}</Text>}
        <TextInput
          ref={ref}
          {...props}
          style={[
            {
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 8,
              height: 40,
              color,
              backgroundColor,
            },
            style,
          ]}
        />
      </View>
    );
  }
);

export { Input };
