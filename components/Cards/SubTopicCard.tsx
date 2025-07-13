// components/ui/SubTopicCard.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ContentElement, CoreSubtopic } from "@/types/types";
import BlockRenderer from "./Blockcard";
import { AddIcon, EditIcon, ExpandIcon, TrashIcon, CollapseIcon } from "@/components/common/icons";

interface Props {
  subtopic: CoreSubtopic;
  onEditBlock: (block: ContentElement, index: number) => void;
  onDeleteBlock: (index: number) => void;
  onAddBlock: (index: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  getIndex: (id: string, index: number) => void;
  index: number;
}

const SubTopicCard = ({ index, subtopic, onDeleteBlock, onAddBlock, isExpanded, onToggle, onEditBlock, getIndex }: Props) => {
  return (
    <View style={styles.card}>
      <Pressable onLongPress={() => getIndex(subtopic.id, index)} onPress={onToggle} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanded ? 16 : 0 }}>
        <Text style={styles.title}>{subtopic.title}</Text>
        {isExpanded ? <ExpandIcon /> : <CollapseIcon />}
      </Pressable>
      {isExpanded && subtopic?.content?.length <= 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No content has been added yet.</Text>
          <Pressable style={styles.addContainer} onPress={() => onAddBlock(0)}>
            <AddIcon size={18} color="#7f7f7f" />
            <Text style={styles.addButtonText}>Add New Block</Text>
          </Pressable>
        </View>
      )}

      {/* Only render content blocks when expanded */}
      {isExpanded &&
        subtopic.content.map((block, index) => (
          <View key={`${block.type}-${index}`} style={styles.blockContainer}>
            <View style={styles.actions}>
              <EditIcon onPress={() => onEditBlock(block, index)} size={18} color="#7f7f7f" />
              <TrashIcon onPress={() => onDeleteBlock(index)} size={18} color="#7f7f7f" />
              <AddIcon onPress={() => onAddBlock(index)} size={18} color="#7f7f7f" />
            </View>
            <BlockRenderer block={block} />
          </View>
        ))}
      {isExpanded && (
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 10 }}>
          <View style={styles.end} />
          <View style={styles.end} />
          <View style={styles.end} />
        </View>
      )}
    </View>
  );
};

export default SubTopicCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 7,
    paddingVertical: 16,
    paddingBottom: 10,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "white",
    paddingHorizontal: 11,
    maxWidth: "80%",
    textTransform: "capitalize",
  },
  blockContainer: {
    marginBottom: 3,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    position: "relative",
    padding: 10,
    paddingRight: 19,
    minHeight: 110,
  },
  actions: {
    position: "absolute",
    right: -14,
    top: 0, // Add this
    bottom: 0, // Add this
    flexDirection: "column",
    justifyContent: "center",
    zIndex: 10,
    gap: 5,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "white",
    marginBottom: 8,
    paddingHorizontal: 11,
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: "#7f7f7f",
  },
  end: {
    backgroundColor: "#7f7f7f",
    borderRadius: 10,
    height: 5,
    width: 5,
  },
});
