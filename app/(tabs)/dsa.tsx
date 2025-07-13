import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import CategoryListItem from "@/components/Cards/DsaTopicCard";
import { useAppStore } from "../../store/useStore";
import StatsChart from "../../components/Charts/pieChart";
import Header from "@/components/common/NewHeader";
import { useOverlayStore } from "@/store/useOverlayStore";
import { DeleteTopicsSheet, AddTopicForm, UpdateTopicForm } from "@/components/Forms/dsaForms/DsaTopic";

export default function DsaTopics() {
  const {
    dsa: { topics },
  } = useAppStore();
  const { showBottomSheet, showDialogModal } = useOverlayStore();

  function updateTopic(id: string, title: string, subtitle: string) {
    showDialogModal({
      title: "Update Topic",
      type: "default",
      subtitle: "Provide a name and details to update the topic.",
      content: <UpdateTopicForm id={id} oldTitle={title} oldSubtitle={subtitle} />,
    });
  }

  return (
    <BackgroundWrapper>
      <Header
        title="DSA Topics"
        leftIcon="none"
        rightIcon="menu"
        theme="dark"
        backgroundColor="transparent"
        menuOptions={[
          {
            label: "Add Topic",
            onPress: () =>
              showDialogModal({
                title: "New Topic",
                type: "default",
                subtitle: "Provide a name and details to create a new topic.",
                content: <AddTopicForm />,
              }),
          },
          {
            label: "Delete Topics",
            onPress: () =>
              showBottomSheet({
                height: 600,
                variant: "default",
                title: "Delete DSA Topics",
                subtitle: "Select topics to delete.",
                content: <DeleteTopicsSheet />,
              }),
          },
        ]}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {topics.length > 0 && <StatsChart />}
        {topics.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No topics yet. Tap + to add.</Text>
          </View>
        ) : (
          topics.map((topic, index) => <CategoryListItem key={topic.id} index={index} category={topic} pathLink="/dsa/[topic]" update={updateTopic} />)
        )}
      </ScrollView>
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
  cardContainer: { borderRadius: 30, overflow: "hidden" },
  contentContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6, paddingLeft: 6 },
  lhs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
