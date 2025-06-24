import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import InputOptionsCard from "@/components/Renderer/inputOptionsCard";
import ContentRenderer from "@/components/Renderer/ContentRendereCore";
import {
  ExpandIcon,
  CollapseIcon,
  BlankCheckBoxIcon,
  CheckedCheckBoxIcon,
} from "../../components/ui/icons";
import { CoreSubtopic } from "@/types/types";

const MemoizedExpandIcon = React.memo(ExpandIcon);
const MemoizedCollapseIcon = React.memo(CollapseIcon);
const MemoizedCheckboxIcon = React.memo(BlankCheckBoxIcon);
const MemoizedCheckboxCheckedIcon = React.memo(CheckedCheckBoxIcon);

interface SubTopicCardProps {
  subtopic: CoreSubtopic;
  isLast?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  // New props for selection mode
  selectionMode?: "none" | "delete" | "rename";
  isSelected?: boolean;
  showCheckbox?: boolean;
  showRenameHighlight?: boolean;
}

const SubTopicCard = React.memo<SubTopicCardProps>(
  ({
    subtopic,
    isLast = false,
    isExpanded,
    onToggle,
    selectionMode = "none",
    isSelected = false,
    showCheckbox = false,
    showRenameHighlight = false,
  }) => {
    const hasContent = useMemo(
      () => subtopic?.content && subtopic.content.length > 0,
      [subtopic?.content],
    );

    // **DYNAMIC STYLING BASED ON MODE**
    const cardStyle = useMemo(() => {
      const baseStyle = [styles.CardContainer];

      if (selectionMode === "delete" && isSelected) {
        baseStyle.push(styles.selectedCard);
      } else if (selectionMode === "rename" && showRenameHighlight) {
        baseStyle.push(styles.renameHighlightCard);
      }

      return baseStyle;
    }, [selectionMode, isSelected, showRenameHighlight]);

    // **RIGHT ICON LOGIC**
    // Shows different icons based on current mode
    const rightIcon = useMemo(() => {
      if (showCheckbox) {
        return isSelected ? (
          <MemoizedCheckboxCheckedIcon />
        ) : (
          <MemoizedCheckboxIcon />
        );
      }

      if (selectionMode === "rename") {
        return null; // No expand/collapse in rename mode
      }

      // Default expand/collapse behavior
      return isExpanded ? <MemoizedCollapseIcon /> : <MemoizedExpandIcon />;
    }, [showCheckbox, isSelected, selectionMode, isExpanded]);

    // **HEADER CONTENT WITH CONDITIONAL STYLING**
    const headerContent = useMemo(() => {
      const titleStyle = [styles.title];

      if (selectionMode === "rename" && showRenameHighlight) {
        titleStyle.push(styles.renameHighlightTitle);
      }

      return (
        <>
          <Text style={titleStyle}>{subtopic.title}</Text>
          {rightIcon}
        </>
      );
    }, [subtopic.title, rightIcon, selectionMode, showRenameHighlight]);

    // **EXPANDED CONTENT**
    // Only show content when not in selection modes and card is expanded
    const expandedContent = useMemo(() => {
      if (!isExpanded || selectionMode !== "none") return null;

      return (
        <>
          {!hasContent && (
            <View style={styles.noContentContainer}>
              <Text style={styles.noContent}>No content available</Text>
            </View>
          )}
          {hasContent && (
            <View style={styles.contentContainer}>
              <ContentRenderer content={subtopic.content} />
            </View>
          )}
          {isLast && <InputOptionsCard coreSubTopicId={subtopic.id} />}
        </>
      );
    }, [
      isExpanded,
      selectionMode,
      hasContent,
      subtopic.content,
      subtopic.id,
      isLast,
    ]);

    // **PRESS HANDLER**
    const handlePress = useMemo(() => {
      return onToggle;
    }, [onToggle]);

    return (
      <View style={cardStyle}>
        <Pressable
          onPress={handlePress}
          style={[
            styles.header,
            selectionMode === "delete" && styles.selectableHeader,
            selectionMode === "rename" && styles.renameHeader,
          ]}
        >
          {headerContent}
        </Pressable>
        {expandedContent}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  CardContainer: {
    backgroundColor: "#3e3d40",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: "100%",
    paddingVertical: 12,
    marginVertical: 8,
    // Smooth transitions
    transform: [{ scale: 1 }],
  },

  // **SELECTION STATE STYLES**
  selectedCard: {
    borderColor: "#ef4444",
    borderWidth: 2,
    backgroundColor: "#4a3e3f", // Slightly different background for selected
    transform: [{ scale: 0.98 }], // Slightly smaller to show selection
  },

  renameHighlightCard: {
    borderColor: "#3b82f6",
    borderWidth: 2,
    backgroundColor: "#3d3e4a",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    // Default state
    opacity: 1,
  },

  selectableHeader: {
    // Visual feedback for selectable state
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 8,
    marginHorizontal: 8,
    paddingHorizontal: 12,
  },

  renameHeader: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 8,
    marginHorizontal: 8,
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 20,
    color: "white",
    flex: 1,
    marginRight: 12,
  },

  renameHighlightTitle: {
    color: "#60a5fa", // Light blue for rename mode
  },

  contentContainer: {
    paddingHorizontal: 16,
  },

  noContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },

  noContent: {
    color: "white",
    fontSize: 16,
  },
});

export default SubTopicCard;
