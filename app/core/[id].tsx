import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../../hooks/useStore";
import { CoreSubtopic } from "../../types/types";
import React, { useLayoutEffect, useState, useCallback, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import SubTopicCard from "@/components/ui/SubTopicCard";
import { AddIcon } from "@/components/ui/icons";
import CustomModal from "@/components/Modal/modal";
import SubTopicForm from "@/components/Forms/SubTopicForm";

export default function CorePage() {
  const { id } = useLocalSearchParams(); // gets topicId
  const navigation = useNavigation();
  const getCoreSubtopicsByTopicId = useAppStore(
    (state) => state.getCoreSubtopicsByTopicId,
  );
  const getCoreTopicById = useAppStore((state) => state.getCoreTopicById);
  const subtopics = getCoreSubtopicsByTopicId(id as string);
  const currentTopic = getCoreTopicById(id as string);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const renderItem = useCallback(
    ({ item, index }: { item: CoreSubtopic; index: number }) => {
      if (!item) return null;
      return (
        <SubTopicCard
          subtopic={item}
          isLast={isLastMemo(index)}
          isExpanded={expandedId === item.id}
          onToggle={() =>
            setExpandedId((prev) => (prev === item.id ? null : item.id))
          }
        />
      );
    },
    [expandedId, subtopics.length],
  );

  // Memoized key extractor

  if (!currentTopic) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Category not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>{currentTopic.name}</Text>
        <AddIcon
          size={26}
          onPress={() => setModalVisible(true)}
          color="white"
        />
      </View>

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
        />
      )}
      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Add new SubTopic"
        >
          <SubTopicForm onSubmit={() => setModalVisible(false)} topicId={id} />
        </CustomModal>
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
    marginRight: 8,
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
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
});
