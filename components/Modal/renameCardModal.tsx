import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CustomModal from "./modal"; // Adjust the path if needed

interface RenameCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newTitle: string) => void;
  initialTitle: string;
  contextLabel?: string;
}

const RenameCardModal: React.FC<RenameCardModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialTitle,
  contextLabel = "Card",
}) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (visible) setTitle(initialTitle);
  }, [visible, initialTitle]);

  const handleRename = () => {
    if (!title.trim()) return;
    onSubmit(title.trim());

    onClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={`Rename ${contextLabel}`}
      scrollable={false}
    >
      <View style={styles.inputWrapper}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter new title"
          placeholderTextColor="#888"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleRename}
        />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleRename} style={styles.addButton}>
          <Text style={styles.addText}>Rename</Text>
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

export default RenameCardModal;
