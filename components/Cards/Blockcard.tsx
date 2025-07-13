// components/Renderer/BlockRenderer.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ContentElement } from "@/types/types";
import { FastCodeBlock } from "@/components/common/codeblock";
import ImageViewing from "react-native-image-viewing";

interface Props {
  block: ContentElement;
}
const getImageStyle = (imageCount, index) => {
  switch (imageCount) {
    case 1:
      return styles.singleImage;
    case 2:
      return styles.twoImagesItem;
    case 3:
      if (index === 0) {
        return styles.threeImagesFirst;
      } else {
        return styles.threeImagesOther;
      }
    case 4:
      return styles.fourImagesItem;
    default:
      return styles.singleImage;
  }
};

const BlockRenderer = ({ block }: Props) => {
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  switch (block.type) {
    case "paragraph":
      const lines = block.value.split("\n");
      return (
        <View>
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            const isHeading = trimmed.startsWith("##");
            const isBullet = trimmed.startsWith("--");

            if (isHeading) {
              return (
                <Text key={idx} style={[styles.paragraph, styles.heading]}>
                  {trimmed.replace(/^##/, "").trim()}
                </Text>
              );
            }

            if (isBullet) {
              return (
                <Text key={idx} style={styles.paragraph}>
                  {"\u2022"} {trimmed.replace(/^--/, "").trim()}
                </Text>
              );
            }

            return (
              <Text key={idx} style={styles.paragraph}>
                {trimmed}
              </Text>
            );
          })}
        </View>
      );

    case "code":
      return (
        <View style={styles.codeContainer}>
          <FastCodeBlock code={block.value} />
        </View>
      );

    case "image":
      if (!Array.isArray(block.value)) {
        console.warn("🚨 Invalid image block data:", block);
        return null;
      }

      return (
        <View>
          {/* Images Grid */}
          {block.value?.length > 0 && (
            <View style={styles.imageGrid}>
              {block.value?.slice(0, 4).map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.imageThumbnail, getImageStyle(block.value?.length, idx)]}
                  onPress={() => {
                    setCurrentImageIndex(idx);
                    setViewerVisible(true);
                  }}
                >
                  <Image source={{ uri: img }} style={styles.imageStyle} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
          <ImageViewing images={block.value?.map((uri) => ({ uri })) || []} imageIndex={currentImageIndex} visible={isViewerVisible} onRequestClose={() => setViewerVisible(false)} />
        </View>
      );

    default:
      return null;
  }
};

export default BlockRenderer;

const styles = StyleSheet.create({
  paragraph: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  heading: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 5,
  },

  bullet: {
    color: "#d0d0d0",
    fontSize: 14,

    marginBottom: 2,
  },
  codeContainer: {
    borderRadius: 8,
  },
  imageRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#333",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  imageThumbnail: {
    backgroundColor: "#f0f0f0",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
  },
  // Single image
  singleImage: {
    width: "100%",
    height: 140,
  },
  // Two images (1x2 grid)
  twoImagesItem: {
    width: "49.5%",
    height: 100,
  },
  // Three images (2x1 grid with first image larger)
  threeImagesFirst: {
    width: "100%",
    height: 100,
  },
  threeImagesOther: {
    width: "49.5%",
    height: 75,
  },
  // Four images (2x2 grid)
  fourImagesItem: {
    width: "49.5%",
    height: 90,
  },
});
