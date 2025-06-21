import React, { useState } from "react";
import { View, Pressable, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// const [inputType, setInputType] = useState("text");
// <InputTypeSwitcher
//   onChange={(val) => setInputType(val)}
//   colors={{
//     background: "#222", // outer switch color
//     slider: "#444", // sliding highlight
//     icon: "#999", // inactive icon
//     activeIcon: "#fff", // active icon
//   }}
//   size={{
//     width: 132,
//     height: 32,
//     iconSize: 16,
//   }}
// />

type InputType = "paragraph" | "code" | "image";

type Props = {
  onChange?: (value: InputType, index: number) => void;
  colors?: {
    background?: string;
    slider?: string;
    icon?: string;
    activeIcon?: string;
  };
  size?: {
    width?: number;
    height?: number;
    iconSize?: number;
  };
};

export default function InputTypeSwitcher({
  onChange,
  colors = {},
  size = {},
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const types: InputType[] = ["paragraph", "code", "image"];
  const icons = ["format-color-text", "code-tags", "image-outline"];

  const width = size.width ?? 132;
  const height = size.height ?? 32;
  const iconSize = size.iconSize ?? 16;
  const padding = 2;
  const totalSegments = 3;

  const segmentWidth = width / totalSegments;

  const containerStyle: ViewStyle = {
    width,
    height,
    backgroundColor: colors.background ?? "#1f1f1f",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    position: "relative",
    overflow: "hidden",
  };

  const sliderStyle: ViewStyle = {
    position: "absolute",
    top: padding,
    left: selectedIndex * segmentWidth + padding,
    width: segmentWidth - padding * 2,
    height: height - padding * 2,
    backgroundColor: colors.slider ?? "#333",
    borderRadius: 999,
  };

  const handlePress = (index: number) => {
    setSelectedIndex(index);
    onChange?.(types[index], index);
  };

  return (
    <View style={containerStyle}>
      <View style={sliderStyle} />
      {icons.map((iconName, index) => (
        <Pressable
          key={index}
          style={{
            width: segmentWidth,
            height,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => handlePress(index)}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={
              selectedIndex === index
                ? (colors.activeIcon ?? "#ffffff")
                : (colors.icon ?? "#888888")
            }
          />
        </Pressable>
      ))}
    </View>
  );
}
