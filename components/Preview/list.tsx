import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useMemo, useCallback } from "react";

type Category = {
  id: string;
  title: string;
  subtitle: string;
};

type Props = {
  category: Category;
  pathLink: string;
  deleteMode?: boolean;
  onDelete?: (id: string) => void;
  onTap?: () => void;
  isSelected?: boolean;
  index: number;
};

const softColors = [
  { icon: "#3b82f6" }, // Blue
  { icon: "#10b981" }, // Green
  { icon: "#a855f7" }, // Purple
  { icon: "#f59e0b" }, // Yellow
  { icon: "#ef4444" }, // Red
  { icon: "#22c55e" }, // Emerald
  { icon: "#06b6d4" }, // Cyan
  { icon: "#c084fc" }, // Violet
  { icon: "#facc15" }, // Amber
];

export default function CategoryListItem({
  category,
  pathLink,
  deleteMode = false,
  onDelete,
  onTap,
  isSelected = false,
  index,
}: Props) {
  const router = useRouter();
  const colorSet = useMemo(
    () => softColors[index % softColors.length],
    [index],
  );

  const handleDelete = useCallback(() => {
    onDelete?.(category.id);
  }, [onDelete, category.id]);

  const containerStyle = useMemo(() => {
    const base = [styles.categoryListItem];
    if (deleteMode && isSelected) {
      base.push({
        borderColor: colorSet.icon,
      });
    }
    return base;
  }, [deleteMode, isSelected, colorSet.icon]);

  const handlePress = useCallback(() => {
    console.log("handlePress called");

    if (typeof onTap === "function") {
      const result = onTap();
      console.log("onTap() returned:", result);

      // If onTap returns true, exit early (user handled the tap)
      if (result === true) {
        console.log("onTap handled the action. Skipping navigation.");
        return;
      }
    }

    // Default navigation
    console.log("Navigating to:", `/dsa/${category.id}`);
    router.push(`/dsa/${category.id}`);
  }, [onTap, category.id, router]);

  const content = (
    <View style={containerStyle}>
      <View style={styles.categoryListItemContent}>
        <View>
          <Text
            style={[styles.categoryListItemTitle, { color: colorSet.icon }]}
          >
            {category.title}
          </Text>
          <Text
            style={[styles.categoryListItemSubtitle, { color: colorSet.icon }]}
          >
            {category.subtitle}
          </Text>
        </View>
        <FontAwesome name={"angle-right"} size={24} color={colorSet.icon} />
      </View>
    </View>
  );

  // Delete Mode
  if (deleteMode) {
    return (
      <TouchableOpacity onPress={handleDelete}>{content}</TouchableOpacity>
    );
  }

  // Rename Mode
  if (onTap) {
    return <TouchableOpacity onPress={onTap}>{content}</TouchableOpacity>;
  }

  // Default navigation mode

  return <TouchableOpacity onPress={handlePress}>{content}</TouchableOpacity>;
}

const styles = StyleSheet.create({
  categoryListItem: {
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "black",
  },
  categoryListItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryListItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryListItemSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
});
