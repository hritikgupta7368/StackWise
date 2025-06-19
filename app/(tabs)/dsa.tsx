import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import CategoryListItem from "../../components/Preview/list";
import { useAppStore } from "../../hooks/useStore";
import StatsChart from "../../components/Charts/pieChart";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import CustomModal from "../../components/Modal/modal";
import DsaTopicForm from "../../components/Forms/DsaTopic";
import { AddIcon, TrashIcon, BackIcon } from "../../components/ui/icons";

export default function DsaTopics() {
  const topics = useAppStore((state) => state.dsa.topics);
  const deleteTopic = useAppStore((state) => state.deleteDsaTopic);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [delayedTopics, setDelayedTopics] = useState(topics);

  useEffect(() => {
    const timeout = setTimeout(() => setDelayedTopics(topics), 300);
    return () => clearTimeout(timeout);
  }, [topics]);

  const handleDelete = (id: string) => deleteTopic(id);
  console.log("Hello", topics);
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {delayedTopics.length > 0 && <StatsChart />}

          <View style={styles.header}>
            {deleteMode ? (
              <BackIcon onPress={() => setDeleteMode(false)} />
            ) : (
              <>
                <AddIcon
                  onPress={() => setModalVisible(true)}
                  color="white"
                  size={20}
                />
                <TrashIcon onPress={() => setDeleteMode(true)} />
              </>
            )}
          </View>

          {modalVisible && (
            <CustomModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              title="Add new Topic"
            >
              <DsaTopicForm onSubmit={() => setModalVisible(false)} />
            </CustomModal>
          )}

          {delayedTopics.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No topics yet. Tap + to add one!
              </Text>
            </View>
          ) : (
            delayedTopics.map((topic, index) => (
              <CategoryListItem
                key={topic.id}
                index={index}
                category={topic}
                pathLink="/dsa/[topic]"
                deleteMode={deleteMode}
                onDelete={handleDelete}
              />
            ))
          )}
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
  scroll: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
  },
});
