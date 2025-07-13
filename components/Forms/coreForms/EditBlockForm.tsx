// components/Forms/coreForms/EditBlockForm.tsx

import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { ContentElement } from "@/types/types";
import AnimatedButton from "@/components/common/button";
import FormInput from "@/components/common/FormInput";

interface Props {
  initialBlock: ContentElement;
  onSubmit: (updated: ContentElement) => void;
}

const EditBlockForm = ({ initialBlock, onSubmit }: Props) => {
  const [value, setValue] = useState(initialBlock.value);

  const handleSubmit = () => {
    let updatedBlock: ContentElement = { ...initialBlock, value };

    if (initialBlock.type === "code") {
      updatedBlock = { ...updatedBlock };
    }

    onSubmit(updatedBlock);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>{initialBlock.type === "code" ? <FormInput multiline={true} label={`Edit ${initialBlock.type} Block`} placeholder="Language (e.g. js, py)" value={value} onChangeText={setValue} /> : <FormInput multiline={true} label={`Edit ${initialBlock.type} Block`} placeholder="Enter content..." value={value} onChangeText={setValue} />}</ScrollView>

      <AnimatedButton onPress={handleSubmit} title="Save " />
    </View>
  );
};

export default EditBlockForm;
