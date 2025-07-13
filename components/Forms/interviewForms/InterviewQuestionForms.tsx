import React, { useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from "react-native";
import { useAppStore } from "@/store/useStore";
import AnimatedButton from "@/components/common/button";
import FormInput from "@/components/common/FormInput";
import { useOverlayStore } from "@/store/useOverlayStore";
import { theme } from "@/components/theme";
import { BlankCheckBoxIcon, CheckedCheckBoxIcon } from "@/components/common/icons";
import { generateId } from "@/utils/generateId";

export const AddInterviewQuestionForm = ({ insertIndex }) => {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { addInterviewQuestion } = useAppStore();
  const { showToast, hideDialogModal } = useOverlayStore();

  const handleAdd = () => {
    if (question.trim().length < 3) {
      setError("Question must be at least 3 characters.");
      return;
    }

    const newQ = {
      id: generateId(),
      question: question.trim(),
      answer: [],
    };

    addInterviewQuestion(newQ, insertIndex);
    showToast({ message: "Interview question added", type: "success" });
    hideDialogModal();
  };

  return (
    <View>
      <FormInput
        label="Interview Question"
        placeholder="Enter interview question"
        value={question}
        onChangeText={(t) => {
          setQuestion(t);
          if (error) setError(null);
        }}
        error={error}
        mandatory
      />
      <AnimatedButton title="Add Question" onPress={handleAdd} />
    </View>
  );
};

export const DeleteInterviewQuestionSheet = () => {
  const {
    interview: { questions },
    deleteInterviewQuestion,
  } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { hideBottomSheet, showToast } = useOverlayStore();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleDelete = () => {
    Array.from(selectedIds).forEach(deleteInterviewQuestion);
    showToast({ message: "Questions deleted", type: "success" });
    hideBottomSheet();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {questions.map((q) => (
          <TouchableOpacity key={q.id} onPress={() => toggleSelect(q.id)} style={[styles.item, selectedIds.has(q.id) && styles.selected]}>
            <Text style={{ color: "#fff" }}>{q.question}</Text>
            <View>{selectedIds.has(q.id) ? <CheckedCheckBoxIcon size={24} color={theme.colors.primary} /> : <BlankCheckBoxIcon size={24} />}</View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <AnimatedButton title={`Delete (${selectedIds.size})`} disabled={selectedIds.size === 0} onPress={handleDelete} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: theme.colors.Primarytext,
  },
  list: {
    flex: 1,
    marginBottom: 16,
  },
  item: {
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
    fontSize: 16,
    color: theme.colors.Primarytext,
  },
});
