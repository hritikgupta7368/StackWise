// import React, { useRef } from "react";
// import { Animated, ImageBackground, View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from "react-native";
// import { BackIcon, ShareIcon } from "@/components/ui/icons";

// const TITLE_TRANSITION_POINT = 160;

// const courseData = {
//   title: "Java\nDeveloping",
//   lessonsCount: 25,
//   examsCount: 6,
//   description: "Master the essentials of Java programming in this comprehensive course designed for beginners. Learn to build robust, scalable applications from scratch with hands-on projects featuring real-world scenarios. Perfect for beginners and experienced developers looking to enhance their skills.",
// };

// const Header = ({ titleOpacity, titleTranslate }) => {
//   return (
//     <View style={styles.headerContainer}>
//       {/* Left Icon */}
//       <View style={styles.iconContainer}>
//         <BackIcon size={24} color="black" />
//       </View>

//       {/* Animated Title */}
//       <Animated.Text
//         style={[
//           styles.headerTitle,
//           {
//             opacity: titleOpacity,
//             transform: [{ translateY: titleTranslate }],
//           },
//         ]}
//       >
//         Java Developing
//       </Animated.Text>

//       {/* Right Icon */}
//       <View style={styles.iconContainer}>
//         <ShareIcon size={24} color="black" />
//       </View>

//       {/* Add more right/center elements here as needed */}
//     </View>
//   );
// };

// const { width } = Dimensions.get("window");
// const IMAGE_HEIGHT = 250;

// interface TitleCardProps {
//   translateY: Animated.AnimatedInterpolation<string | number>;
//   opacity: Animated.AnimatedInterpolation<string | number>;
//   textTranslateY: Animated.AnimatedInterpolation<string | number>;
//   textOpacity: Animated.AnimatedInterpolation<string | number>;
// }

// const TitleCard: React.FC<TitleCardProps> = ({ translateY, opacity, textTranslateY, textOpacity }) => {
//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         {
//           transform: [{ translateY }],
//           opacity,
//         },
//       ]}
//     >
//       <ImageBackground source={require("../../assets/cards/1.jpg")} style={styles.image} imageStyle={styles.imageBorder}>
//         <Animated.View
//           style={[
//             styles.textWrapper,
//             {
//               transform: [{ translateY: textTranslateY }],
//               opacity: textOpacity,
//             },
//           ]}
//         >
//           <Text style={styles.title}>Java{"\n"}Developing</Text>
//         </Animated.View>
//       </ImageBackground>
//     </Animated.View>
//   );
// };

// // Main Test Component
// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// const Test: React.FC = () => {
//   const scrollY = useRef(new Animated.Value(0)).current;

//   // Header title appearance
//   const headerTitleOpacity = scrollY.interpolate({
//     inputRange: [TITLE_TRANSITION_POINT - 30, TITLE_TRANSITION_POINT],
//     outputRange: [0, 1],
//     extrapolate: "clamp",
//   });

//   const headerTitleTranslate = scrollY.interpolate({
//     inputRange: [TITLE_TRANSITION_POINT - 30, TITLE_TRANSITION_POINT],
//     outputRange: [10, 0],
//     extrapolate: "clamp",
//   });

//   // TitleCard fade + shrink
//   const cardOpacity = scrollY.interpolate({
//     inputRange: [0, TITLE_TRANSITION_POINT / 1.5],
//     outputRange: [1, 0],
//     extrapolate: "clamp",
//   });

//   const cardTranslateY = scrollY.interpolate({
//     inputRange: [0, TITLE_TRANSITION_POINT],
//     outputRange: [0, -80],
//     extrapolate: "clamp",
//   });

//   // Title inside TitleCard animating upward
//   const bigTitleTranslateY = scrollY.interpolate({
//     inputRange: [0, TITLE_TRANSITION_POINT],
//     outputRange: [0, -120],
//     extrapolate: "clamp",
//   });

//   const bigTitleOpacity = scrollY.interpolate({
//     inputRange: [0, TITLE_TRANSITION_POINT / 1.5],
//     outputRange: [1, 0],
//     extrapolate: "clamp",
//   });

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ImageBackground source={require("../../assets/CardBackground/1.avif")} style={styles.backgroundImage} resizeMode="cover">
//         <Header titleOpacity={headerTitleOpacity} titleTranslate={headerTitleTranslate} />

//         <Animated.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
//           <TitleCard translateY={cardTranslateY} opacity={cardOpacity} textTranslateY={bigTitleTranslateY} textOpacity={bigTitleOpacity} />
//           <View style={{ height: SCREEN_HEIGHT * 2 }} />
//         </Animated.ScrollView>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// };

// export default Test;

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   headerContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 1000,
//     height: 80,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   iconContainer: {
//     padding: 8,
//     borderRadius: 26,
//     backgroundColor: "rgba(17, 24, 39, 0.4)",
//   },
//   headerTitle: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     textAlign: "center",
//     fontSize: 18,
//     color: "white",
//     fontWeight: "bold",
//   },
//   container: {
//     width: width,
//     height: IMAGE_HEIGHT,
//     overflow: "hidden",
//     borderBottomLeftRadius: 26,
//     borderBottomRightRadius: 26,
//   },
//   image: {
//     flex: 1,
//     padding: 16,
//   },
//   imageBorder: {
//     borderBottomLeftRadius: 26,
//     borderBottomRightRadius: 26,
//   },
//   textWrapper: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "flex-start",
//   },
//   title: {
//     fontFamily: "Michroma",
//     fontSize: 26,
//     color: "black",
//     fontWeight: "condensedBold",
//   },
// });
// Card.js
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useAppStore } from "@/store/useStore";
import { DailyGoal, PlannedAction } from "@/src/goalEngine/goalTypes";
import { ensureStoreInitialized } from "@/src/goalEngine/storeInitializer";
const dummyWidgets = [
  { id: "1", w: 1, h: 1, color: "#e57373" },
  { id: "2", w: 2, h: 1, color: "#81c784" },
  { id: "3", w: 1, h: 1, color: "#64b5f6" },
  { id: "4", w: 2, h: 2, color: "#ffd54f" },
  { id: "5", w: 1, h: 1, color: "#ba68c8" },
  { id: "6", w: 2, h: 1, color: "#ffb74d" },
  { id: "7", w: 1, h: 1, color: "#9575cd" },
  { id: "8", w: 1, h: 1, color: "#4dd0e1" },
];

const Test = () => {
  // Create state to store and display results
  const [actionResult, setActionResult] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("goals");
  const [schedule, setSchedule] = useState<any>(null);

  // Get all required store functions (only the ones that exist)
  const store = useAppStore();
  const today = new Date().toISOString().slice(0, 10);

  // Function to safely execute store methods with error handling
  const safeExecute = useCallback((fn: Function, ...args: any[]) => {
    try {
      const result = fn(...args);
      console.log(`✅ Successfully executed ${fn.name}`);
      setActionResult(JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error(`❌ Error executing ${fn.name}:`, error);
      setActionResult(`Error: ${error}`);
      return null;
    }
  }, []);

  const loadScheduleData = useCallback(() => {
    if (store.getScheduleForDate) {
      try {
        const todaySchedule = store.getScheduleForDate(today);
        loadScheduleData;
        setSchedule(todaySchedule);
        setActionResult(JSON.stringify(todaySchedule, null, 2));
      } catch (error) {
        console.error("Error loading schedule:", error);
        setActionResult(`Error loading schedule: ${error}`);
      }
    }
  }, [store, today]);

  useEffect(() => {
    if (activeSection === "schedule") {
      loadScheduleData();
    }
  }, [activeSection, loadScheduleData]);

  useEffect(() => {
    // Check if goals exist for today
    const updated = ensureStoreInitialized();
    if (updated) {
      console.log("🔄 Store was updated with missing properties");
    }
    const todayGoal = store.getTodayGoal ? store.getTodayGoal() : null;

    if (!todayGoal && store.generateGoalsFromEngine) {
      console.log("No goals for today - generating...");
      safeExecute(store.generateGoalsFromEngine);
    }
  }, []);

  // Test sections
  // Fixed key issue in test.tsx - use a modified version of renderGoalsSection function
  const renderGoalsSection = () => (
    <View>
      <Text style={styles.sectionTitle}>📅 Daily Goals</Text>
      {store.goal?.dailyGoals?.map((g: DailyGoal, goalIndex: number) => (
        <View key={`goal-${g.date}-${goalIndex}`} style={styles.goalCard}>
          <Text style={styles.date}>🗓️ Date: {g.date}</Text>
          <Text>
            📚 Learn: {g.plannedLearning.length} | 🔁 Revise: {g.plannedRevision.length}
          </Text>
          <Text>
            ✅ Completed: {g.totalCompleted} / {g.totalPlannedActions}
          </Text>
          <Text>{g.goalMet ? "✅ Goal Met" : "❌ Goal Not Met"}</Text>

          {g.date === today && (
            <View style={styles.todayActions}>
              <Text style={styles.subheading}>Today's Actions:</Text>
              {[...g.plannedLearning, ...g.plannedRevision].map((action: PlannedAction, actionIndex: number) => (
                <View key={`action-${action.id}-${actionIndex}`} style={styles.actionItem}>
                  <Text style={{ maxWidth: "50%" }}>
                    📝 {action.title} ({action.domain})
                  </Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.smallButton} onPress={() => store.markActionStarted && safeExecute(store.markActionStarted, g.date, action.id)}>
                      <Text style={styles.smallButtonText}>Start</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.smallButton, styles.completeButton]} onPress={() => store.markActionCompleted && safeExecute(store.markActionCompleted, g.date, action.id)}>
                      <Text style={styles.smallButtonText}>Complete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderScheduleSection = () => (
    <View>
      <Text style={styles.sectionTitle}>⏰ Today's Schedule</Text>
      <View style={styles.resultCard}>
        <Text>{schedule ? JSON.stringify(schedule, null, 2) : "No schedule available"}</Text>
      </View>

      <Button
        title="Generate Schedule for Today"
        onPress={() => {
          if (store.generateScheduleForGoal) {
            safeExecute(store.generateScheduleForGoal, today);
            // Reload schedule data after generation
            setTimeout(loadScheduleData, 100);
          }
        }}
      />

      <Button title="Refresh Schedule" onPress={() => loadScheduleData()} />
    </View>
  );

  const renderMetricsSection = () => (
    <View>
      <Text style={styles.sectionTitle}>📈 Metrics</Text>
      <View style={styles.resultCard}>
        <Text>{store.goal?.metrics ? JSON.stringify(store.goal.metrics, null, 2) : "No metrics yet"}</Text>
      </View>

      <Button title="Refresh Metrics" onPress={() => store.refreshMetrics && safeExecute(store.refreshMetrics)} />
    </View>
  );

  const renderForecastSection = () => (
    <View>
      <Text style={styles.sectionTitle}>🔮 Forecast</Text>
      <View style={styles.resultCard}>
        <Text>{store.goal?.forecast ? JSON.stringify(store.goal.forecast, null, 2) : "No forecast yet"}</Text>
      </View>

      <Button title="Update Forecast" onPress={() => store.updateForecast && safeExecute(store.updateForecast)} />
    </View>
  );

  const renderMemorySection = () => (
    <View>
      <Text style={styles.sectionTitle}>🧠 Learning Memory</Text>
      <View style={styles.resultCard}>
        <Text>{store.goal?.memory ? JSON.stringify(store.goal.memory, null, 2) : "No memory yet"}</Text>
      </View>

      <Button title="Refresh Memory" onPress={() => store.refreshMemory && safeExecute(store.refreshMemory)} />
    </View>
  );

  const renderTimePatternsSection = () => (
    <View>
      <Text style={styles.sectionTitle}>⌚ Time Patterns</Text>
      <View style={styles.resultCard}>
        <Text>{store.goal?.timePatterns ? JSON.stringify(store.goal.timePatterns, null, 2) : "No time patterns yet"}</Text>
      </View>

      <Button title="Update Time Patterns" onPress={() => store.updateTimePatterns && safeExecute(store.updateTimePatterns)} />
    </View>
  );

  const renderDigestSection = () => (
    <View>
      <Text style={styles.sectionTitle}>📊 Goal Digest</Text>
      <View style={styles.resultCard}>
        <Text>{store.goal?.goalDigest ? JSON.stringify(store.goal.goalDigest, null, 2) : "No digest yet"}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => store.generateDigest && safeExecute(store.generateDigest, "daily")}>
          <Text style={styles.buttonText}>Daily Digest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => store.generateDigest && safeExecute(store.generateDigest, "weekly")}>
          <Text style={styles.buttonText}>Weekly Digest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEngineControlSection = () => (
    <View>
      <Text style={styles.sectionTitle}>⚙️ Engine Controls</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => store.runHourlyUpdate && safeExecute(store.runHourlyUpdate, today)}>
          <Text style={styles.buttonText}>Hourly Update</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => store.evaluateAndUpdateMode && safeExecute(store.evaluateAndUpdateMode)}>
          <Text style={styles.buttonText}>Evaluate Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => store.restructureFutureGoals && safeExecute(store.restructureFutureGoals)}>
          <Text style={styles.buttonText}>Restructure Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => store.generateGoalsFromEngine && safeExecute(store.generateGoalsFromEngine)}>
          <Text style={styles.buttonText}>Generate Goals</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserConfigSection = () => (
    <View>
      <Text style={styles.sectionTitle}>👤 User Config</Text>
      <View style={styles.resultCard}>
        <Text>{store.goal?.userConfig ? JSON.stringify(store.goal.userConfig, null, 2) : "No config yet"}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => store.updateUserConfig && safeExecute(store.updateUserConfig, { mode: "boost" })}>
          <Text style={styles.buttonText}>Set Boost Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => store.updateUserConfig && safeExecute(store.updateUserConfig, { mode: "normal" })}>
          <Text style={styles.buttonText}>Set Normal Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Navigation tabs
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={[styles.tab, activeSection === "goals" && styles.activeTab]} onPress={() => setActiveSection("goals")}>
          <Text style={styles.tabText}>Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "schedule" && styles.activeTab]} onPress={() => setActiveSection("schedule")}>
          <Text style={styles.tabText}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "metrics" && styles.activeTab]} onPress={() => setActiveSection("metrics")}>
          <Text style={styles.tabText}>Metrics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "forecast" && styles.activeTab]} onPress={() => setActiveSection("forecast")}>
          <Text style={styles.tabText}>Forecast</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "memory" && styles.activeTab]} onPress={() => setActiveSection("memory")}>
          <Text style={styles.tabText}>Memory</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "patterns" && styles.activeTab]} onPress={() => setActiveSection("patterns")}>
          <Text style={styles.tabText}>Patterns</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "digest" && styles.activeTab]} onPress={() => setActiveSection("digest")}>
          <Text style={styles.tabText}>Digest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "controls" && styles.activeTab]} onPress={() => setActiveSection("controls")}>
          <Text style={styles.tabText}>Controls</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeSection === "config" && styles.activeTab]} onPress={() => setActiveSection("config")}>
          <Text style={styles.tabText}>Config</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // Render active section content
  const renderActiveSection = () => {
    switch (activeSection) {
      case "goals":
        return renderGoalsSection();
      case "schedule":
        return renderScheduleSection();
      case "metrics":
        return renderMetricsSection();
      case "forecast":
        return renderForecastSection();
      case "memory":
        return renderMemorySection();
      case "patterns":
        return renderTimePatternsSection();
      case "digest":
        return renderDigestSection();
      case "controls":
        return renderEngineControlSection();
      case "config":
        return renderUserConfigSection();
      default:
        return renderGoalsSection();
    }
  };

  // Result display
  const renderActionResult = () => (
    <View style={styles.resultSection}>
      <Text style={styles.resultTitle}>Action Result:</Text>
      <ScrollView style={styles.resultScroll}>
        <Text>{actionResult}</Text>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderTabs()}

      <ScrollView style={styles.content}>
        {renderActiveSection()}

        {actionResult ? renderActionResult() : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabsContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  goalCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  todayActions: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  subheading: {
    fontWeight: "600",
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionButtons: {
    flexDirection: "row",
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: "#34C759",
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  resultSection: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultScroll: {
    maxHeight: 200,
  },
});

export default Test;
