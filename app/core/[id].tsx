import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Linking,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../../hooks/useStore";
import { CoreSubtopic } from "../../types/types";
import React, { useLayoutEffect, useState, useCallback } from "react";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import CodeBlock from "../../components/Preview/codeBlock";

const localImageMap: { [key: string]: any } = {};

const ContentRenderer = ({ content }) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesForViewer, setImagesForViewer] = useState<{ uri: string }[]>([]);

  // Function to open the image viewer for a specific image
  const openImageViewer = useCallback(
    (imageUri: string, allImageUris: string[]) => {
      const images = allImageUris.map((uri) => ({ uri }));
      setImagesForViewer(images);
      setCurrentImageIndex(allImageUris.indexOf(imageUri)); // Find index of clicked image
      setImageViewerVisible(true);
    },
    [],
  );

  // Collect all image URIs from content for the image viewer
  const allImageUrisInContent = content
    .filter((item) => item.type === "image")
    .map((item) => (item as { type: "image"; value: string }).value);

  return (
    <View style={styles.container}>
      {content.map((item, index) => {
        switch (item.type) {
          case "paragraph":
            return (
              <Text key={index} style={styles.paragraph}>
                {item.value}
              </Text>
            );

          case "code":
            // Use your CodeBlock component directly
            return (
              <View key={index} style={styles.codeBlockWrapper}>
                <CodeBlock
                  code={item.value}
                  title={`Code (${item.language || "auto"}):`}
                />
              </View>
            );

          case "image":
            // Determine if it's a local asset or a remote URI
            const imageSource = localImageMap[item.value] || {
              uri: item.value,
            };
            return (
              <Pressable
                key={index}
                onPress={() =>
                  openImageViewer(item.value, allImageUrisInContent)
                }
                style={styles.imagePressable}
              >
                <Image
                  source={imageSource}
                  style={styles.image}
                  accessibilityLabel={item.alt}
                  resizeMode="contain"
                />
                {item.alt && (
                  <Text style={styles.imageAltText}>{item.alt}</Text>
                )}
              </Pressable>
            );

          case "list":
            return (
              <View key={index} style={styles.listContainer}>
                {item.value.map((listItem, listItemIndex) => (
                  <Text key={listItemIndex} style={styles.listItem}>
                    • {listItem}
                  </Text>
                ))}
              </View>
            );

          default:
            return null;
        }
      })}

      {/* ImageViewer component */}
      <ImageView
        images={imagesForViewer}
        imageIndex={currentImageIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        swipeToCloseEnabled={true} // Allow swipe to close
        doubleTapToZoomEnabled={true} // Allow double tap to zoom
      />
    </View>
  );
};

const CoreSubtopicCard = ({ subtopic }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage card expansion

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>{subtopic.title}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="#3498db"
        />
      </Pressable>

      {/* Render content only if expanded */}
      {isExpanded && (
        <View style={styles.contentContainer}>
          <ContentRenderer content={subtopic.content} />
        </View>
      )}
    </View>
  );
};

export default function CorePage() {
  const { id } = useLocalSearchParams(); // 'category' is the id from the route `core/[category].tsx`

  const getCoreSubtopicsByTopicId = useAppStore(
    (state) => state.getCoreSubtopicsByTopicId,
  );
  const getCoreTopicById = useAppStore((state) => state.getCoreTopicById);

  const subtopics = getCoreSubtopicsByTopicId(id as string);
  const currentTopic = getCoreTopicById(id as string);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (currentTopic) {
      navigation.setOptions({ title: currentTopic.name });
    }
  }, [navigation, currentTopic]);

  if (!currentTopic) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Category not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {subtopics.length === 0 ? (
        <Text style={styles.emptyText}>No subtopics found for this topic.</Text>
      ) : (
        <FlatList // Using FlatList as requested
          data={subtopics}
          renderItem={({ item }) => <CoreSubtopicCard subtopic={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    paddingTop: 10,
  },
  listContentContainer: {
    paddingVertical: 10, // Add vertical padding to the FlatList content
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#7f8c8d",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden", // Ensures border-radius cuts content properly
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#ecf0f1", // Light background for the collapsible header
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    flexShrink: 1, // Allow title to wrap
    marginRight: 10,
  },
  contentContainer: {
    padding: 16,
    // Add any specific styling for the content area if needed
  },
});
