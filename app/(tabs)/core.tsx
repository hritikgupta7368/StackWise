import React, { useMemo, useCallback, useState } from "react";
import { StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import { useAppStore } from "../../store/useStore";
import Header from "@/components/common/NewHeader";
import { useOverlayStore } from "../../store/useOverlayStore";
import { AddCategoryForm, DeleteCategorySheet } from "@/components/Forms/coreForms/CoreCategory";
import Carousel from "@/components/common/carousel";
import CategoryCard from "@/components/Cards/CategoryCard";
import { AddTopicForm, DeleteTopicForm } from "@/components/Forms/coreForms/CoreTopic";
import { routeBackground } from "@/constants/Background";

// Memoized selector to prevent unnecessary re-renders
const selectCategories = (state) => state.core.categories;
const selectGetCoreTopicsByCategoryId = (state) => state.getCoreTopicsByCategoryId;
const selectTopics = (state) => state.core.topics;

export default function Core() {
  const categories = useAppStore(selectCategories);
  const getCoreTopicsByCategoryId = useAppStore(selectGetCoreTopicsByCategoryId);
  const { showBottomSheet, showDialogModal } = useOverlayStore();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [scrollToIndex, setScrollToIndex] = useState(null);
  const topics = useAppStore(selectTopics);

  // Memoize store actions to prevent recreating on every render
  const storeActions = useMemo(
    () => ({
      getCoreTopicsByCategoryId,
      topics,
    }),
    [getCoreTopicsByCategoryId, topics],
  );

  // Memoize handlers to prevent recreation
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

  // Memoize operations object
  const operations = useMemo(
    () => ({
      add: handleAddTopic,
      delete: handleDeleteTopic,
    }),
    [handleAddTopic, handleDeleteTopic],
  );

  // Memoize menu options to prevent recreation
  const menuOptions = useMemo(
    () => [
      {
        label: "Add new Subject",
        onPress: () => {
          const insertIndex = categories.length === 0 ? 0 : activeCategoryIndex + 1;
          setScrollToIndex(insertIndex);

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
    ],
    [categories.length, activeCategoryIndex, showDialogModal, showBottomSheet],
  );

  // Memoize background source
  const backgroundSource = useMemo(() => routeBackground.core(), []);

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <Header title="Core Subjects" leftIcon="none" rightIcon="menu" theme="dark" backgroundColor="transparent" menuOptions={menuOptions} />
        <Carousel data={categories} Component={CategoryCard} storeActions={storeActions} operations={operations} onIndexChange={setActiveCategoryIndex} scrollToIndex={scrollToIndex} />
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
  container: {
    flex: 1,
  },
});
