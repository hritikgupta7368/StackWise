import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Dimensions, StyleSheet, FlatList } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAppStore } from "@/hooks/useStore";
import SubTopicCard from "@/components/ui/SubTopicCard"; // Same component reused

export default function Interview() {
  const interviewQuestions = useAppStore((s) => s.interview.questions);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isLastMemo = useMemo(() => {
    const len = interviewQuestions.length;
    return (index: number) => index === len - 1;
  }, [interviewQuestions.length]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  // In your Interview component's renderItem
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <SubTopicCard
          subtopic={{ id: item.id, title: item.question, content: item.answer }}
          isLast={isLastMemo(index)}
          isExpanded={expandedId === item.id}
          onToggle={() => {
            const newExpandedId = expandedId === item.id ? null : item.id;

            setExpandedId(newExpandedId);
          }}
          selectionMode="none"
          isSelected={false}
          showCheckbox={false}
          showRenameHighlight={false}
        />
      );
    },
    [expandedId, isLastMemo],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interview Questions</Text>

      {interviewQuestions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Interview Questions</Text>
        </View>
      ) : (
        <FlashList
          data={interviewQuestions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={80}
          contentContainerStyle={styles.listContent}
          extraData={expandedId} // This tells FlashList to re-render when expandedId changes
          removeClippedSubviews
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          estimatedListSize={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d1f",
    paddingTop: 35,
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
  },
  listContent: {
    paddingVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});
