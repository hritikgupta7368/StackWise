import { View, StyleSheet } from "react-native";
import InputTypeSwitcher from "../../components/ui/InputTypeSwitcher";
import InputRenderer from "../../components/ui/InputOptions";
import React, { useState } from "react";
import { AddIcon } from "../ui/icons";
import { useAppStore } from "@/hooks/useStore";

const InputOptionsCard = ({ coreSubTopicId }) => {
  const [inputType, setInputType] = useState<"paragraph" | "code" | "image">(
    "paragraph",
  );
  const [value, setValue] = useState<string | string[] | null>("");

  const currentCoreSubTopic = useAppStore((state) =>
    state.getCoreSubtopicById(coreSubTopicId),
  );

  const updateCoreSubtopic = useAppStore((state) => state.updateCoreSubtopic);

  function handleSubmit() {
    if (!value || !coreSubTopicId) return;
    const newBlock = {
      type: inputType,
      value,
    };
    // Get the current subtopic (already fetched)
    if (!currentCoreSubTopic) return;

    const updated = {
      ...currentCoreSubTopic,
      content: [...currentCoreSubTopic.content, newBlock],
    };

    updateCoreSubtopic(updated as any);

    // Reset input
    setValue(inputType === "image" ? [] : "");
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 8,
        }}
      >
        <InputTypeSwitcher
          onChange={(val) => setInputType(val)}
          colors={{
            background: "#222",
            slider: "#444",
            icon: "#999",
            activeIcon: "#fff",
          }}
          size={{
            width: 132,
            height: 32,
            iconSize: 16,
          }}
        />
        <AddIcon
          onPress={() => {
            handleSubmit();
          }}
          color="white"
        />
      </View>

      <View style={{ width: 320 }}>
        <InputRenderer
          type={inputType}
          value={value}
          onChange={setValue}
          placeholder={`Type something in ${inputType} mode...`}
          colors={{
            background: "#1f1f1f",
            text: "#fff",
            placeholder: "#777",
            border: "#333",
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default InputOptionsCard;
