import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import FormInput from "@/components/common/FormInput";
import { useAppStore } from "@/store/useStore";
import { Problem } from "@/types/types";
import HorizontalSelect from "@/components/common/PillSelect";
import AnimatedButton from "@/components/common/button";
import { useOverlayStore } from "@/store/useOverlayStore";
import { theme } from "@/components/theme";
import { AddIcon, CheckedCheckBoxIcon, BlankCheckBoxIcon } from "@/components/common/icons";
import { ImageInput } from "@/components/common/ImageInput";
import { generateId } from "@/utils/generateId";

const difficultyLevels = ["easy", "medium", "hard"];

export const AddNewProblem = ({ topicId }) => {
  const { addProblem } = useAppStore();
  const { hideBottomSheet, showToast } = useOverlayStore();
  const [form, setForm] = useState({
    title: "",
    explanation: "",
    problemLink: "",
    difficultyLevel: "easy",
    testCase: "",
    solution: "",
    code: "",
    similarProblems: [],
    images: [],
  });

  const [newSimilar, setNewSimilar] = useState<any>({
    id: generateId(),
    title: "",
    description: "",
    shortExplanation: "",
    difficultyLevel: "easy",
    code: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.explanation) newErrors.explanation = "Explanation is required";
    if (!form.testCase) newErrors.testCase = "Test case is required";
    if (!form.solution) newErrors.solution = "Solution is required";
    if (!form.code) newErrors.code = "Code is required";

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      throw new Error("Validation failed");
    }

    const problem: Problem = {
      id: generateId(),
      topicId: topicId,
      ...form,
    };

    addProblem(problem);
    hideBottomSheet();
    showToast({ message: "Problem added successfully", type: "success" });
  };
  const handleAddSimilarProblem = () => {
    if (!newSimilar.title || !newSimilar.description || !newSimilar.shortExplanation || !newSimilar.code) {
      showToast({ message: "Please enter the data", type: "error" });
      return;
    }
    setForm((prevForm) => ({
      ...prevForm,
      similarProblems: [...prevForm.similarProblems, { ...newSimilar }],
    }));
    setNewSimilar({
      title: "",
      description: "",
      shortExplanation: "",
      difficultyLevel: "easy",
      code: "",
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <FormInput label="Title" mandatory value={form.title} onChangeText={(text) => handleChange("title", text)} error={errors.title} />
        <FormInput label="Explanation" mandatory multiline value={form.explanation} onChangeText={(text) => handleChange("explanation", text)} error={errors.explanation} />
        <FormInput label="Problem Link" placeholder="https://..." value={form.problemLink} onChangeText={(text) => handleChange("problemLink", text)} />

        <HorizontalSelect
          label="Difficulty Level"
          data={difficultyLevels}
          onSelect={(selectedDifficulty) => {
            handleChange("difficultyLevel", selectedDifficulty);
          }}
          defaultSelected="easy"
          borderRadius={10}
        />
        <FormInput label="Test Case" mandatory multiline value={form.testCase} onChangeText={(text) => handleChange("testCase", text)} error={errors.testCase} />
        <FormInput label="Solution" mandatory multiline value={form.solution} onChangeText={(text) => handleChange("solution", text)} error={errors.solution} />

        <FormInput label="Code" mandatory multiline value={form.code} onChangeText={(text) => handleChange("code", text)} error={errors.code} fontFamily="monospace" />
        <ImageInput
          label="Upload Images"
          colors={{
            background: theme.colors.surface,
          }}
          value={form.images}
          onChange={(newImages) => handleChange("images", newImages)}
        />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: theme.colors.Primarytext, fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add Similar Problem</Text>
          <AddIcon onPress={handleAddSimilarProblem} color={theme.colors.Primarytext} size={23} showBackground backgroundColor="grey" />
        </View>
        {form.similarProblems.length > 0 && (
          <HorizontalSelect
            label=""
            data={form.similarProblems.map((problem) => problem.title)}
            onSelect={(title) =>
              setForm((prev) => ({
                ...prev,
                similarProblems: prev.similarProblems.filter((p) => p.title !== title),
              }))
            }
            defaultSelected="none"
            borderRadius={10}
          />
        )}
        <FormInput label="Title" value={newSimilar.title} onChangeText={(text) => setNewSimilar({ ...newSimilar, title: text })} placeholder="Similar problem title" mandatory={false} />
        <FormInput label="Description" value={newSimilar.description} onChangeText={(text) => setNewSimilar({ ...newSimilar, description: text })} placeholder="Brief description" multiline={true} mandatory={false} />
        <HorizontalSelect
          label="Difficulty Level"
          data={difficultyLevels}
          onSelect={(selectedDifficulty) => {
            setNewSimilar({
              ...newSimilar,
              difficultyLevel: selectedDifficulty,
            });
          }}
          defaultSelected="easy"
          borderRadius={10}
        />
        <FormInput label="Short Explanation" value={newSimilar.shortExplanation} onChangeText={(text) => setNewSimilar({ ...newSimilar, shortExplanation: text })} placeholder="Key differences or approach" multiline={true} mandatory={false} />

        <FormInput label="Code" value={newSimilar.code} onChangeText={(text) => setNewSimilar({ ...newSimilar, code: text })} placeholder="Solution code" multiline={true} mandatory={false} fontFamily="monospace" />
      </ScrollView>
      <AnimatedButton title="Submit" onPress={handleSubmit} />
    </View>
  );
};
export const DeleteProblemsSheet = ({ problems }) => {
  const { deleteProblem } = useAppStore();
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
    Array.from(selectedIds).forEach(deleteProblem);
    hideBottomSheet();
    showToast({ message: "Topics deleted", type: "success" });
  }, [selectedIds, deleteProblem]);

  if (!problems || problems.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
        <Text style={{ fontSize: 16, color: theme.colors.secondaryText }}>No problems are there</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {problems.map((problem) => (
          <TouchableOpacity key={problem.id} style={[styles.item, selectedIds.has(problem.id) && styles.selected]} onPress={() => toggleSelect(problem.id)}>
            <Text style={styles.label}>{problem.title}</Text>
            <View>{selectedIds.has(problem.id) ? <CheckedCheckBoxIcon size={24} color={theme.colors.primary} /> : <BlankCheckBoxIcon size={24} />}</View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <AnimatedButton title={`Delete (${selectedIds.size})`} disabled={selectedIds.size === 0} onPress={handleDelete} />
    </View>
  );
};

export const UpdateProblemForm = ({ problemId = "" }) => {
  const { getProblemById, updateProblem } = useAppStore();
  const { hideBottomSheet, showToast } = useOverlayStore();

  const existing = getProblemById(problemId);

  const [form, setForm] = useState({
    title: "",
    explanation: "",
    problemLink: "",
    difficultyLevel: "easy",
    testCase: "",
    solution: "",
    code: "",
    similarProblems: [],
    images: [],
  });

  const [newSimilar, setNewSimilar] = useState<any>({
    title: "",
    description: "",
    shortExplanation: "",
    difficultyLevel: "easy",
    code: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        explanation: existing.explanation,
        problemLink: existing.problemLink,
        difficultyLevel: existing.difficultyLevel,
        testCase: existing.testCase,
        solution: existing.solution,
        code: existing.code,
        similarProblems: existing.similarProblems,
        images: existing.images,
      });
    }
  }, [existing]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.explanation) newErrors.explanation = "Explanation is required";
    if (!form.testCase) newErrors.testCase = "Test case is required";
    if (!form.solution) newErrors.solution = "Solution is required";
    if (!form.code) newErrors.code = "Code is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      throw new Error("Validation failed");
    }

    const updatedProblem: Problem = {
      ...existing,
      ...form,
    };

    updateProblem(updatedProblem);
    hideBottomSheet();
    showToast({ message: "Updated successfully", type: "success" });
  };
  const handleAddSimilarProblem = () => {
    if (!newSimilar.title || !newSimilar.description || !newSimilar.shortExplanation || !newSimilar.code) {
      showToast({ message: "Please enter the data", type: "error" });
      return;
    }
    setForm((prevForm) => ({
      ...prevForm,
      similarProblems: [...prevForm.similarProblems, { ...newSimilar }],
    }));
    setNewSimilar({
      title: "",
      description: "",
      shortExplanation: "",
      difficultyLevel: "easy",
      code: "",
    });
  };
  if (!problemId || problemId === "")
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
        <Text style={{ fontSize: 16, color: theme.colors.secondaryText }}>No problem selected</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <FormInput label="Title" mandatory value={form.title} onChangeText={(text) => handleChange("title", text)} error={errors.title} />
        <FormInput label="Explanation" mandatory multiline value={form.explanation} onChangeText={(text) => handleChange("explanation", text)} error={errors.explanation} />
        <FormInput label="Problem Link" placeholder="https://..." value={form.problemLink} onChangeText={(text) => handleChange("problemLink", text)} />

        <HorizontalSelect
          label="Difficulty Level"
          data={difficultyLevels}
          onSelect={(selectedDifficulty) => {
            handleChange("difficultyLevel", selectedDifficulty);
          }}
          defaultSelected="easy"
          borderRadius={10}
        />
        <FormInput label="Test Case" mandatory multiline value={form.testCase} onChangeText={(text) => handleChange("testCase", text)} error={errors.testCase} />
        <FormInput label="Solution" mandatory multiline value={form.solution} onChangeText={(text) => handleChange("solution", text)} error={errors.solution} />
        <FormInput label="Code" mandatory multiline value={form.code} onChangeText={(text) => handleChange("code", text)} error={errors.code} fontFamily="monospace" />
        <ImageInput
          label="Upload Images"
          colors={{
            background: theme.colors.surface,
          }}
          value={form.images}
          onChange={(newImages) => handleChange("images", newImages)}
        />

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: theme.colors.Primarytext, fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add Similar Problem</Text>
          <AddIcon onPress={handleAddSimilarProblem} color={theme.colors.Primarytext} size={23} showBackground backgroundColor="grey" />
        </View>
        {form.similarProblems.length > 0 && (
          <HorizontalSelect
            label=""
            data={form.similarProblems.map((problem) => problem.title)}
            onSelect={(title) =>
              setForm((prev) => ({
                ...prev,
                similarProblems: prev.similarProblems.filter((p) => p.title !== title),
              }))
            }
            defaultSelected="none"
            borderRadius={10}
          />
        )}
        <FormInput label="Title" value={newSimilar.title} onChangeText={(text) => setNewSimilar({ ...newSimilar, title: text })} placeholder="Similar problem title" mandatory={false} />
        <FormInput label="Description" value={newSimilar.description} onChangeText={(text) => setNewSimilar({ ...newSimilar, description: text })} placeholder="Brief description" multiline={true} mandatory={false} />
        <HorizontalSelect
          label="Difficulty Level"
          data={difficultyLevels}
          onSelect={(selectedDifficulty) => {
            setNewSimilar({
              ...newSimilar,
              difficultyLevel: selectedDifficulty,
            });
          }}
          defaultSelected="easy"
          borderRadius={10}
        />
        <FormInput label="Short Explanation" value={newSimilar.shortExplanation} onChangeText={(text) => setNewSimilar({ ...newSimilar, shortExplanation: text })} placeholder="Key differences or approach" multiline={true} mandatory={false} />

        <FormInput label="Code" value={newSimilar.code} onChangeText={(text) => setNewSimilar({ ...newSimilar, code: text })} placeholder="Solution code" multiline={true} mandatory={false} fontFamily="monospace" />
      </ScrollView>
      <AnimatedButton title="Update" onPress={handleSubmit} />
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
