import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
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

  const content = (
    <View style={styles.categoryListItemContent}>
      <View>
        <Text style={[styles.categoryListItemTitle, { color: colorSet.icon }]}>
          {category.title}
        </Text>
        <Text
          style={[styles.categoryListItemSubtitle, { color: colorSet.icon }]}
        >
          {category.subtitle}
        </Text>
      </View>
      <FontAwesome name="angle-right" size={24} color={colorSet.icon} />
    </View>
  );

  if (deleteMode) {
    return (
      <TouchableOpacity onPress={handleDelete} style={containerStyle}>
        {content}
      </TouchableOpacity>
    );
  }

  if (onTap) {
    return (
      <TouchableOpacity onPress={onTap} style={containerStyle}>
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <Link href={{ pathname: pathLink, params: { topic: category.id } }} asChild>
      <Pressable style={styles.categoryListItem}>
        <View style={styles.categoryListItemContent}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.categoryListItemTitle, { color: colorSet.icon }]}
            >
              {category.title}
            </Text>
            <Text
              style={[
                styles.categoryListItemSubtitle,
                { color: colorSet.icon },
              ]}
            >
              {category.subtitle}
            </Text>
          </View>
          <View style={{ paddingTop: 2 }}>
            <FontAwesome name={"angle-right"} size={24} color={colorSet.icon} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  categoryListItem: {
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "black",

    // Ensure it contains overflowing children
    overflow: "hidden",
  },

  categoryListItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryListItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flexWrap: "wrap",
    lineHeight: 22,

    width: "90%",
  },

  categoryListItemSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    flexWrap: "wrap",
    lineHeight: 18,

    width: "90%",
  },
});
