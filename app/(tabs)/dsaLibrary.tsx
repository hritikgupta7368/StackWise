import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StriverSheet } from "@/constants/DsaProblemSet1";
import { theme } from "@/components/theme";
import Header from "@/components/common/NewHeader";
import { FlashList } from "@shopify/flash-list";

// Flatten the StriverSheet into a list of { category, title, difficulty } objects
const flatProblems = Object.entries(StriverSheet).flatMap(([category, problems]) =>
  problems.map((problem, index) => ({
    ...problem,
    category,
    index: index + 1,
  })),
);

const getColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "green";
    case "Medium":
      return "orange";
    case "Hard":
      return theme.colors.red;
    default:
      return "#fff";
  }
};

const StriverSheetScreen = () => {
  const renderItem = ({ item }: { item: (typeof flatProblems)[number] }) => (
    <View style={styles.problemCard}>
      <View style={styles.cardLeft}>
        <Text style={styles.problemTitle}>
          {item.index}. {item.title}
        </Text>
        <Text style={styles.categoryLabel}>{item.category}</Text>
      </View>
      <View style={[styles.difficultyTag, { backgroundColor: getColor(item.difficulty) }]}>
        <Text style={styles.difficultyText}>{item.difficulty}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="DSA Library" leftIcon="back" rightIcon="none" theme="dark" backgroundColor="transparent" />
      <FlashList
        data={flatProblems}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={renderItem}
        estimatedItemSize={70} // rough average height in pixels of each item
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.pageTitle}>Striver Sheet Problems</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.Primarytext,
    marginBottom: 16,
  },
  problemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  problemTitle: {
    color: theme.colors.Primarytext,
    fontSize: 14,
    fontWeight: "500",
  },
  categoryLabel: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginTop: 4,
  },
  difficultyTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default StriverSheetScreen;
