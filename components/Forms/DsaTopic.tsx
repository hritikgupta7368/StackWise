import { useState } from "react";
import { View } from "react-native";
import FormInput from "../ui/textInput";
import ButtonGroup from "../ui/buttons";
import { useAppStore } from "../../hooks/useStore";

export default function DsaTopicForm({ onSubmit }: { onSubmit: () => void }) {
  const { addDsaTopic } = useAppStore();

  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicSubtitle, setNewTopicSubtitle] = useState("");

  const handleAddTopic = () => {
    if (newTopicTitle.trim() === "") return;

    addDsaTopic({
      id: Date.now().toString(),
      title: newTopicTitle.trim(),
      subtitle: newTopicSubtitle.trim() || "New topic",
    });

    setNewTopicTitle("");
    setNewTopicSubtitle("");
    onSubmit();
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
      <FormInput
        label="Subtitle"
        placeholder="Enter Subtitle"
        value={newTopicSubtitle}
        onChangeText={setNewTopicSubtitle}
        mandatory={true}
      />
      <ButtonGroup text1="Save" handlePress1={handleAddTopic} />
    </View>
  );
}
