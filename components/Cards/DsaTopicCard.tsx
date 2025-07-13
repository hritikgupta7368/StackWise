import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useMemo } from "react";

type Category = {
  id: string;
  title: string;
  subtitle: string;
};

type Props = {
  category: Category;
  pathLink: string;
  index: number;
  update: (title: string, subtitle: string) => void;
};

const softColors = [
  { icon: "#ffbe0b" }, // Blue
  { icon: "#fb5607" }, // Green
  { icon: "#ff006e" }, // Purple
  { icon: "#8338ec" }, // Yellow
  { icon: "#3a86ff" }, // Red
  { icon: "#80ed99" }, // Emerald
  { icon: "#d62828" }, // Cyan
  { icon: "#ffd6ff" }, // Violet
  { icon: "#ff0054" }, // Amber
];

export default function CategoryListItem({ category, pathLink, index, update }: Props) {
  const colorSet = useMemo(() => softColors[index % softColors.length], [index]);

  return (
    <Link
      href={{ pathname: pathLink, params: { topic: category.id } }}
      asChild
      onLongPress={() => {
        update(category.id, category.title, category.subtitle);
      }}
    >
      <Pressable style={styles.categoryListItem}>
        <View style={styles.categoryListItemContent}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.categoryListItemTitle, { color: colorSet.icon }]}>{category.title}</Text>
            <Text style={[styles.categoryListItemSubtitle, { color: colorSet.icon }]}>{category.subtitle}</Text>
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
