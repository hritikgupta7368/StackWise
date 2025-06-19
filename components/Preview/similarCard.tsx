import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CodeBlock from "./codeBlock";

const SimilarQuestionCard = ({ question }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get color based on difficulty level
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "#10B981"; // green-500
      case "medium":
        return "#F59E0B"; // amber-500
      case "hard":
        return "#EF4444"; // red-500
      default:
        return "#1F2937"; // gray-800 (default)
    }
  };

  // Get difficulty badge background color
  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "#D1FAE5"; // green-100
      case "medium":
        return "#FEF3C7"; // amber-100
      case "hard":
        return "#FEE2E2"; // red-100
      default:
        return "#F3F4F6"; // gray-100
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.cardHeader}>
        <View style={styles.headerTextContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.questionName,
                { color: getDifficultyColor(question.difficultyLevel) },
              ]}
              ellipsizeMode="tail" // Add ... at the end if text is too long
            >
              {question.title}
            </Text>
            {question.difficultyLevel && (
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor: getDifficultyBadgeColor(
                      question.difficultyLevel,
                    ),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(question.difficultyLevel) },
                  ]}
                >
                  {question.difficultyLevel.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.questionDifference} ellipsizeMode="tail">
            {question.description}
          </Text>
        </View>
        {/* Arrow indicator */}
        <View style={styles.expandToggleContainer}>
          <Text style={styles.expandToggleIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView
          style={styles.expandedContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Explanation Section */}
          {question.shortExplanation &&
            ((Array.isArray(question.shortExplanation) &&
              question.shortExplanation.length > 0) ||
              (typeof question.shortExplanation === "string" &&
                question.shortExplanation.trim())) && (
              <View style={styles.explanationSection}>
                <Text style={styles.explanationTitle}>Explanation:</Text>
                {Array.isArray(question.shortExplanation) ? (
                  question.shortExplanation.map((item, index) => (
                    <Text key={index} style={styles.explanationListItem}>
                      {`• ${item}`}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.explanationListItem}>
                    {`• ${question.shortExplanation}`}
                  </Text>
                )}
              </View>
            )}

          {/* Code Section */}
          {question.code && question.code.trim() && (
            <View style={styles.codeSection}>
              <CodeBlock code={question.code} title="Solution Code:" />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12, // Slightly more rounded
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start", // Changed from center to flex-start for better alignment
    justifyContent: "space-between",
    paddingBottom: 8,
    minHeight: 60, // Minimum height to accommodate content
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12, // Increased margin
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
    flexWrap: "wrap", // Allow wrapping if needed
  },
  questionName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1, // Take available space
    marginRight: 8, // Space between title and badge
    lineHeight: 22, // Better line height for readability
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start", // Align to top
    minWidth: 60, // Minimum width for consistency
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  questionDifference: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginTop: 2,
  },
  expandToggleContainer: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 30, // Minimum width for touch target
    minHeight: 30, // Minimum height for touch target
  },
  expandToggleIcon: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  expandedContent: {
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  explanationSection: {
    marginBottom: 16,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151", // Darker gray
    marginBottom: 8,
  },
  explanationListItem: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22, // Better line height
    marginBottom: 6,
    paddingRight: 8, // Right padding for better text flow
  },
  codeSection: {
    marginTop: 8,
  },
});

export default SimilarQuestionCard;
