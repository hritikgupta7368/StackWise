import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import CustomModal from "./modal";

//addcard Modal
interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  contextLabel?: string;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  onSubmit,
  contextLabel = "Card",
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!visible) setTitle("");
  }, [visible]);

  const handleAdd = () => {
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle("");
    onClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={`Add ${contextLabel}`}
    >
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={`Enter ${contextLabel} title`}
          placeholderTextColor="#888"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginTop: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#3a3a50",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
    height: 44,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  addButton: {
    backgroundColor: "#5a67d8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
  },
  addText: {
    color: "#fff",
  },
  cancelText: {
    color: "#ccc",
  },
});

export default AddCardModal;
