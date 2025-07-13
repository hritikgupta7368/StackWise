// ✅ New file: components/BottomSheets/DeleteTopicsSheet.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAppStore } from "@/store/useStore";
import AnimatedButton from "@/components/common/button";
import { theme } from "@/components/theme";
import { useOverlayStore } from "@/store/useOverlayStore";
import FormInput from "@/components/common/FormInput";
import { BlankCheckBoxIcon, CheckedCheckBoxIcon } from "@/components/common/icons";
import { generateId } from "@/utils/generateId";

export const AddTopicForm = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [subtitleError, setSubtitleError] = useState<string | null>(null);

  const { addDsaTopic } = useAppStore();
  const { showToast, hideDialogModal } = useOverlayStore();

  const handleAdd = () => {
    let hasError = false;

    if (title.trim().length < 2) {
      setTitleError("Title must be at least 2 characters long.");
      hasError = true;
    }

    if (subtitle.trim().length < 2) {
      setSubtitleError("Subtitle must be at least 2 characters long.");
      hasError = true;
    }

    if (hasError) return;

    const newTopic = {
      id: generateId(),
      title: title.trim(),
      subtitle: subtitle.trim(),
    };

    addDsaTopic(newTopic);
    showToast({ message: "Topic added", type: "success" });
    hideDialogModal();
  };

  return (
    <View>
      <FormInput
        label="Topic Title"
        placeholder="Enter new topic title"
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (titleError) setTitleError(null);
        }}
        error={titleError}
        mandatory
      />
      <FormInput
        label="Topic Subtitle"
        placeholder="Enter new topic subtitle"
        value={subtitle}
        onChangeText={(t) => {
          setSubtitle(t);
          if (subtitleError) setSubtitleError(null);
        }}
        error={subtitleError}
        mandatory
      />
      <AnimatedButton title="Add Topic" onPress={handleAdd} disabled={title.trim().length < 2} />
      <AnimatedButton title="Cancel" onPress={() => hideDialogModal()} borderColor={theme.Model.borderColor} backgroundColor="white" textColor="black" marginBottom={0} />
    </View>
  );
};

export const UpdateTopicForm = ({ id = "", oldTitle = "", oldSubtitle = "" }) => {
  const [title, setTitle] = useState(oldTitle);
  const [subtitle, setSubtitle] = useState(oldSubtitle);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [subtitleError, setSubtitleError] = useState<string | null>(null);

  const { updateDsaTopic } = useAppStore();

  const { showToast, hideDialogModal } = useOverlayStore();

  const handleAdd = () => {
    let hasError = false;

    if (title.trim().length < 2) {
      setTitleError("Title must be at least 2 characters long.");
      hasError = true;
    }

    if (subtitle.trim().length < 2) {
      setSubtitleError("Subtitle must be at least 2 characters long.");
      hasError = true;
    }

    if (hasError) return;

    const newTopic = {
      id: id,
      title: title.trim(),
      subtitle: subtitle.trim(),
    };

    updateDsaTopic(newTopic);
    showToast({ message: "Topic updated", type: "success" });
    hideDialogModal();
  };

  return (
    <View>
      <FormInput
        label="Topic Title"
        placeholder="Enter new topic title"
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (titleError) setTitleError(null);
        }}
        error={titleError}
        mandatory
      />
      <FormInput
        label="Topic Subtitle"
        placeholder="Enter new topic subtitle"
        value={subtitle}
        onChangeText={(t) => {
          setSubtitle(t);
          if (subtitleError) setSubtitleError(null);
        }}
        error={subtitleError}
        mandatory
      />
      <AnimatedButton title="Update" onPress={handleAdd} disabled={title.trim().length < 2} />
      <AnimatedButton title="Cancel" onPress={() => hideDialogModal()} borderColor={theme.Model.borderColor} backgroundColor="white" textColor="black" marginBottom={0} />
    </View>
  );
};

export const DeleteTopicsSheet = () => {
  const {
    dsa: { topics },
    deleteDsaTopic,
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

  // Delete handler
  const handleDelete = useCallback(() => {
    Array.from(selectedIds).forEach(deleteDsaTopic);
    hideBottomSheet();
    showToast({ message: "Topics deleted", type: "success" });
  }, [selectedIds, deleteDsaTopic]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {topics.map((topic) => (
          <TouchableOpacity key={topic.id} style={[styles.item, selectedIds.has(topic.id) && styles.selected]} onPress={() => toggleSelect(topic.title)}>
            <Text style={styles.label}>{topic.title}</Text>
            <View>{selectedIds.has(topic.title) ? <CheckedCheckBoxIcon size={24} color={theme.colors.primary} /> : <BlankCheckBoxIcon size={24} />}</View>
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
