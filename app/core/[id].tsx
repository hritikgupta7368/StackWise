import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../../hooks/useStore";
import { CoreSubtopic } from "../../types/types";
import React, { useLayoutEffect, useState, useCallback, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import SubTopicCard from "@/components/ui/SubTopicCard";
import { AddIcon, TrashIcon, OptionsVerticalIcon } from "@/components/ui/icons";
import CustomModal from "@/components/Modal/modal";
import SubTopicForm from "@/components/Forms/SubTopicForm";
import RenameModal from "@/components/Modal/renameModal";
import ActionSheet from "@/components/Modal/actionSheet";

export default function CorePage() {
  const { id } = useLocalSearchParams(); // gets topicId
  const navigation = useNavigation();

  // Store functions
  const getCoreSubtopicsByTopicId = useAppStore(
    (state) => state.getCoreSubtopicsByTopicId,
  );
  const getCoreTopicById = useAppStore((state) => state.getCoreTopicById);
  const deleteCoreSubtopic = useAppStore((state) => state.deleteCoreSubtopic);
  const updateCoreSubtopic = useAppStore((state) => state.updateCoreSubtopic);

  const subtopics = getCoreSubtopicsByTopicId(id as string);
  const currentTopic = getCoreTopicById(id as string);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  // Selection and editing states
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<
    "none" | "delete" | "rename"
  >("none");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [itemToRename, setItemToRename] = useState<CoreSubtopic | null>(null);

  // Callbacks
  const getItemType = useCallback(() => "subtopic", []);
  const keyExtractor = useCallback((item: CoreSubtopic) => item.id, []);

  useLayoutEffect(() => {
    if (currentTopic) {
      navigation.setOptions({ title: currentTopic.name });
    }
  }, [navigation, currentTopic]);

  const isLastMemo = useMemo(() => {
    const len = subtopics.length;
    return (index: number) => index === len - 1;
  }, [subtopics.length]);

  // **SELECTION LOGIC**
  // Handle card selection in delete mode
  const handleCardSelection = useCallback(
    (id: string) => {
      if (selectionMode === "delete") {
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return newSet;
        });
      }
    },
    [selectionMode],
  );

  // **ACTION SHEET LOGIC**
  // Show action sheet with delete/rename options
  const handleMoreOptions = useCallback(() => {
    setActionSheetVisible(true);
  }, []);

  const handleActionSheetSelect = useCallback((action: string) => {
    setActionSheetVisible(false);

    if (action === "delete") {
      setSelectionMode("delete");
      setSelectedIds(new Set());
      setExpandedId(null); // Collapse all cards when entering delete mode
    } else if (action === "rename") {
      setSelectionMode("rename");
      setSelectedIds(new Set());
      setExpandedId(null);
    }
  }, []);

  // **DELETION LOGIC**
  // Execute deletion of selected items
  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      "Delete Subtopics",
      `Are you sure you want to delete ${selectedIds.size} subtopic(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Delete all selected items
            selectedIds.forEach((id) => {
              deleteCoreSubtopic(id);
            });

            // Reset selection state
            setSelectionMode("none");
            setSelectedIds(new Set());
          },
        },
      ],
    );
  }, [selectedIds, deleteCoreSubtopic]);

  // **RENAME LOGIC**
  // Handle rename selection
  const handleRename = useCallback((subtopic: CoreSubtopic) => {
    setItemToRename(subtopic);
    setRenameModalVisible(true);
    setSelectionMode("none");
  }, []);

  const handleRenameSubmit = useCallback(
    (newTitle: string) => {
      if (itemToRename) {
        updateCoreSubtopic({
          ...itemToRename,
          title: newTitle,
        });
      }
      setRenameModalVisible(false);
      setItemToRename(null);
    },
    [itemToRename, updateCoreSubtopic],
  );

  // **CANCEL SELECTION MODE**
  const handleCancelSelection = useCallback(() => {
    setSelectionMode("none");
    setSelectedIds(new Set());
  }, []);

  // **RENDER ITEM LOGIC**
  const renderItem = useCallback(
    ({ item, index }: { item: CoreSubtopic; index: number }) => {
      if (!item) return null;

      const isSelected = selectedIds.has(item.id);
      const showCheckbox = selectionMode === "delete";
      const showRenameHighlight = selectionMode === "rename";

      return (
        <SubTopicCard
          subtopic={item}
          isLast={isLastMemo(index)}
          isExpanded={selectionMode === "none" ? expandedId === item.id : false}
          onToggle={() => {
            if (selectionMode === "delete") {
              handleCardSelection(item.id);
            } else if (selectionMode === "rename") {
              handleRename(item);
            } else {
              setExpandedId((prev) => (prev === item.id ? null : item.id));
            }
          }}
          // New props for selection mode
          selectionMode={selectionMode}
          isSelected={isSelected}
          showCheckbox={showCheckbox}
          showRenameHighlight={showRenameHighlight}
        />
      );
    },
    [
      expandedId,
      selectionMode,
      selectedIds,
      isLastMemo,
      handleCardSelection,
      handleRename,
    ],
  );

  if (!currentTopic) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Category not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      {/* **HEADER WITH CONTEXT-AWARE ACTIONS** */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>{currentTopic.name}</Text>

        <View style={styles.headerActions}>
          {selectionMode === "none" && (
            <>
              <AddIcon
                size={26}
                onPress={() => setModalVisible(true)}
                color="white"
                style={styles.headerIcon}
              />
              <OptionsVerticalIcon
                size={26}
                onPress={handleMoreOptions}
                color="white"
                // style={styles.headerIcon}
              />
            </>
          )}

          {selectionMode === "delete" && (
            <>
              <Text style={styles.selectionText}>
                {selectedIds.size} selected
              </Text>
              <TrashIcon
                size={26}
                onPress={handleDeleteSelected}
                color={selectedIds.size > 0 ? "#ef4444" : "#666"}
                disabled={selectedIds.size === 0}
                style={styles.headerIcon}
              />
              <Text style={styles.cancelText} onPress={handleCancelSelection}>
                Cancel
              </Text>
            </>
          )}

          {selectionMode === "rename" && (
            <>
              <Text style={styles.instructionText}>Tap a card to rename</Text>
              <Text style={styles.cancelText} onPress={handleCancelSelection}>
                Cancel
              </Text>
            </>
          )}
        </View>
      </View>

      {/* **SUBTOPICS LIST** */}
      {!subtopics || subtopics.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Subtopics</Text>
          <Text style={styles.emptySubText}>
            Add new subtopics to get started.
          </Text>
        </View>
      ) : (
        <FlashList
          data={subtopics}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContentContainer}
          estimatedItemSize={80}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          initialNumToRender={5}
          windowSize={5}
          getItemType={getItemType}
          scrollEventThrottle={16}
          estimatedListSize={{
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
          }}
          // Disable scrolling during selection modes for better UX
          scrollEnabled={selectionMode === "none"}
        />
      )}

      {/* **MODALS** */}
      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Add new SubTopic"
        >
          <SubTopicForm onSubmit={() => setModalVisible(false)} topicId={id} />
        </CustomModal>
      )}

      {renameModalVisible && itemToRename && (
        <RenameModal
          visible={renameModalVisible}
          onClose={() => setRenameModalVisible(false)}
          onSubmit={handleRenameSubmit}
          currentTitle={itemToRename.title}
          title="Rename Subtopic"
        />
      )}

      {actionSheetVisible && (
        <ActionSheet
          visible={actionSheetVisible}
          onClose={() => setActionSheetVisible(false)}
          onSelect={handleActionSheetSelect}
          options={[
            { id: "delete", title: "Delete", icon: "trash", color: "#ef4444" },
            { id: "rename", title: "Rename", icon: "edit", color: "#3b82f6" },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#1d1d1f",
    paddingTop: 35,
    padding: 16,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 12,
  },
  selectionText: {
    color: "#ffffff",
    fontSize: 16,
    marginRight: 12,
  },
  instructionText: {
    color: "#3b82f6",
    fontSize: 14,
    marginRight: 12,
  },
  cancelText: {
    color: "#3b82f6",
    fontSize: 16,
    marginLeft: 12,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
  },
  listContentContainer: {
    paddingVertical: 8,
  },
});
