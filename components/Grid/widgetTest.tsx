import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UNIT, H_GAP } from "./Config";

export function DummyBox({ spanX, spanY }: { spanX: number; spanY: number }) {
  return (
    <View style={[styles.box, { width: UNIT * spanX + H_GAP * (spanX - 1), height: UNIT * spanY + H_GAP * (spanY - 1) }]}>
      <Text>
        {spanX}×{spanY}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginRight: H_GAP,
    marginBottom: H_GAP,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
});
