import { View, Text, Image, StyleSheet, ScrollView, Pressable } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, FadeInDown, FadeOutUp, Layout, SlideInRight } from "react-native-reanimated";
import { AddIcon } from "@/components/common/icons";
import { Link } from "expo-router";
import React from "react";

const MAX_ROWS = 5;
const LINK_HEIGHT = 43;

const SystemDesignCategoryCard = ({ data, index, scrollX, cardWidth, spacing, backgroundImage, storeActions, operations }) => {
  const topics = storeActions.getSystemDesignTopicsByCategoryId(data.id);

  const rnAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * (cardWidth + spacing), index * (cardWidth + spacing), (index + 1) * (cardWidth + spacing)];
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);
    const translateX = interpolate(scrollX.value, inputRange, [-cardWidth * 0.13, 0, cardWidth * 0.13], Extrapolation.CLAMP);
    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View entering={SlideInRight.springify().duration(400)} layout={Layout.springify()} style={[styles.cardContainer, { width: cardWidth, marginRight: spacing }, rnAnimatedStyle]}>
      <View style={styles.imageContainer}>
        <Image source={backgroundImage} style={styles.image} />
        <View style={styles.glassOverlay} />
      </View>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <AddIcon size={24} color="#fff" onPress={() => operations.add(data.id)} />
        </View>
        <Text style={styles.cardTitle}>{data.name}</Text>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          <View style={styles.linksWrapper}>
            {topics.map((topic, index) => (
              <Animated.View key={topic.id} entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)} layout={Layout.springify().delay(index * 20)}>
                <Link href={`/system-design/${topic.id}`} asChild key={topic.id}>
                  <Pressable key={index} onLongPress={() => operations.delete(topic.id)}>
                    <Text style={styles.link}>{topic.name}</Text>
                  </Pressable>
                </Link>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default SystemDesignCategoryCard;

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    position: "absolute",
    top: "5%",
    left: 0,
    maxWidth: "95%",
    zIndex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(31, 41, 55, 0.8)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "rgba(75, 85, 99, 0.5)",
  },
  cardTitle: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 16,
    lineHeight: 32,
    marginLeft: 20,
  },
  scrollContainer: {
    maxHeight: MAX_ROWS * LINK_HEIGHT,
    maxWidth: "100%",
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  linksWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  link: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 6,
    margin: 2,
    color: "#D1D5DB",
  },
});
