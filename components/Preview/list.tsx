import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
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
  index,
}: Props) {
  const colorSet = useMemo(
    () => softColors[index % softColors.length],
    [index],
  );

  const handleDelete = useCallback(() => {
    onDelete?.(category.id);
  }, [onDelete, category.id]);

  const content = (
    <View style={[styles.categoryListItem]}>
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
        <FontAwesome
          name={deleteMode ? "trash" : "angle-right"}
          size={24}
          color={colorSet.icon}
        />
      </View>
    </View>
  );

  if (deleteMode) {
    return (
      <TouchableOpacity onPress={handleDelete}>{content}</TouchableOpacity>
    );
  }

  return (
    <Link href={{ pathname: pathLink, params: { topic: category.id } }} asChild>
      <TouchableOpacity>{content}</TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  categoryListItem: {
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
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
