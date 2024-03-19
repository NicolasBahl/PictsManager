import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleProp,
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from "react-native";

interface IconProps {
  name: any;
  color?: string;
  size?: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const Icon: React.FC<IconProps> = ({
  name,
  color = "#fff",
  size = 30,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <MaterialIcons name={name} size={size} color={color} />
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
