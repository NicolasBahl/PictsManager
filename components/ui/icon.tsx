import {  ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from "react-native";

interface IconProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode
}

const Icon: React.FC<IconProps> = ({
  onPress,
  style,
  children
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {
        children && children
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignContent: "center",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});

export default Icon;
