import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  buttonTextStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  style?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  buttonTextStyle,
  children,
  variant = "default",
  size = "default",
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const variantStyle = variant ? styles[variant] : styles["default"];
  const sizeStyle = size ? styles[size] : styles["defaultSize"];

  let backgroundColor;
  if (variant === "default") {
    backgroundColor = props.disabled
      ? isDarkMode
        ? Colors.dark.disabled
        : Colors.light.disabled
      : isDarkMode
        ? Colors.dark.primary
        : Colors.light.primary;
  } else if (variant === "secondary") {
    backgroundColor = props.disabled
      ? isDarkMode
        ? Colors.dark.disabled
        : Colors.light.disabled
      : isDarkMode
        ? Colors.dark.lightBackground
        : Colors.light.lightBackground;
  } else {
    backgroundColor = "transparent";
  }

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[
        {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor
        },
        variantStyle,
        sizeStyle,
        style,
      ]}
      {...props}
    >
      <Text
        style={{
          color: variantStyle.color || "#fff",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  default: {
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  secondary: {
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  destructive: {
    backgroundColor: "#c54941",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  ghost: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    color: "#272727",
  },
  link: {
    backgroundColor: "#5673f6",
    padding: 0,
    color: "#fff",
  },
  defaultSize: {
    height: 40,
  },
  sm: {
    height: 30,
  },
  lg: {
    height: 45,
  },
});

export { Button };
