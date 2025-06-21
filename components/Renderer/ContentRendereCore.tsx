import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { FastCodeBlock } from "../Preview/fastcodeblock";

// Memoized components to prevent unnecessary re-renders
const MemoizedText = React.memo(
  ({ text, style }: { text: string; style: any }) => (
    <Text style={style}>{text}</Text>
  ),
);

const MemoizedCodeBlock = React.memo(
  ({ code, language }: { code: string; language?: string }) => (
    <FastCodeBlock code={code} title={`Code (${language || "auto"}):`} />
  ),
);

const MemoizedImage = React.memo(
  ({
    uri,
    onPress,
    style,
  }: {
    uri: string;
    onPress: () => void;
    style: any;
  }) => (
    <Pressable onPress={onPress}>
      <Image source={{ uri }} style={style} />
    </Pressable>
  ),
);

// Memoized image container styles
const imageContainerStyle = {
  flexDirection: "row" as const,
  flexWrap: "wrap" as const,
  gap: 8,
};

interface ContentRendererProps {
  content: any[];
}

const ContentRenderer = React.memo<ContentRendererProps>(({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageGroup, setCurrentImageGroup] = useState<{
    images: { uri: string }[];
    index: number;
  } | null>(null);

  const openImageViewer = useCallback((images: string[], index: number) => {
    const formattedImages = images.map((uri) => ({ uri }));
    setCurrentImageGroup({ images: formattedImages, index });
    setIsVisible(true);
  }, []);

  const closeViewer = useCallback(() => {
    setIsVisible(false);
    setCurrentImageGroup(null);
  }, []);

  // Memoize individual content items to prevent re-renders
  const renderedContent = useMemo(() => {
    if (!content || content.length === 0) return null;

    return content.map((item, index) => {
      const key = `${item.type}-${index}`;

      switch (item.type) {
        case "paragraph":
          return (
            <MemoizedText
              key={key}
              text={item.value}
              style={styles.paragraph}
            />
          );

        case "code":
          return (
            <MemoizedCodeBlock
              key={key}
              code={item.value}
              language={item.language}
            />
          );

        case "image":
          if (!Array.isArray(item.value)) return null;

          return (
            <View key={key} style={imageContainerStyle}>
              {item.value.map((uri: string, imgIndex: number) => (
                <MemoizedImage
                  key={`${key}-${imgIndex}`}
                  uri={uri}
                  onPress={() => openImageViewer(item.value, imgIndex)}
                  style={styles.image}
                />
              ))}
            </View>
          );

        default:
          return null;
      }
    });
  }, [content, openImageViewer]);

  // Memoize ImageViewing component
  const imageViewer = useMemo(() => {
    if (!currentImageGroup) return null;

    return (
      <ImageViewing
        images={currentImageGroup.images}
        imageIndex={currentImageGroup.index}
        visible={isVisible}
        onRequestClose={closeViewer}
        swipeToCloseEnabled
        backgroundColor="#000"
      />
    );
  }, [currentImageGroup, isVisible, closeViewer]);

  return (
    <View>
      {renderedContent}
      {imageViewer}
    </View>
  );
});

ContentRenderer.displayName = "ContentRenderer";

export default ContentRenderer;

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "white",
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
