import { useEffect, useState, useRef } from "react";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, Stack } from "expo-router";
import { useProblemStore } from "../../hooks/useStore";
import SliderComponent from "../../components/Preview/sliderPagination";
import { FontAwesome } from "@expo/vector-icons";
import SimilarQuestionCard from "../../components/Preview/similarCard";
import CodeBlock from "../../components/Preview/codeBlock";
import ImageViewing from "react-native-image-viewing";

interface SimilarProblem {
  title: string;
  explanation: string;
  code?: string;
}

interface Problem {
  title: string;
  problemLink?: string;
  description: string;
  testCase: string;
  explanation: string;
  code?: string;
  similarProblems?: SimilarProblem[];
}

export default function TopicPage() {
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const getProblemsByTopicId = useProblemStore((s) => s.getProblemsByTopicId);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentProblem = problems[selectedIndex];
  const images = currentProblem?.images || [];

  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const textScale = useRef(new Animated.Value(0.9)).current;

  // Content animation values
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const pageScale = useRef(new Animated.Value(1)).current;

  // Initial page load animation
  const initialOpacity = useRef(new Animated.Value(0)).current;
  const initialTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (topic) {
      const result = getProblemsByTopicId(topic);
      setProblems(result || []);

      // Initial page load animation
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
    }
  }, [topic]);

  // Animate overlay when isSliding changes
  useEffect(() => {
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

  // Content transition animation
  const animateContentChange = (newIndex: number) => {
    setIsTransitioning(true);

    // Fade out and slide current content
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: newIndex > selectedIndex ? -30 : 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change the content
      setSelectedIndex(newIndex);

      // Reset position and fade in new content
      contentTranslateX.setValue(newIndex > selectedIndex ? 30 : -30);

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
  };

  if (!problems.length) {
    return <Text style={styles.empty}>No problems found.</Text>;
  }

  const current = problems[selectedIndex];

  const handleLinkPress = () => {
    if (current.problemLink) {
      Linking.openURL(current.problemLink);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: initialOpacity,
            transform: [
              { translateY: initialTranslateY },
              { scale: pageScale },
            ],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isTransitioning}
        >
          <Stack.Screen options={{ headerShown: false }} />

          <SliderComponent
            label={`Problem ${previewIndex + 1} of ${problems.length}`}
            min={0}
            max={problems.length - 1}
            step={1}
            initialValue={selectedIndex}
            onSlidingStart={() => setIsSliding(true)}
            onValueChange={(val: number) => setPreviewIndex(val)}
            onSlidingComplete={(val: number) => {
              setTimeout(() => {
                setIsSliding(false);
                if (val !== selectedIndex) {
                  animateContentChange(val);
                }
              }, 100);
            }}
          />

          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{ translateX: contentTranslateX }],
            }}
          >
            {/* Title + YouTube link */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{current.title}</Text>
              {current.problemLink && (
                <TouchableOpacity
                  onPress={handleLinkPress}
                  style={styles.linkButton}
                >
                  <FontAwesome name="youtube-play" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>

            {/* Description */}
            <Text style={styles.description}>{current.description}</Text>

            {/* Test Cases */}
            <View style={styles.testCaseWrapper}>
              <Text style={styles.testCaseTitle}>Test Case:</Text>
              <View style={styles.testCaseContent}>
                <Text style={styles.testCaseText}>{current.testCase}</Text>
              </View>
            </View>

            {/* Explanation */}
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{current.explanation}</Text>
            </View>

            {/* Images Grid */}
            {images?.length > 0 && (
              <View style={styles.imageGrid}>
                {images.slice(0, 4).map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.imageThumbnail}
                    onPress={() => {
                      setCurrentImageIndex(idx);
                      setViewerVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: img }}
                      style={styles.imageStyle}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Fullscreen Viewer */}
            <ImageViewing
              images={images?.map((uri) => ({ uri })) || []}
              imageIndex={currentImageIndex}
              visible={isViewerVisible}
              onRequestClose={() => setViewerVisible(false)}
            />

            {/* Code Block */}
            {current.code && (
              <View style={styles.codeSection}>
                <CodeBlock code={current.code} title="Solution Code:" />
              </View>
            )}

            {/* Similar Problems */}
            <View style={styles.similarProblemsContainer}>
              <Text style={styles.similarProblemsTitle}>
                Similar Questions:
              </Text>
              <View>
                {current.similarProblems?.map((question, index) => (
                  <SimilarQuestionCard key={index} question={question} />
                ))}
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>

      {/* Animated Gradient Overlay */}
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
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.95)",
            "rgba(0,0,0,0.85)",
            "rgba(0,0,0,0.75)",
            "rgba(0,0,0,0.85)",
            "rgba(0,0,0,0.95)",
          ]}
          locations={[0, 0.2, 0.5, 0.8, 1]}
          style={styles.gradientOverlay}
        >
          <Animated.View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.slidingText,
                {
                  transform: [
                    { translateY: textTranslateY },
                    { scale: textScale },
                  ],
                },
              ]}
            >
              🎯 Drag Slider to Navigate Problems
            </Animated.Text>
            <Animated.Text
              style={[
                styles.subText,
                {
                  transform: [
                    { translateY: textTranslateY },
                    { scale: textScale },
                  ],
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
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  imageThumbnail: {
    // This style is now for the TouchableOpacity
    width: "40%", // Each touchable takes up 48% of the width
    height: 100,
    borderRadius: 10,
    overflow: "hidden", // Ensures the image's corners are also rounded
  },
  imageStyle: {
    // Add this new style for the Image component
    width: "100%",
    height: "100%",
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
    color: "#111827",
    flex: 1,
  },
  linkButton: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    color: "#374151",
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
    color: "#111827",
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 14,
    color: "#374151",
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
    color: "#4B5563",
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
});
