import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAppStore } from "@/store/useStore";
import AnimatedButton from "@/components/common/button";
import { theme } from "@/components/theme";
import { useOverlayStore } from "@/store/useOverlayStore";
import FormInput from "@/components/common/FormInput";
import { BlankCheckBoxIcon, CheckedCheckBoxIcon } from "@/components/common/icons";
import { generateId } from "@/utils/generateId";

export const AddSubTopicForm = ({ topicName, id, index, addAtIndex = false }) => {
  const [subTopicName, setSubTopicName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { addSystemDesignSubtopic } = useAppStore();
  const { showToast, hideDialogModal } = useOverlayStore();

  const handleAdd = () => {
    if (subTopicName.trim().length < 2) {
      setError("Subtopic Name must be at least 2 characters long.");
      return;
    }
    const newSubTopic = {
      id: generateId(),
      topicId: topicName,
      title: subTopicName.trim(),
      content: [],
    };
    addSystemDesignSubtopic(newSubTopic, { index, addAtIndex });
    showToast({ message: "Subtopic Created", type: "success" });
    hideDialogModal();
  };

  return (
    <View>
      <FormInput
        label="Subtopic Title"
        placeholder="Enter new subtopic title"
        value={subTopicName}
        onChangeText={(t) => {
          setSubTopicName(t);
          if (error) setError(null);
        }}
        error={error}
        mandatory
      />
      <AnimatedButton title="Add Subtopic" onPress={handleAdd} disabled={subTopicName.trim().length < 2} />
    </View>
  );
};

export const DeleteSubTopicSheet = ({ topicName }) => {
  const { getSystemDesignSubtopicsByTopicId, deleteSystemDesignSubtopic } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { hideBottomSheet, showToast } = useOverlayStore();
  const subtopics = getSystemDesignSubtopicsByTopicId(topicName);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleDelete = useCallback(() => {
    Array.from(selectedIds).forEach(deleteSystemDesignSubtopic);
    hideBottomSheet();
    showToast({ message: "Subtopics deleted", type: "success" });
  }, [selectedIds, deleteSystemDesignSubtopic]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.checkBoxList}>
        {!subtopics.length && <Text style={styles.emptyText}>No subtopics found</Text>}
        {subtopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={[styles.listItem, selectedIds.has(topic.id) && styles.selected]} onPress={() => toggleSelect(topic.id)}>
            <Text style={styles.label}>{topic.title}</Text>
            <View>{selectedIds.has(topic.id) ? <CheckedCheckBoxIcon size={24} color={theme.colors.primary} /> : <BlankCheckBoxIcon size={24} />}</View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <AnimatedButton title={`Delete (${selectedIds.size})`} disabled={selectedIds.size === 0} onPress={handleDelete} marginBottom={0} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkBoxList: {
    flex: 1,
  },
  listItem: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: theme.colors.surface,
  },
  selected: {
    borderColor: theme.colors.borderColor,
  },
  label: {
    fontSize: 14,
    color: theme.colors.Primarytext,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.Primarytext,
    textAlign: "center",
    marginTop: 20,
  },
});
