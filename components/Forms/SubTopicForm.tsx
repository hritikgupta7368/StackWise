import { useState } from "react";
import { View } from "react-native";
import FormInput from "../ui/textInput";
import ButtonGroup from "../ui/buttons";
import { useAppStore } from "../../hooks/useStore";

export default function SubTopicForm({
  onSubmit,
  topicId,
}: {
  onSubmit: () => void;
  topicId: string;
}) {
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const addCoreSubtopic = useAppStore((state) => state.addCoreSubtopic);
  const handleAddSubTopic = () => {
    if (!newTopicTitle.trim()) return;

    const newSubtopic = {
      id: Math.random().toString(36).substring(2, 9),
      topicId,
      title: newTopicTitle.trim(),
      content: [],
    };

    addCoreSubtopic(newSubtopic);
    onSubmit();
    setNewTopicTitle("");
  };
  return (
    <View>
      <FormInput
        label="Topic Name"
        placeholder="Enter Topic Name"
        value={newTopicTitle}
        onChangeText={setNewTopicTitle}
        mandatory={true}
      />

      <ButtonGroup text1="Save" handlePress1={handleAddSubTopic} />
    </View>
  );
}
