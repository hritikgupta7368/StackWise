import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useOverlayStore } from "@/store/useOverlayStore";

type MenuOption = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
};

type Props = {
  title?: string;
  leftIcon?: "back" | "none";
  onLeftPress?: () => void;
  rightIcon?: "settings" | "menu" | "none";
  onRightPress?: () => void;
  menuOptions?: MenuOption[];
  backgroundColor?: string;
  theme?: "light" | "dark";
  withBorder?: boolean;
};

const Header = ({ title = "", leftIcon = "back", onLeftPress, rightIcon = "none", onRightPress, menuOptions, backgroundColor = "#121212", theme = "dark", withBorder = false }: Props) => {
  const navigation = useNavigation();
  const { showPopupMenu } = useOverlayStore();

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else {
      navigation.goBack();
    }
  };

  const handleRightPress = () => {
    if (rightIcon === "menu" && menuOptions?.length) {
      showPopupMenu(menuOptions);
    } else if (onRightPress) {
      onRightPress();
    }
  };

  const iconColor = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <View style={[styles.header, { backgroundColor }, withBorder && styles.withBorder]}>
      {leftIcon === "back" ? (
        <TouchableOpacity onPress={handleLeftPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerSpacer} />
      )}

      <Text style={[styles.headerTitle, { color: iconColor }]} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon === "settings" && (
        <TouchableOpacity onPress={handleRightPress} style={styles.backButton}>
          <Ionicons name="settings-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      )}

      {rightIcon === "menu" && menuOptions?.length ? (
        <TouchableOpacity onPress={handleRightPress} style={styles.backButton}>
          <Ionicons name="ellipsis-vertical" size={22} color={iconColor} />
        </TouchableOpacity>
      ) : rightIcon === "none" ? (
        <View style={styles.headerSpacer} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  headerSpacer: {
    width: 40,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
});

export default Header;

// <CustomHeader
//   leftIcon="back"
//   rightIcon="menu"
//   menuOptions={[
//     { label: "Add", onPress: () => console.log("Add") },
//     { label: "Rename", onPress: () => console.log("Rename") },
//     { label: "Delete", onPress: () => console.log("Delete") },
//   ]}
// />
