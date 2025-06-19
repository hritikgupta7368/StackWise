import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { CloseIcon } from "../ui/icons";

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function CustomModal({
  visible,
  onClose,
  title,
  children,
  scrollable = true,
}: CustomModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}

            <CloseIcon onPress={onClose} />
          </View>

          {/* Body */}
          {scrollable ? (
            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
              {children}
            </ScrollView>
          ) : (
            <View>{children}</View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000088",
  },
  modalContainer: {
    position: "absolute",
    top: "15%",
    left: "5%",
    right: "5%",
    backgroundColor: "#1f1f1f",
    color: "#fff",
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: "500",
    color: "#212529",
  },
});
