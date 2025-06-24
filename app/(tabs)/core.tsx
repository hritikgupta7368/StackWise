// Fixed version: Preventing infinite re-renders and stabilizing function references

import React, { useMemo, useCallback, memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useAppStore } from "../../hooks/useStore";
import Header, { useHeaderState } from "@/components/Header/header";
import AddCardModal from "@/components/Modal/addCardModal";
import PopupMenu from "@/components/ui/popMenu";

const { width: screenWidth } = Dimensions.get("window");
const containerPadding = 12;
const cardGap = 5;
const availableWidth = screenWidth - containerPadding * 2 - cardGap;
const largeWidth = availableWidth * 0.65;
const smallWidth = availableWidth * 0.35;

const categoryColors = [
  "#FFDE03",
  "#ff0266",
  "#03dac5",
  "#3700b3",
  "#FF9500",
  "#6200ee",
];

const TopicCard = memo(
  ({
    topic,
    width,
    color,
    isLarge,
    deleteMode = false,
    isSelected = false,
    onDelete,
    onPress,
  }: {
    topic: any;
    width: number;
    color: string;
    isLarge: boolean;
    deleteMode?: boolean;
    isSelected?: boolean;
    onDelete?: () => void;
    onPress?: () => void;
  }) => {
    const handlePress = useCallback(() => {
      if (deleteMode && onDelete) {
        onDelete();
      } else if (onPress) {
        onPress();
      }
    }, [deleteMode, onDelete, onPress]);

    return (
      <Pressable
        style={[
          styles.topicCard,
          {
            width,
            backgroundColor: color,
            borderWidth: deleteMode && isSelected ? 2 : 0,
            borderColor: deleteMode && isSelected ? "red" : "transparent",
          },
        ]}
        onPress={handlePress}
      >
        <Text style={[styles.topicName, { fontSize: isLarge ? 20 : 16 }]}>
          {topic.name}
        </Text>
      </Pressable>
    );
  },
);

TopicCard.displayName = "TopicCard";

const CategorySection = memo(
  ({
    category,
    deleteMode = false,
    isSelected = false,
    onDelete,
    onTap,
    colorIndex,
    // Pass store functions as stable refs
    storeActions,
  }: {
    category: any;
    deleteMode?: boolean;
    isSelected?: boolean;
    onDelete?: (id: string) => void;
    onTap?: () => void;
    colorIndex: number;
    storeActions: {
      getCoreTopicsByCategoryId: (id: string) => any[];
      addCoreTopic: (topic: any) => void;
      deleteCoreTopic: (id: string) => void;
      updateCoreTopic: (topic: any) => void;
      getCoreTopicById: (id: string) => any;
    };
  }) => {
    // Memoize topics to prevent unnecessary recalculations
    const topics = storeActions.getCoreTopicsByCategoryId(category.id);

    // Local state for topic management - use refs to prevent re-renders
    const [topicManagementMode, setTopicManagementMode] = useState<
      "none" | "delete" | "add"
    >("none");
    const [selectedTopicsToDelete, setSelectedTopicsToDelete] = useState<
      Set<string>
    >(() => new Set());
    const [topicMenuVisible, setTopicMenuVisible] = useState(false);
    const [addTopicModalVisible, setAddTopicModalVisible] = useState(false);

    // Stable function references to prevent infinite re-renders
    const handleTopicAdd = useCallback(
      (name: string) => {
        const newTopic = {
          id: Date.now().toString(),
          categoryId: category.id,
          name,
          description: "",
        };
        storeActions.addCoreTopic(newTopic);
        setAddTopicModalVisible(false);
      },
      [storeActions.addCoreTopic, category.id],
    );
    const handleTopicDelete = useCallback(() => {
      selectedTopicsToDelete.forEach((topicId) => {
        storeActions.deleteCoreTopic(topicId);
      });
      setSelectedTopicsToDelete(new Set());
      setTopicManagementMode("none");
    }, [storeActions.deleteCoreTopic, selectedTopicsToDelete]);

    const toggleTopicDeleteSelection = useCallback((topicId: string) => {
      setSelectedTopicsToDelete((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(topicId)) {
          newSet.delete(topicId);
        } else {
          newSet.add(topicId);
        }
        return newSet;
      });
    }, []);

    const cancelTopicDelete = useCallback(() => {
      setTopicManagementMode("none");
      setSelectedTopicsToDelete(new Set());
    }, []);

    const handleCategoryDelete = useCallback(() => {
      if (onDelete) {
        onDelete(category.id);
      }
    }, [onDelete, category.id]);

    const handleCategoryTap = useCallback(() => {
      if (onTap) {
        onTap();
      }
    }, [onTap]);

    // Memoize menu options to prevent recreating on every render
    const topicMenuOptions = useMemo(
      () => [
        {
          label: "Add Topic",
          onPress: () => setAddTopicModalVisible(true),
        },
        {
          label: "Delete Topics",
          onPress: () => setTopicManagementMode("delete"),
        },
      ],
      [],
    );

    // Memoize render function to prevent unnecessary re-renders
    const renderTopicCard = useCallback(
      ({ item, index }: { item: any; index: number }) => {
        const isEvenRow = Math.floor(index / 2) % 2 === 0;
        const isFirstInRow = index % 2 === 0;

        const cardWidth = isEvenRow
          ? isFirstInRow
            ? largeWidth
            : smallWidth
          : isFirstInRow
            ? smallWidth
            : largeWidth;

        const cardColor =
          categoryColors[(colorIndex + index) % categoryColors.length];

        const cardProps = {
          topic: item,
          width: cardWidth,
          color: cardColor,
          isLarge: isFirstInRow ? isEvenRow : !isEvenRow,
        };

        if (topicManagementMode === "delete") {
          return (
            <TopicCard
              key={item.id}
              {...cardProps}
              deleteMode
              isSelected={selectedTopicsToDelete.has(item.id)}
              onDelete={() => toggleTopicDeleteSelection(item.id)}
            />
          );
        }

        return (
          <Link href={`/core/${item.id}`} asChild key={item.id}>
            <TopicCard {...cardProps} />
          </Link>
        );
      },
      [
        colorIndex,
        topicManagementMode,
        selectedTopicsToDelete,
        toggleTopicDeleteSelection,
      ],
    );

    return (
      <View style={styles.categorySection}>
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          {deleteMode ? (
            <TouchableOpacity
              onPress={handleCategoryDelete}
              style={[
                styles.categoryTitleContainer,
                {
                  borderWidth: isSelected ? 1 : 0,
                  borderColor: "red",
                  borderRadius: 6,
                  padding: 6,
                },
              ]}
            >
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </TouchableOpacity>
          ) : onTap ? (
            <TouchableOpacity
              onPress={handleCategoryTap}
              style={styles.categoryTitleContainer}
            >
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.categoryTitleContainer}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
          )}

          {/* Topic Management Controls */}
          {!deleteMode && !onTap && (
            <View style={styles.topicControls}>
              {topicManagementMode === "delete" ? (
                <View style={styles.deleteControls}>
                  <TouchableOpacity
                    onPress={handleTopicDelete}
                    style={styles.deleteButton}
                    disabled={selectedTopicsToDelete.size === 0}
                  >
                    <Text
                      style={[
                        styles.deleteButtonText,
                        {
                          opacity: selectedTopicsToDelete.size === 0 ? 0.5 : 1,
                        },
                      ]}
                    >
                      Delete ({selectedTopicsToDelete.size})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={cancelTopicDelete}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Pressable
                  onPress={() => setTopicMenuVisible(true)}
                  hitSlop={8}
                >
                  <SimpleLineIcons
                    name="options-vertical"
                    size={12}
                    color="#fff"
                  />
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Topics Container */}
        <View style={styles.topicsContainer}>
          {topics.length === 0 ? (
            <View style={styles.emptyTopics}>
              <Text style={styles.emptyTopicsText}>
                No topics available in this category
              </Text>
              {!deleteMode && !onTap && (
                <Pressable
                  style={styles.addTopicButton}
                  onPress={() => setAddTopicModalVisible(true)}
                >
                  <Text style={styles.addTopicButtonText}>Add First Topic</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <FlatList
              data={topics}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTopicCard}
              numColumns={2}
              columnWrapperStyle={styles.topicRow}
              scrollEnabled={false}
              removeClippedSubviews
              windowSize={5}
              getItemLayout={(data, index) => ({
                length: 100, // Approximate item height
                offset: 100 * Math.floor(index / 2),
                index,
              })}
            />
          )}
        </View>

        {/* Topic Menu */}
        {topicMenuVisible && (
          <PopupMenu
            visible={topicMenuVisible}
            onClose={() => setTopicMenuVisible(false)}
            options={topicMenuOptions}
          />
        )}

        {/* Add Topic Modal */}
        {addTopicModalVisible && (
          <AddCardModal
            visible={addTopicModalVisible}
            onClose={() => setAddTopicModalVisible(false)}
            onSubmit={handleTopicAdd}
            contextLabel="Topic"
          />
        )}
      </View>
    );
  },
);

CategorySection.displayName = "CategorySection";

export default function Core() {
  const {
    core: { categories },
    addCoreCategory,
    deleteCoreCategory,
    getCoreCategoryById,
    getCoreTopicsByCategoryId,
    updateCoreCategory,
    addCoreTopic,
    deleteCoreTopic,
    updateCoreTopic,
    getCoreTopicById,
  } = useAppStore();

  // Memoize store actions to prevent recreating on every render
  const storeActions = useMemo(
    () => ({
      getCoreTopicsByCategoryId,
      addCoreTopic,
      deleteCoreTopic,
      updateCoreTopic,
      getCoreTopicById,
    }),
    [
      getCoreTopicsByCategoryId,
      addCoreTopic,
      deleteCoreTopic,
      updateCoreTopic,
      getCoreTopicById,
    ],
  );

  // Stable function references
  const handleRename = useCallback(
    (id: string, newName: string) => {
      const category = getCoreCategoryById(id);
      if (category && category.name !== newName) {
        updateCoreCategory({ ...category, name: newName });
      }
    },
    [getCoreCategoryById, updateCoreCategory],
  );

  const getCategoryNameById = useCallback(
    (id: string) => {
      return getCoreCategoryById(id)?.name || "";
    },
    [getCoreCategoryById],
  );

  const handleAdd = useCallback(
    (name: string) => {
      const newCategory = {
        id: Date.now().toString(),
        name,
        description: "",
      };
      addCoreCategory(newCategory);
    },
    [addCoreCategory],
  );

  const handleDelete = useCallback(
    (ids: string[]) => {
      ids.forEach(deleteCoreCategory);
    },
    [deleteCoreCategory],
  );

  const { headerState, headerControls } = useHeaderState(
    getCategoryNameById,
    handleRename,
  );

  const renderCategory = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <CategorySection
        key={item.id}
        category={item}
        deleteMode={headerState.deleteMode}
        isSelected={headerState.selectedToDelete.has(item.id)}
        onDelete={() => headerState.toggleDeleteSelection(item.id)}
        onTap={
          headerState.renameMode
            ? () => headerState.handleCardTap(item.id)
            : undefined
        }
        colorIndex={index}
        storeActions={storeActions}
      />
    ),
    [headerState, storeActions],
  );

  const EmptyState = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No categories available yet</Text>
        <Pressable style={styles.addFirstButton}>
          <Text style={styles.addFirstButtonText}>
            Create Your First Category
          </Text>
        </Pressable>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <Header
          title="Core Subjects"
          actions={{
            onAdd: handleAdd,
            onDelete: handleDelete,
          }}
          addContextLabel="Core Subject"
          renameContextLabel="Core Subject"
          headerControls={headerControls}
          headerState={headerState}
        />
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
          ListEmptyComponent={EmptyState}
          getItemLayout={(data, index) => ({
            length: 200, // Approximate category section height
            offset: 200 * index,
            index,
          })}
        />
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  categoriesContainer: {
    paddingHorizontal: containerPadding,
    paddingBottom: 90,
  },
  categorySection: {
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  topicControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteButton: {
    backgroundColor: "#ff0266",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cancelText: {
    color: "#aaa",
    fontSize: 12,
  },
  topicsContainer: {
    minHeight: 100,
  },
  topicRow: {
    justifyContent: "space-between",
    marginBottom: cardGap,
  },
  topicCard: {
    borderRadius: 12,
    padding: 20,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  topicName: {
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyTopics: {
    padding: 20,
    alignItems: "center",
  },
  emptyTopicsText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 12,
  },
  addTopicButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addTopicButtonText: {
    color: "#fff",
    fontSize: 14,
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
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
