// components/BackgroundWrapper.js
import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BackgroundWrapper({ children }) {
  return (
    // <SafeAreaView>
    <ImageBackground
      source={require("../../assets/background_Dark.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
