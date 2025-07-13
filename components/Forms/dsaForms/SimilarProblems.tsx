import { View, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { useAppStore } from "@/store/useStore";
import { theme } from "@/components/theme";
import FormInput from "@/components/common/FormInput";
import AnimatedButton from "@/components/common/button";
import HorizontalSelect from "@/components/common/PillSelect";

export default function SimilarProblemForm({ problemId, index, onClose }) {
  const problem = useAppStore((s) => s.getProblemById(problemId));
  const updateProblem = useAppStore((s) => s.updateProblem);
  const problems = useAppStore((s) => s.dsa.problems);

  const initialData = problem.similarProblems?.[index];
  const [form, setForm] = useState({ ...initialData });

  // Exclude the current problem
  const moveTargets = problems.filter((p) => p.id !== problemId);

  // Extract just the titles for the select UI
  const moveTargetTitles = moveTargets.map((p) => p.title);

  const handleUpdate = () => {
    const updatedSimilar = [...(problem.similarProblems || [])];
    updatedSimilar[index] = form;
    updateProblem({ ...problem, similarProblems: updatedSimilar });
    onClose?.();
  };

  const handleMove = (targetProblemId) => {
    const fromSimilar = [...(problem.similarProblems || [])];
    const movedItem = fromSimilar.splice(index, 1)[0];

    const targetProblem = useAppStore.getState().getProblemById(targetProblemId);
    const updatedTarget = {
      ...targetProblem,
      similarProblems: [...(targetProblem.similarProblems || []), movedItem],
    };

    updateProblem({ ...problem, similarProblems: fromSimilar });
    updateProblem(updatedTarget);
    onClose?.();
  };

  return (
    <View style={{ flex: 1 }}>
      <HorizontalSelect
        label="Select Problem To Move To"
        data={moveTargetTitles}
        onSelect={(selectedTitle) => {
          // Find the selected problem’s ID using the title
          const selected = moveTargets.find((p) => p.title === selectedTitle);
          if (selected) {
            handleMove(selected.id);
          }
        }}
        defaultSelected={moveTargetTitles[0]}
        borderRadius={10}
      />

      <ScrollView>
        <FormInput label="Title" value={form.title} onChangeText={(text) => setForm({ ...form, title: text })} />
        <FormInput label="Difficulty" value={form.difficultyLevel} onChangeText={(text) => setForm({ ...form, difficultyLevel: text.toLowerCase() })} />
        <FormInput multiline={true} label="Description" value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} />
        <FormInput multiline={true} label="Short Explanation" value={form.shortExplanation} onChangeText={(text) => setForm({ ...form, shortExplanation: text })} />
        <FormInput multiline={true} label="Code" value={form.code} onChangeText={(text) => setForm({ ...form, code: text })} />
      </ScrollView>
      <AnimatedButton onPress={handleUpdate} title="Save Changes" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 16 },
  label: { color: theme.colors.Primarytext, fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 6,
    padding: 8,
    color: theme.colors.Primarytext,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: { color: "white", fontWeight: "600" },
  moveTarget: {
    color: theme.colors.Primarytext,
    paddingVertical: 4,
    paddingLeft: 4,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
});
