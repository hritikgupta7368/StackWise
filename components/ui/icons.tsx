// /icons/index.tsx
import React from "react";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";

type IconProps = {
  size?: number;
  color?: string;
  onPress?: () => void;
};

// Default values
const defaultSize = 20;
const defaultColor = "#868482";

export const CloseIcon = ({
  size = defaultSize,
  color = defaultColor,

  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="close" size={size} color={color} />
  </TouchableOpacity>
);

export const SettingsIcon = ({
  size = defaultSize,
  color = defaultColor,
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="settings" size={size} color={color} />
  </TouchableOpacity>
);

export const BackIcon = ({
  size = defaultSize,
  color = defaultColor,
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="arrow-back" size={size} color={color} />
  </TouchableOpacity>
);

export const ShareIcon = ({
  size = defaultSize,
  color = "#4f46e5",
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="share-social" size={size} color={color} />
  </TouchableOpacity>
);

export const CheckIcon = ({
  size = defaultSize,
  color = "#10b981",
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="checkmark-circle" size={size} color={color} />
  </TouchableOpacity>
);

export const WarningIcon = ({
  size = defaultSize,
  color = "#fbbf24",
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="alert" size={size} color={color} />
  </TouchableOpacity>
);

export const FileIcon = ({
  size = defaultSize,
  color = defaultColor,
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="document" size={size} color={color} />
  </TouchableOpacity>
);

export const AddIcon = ({
  size = defaultSize,
  color = "#4f46e5",
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="add-circle" size={size} color={color} />
  </TouchableOpacity>
);

export const TrashIcon = ({
  size = defaultSize,
  color = "#f43f5e",
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <Ionicons name="trash" size={size} color={color} />
  </TouchableOpacity>
);

export const Menuunfold = ({
  size = defaultSize,
  color = "#4f46e5", // violet
  onPress,
}: IconProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.common}>
    <AntDesign name="menuunfold" size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  common: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1e1c1a",
    alignItems: "center",
    justifyContent: "center",
  },
});
