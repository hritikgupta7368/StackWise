import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Linking, Animated, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useAppStore } from "../../store/useStore";
import SliderComponent from "@/components/common/Slider";
import { FontAwesome } from "@expo/vector-icons";
import SimilarQuestionCard from "@/components/Cards/SimilarQuestionCard";

import ImageViewing from "react-native-image-viewing";
import Header from "@/components/common/NewHeader";
import { useOverlayStore } from "@/store/useOverlayStore";
import { AddNewProblem, UpdateProblemForm, DeleteProblemsSheet } from "@/components/Forms/dsaForms/DsaProblems";
import { theme } from "@/components/theme";
import { Problem, SimilarProblem } from "@/types/types";
import { FastCodeBlock } from "@/components/common/codeblock";

export default function TopicPage() {
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const { showBottomSheet } = useOverlayStore();

  // Fixed store selector - stable reference
  const allProblems = useAppStore((state) => state.dsa.problems);

  // Memoize filtered problems to prevent unnecessary recalculations
  const problems = useMemo(() => {
    return allProblems.filter((problem) => problem.topicId === (topic || ""));
  }, [allProblems, topic]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoize current problem to prevent unnecessary re-renders
  const currentProblem = useMemo(() => problems[selectedIndex], [problems, selectedIndex]);

  // Memoize images array
  const images = useMemo(() => currentProblem?.images || [], [currentProblem?.images]);

  // Memoize image data for ImageViewing
  const imageViewingData = useMemo(() => images?.map((uri) => ({ uri })) || [], [images]);

  // Group all animation values into a single ref to reduce memory usage
  const animationRefs = useRef({
    overlayOpacity: new Animated.Value(0),
    textTranslateY: new Animated.Value(30),
    textScale: new Animated.Value(0.9),
    contentOpacity: new Animated.Value(1),
    contentTranslateX: new Animated.Value(0),
    pageScale: new Animated.Value(1),
    initialOpacity: new Animated.Value(0),
    initialTranslateY: new Animated.Value(20),
  }).current;

  // Reset selectedIndex when topic changes or problems change significantly
  useEffect(() => {
    if (selectedIndex >= problems.length && problems.length > 0) {
      setSelectedIndex(0);
      setPreviewIndex(0);
    }
  }, [problems.length, selectedIndex]);

  // Reset when topic changes
  useEffect(() => {
    setSelectedIndex(0);
    setPreviewIndex(0);
  }, [topic]);

  // Initial page load animation
  useEffect(() => {
    const { initialOpacity, initialTranslateY } = animationRefs;

    Animated.parallel([
      Animated.timing(initialOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(initialTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Cleanup function
    return () => {
      // Stop all animations when component unmounts
      Object.values(animationRefs).forEach((animValue) => {
        animValue.stopAnimation();
      });
    };
  }, []);

  // Animate overlay when isSliding changes
  useEffect(() => {
    const { overlayOpacity, textTranslateY, textScale, pageScale } = animationRefs;

    if (isSliding) {
      // Fade in overlay with enhanced animations
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          tension: 150,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(pageScale, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out overlay
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 30,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textScale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(pageScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSliding]);

  // Optimized content transition animation
  const animateContentChange = useCallback(
    (newIndex: number) => {
      const { contentOpacity, contentTranslateX } = animationRefs;

      setIsTransitioning(true);
      const direction = newIndex > selectedIndex ? -30 : 30;

      // Fade out and slide current content
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateX, {
          toValue: direction,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change the content
        setSelectedIndex(newIndex);

        // Reset position and fade in new content
        contentTranslateX.setValue(-direction);

        Animated.parallel([
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(contentTranslateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsTransitioning(false);
        });
      });
    },
    [selectedIndex, animationRefs],
  );

  // Memoize handlers to prevent unnecessary re-renders
  const handleLinkPress = useCallback(() => {
    if (currentProblem?.problemLink) {
      Linking.openURL(currentProblem.problemLink);
    }
  }, [currentProblem?.problemLink]);

  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setViewerVisible(true);
  }, []);

  const handleImageViewerClose = useCallback(() => {
    setViewerVisible(false);
  }, []);

  const handleSliderStart = useCallback(() => {
    setIsSliding(true);
  }, []);

  const handleSliderChange = useCallback((val: number) => {
    setPreviewIndex(val);
  }, []);

  const handleSliderComplete = useCallback(
    (val: number) => {
      setTimeout(() => {
        setIsSliding(false);
        if (val !== selectedIndex) {
          animateContentChange(val);
        }
      }, 100);
    },
    [selectedIndex, animateContentChange],
  );

  // Memoize image style calculation
  const getImageStyle = useCallback((imageCount: number, index: number) => {
    switch (imageCount) {
      case 1:
        return styles.singleImage;
      case 2:
        return styles.twoImagesItem;
      case 3:
        return index === 0 ? styles.threeImagesFirst : styles.threeImagesOther;
      case 4:
        return styles.fourImagesItem;
      default:
        return styles.singleImage;
    }
  }, []);

  // Memoize menu options to prevent recreation
  const menuOptions = useMemo(
    () => [
      {
        label: "Add a New Problem",
        onPress: () =>
          showBottomSheet({
            height: 700,
            content: <AddNewProblem topicId={topic} />,
            title: `Add to ${topic}`,
            subtitle: "Add a new problem to this topic",
          }),
      },
      {
        label: "Update Problem",
        onPress: () => {
          showBottomSheet({
            height: 700,
            content: <UpdateProblemForm problemId={currentProblem?.id || ""} />,
            title: "Update problem",
            subtitle: "Update the details of this problem",
          });
        },
      },
      {
        label: "Delete Problem",
        onPress: () => {
          showBottomSheet({
            height: 700,
            content: <DeleteProblemsSheet problems={problems} />,
            title: "Delete problem",
            subtitle: "Delete this problem",
          });
        },
      },
    ],
    [topic, currentProblem?.id, problems, showBottomSheet],
  );

  // Memoize similar problems rendering
  const similarProblemsSection = useMemo(() => {
    if (!currentProblem?.similarProblems?.length) return null;

    return (
      <View style={styles.similarProblemsContainer}>
        <Text style={styles.similarProblemsTitle}>Similar Questions:</Text>
        <View>
          {currentProblem.similarProblems.map((question, index) => (
            <SimilarQuestionCard key={`${question.id}-${index}`} question={question} index={index} problemId={currentProblem.id} />
          ))}
        </View>
      </View>
    );
  }, [currentProblem?.similarProblems, currentProblem?.id]);

  // Memoize images grid
  const imagesGrid = useMemo(() => {
    if (!images?.length) return null;

    return (
      <View style={styles.imageGrid}>
        {images.slice(0, 4).map((img, idx) => (
          <TouchableOpacity key={`${img}-${idx}`} style={[styles.imageThumbnail, getImageStyle(images.length, idx)]} onPress={() => handleImagePress(idx)}>
            <Image source={{ uri: img }} style={styles.imageStyle} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [images, getImageStyle, handleImagePress]);

  const { overlayOpacity, textTranslateY, textScale, contentOpacity, contentTranslateX, pageScale, initialOpacity, initialTranslateY } = animationRefs;

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: initialOpacity,
            transform: [{ translateY: initialTranslateY }, { scale: pageScale }],
          },
        ]}
      >
        <Header title={currentProblem?.title || ""} leftIcon="back" rightIcon="menu" theme="dark" backgroundColor="#121212" withBorder menuOptions={menuOptions} />

        {problems.length < 1 ? (
          <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: theme.colors.background }}>
            <Text style={styles.empty}>No problems found</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} scrollEnabled={!isTransitioning}>
            <SliderComponent label={`Problem ${previewIndex + 1} of ${problems.length}`} min={0} max={problems.length - 1} step={1} initialValue={selectedIndex} onSlidingStart={handleSliderStart} onValueChange={handleSliderChange} onSlidingComplete={handleSliderComplete} />

            <Animated.View
              style={{
                opacity: contentOpacity,
                transform: [{ translateX: contentTranslateX }],
              }}
            >
              {/* Title + YouTube link */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{currentProblem?.title}</Text>
                {currentProblem?.problemLink && (
                  <TouchableOpacity onPress={handleLinkPress} style={styles.linkButton}>
                    <FontAwesome name="youtube-play" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Description */}
              <Text style={styles.description}>{currentProblem?.explanation}</Text>

              {/* Test Cases */}
              <View style={styles.testCaseWrapper}>
                <Text style={styles.testCaseTitle}>Test Case:</Text>
                <View style={styles.testCaseContent}>
                  <Text style={styles.testCaseText}>{currentProblem?.testCase}</Text>
                </View>
              </View>

              {/* Explanation */}
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>Explanation:</Text>
                <Text style={styles.explanationText}>{currentProblem?.solution}</Text>
              </View>

              {/* Images Grid */}
              {imagesGrid}

              <ImageViewing images={imageViewingData} imageIndex={currentImageIndex} visible={isViewerVisible} onRequestClose={handleImageViewerClose} />

              {/* Code Block */}
              {currentProblem?.code && <FastCodeBlock code={currentProblem.code} />}

              {/* Similar Problems */}
              {similarProblemsSection}
            </Animated.View>
          </ScrollView>
        )}
      </Animated.View>

      {/* Animated Gradient Overlay when changing topics */}
      <Animated.View
        style={[
          styles.overlayContainer,
          {
            opacity: overlayOpacity,
            display: isSliding || overlayOpacity._value > 0 ? "flex" : "none",
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient colors={["rgba(0,0,0,0.95)", "rgba(0,0,0,0.85)", "rgba(0,0,0,0.75)", "rgba(0,0,0,0.85)", "rgba(0,0,0,0.95)"]} locations={[0, 0.2, 0.5, 0.8, 1]} style={styles.gradientOverlay}>
          <Animated.View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.slidingText,
                {
                  transform: [{ translateY: textTranslateY }, { scale: textScale }],
                },
              ]}
            >
              🎯 Drag Slider to Navigate Problems
            </Animated.Text>
            <Animated.Text
              style={[
                styles.subText,
                {
                  transform: [{ translateY: textTranslateY }, { scale: textScale }],
                },
              ]}
            >
              Problem {previewIndex + 1} of {problems.length}
            </Animated.Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.Primarytext,
    flex: 1,
  },
  linkButton: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    lineHeight: 20,
    marginBottom: 20,
  },
  testCaseWrapper: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    marginBottom: 16,
  },
  testCaseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4338CA",
    marginBottom: 8,
  },
  testCaseContent: {
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    padding: 8,
  },
  testCaseText: {
    fontSize: 14,
    color: "#3730A3",
    fontFamily: "monospace",
    lineHeight: 18,
    flexWrap: "wrap",
  },
  explanationContainer: {
    marginBottom: 25,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.Primarytext,
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    lineHeight: 20,
  },
  codeSection: {
    marginTop: 8,
  },
  similarProblemsContainer: {
    marginBottom: 30,
  },
  similarProblemsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.Primarytext,
    marginBottom: 10,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  slidingText: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "400",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  empty: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 50,
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
