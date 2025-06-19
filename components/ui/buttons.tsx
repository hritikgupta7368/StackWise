import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  text1: string;
  handlePress1: () => void;
  text2?: string;
  handlePress2?: () => void;
};

const ButtonGroup = ({ text1, handlePress1, text2, handlePress2 }: Props) => {
  const isDual = text2 && handlePress2;

  return (
    <View style={[styles.container, isDual && styles.dual]}>
      {/* First Button */}
      <TouchableOpacity
        onPress={handlePress1}
        style={[
          styles.button,
          styles.primary,
          isDual ? styles.dualButton : styles.singleButton,
        ]}
      >
        <Text style={styles.primaryText}>{text1}</Text>
      </TouchableOpacity>

      {isDual && (
        <TouchableOpacity
          onPress={handlePress2}
          style={[styles.button, styles.outline, styles.dualButton]}
        >
          <Text style={styles.outlineText}>{text2}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ButtonGroup;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: "100%",
  },
  dual: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  singleButton: {
    width: "100%",
  },
  dualButton: {
    flex: 1,
  },
  primary: {
    backgroundColor: "#0b84fe", // blue
  },
  outline: {
    borderWidth: 1,
    borderColor: "#d1d5db", // Gray-300
    backgroundColor: "#fff",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  outlineText: {
    color: "#111827", // Gray-900
    fontWeight: "500",
    fontSize: 16,
  },
});
