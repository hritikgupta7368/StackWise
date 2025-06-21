import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import InputOptionsCard from "@/components/Renderer/inputOptionsCard";
import ContentRenderer from "@/components/Renderer/ContentRendereCore";
import { ExpandIcon, CollapseIcon } from "../../components/ui/icons";
import { CoreSubtopic } from "@/types/types";

const MemoizedExpandIcon = React.memo(ExpandIcon);
const MemoizedCollapseIcon = React.memo(CollapseIcon);

interface SubTopicCardProps {
  subtopic: CoreSubtopic;
  isLast?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const SubTopicCard = React.memo<SubTopicCardProps>(
  ({ subtopic, isLast = false, isExpanded, onToggle }) => {
    const hasContent = useMemo(
      () => subtopic?.content && subtopic.content.length > 0,
      [subtopic?.content],
    );
    // Memoize the header content
    const headerContent = useMemo(
      () => (
        <>
          <Text style={styles.title}>{subtopic.title}</Text>
          {isExpanded ? <MemoizedCollapseIcon /> : <MemoizedExpandIcon />}
        </>
      ),
      [subtopic.title, isExpanded],
    );

    // Memoize the expanded content
    const expandedContent = useMemo(() => {
      if (!isExpanded) return null;

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
    }, [isExpanded, hasContent, subtopic.content, subtopic.id, isLast]);

    return (
      <View style={styles.CardContainer}>
        <Pressable onPress={onToggle} style={styles.header}>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    color: "white",
    flex: 1,
    marginRight: 12,
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
