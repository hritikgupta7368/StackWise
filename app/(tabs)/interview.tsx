import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "@/components/common/NewHeader";
import { useAppStore } from "@/store/useStore";
import InterviewCard from "@/components/Cards/InterviewCard";
import { FlashList } from "@shopify/flash-list";
import { useOverlayStore } from "@/store/useOverlayStore";
import AddBlockForm from "@/components/Forms/coreForms/AddBlockForm";
import EditBlockForm from "@/components/Forms/coreForms/EditBlockForm";
import { AddInterviewQuestionForm, DeleteInterviewQuestionSheet } from "@/components/Forms/interviewForms/InterviewQuestionForms";

export default function Interview() {
  const questions = useAppStore((s) => s.interview.questions);
  const { showDialogModal, showBottomSheet, hideBottomSheet } = useOverlayStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((subId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(subId) ? next.delete(subId) : next.add(subId);
      return next;
    });
  }, []);

  const handleAddBlock = useCallback(
    (id: string, at: number) => {
      showBottomSheet({
        title: "Add Block",
        subtitle: "Add block to interview answer",
        height: 700,
        content: (
          <AddBlockForm
            onSubmit={(newBlock) => {
              useAppStore.getState().insertInterviewAnswerBlock(id, at, newBlock);
              hideBottomSheet();
            }}
          />
        ),
      });
    },
    [hideBottomSheet, showBottomSheet],
  );

  const handleEditBlock = useCallback((id: string, block, index) => {
    showBottomSheet({
      title: "Edit Block",
      subtitle: `Editing ${block.type} block`,
      height: 700,
      content: (
        <EditBlockForm
          initialBlock={block}
          onSubmit={(updated) => {
            useAppStore.getState().updateInterviewAnswerBlock(id, index, updated);
            hideBottomSheet();
          }}
        />
      ),
    });
  }, []);

  const handleDeleteBlock = useCallback((id: string, index: number) => {
    useAppStore.getState().deleteInterviewAnswerBlock(id, index);
  }, []);

  return (
    <View style={styles.page}>
      <Header
        title="Interview Prep"
        theme="dark"
        leftIcon="none"
        rightIcon="menu"
        menuOptions={[
          {
            label: "Add Interview Question",
            onPress: () => {
              showDialogModal({
                title: "Add Interview Question",
                subtitle: "Enter a question to get started",
                type: "default",
                content: <AddInterviewQuestionForm insertIndex={questions.length} />,
              });
            },
          },
          {
            label: "Delete Questions",
            onPress: () => {
              showBottomSheet({
                title: "Delete Interview Questions",
                subtitle: "Select and delete questions",
                height: 600,
                content: <DeleteInterviewQuestionSheet />,
              });
            },
          },
        ]}
      />

      <FlashList extraData={expandedIds} data={questions} estimatedItemSize={200} contentContainerStyle={{ padding: 14, paddingBottom: 100 }} renderItem={({ item }) => <InterviewCard id={item.id} question={item.question} answer={item.answer} isExpanded={expandedIds.has(item.id)} onToggle={() => toggleExpanded(item.id)} onAddBlock={() => handleAddBlock(item.id, item.answer.length)} onEditBlock={(blk, idx) => handleEditBlock(item.id, blk, idx)} onDeleteBlock={(idx) => handleDeleteBlock(item.id, idx)} />} showsVerticalScrollIndicator={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#111",
  },
});
