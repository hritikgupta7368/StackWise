import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import AddCardModal from "../Modal/addCardModal";
import PopupMenu from "../ui/popMenu";
import RenameCardModal from "../Modal/renameCardModal";
import { TrashIcon } from "../ui/icons";

export type HeaderState = {
  renameMode: boolean;
  deleteMode: boolean;
  selectedToDelete: Set<string>;
  handleCardTap: (id: string) => void;
  toggleDeleteSelection: (id: string) => void;
};

export const useHeaderState = (
  getDisplayText: (id: string) => string,
  onRename: (id: string, newTitle: string) => void,
) => {
  const [renameMode, setRenameMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Set<string>>(
    new Set(),
  );
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [selectedToRename, setSelectedToRename] = useState<string | null>(null);

  const handleCardTap = useCallback(
    (id: string) => {
      if (!renameMode) return;
      const displayTitle = getDisplayText(id);
      setSelectedToRename(id);
      setRenameValue(displayTitle);
      setRenameModalVisible(true);
    },
    [renameMode, getDisplayText],
  );

  const toggleDeleteSelection = useCallback((id: string) => {
    setSelectedToDelete((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  }, []);

  const handleRenameSubmit = useCallback(
    (newTitle: string) => {
      if (!newTitle.trim() || !selectedToRename) return;
      onRename(selectedToRename, newTitle.trim());
      setRenameModalVisible(false);
      setRenameMode(false);
      setSelectedToRename(null);
      setRenameValue("");
    },
    [selectedToRename, onRename],
  );

  const cancelRename = useCallback(() => {
    setRenameMode(false);
    setRenameModalVisible(false);
    setSelectedToRename(null);
    setRenameValue("");
  }, []);

  const headerState: HeaderState = useMemo(
    () => ({
      renameMode,
      deleteMode,
      selectedToDelete,
      handleCardTap,
      toggleDeleteSelection,
    }),
    [
      renameMode,
      deleteMode,
      selectedToDelete,
      handleCardTap,
      toggleDeleteSelection,
    ],
  );

  const headerControls = useMemo(
    () => ({
      setRenameMode,
      setDeleteMode,
      setSelectedToDelete,
      renameModalVisible,
      setRenameModalVisible,
      renameValue,
      setRenameValue,
      handleRenameSubmit,
      cancelRename,
    }),
    [
      setRenameMode,
      setDeleteMode,
      setSelectedToDelete,
      renameModalVisible,
      setRenameModalVisible,
      renameValue,
      setRenameValue,
      handleRenameSubmit,
      cancelRename,
    ],
  );

  return { headerState, headerControls };
};
// Updated Header Component
interface HeaderActions {
  onAdd: (title: string) => void;
  onDelete: (ids: string[]) => void;
}

interface HeaderProps {
  title?: string;
  actions: HeaderActions;
  addContextLabel?: string;
  renameContextLabel?: string;
  headerControls: ReturnType<typeof useHeaderState>["headerControls"];
  headerState: HeaderState;
}

const Header: React.FC<HeaderProps> = ({
  title = "My App",
  actions,
  addContextLabel = "Item",
  renameContextLabel = "Item",
  headerControls,
  headerState,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const {
    setRenameMode,
    setDeleteMode,
    setSelectedToDelete,
    renameModalVisible,
    renameValue,
    handleRenameSubmit,
    cancelRename,
  } = headerControls;

  const { renameMode, deleteMode, selectedToDelete } = headerState;

  const handleAdd = useCallback(
    (title: string) => {
      actions.onAdd(title);
    },
    [actions],
  );

  const confirmDelete = useCallback(() => {
    const idsToDelete = Array.from(selectedToDelete);
    actions.onDelete(idsToDelete);
    setDeleteMode(false);
    setSelectedToDelete(new Set());
  }, [selectedToDelete, actions, setDeleteMode, setSelectedToDelete]);

  const cancelDeleteMode = useCallback(() => {
    setDeleteMode(false);
    setSelectedToDelete(new Set());
  }, [setDeleteMode, setSelectedToDelete]);

  const menuOptions = useMemo(
    () => [
      { label: "Add", onPress: () => setAddModalVisible(true) },
      { label: "Rename", onPress: () => setRenameMode(true) },
      { label: "Delete", onPress: () => setDeleteMode(true) },
    ],
    [setAddModalVisible, setRenameMode, setDeleteMode],
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {renameMode ? "Select a cards" : deleteMode ? "Select cards" : title}
        </Text>

        {renameMode ? (
          <TouchableOpacity onPress={cancelRename}>
            <Text style={{ color: "#aaa", fontSize: 14 }}>Cancel</Text>
          </TouchableOpacity>
        ) : deleteMode ? (
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <TrashIcon onPress={confirmDelete} />
            <TouchableOpacity onPress={cancelDeleteMode}>
              <Text style={{ color: "#aaa", fontSize: 14 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Pressable onPress={() => setMenuVisible(true)} hitSlop={10}>
            <SimpleLineIcons name="options-vertical" size={15} color="#fff" />
          </Pressable>
        )}
      </View>

      <PopupMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        options={menuOptions}
      />

      <AddCardModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAdd}
        contextLabel={addContextLabel}
      />

      <RenameCardModal
        visible={renameModalVisible}
        onClose={cancelRename}
        onSubmit={handleRenameSubmit}
        initialTitle={renameValue}
        contextLabel={renameContextLabel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    flexShrink: 1,
  },
  card: {
    backgroundColor: "#2a2a3d",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
  },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "#0009",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#2a2a3d",
    padding: 24,
    borderRadius: 12,
    width: "85%",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#3a3a50",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
    height: 44,
  },
  buttons: {
    marginTop: 20,
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
});

export default Header;
