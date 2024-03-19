import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

interface RatioProps {
  ratio: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  style?: StyleProp<ViewStyle>;
}

const RatioChanger: React.FC<RatioProps> = ({ ratio, setState, style }) => {
  const [showMore, setShowMore] = React.useState(false);
  const options = ["16:9", "1:1", "4:3"];
  const height = showMore ? 170 : 0;

  return (
    <View style={[styles.container, { height }, style]}>
      <TouchableOpacity
        style={styles.ratioContainer}
        onPress={() => setShowMore(!showMore)}
      >
        <Text style={styles.ratio}>{ratio}</Text>
      </TouchableOpacity>
      {showMore &&
        options
          .filter((option, index) => option !== ratio)
          .map((option, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                style={styles.ratioChanger}
                onPress={() => {
                  setState(option);
                  setShowMore(false);
                }}
              >
                <Text style={styles.ratio}>{option}</Text>
              </TouchableOpacity>
            );
          })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 45,
    width: 45,
    backgroundColor: "rgba(255,255,255, 0.25)",
  },
  ratioChanger: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 50,
    width: "100%",
    height: 45,
    padding: 5,
  },
  ratioContainer: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 45,
    width: "100%",
    height: 45,
    padding: 5,
    marginBottom: 5,
  },
  ratio: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default RatioChanger;
