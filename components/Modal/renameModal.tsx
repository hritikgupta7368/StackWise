import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface RenameModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newTitle: string) => void;
  currentTitle: string;
  title?: string;
}

const RenameModal: React.FC<RenameModalProps> = ({
  visible,
  onClose,
  onSubmit,
  currentTitle,
  title = "Rename Item",
}) => {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setNewTitle(currentTitle);
      setError("");

      // Animate modal in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, currentTitle]);

  const handleSubmit = () => {
    const trimmedTitle = newTitle.trim();

    // Validation
    if (!trimmedTitle) {
      setError("Title cannot be empty");
      return;
    }

    if (trimmedTitle.length > 100) {
      setError("Title is too long (max 100 characters)");
      return;
    }

    if (trimmedTitle === currentTitle.trim()) {
      // No change, just close
      onClose();
      return;
    }

    // Submit the new title
    onSubmit(trimmedTitle);
  };

  const handleCancel = () => {
    setNewTitle(currentTitle);
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}
        >
          <Pressable style={styles.backdropPress} onPress={handleCancel} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={[styles.input, error ? styles.inputError : null]}
              value={newTitle}
              onChangeText={(text) => {
                setNewTitle(text);
                if (error) setError(""); // Clear error when user types
              }}
              placeholder="Enter new title"
              placeholderTextColor="#666"
              maxLength={100}
              multiline={false}
              selectTextOnFocus
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.characterCount}>{newTitle.length}/100</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Rename</Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  backdropPress: {
    flex: 1,
  },
  modal: {
    backgroundColor: "#2d2d30",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#3a3a3c",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    minHeight: 50,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  characterCount: {
    color: "#888",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#3a3a3c",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RenameModal;
