import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import { useAppStore } from "../../hooks/useStore";
import { CoreCategory } from "../../types/types";
import { Link } from "expo-router";

const CoreCategoryWithTopics = ({ category }) => {
  const getCoreTopicsByCategoryId = useAppStore(
    (state) => state.getCoreTopicsByCategoryId,
  );
  const topics = getCoreTopicsByCategoryId(category.id);
  return (
    <View style={styles.categoryContainer}>
      {/* Category Header */}
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {category.description && (
          <Text style={styles.categoryDescription}>{category.description}</Text>
        )}
      </View>

      {/* List of Topics within this Category */}
      {topics.length === 0 ? (
        <Text style={styles.noTopicsText}>
          No topics available in this category.
        </Text>
      ) : (
        <View style={styles.topicsList}>
          {topics.map((topic) => (
            // Each topic item navigates to /core/[topic.id]
            <Link key={topic.id} href={`/core/${topic.id}`} asChild>
              <Pressable style={styles.topicItem}>
                <Text style={styles.topicName}>{topic.name}</Text>
                {topic.description && (
                  <Text style={styles.topicDescription} numberOfLines={2}>
                    {topic.description}
                  </Text>
                )}
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </View>
  );
};

export default function Core() {
  const categories = useAppStore((state) => state.core.categories);
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Core Learning Modules</Text>
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>
            No core categories available. Please import data from settings.
          </Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CoreCategoryWithTopics category={item} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Light background
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  listContentContainer: {
    paddingVertical: 10, // Add vertical padding to the content container
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#7f8c8d",
  },
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16, // Add margin for spacing from screen edges
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden", // Ensure rounded corners apply
  },
  categoryHeader: {
    padding: 20,
    backgroundColor: "#3498db", // A distinct background for category headers
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#ecf0f1", // Lighter text for description
  },
  topicsList: {
    padding: 15,
    backgroundColor: "#ecf0f1", // Slightly different background for topics section
  },
  topicItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  topicName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 5,
  },
  topicDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  noTopicsText: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    paddingVertical: 20,
    backgroundColor: "#ecf0f1",
  },
});
