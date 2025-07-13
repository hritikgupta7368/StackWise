// components/Forms/systemDesignForms/AddBlockForm.tsx

import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { ContentElement } from "@/types/types";
import HorizontalSelect from "@/components/common/PillSelect";
import AnimatedButton from "@/components/common/button";
import FormInput from "@/components/common/FormInput";
import { ImageInput } from "@/components/common/ImageInput";
import { theme } from "@/components/theme";

interface Props {
  onSubmit: (block: ContentElement) => void;
}

const blockTypes = ["paragraph", "code", "image"];

const AddBlockForm = ({ onSubmit }: Props) => {
  const [type, setType] = useState("paragraph");
  const [value, setValue] = useState<string | string[]>([]);
  const [language, setLanguage] = useState("");

  const handleSubmit = () => {
    let newBlock: ContentElement;

    switch (type) {
      case "paragraph":
        newBlock = { type: "paragraph", value: value as string };
        break;
      case "code":
        newBlock = { type: "code", value: value as string, language };
        break;
      case "image":
        newBlock = {
          type: "image",
          value: value as string[],
        }; // Comma-separated string of URLs
        break;
      default:
        return;
    }

    onSubmit(newBlock);
  };

  return (
    <ScrollView style={styles.container}>
      <HorizontalSelect
        label="Select Block Type"
        data={blockTypes}
        defaultSelected="paragraph"
        onSelect={(selected) => {
          setType(selected);
          setValue("");
          setLanguage("");
        }}
      />
      {type === "paragraph" && <FormInput multiline={true} label="Content" placeholder="Enter content" value={value} onChangeText={setValue} />}
      {type === "code" && (
        <View>
          <FormInput label="Language" placeholder="e.g. javascript, python" value={language} onChangeText={setLanguage} />
          <FormInput multiline={true} label="Code" placeholder="Enter code" value={value} onChangeText={setValue} />
        </View>
      )}
      {type === "image" && (
        <View>
          <ImageInput
            colors={{
              background: theme.colors.surface,
            }}
            label="Upload Image"
            placeholder="Enter image URL"
            value={(value as string[]) || []}
            onChange={(newImages) => setValue(newImages)}
          />
        </View>
      )}

      <AnimatedButton onPress={handleSubmit} title="Add Block" />
    </ScrollView>
  );
};

export default AddBlockForm;

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    backgroundColor: "#222",
  },
});
