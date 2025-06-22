import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import CategoryListItem from "../../components/Preview/list";
import { useAppStore } from "../../hooks/useStore";
import { useHeaderState } from "@/components/Header/header";
import Header from "@/components/Header/header";
import StatsChart from "../../components/Charts/pieChart";

export default function DsaTopics() {
  const {
    dsa: { topics },
    addDsaTopic,
    deleteDsaTopic,
    updateDsaTopic,
    getDsaTopicById,
  } = useAppStore();

  // ✅ Rename
  const handleRename = useCallback(
    (id: string, newTitle: string) => {
      const topic = getDsaTopicById(id);
      if (topic && topic.title !== newTitle) {
        updateDsaTopic({ ...topic, title: newTitle });
      }
    },
    [getDsaTopicById, updateDsaTopic],
  );

  // Get title for rename modal
  const getTitleById = useCallback(
    (id: string) => {
      return getDsaTopicById(id)?.title || "";
    },
    [getDsaTopicById],
  );

  // Add handler
  const handleAdd = useCallback(
    (title: string) => {
      const newTopic = {
        id: Date.now().toString(),
        title,
        subtitle: "",
      };
      addDsaTopic(newTopic);
    },
    [addDsaTopic],
  );

  // Delete handler
  const handleDelete = useCallback(
    (ids: string[]) => {
      ids.forEach(deleteDsaTopic);
    },
    [deleteDsaTopic],
  );

  const { headerState, headerControls } = useHeaderState(
    getTitleById,
    handleRename,
  );

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <Header
          title="DSA Topics"
          actions={{
            onAdd: handleAdd,
            onDelete: handleDelete,
          }}
          addContextLabel="DSA Topic"
          renameContextLabel="Topic"
          headerControls={headerControls}
          headerState={headerState}
        />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {topics.length > 0 && <StatsChart />}
          {topics.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No topics yet. Tap + to add.</Text>
            </View>
          ) : (
            topics.map((topic, index) => (
              <CategoryListItem
                key={topic.id}
                index={index}
                category={topic}
                pathLink="/dsa/[topic]"
                deleteMode={headerState.deleteMode}
                isSelected={headerState.selectedToDelete.has(topic.id)}
                onDelete={() => headerState.toggleDeleteSelection(topic.id)}
                onTap={
                  headerState.renameMode
                    ? () => headerState.handleCardTap(topic.id)
                    : undefined // ← don’t pass if not rename mode
                }
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 110, // leave space for modal/fab/etc.
    paddingTop: 12,
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
