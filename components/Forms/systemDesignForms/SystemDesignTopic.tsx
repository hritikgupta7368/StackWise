import React, { useState } from "react";
import { View } from "react-native";
import { useAppStore } from "@/store/useStore";
import AnimatedButton from "@/components/common/button";
import { useOverlayStore } from "@/store/useOverlayStore";
import FormInput from "@/components/common/FormInput";
import { generateId } from "@/utils/generateId";

export const AddTopicForm = ({ categoryId }) => {
  const [topicName, setTopicName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { addSystemDesignTopic } = useAppStore();
  const { showToast, hideDialogModal } = useOverlayStore();

  const handleAdd = () => {
    if (topicName.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    const newTopic = {
      id: generateId(),
      name: topicName.trim(),
      categoryId,
    };

    addSystemDesignTopic(newTopic);
    showToast({ message: "Topic Created", type: "success" });
    hideDialogModal();
  };

  return (
    <View>
      <FormInput
        label="Topic Title"
        placeholder="Enter new topic title"
        value={topicName}
        onChangeText={(t) => {
          setTopicName(t);
          if (error) setError(null);
        }}
        error={error}
        mandatory
      />
      <AnimatedButton title="Add Topic" onPress={handleAdd} disabled={topicName.trim().length < 2} />
    </View>
  );
};

export const DeleteTopicForm = ({ topicId }) => {
  const { deleteSystemDesignTopic } = useAppStore();
  const { showToast, hideDialogModal } = useOverlayStore();

  const handleDelete = () => {
    deleteSystemDesignTopic(topicId);
    showToast({ message: "Topic Deleted", type: "success" });
    hideDialogModal();
  };

  return (
    <View>
      <AnimatedButton title="Delete Topic" onPress={handleDelete} backgroundColor="red" />
      <AnimatedButton title="Cancel" onPress={() => hideDialogModal()} />
    </View>
  );
};
