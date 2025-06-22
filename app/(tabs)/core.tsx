import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import { useAppStore } from "../../hooks/useStore";

const { width: screenWidth } = Dimensions.get("window");
const containerPadding = 12;
const cardGap = 5;
const availableWidth = screenWidth - containerPadding * 2 - cardGap;
const largeWidth = availableWidth * 0.65;
const smallWidth = availableWidth * 0.35;

// Static color palette
const categoryColors = [
  "#FFDE03", // Bright Yellow
  "#ff0266", // Punchy Red
  "#03dac5", // Vivid Green
  "#3700b3", // Bright Blue
  "#FF9500", // Vivid Orange
  "#6200ee", // Punchy Purple
];

const TopicCard = React.memo(
  ({
    topic,
    width,
    color,
    onPress,
    isLarge,
  }: {
    topic: any;
    width: number;
    color: string;
    onPress: (id: any) => void;
    isLarge: boolean;
  }) => (
    <Pressable
      style={[
        styles.topicCard,
        {
          width,
          backgroundColor: color,
        },
      ]}
      onPress={() => onPress(topic.id)}
    >
      <Text
        style={[styles.topicName, { fontSize: isLarge ? 20 : 16 }]}
        numberOfLines={3}
      >
        {topic.name}
      </Text>
    </Pressable>
  ),
);

const CategorySection = React.memo(
  ({
    category,
    colorIndex,
    getCoreTopicsByCategoryId,
  }: {
    category: any;
    colorIndex: number;
    getCoreTopicsByCategoryId: (id: any) => any[];
  }) => {
    const topics = getCoreTopicsByCategoryId(category.id);

    // The new, optimized useMemo block
    const topicRows = useMemo(() => {
      const rows = [];
      for (let i = 0; i < topics.length; i += 2) {
        const rowIndex = Math.floor(i / 2);
        const isEvenRow = rowIndex % 2 === 0;

        const firstTopic = topics[i];
        const secondTopic = topics[i + 1];

        const firstCardWidth = isEvenRow ? largeWidth : smallWidth;
        const secondCardWidth = isEvenRow ? smallWidth : largeWidth;

        const firstColor =
          categoryColors[(colorIndex + i) % categoryColors.length];
        const secondColor =
          categoryColors[(colorIndex + i + 1) % categoryColors.length];

        rows.push(
          <View key={i} style={styles.topicRow}>
            <Link href={`/core/${firstTopic.id}`} asChild>
              <TopicCard
                topic={firstTopic}
                width={firstCardWidth}
                color={firstColor}
                isLarge={isEvenRow}
              />
            </Link>
            {secondTopic && (
              <Link href={`/core/${secondTopic.id}`} asChild>
                <TopicCard
                  topic={secondTopic}
                  width={secondCardWidth}
                  color={secondColor}
                  isLarge={!isEvenRow}
                />
              </Link>
            )}
          </View>,
        );
      }
      return rows;
    }, [topics, colorIndex]); // Dependency array is now cleaner

    return (
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category.name}</Text>
        <View style={styles.topicsContainer}>
          {topics.length === 0 ? (
            <View style={styles.emptyTopics}>
              <Text style={styles.emptyTopicsText}>
                No topics available in this category
              </Text>
            </View>
          ) : (
            topicRows
          )}
        </View>
      </View>
    );
  },
);

export default function Core() {
  const categories = useAppStore((state) => state.core.categories);
  const getCoreTopicsByCategoryId = useAppStore(
    (state) => state.getCoreTopicsByCategoryId,
  );

  const renderCategory = useCallback(
    ({ item: category, index }: { item: any; index: number }) => (
      <CategorySection
        category={category}
        colorIndex={index}
        getCoreTopicsByCategoryId={getCoreTopicsByCategoryId}
      />
    ),
    [getCoreTopicsByCategoryId],
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Core Learning</Text>
        <Link href="/manage/core-categories" asChild>
          <Pressable style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage</Text>
          </Pressable>
        </Link>
      </View>
    ),
    [],
  );

  const EmptyState = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No categories available yet</Text>
        <Link href="/manage/core-categories" asChild>
          <Pressable style={styles.addFirstButton}>
            <Text style={styles.addFirstButtonText}>
              Create Your First Category
            </Text>
          </Pressable>
        </Link>
      </View>
    ),
    [],
  );

  return (
    <BackgroundWrapper>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
        contentContainerStyle={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        windowSize={10}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
      />
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: containerPadding,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  manageButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  manageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: containerPadding,
    paddingBottom: 16,
  },
  categorySection: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  topicsContainer: {
    gap: 8,
  },
  topicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topicCard: {
    borderRadius: 12,
    padding: 20,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  topicName: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyTopics: {
    padding: 20,
    alignItems: "center",
  },
  emptyTopicsText: {
    fontSize: 14,
    color: "#a0a0a0",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#a0a0a0",
    textAlign: "center",
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFirstButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
