import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface RatioProps {
  ratio: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const RatioChanger: React.FC<RatioProps> = ({ ratio, setState }) => {
  const [showMore, setShowMore] = React.useState(false);
  const options = ["16:9", "1:1", "4:3"];
  const height = showMore ? 170 : 0;

  return (
    <View style={[styles.container, { height }]}>
      <TouchableOpacity
        style={styles.ratioContainer}
        onPress={() => setShowMore(!showMore)}
      >
        <Text style={styles.ratio}>{ratio}</Text>
      </TouchableOpacity>
      {showMore &&
        options
          .filter((option, index) => option !== ratio)
          .map((otion, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                style={styles.ratioChanger}
                onPress={() => {
                  setState(otion);
                  setShowMore(false);
                }}
              >
                <Text style={styles.ratio}>{otion}</Text>
              </TouchableOpacity>
            );
          })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 180,
    right: 18,
    flex: 1,
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
