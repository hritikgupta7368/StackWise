// components/BackgroundWrapper.js
import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function BackgroundWrapper({ children }) {
  return (
    <ImageBackground
      source={require("../../assets/background_Dark.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
