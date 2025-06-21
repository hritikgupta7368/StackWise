import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  code: unknown;
};

const CodeBlockComponent = ({ code = "" }: Props) => {
  const normalizedCode = useMemo(() => {
    // Convert any input to string safely
    if (typeof code === "string") return code;
    if (code == null) return ""; // null or undefined
    try {
      return JSON.stringify(code, null, 2); // handles arrays, objects
    } catch {
      return String(code); // fallback
    }
  }, [code]);

  const highlightedLines = useMemo(() => {
    return normalizedCode.split("\n").map((line, index) => {
      let commentIndex = -1;

      // Check for comment indicators in order
      const commentMarkers = ["#", "//", "/*"];
      for (const marker of commentMarkers) {
        const idx = line.indexOf(marker);
        if (idx !== -1 && (commentIndex === -1 || idx < commentIndex)) {
          commentIndex = idx;
        }
      }

      // Split into code + comment
      const codePart = commentIndex !== -1 ? line.slice(0, commentIndex) : line;
      const commentPart = commentIndex !== -1 ? line.slice(commentIndex) : "";

      return (
        <Text key={index} style={styles.codeLine}>
          <Text style={styles.codeDefault}>{codePart}</Text>
          {commentPart.length > 0 && (
            <Text style={styles.codeComment}>{commentPart}</Text>
          )}
        </Text>
      );
    });
  }, [normalizedCode]);

  return (
    <View style={styles.codeContainer}>
      <View style={styles.codeContent}>{highlightedLines}</View>
    </View>
  );
};

// ✅ Wrap with React.memo for performance
export const FastCodeBlock = React.memo(CodeBlockComponent);

// ✅ Add minimal styles
const styles = StyleSheet.create({
  // Fast CodeBlock styles
  codeContainer: {
    backgroundColor: "#374151",
    borderRadius: 8,
    marginVertical: 8,
    overflow: "hidden",
  },

  codeContent: {
    padding: 12,
    backgroundColor: "#1f1f1f",
  },
  codeLine: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: "monospace",
  },
  codeDefault: {
    color: "#FFFFFF",
  },
  codeComment: {
    color: "#b8d086",
    fontStyle: "italic",
  },
});
