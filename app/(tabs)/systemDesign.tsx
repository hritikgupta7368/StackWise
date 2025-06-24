// Alternative approach: Simple topic management without multiple headers
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
import Header from "@/components/Header/header";
import { useHeaderState } from "@/components/Header/header";
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
    ...props
  }: {
    topic: any;
    width: number;
    color: string;
    isLarge: boolean;
    deleteMode?: boolean;
    isSelected?: boolean;
    onDelete?: () => void;
    onPress?: () => void;
  }) => (
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
      onPress={deleteMode ? onDelete : props.onPress}
    >
      <Text style={[styles.topicName, { fontSize: isLarge ? 20 : 16 }]}>
        {topic.name}
      </Text>
    </Pressable>
  ),
);

const CategorySection = memo(
  ({
    category,
    deleteMode = false,
    isSelected = false,
    onDelete,
    onTap,
    colorIndex,
    getCoreTopicsByCategoryId,
    addCoreTopic,
    deleteCoreTopic,
    updateCoreTopic,
    getCoreTopicById,
  }: any) => {
    const topics = getCoreTopicsByCategoryId(category.id);

    // Local state for topic management
    const [topicManagementMode, setTopicManagementMode] = useState<
      "none" | "delete" | "add"
    >("none");
    const [selectedTopicsToDelete, setSelectedTopicsToDelete] = useState<
      Set<string>
    >(new Set());
    const [topicMenuVisible, setTopicMenuVisible] = useState(false);
    const [addTopicModalVisible, setAddTopicModalVisible] = useState(false);

    // Topic management handlers
    const handleTopicAdd = useCallback(
      (name: string) => {
        const newTopic = {
          id: Date.now().toString(),
          categoryId: category.id,
          name,
          description: "",
        };
        addCoreTopic(newTopic);
        setAddTopicModalVisible(false);
      },
      [addCoreTopic, category.id],
    );

    const handleTopicDelete = useCallback(() => {
      const idsToDelete = Array.from(selectedTopicsToDelete);
      idsToDelete.forEach(deleteCoreTopic);
      setSelectedTopicsToDelete(new Set());
      setTopicManagementMode("none");
    }, [deleteCoreTopic, selectedTopicsToDelete]);

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

    const topicMenuOptions = useMemo(
      () => [
        { label: "Add Topic", onPress: () => setAddTopicModalVisible(true) },
        {
          label: "Delete Topics",
          onPress: () => setTopicManagementMode("delete"),
        },
      ],
      [],
    );

    const renderTopicCard = ({ item, index }: { item: any; index: number }) => {
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
        <Link href={`/systemDesign/${item.id}`} asChild>
          <TopicCard {...cardProps} />
        </Link>
      );
    };
    return (
      <View style={styles.categorySection}>
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          {deleteMode ? (
            <TouchableOpacity
              onPress={() => onDelete?.(category.id)}
              style={[
                styles.categoryTitleContainer,
                {
                  borderWidth: deleteMode && isSelected ? 1 : 0,
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
              onPress={onTap}
              style={styles.categoryTitleContainer}
            >
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.categoryTitleContainer}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
          )}

          {/* Topic Management Controls - Only show when not in category management mode */}
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
              scrollEnabled={false} // so parent FlatList handles scrolling
              removeClippedSubviews
              windowSize={5}
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

// Rest of your Core component remains the same...
export default function SystemDesign() {
  const {
    systemDesign: { categories },
    addSystemDesignCategory,
    deleteSystemDesignCategory,
    getSystemDesignCategoryById,
    getSystemDesignTopicsByCategoryId,
    updateSystemDesignCategory,
    addSystemDesignTopic,
    deleteSystemDesignTopic,
    updateSystemDesignTopic,
    getSystemDesignTopicById,
  } = useAppStore();

  // Category management handlers (unchanged)
  const handleRename = useCallback(
    (id: string, newName: string) => {
      const category = getSystemDesignCategoryById(id);
      if (category && category.name !== newName) {
        updateSystemDesignCategory({ ...category, name: newName });
      }
    },
    [getSystemDesignCategoryById, updateSystemDesignCategory],
  );

  const getCategoryNameById = useCallback(
    (id: string) => {
      return getSystemDesignCategoryById(id)?.name || "";
    },
    [getSystemDesignCategoryById],
  );

  const handleAdd = useCallback(
    (name: string) => {
      const newCategory = {
        id: Date.now().toString(),
        name,
        description: "",
      };
      addSystemDesignCategory(newCategory);
    },
    [addSystemDesignCategory],
  );

  const handleDelete = useCallback(
    (ids: string[]) => {
      ids.forEach(deleteSystemDesignCategory);
    },
    [deleteSystemDesignCategory],
  );

  const { headerState, headerControls } = useHeaderState(
    getCategoryNameById,
    handleRename,
  );

  const renderCategory = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <CategorySection
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
        getCoreTopicsByCategoryId={getSystemDesignTopicsByCategoryId}
        addCoreTopic={addSystemDesignTopic}
        deleteCoreTopic={deleteSystemDesignTopic}
        updateCoreTopic={updateSystemDesignTopic}
        getCoreTopicById={getSystemDesignTopicById}
      />
    ),
    [
      getSystemDesignTopicsByCategoryId,
      headerState,
      addSystemDesignTopic,
      deleteSystemDesignTopic,
      updateSystemDesignTopic,
      getSystemDesignTopicById,
    ],
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
          title="System Design"
          actions={{
            onAdd: handleAdd,
            onDelete: handleDelete,
          }}
          addContextLabel="System Design"
          renameContextLabel="System Design"
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
    marginBottom: 10,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    paddingHorizontal: 2,
  },
  topicControls: {
    marginLeft: 12,
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
    gap: 8,
  },
  topicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  topicCard: {
    borderRadius: 12,
    padding: 20,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
