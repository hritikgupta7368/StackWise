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

export const AddCategoryForm = ({ insertIndex }) => {
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { addCoreCategory } = useAppStore();
  const { showToast, hideDialogModal } = useOverlayStore();

  const handleAdd = () => {
    if (category.trim().length < 2) {
      setError("Category Name must be at least 2 characters long.");
      return;
    }
    const newCategory = {
      id: generateId(),
      name: category.trim(),
    };
    addCoreCategory(newCategory, insertIndex);
    showToast({ message: "Category Created", type: "success" });
    hideDialogModal();
  };

  return (
    <View>
      <FormInput
        label="Topic Title"
        placeholder="Enter new topic title"
        value={category}
        onChangeText={(t) => {
          setCategory(t);
          if (error) setError(null);
        }}
        error={error}
        mandatory
      />

      <AnimatedButton title="Add Category" onPress={handleAdd} disabled={category.trim().length < 2} />
    </View>
  );
};

export const DeleteCategorySheet = () => {
  const {
    core: { categories },
    deleteCoreCategory,
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
    Array.from(selectedIds).forEach(deleteCoreCategory);
    hideBottomSheet();
    showToast({ message: "Categories deleted", type: "success" });
  }, [selectedIds, deleteCoreCategory]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.checkBoxList}>
        {categories.map((topic) => (
          <TouchableOpacity key={topic.id} style={[styles.listItem, selectedIds.has(topic.id) && styles.selected]} onPress={() => toggleSelect(topic.id)}>
            <Text style={styles.label}>{topic.name}</Text>
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
});
