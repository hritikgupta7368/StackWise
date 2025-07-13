import React, { useLayoutEffect, useState, useRef, useMemo, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import SubTopicCard from "@/components/Cards/SubTopicCard";
import { useAppStore } from "@/store/useStore";
import Header from "@/components/common/NewHeader";
import { useOverlayStore } from "@/store/useOverlayStore";
import AddBlockForm from "@/components/Forms/coreForms/AddBlockForm";
import EditBlockForm from "@/components/Forms/coreForms/EditBlockForm";
import { AddSubTopicForm, DeleteSubTopicSheet } from "@/components/Forms/systemDesignForms/SystemDesignSubtopic";

export default function SystemDesignPage() {
  const { id } = useLocalSearchParams(); // topicId
  const navigation = useNavigation();
  const titleRef = useRef<string | null>(null);
  const { showBottomSheet, showDialogModal, hideBottomSheet } = useOverlayStore();

  const allTopics = useAppStore((s) => s.systemDesign.topics);
  const allSubtopics = useAppStore((s) => s.systemDesign.subtopics);

  const topic = useMemo(() => allTopics.find((t) => t.id === id), [allTopics, id]);
  const subtopics = useMemo(() => allSubtopics.filter((st) => st.topicId === id), [allSubtopics, id]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const toggleExpanded = useCallback((subId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(subId) ? next.delete(subId) : next.add(subId);
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    if (topic?.name && topic.name !== titleRef.current) {
      navigation.setOptions({ title: topic.name });
      titleRef.current = topic.name;
    }
  }, [navigation, topic?.name]);

  const handleAddBlock = useCallback(
    (subId: string, at: number) => {
      showBottomSheet({
        height: 700,
        title: "Add Block",
        subtitle: "Add new content block",
        content: (
          <AddBlockForm
            onSubmit={(newBlock) => {
              useAppStore.getState().insertBlockInSystemDesignSubtopic(subId, at, newBlock);
              hideBottomSheet();
            }}
          />
        ),
      });
    },
    [hideBottomSheet, showBottomSheet],
  );

  const handleEditBlock = useCallback(
    (subId: string, block: any, idx: number) => {
      showBottomSheet({
        height: 700,
        title: "Edit Block",
        subtitle: `Editing ${block.type} block`,
        content: (
          <EditBlockForm
            initialBlock={block}
            onSubmit={(updated) => {
              useAppStore.getState().updateBlockInSystemDesignSubtopic(subId, idx, updated);
              hideBottomSheet();
            }}
          />
        ),
      });
    },
    [hideBottomSheet, showBottomSheet],
  );

  const handleDeleteBlock = useCallback((subId: string, idx: number) => {
    useAppStore.getState().deleteBlockInSystemDesignSubtopic(subId, idx);
  }, []);

  function addSubtopicAtIndex(id, index) {
    showDialogModal({
      title: "New Subtopic",
      type: "default",
      subtitle: "Enter title to create new subtopic",
      content: <AddSubTopicForm topicName={topic.id} id={id} index={index} addAtIndex={true} />,
    });
  }

  return (
    <View style={styles.page}>
      <Header
        title={!subtopics || subtopics.length <= 0 ? "Create Subtopic" : topic.name}
        theme="dark"
        leftIcon="back"
        rightIcon="menu"
        menuOptions={[
          {
            label: "Add Subtopic",
            onPress: () =>
              showDialogModal({
                title: "New Subtopic",
                type: "default",
                subtitle: "Enter title to create new subtopic",
                content: <AddSubTopicForm topicName={topic.id} id={""} index={null} addAtIndex={false} />,
              }),
          },
          {
            label: "Delete Subtopic",
            onPress: () =>
              showBottomSheet({
                title: "Delete Subtopic",
                height: 600,
                subtitle: "Delete subtopic",
                content: <DeleteSubTopicSheet topicName={topic.id} />,
              }),
          },
        ]}
      />
      {!subtopics || subtopics.length <= 0 ? (
        <View style={styles.centered}>
          <Text style={styles.notFound}>No subtopics found</Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 14, paddingTop: 7 }}>
          <FlashList data={subtopics} extraData={expandedIds} keyExtractor={(item) => item.id} renderItem={({ item, index }) => <SubTopicCard index={index} getIndex={() => addSubtopicAtIndex(item.id, index)} subtopic={item} isExpanded={expandedIds.has(item.id)} onToggle={() => toggleExpanded(item.id)} onAddBlock={() => handleAddBlock(item.id, item.content.length)} onEditBlock={(blk, idx) => handleEditBlock(item.id, blk, idx)} onDeleteBlock={(idx) => handleDeleteBlock(item.id, idx)} />} estimatedItemSize={200} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#111" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 18, color: "#fff" },
});
