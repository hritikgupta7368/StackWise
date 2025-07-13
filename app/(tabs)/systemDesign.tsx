import React, { useMemo, useCallback, useState } from "react";
import { StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import { useAppStore } from "../../store/useStore";
import Header from "@/components/common/NewHeader";
import { useOverlayStore } from "@/store/useOverlayStore";
import { AddCategoryForm, DeleteCategorySheet } from "@/components/Forms/systemDesignForms/SystemDesignCategory";
import Carousel from "@/components/common/carousel";
import SystemDesignCategoryCard from "@/components/Cards/SystemCategoryCard";
import { AddTopicForm, DeleteTopicForm } from "@/components/Forms/systemDesignForms/SystemDesignTopic";
import { routeBackground } from "@/constants/Background";

export default function SystemDesign() {
  const {
    systemDesign: { categories },
    getSystemDesignTopicsByCategoryId,
  } = useAppStore();
  const { showBottomSheet, showDialogModal } = useOverlayStore();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [scrollToIndex, setScrollToIndex] = useState<number | null>(null);

  // Memoize store actions
  const storeActions = useMemo(
    () => ({
      getSystemDesignTopicsByCategoryId,
    }),
    [getSystemDesignTopicsByCategoryId],
  );

  // Handlers are memoized correctly with useCallback
  const handleAddTopic = useCallback(
    (categoryId) => {
      showDialogModal({
        title: "Add Topic",
        subtitle: "Provide a name and details to create a new topic.",
        type: "default",
        content: <AddTopicForm categoryId={categoryId} />,
      });
    },
    [showDialogModal],
  );

  const handleDeleteTopic = useCallback(
    (topicId) => {
      showDialogModal({
        title: "Delete Topic",
        subtitle: "Are you sure you want to delete this topic?",
        type: "warning",
        content: <DeleteTopicForm topicId={topicId} />,
      });
    },
    [showDialogModal],
  );

  const operations = useMemo(
    () => ({
      add: handleAddTopic,
      delete: handleDeleteTopic,
    }),
    [handleAddTopic, handleDeleteTopic],
  );
  return (
    <ImageBackground source={routeBackground.core()} style={styles.background} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title="System design"
          leftIcon="none"
          rightIcon="menu"
          theme="dark"
          backgroundColor="transparent"
          menuOptions={[
            {
              label: "Add new Subject",
              onPress: () => {
                const insertIndex = categories.length === 0 ? 0 : activeCategoryIndex + 1;
                setScrollToIndex(insertIndex); // 👈 set scroll target

                showDialogModal({
                  title: "Add Subject",
                  subtitle: "Provide a name and details to create a new subject.",
                  type: "default",
                  content: <AddCategoryForm insertIndex={insertIndex} />,
                });
              },
            },
            {
              label: "Delete Subject",
              onPress: () =>
                showBottomSheet({
                  height: 600,
                  variant: "default",
                  title: "Delete Core Subjects",
                  content: <DeleteCategorySheet />,
                }),
            },
          ]}
        />
        <Carousel data={categories} Component={SystemDesignCategoryCard} storeActions={storeActions} operations={operations} onIndexChange={setActiveCategoryIndex} scrollToIndex={scrollToIndex} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
