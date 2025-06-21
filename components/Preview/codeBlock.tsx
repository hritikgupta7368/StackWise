import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

interface CodeBlockProps {
  code: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  title = "Solution Code:",
}) => {
  // Reduced animation complexity - only using opacity
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simplified animation - just fade in
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [code]);

  // Memoize the formatted code to prevent recalculation on every render
  const formattedCode = useMemo(() => {
    return formatCodeOptimized(code);
  }, [code]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      <Text style={styles.title}>{title}</Text>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        style={styles.codeContainer}
        contentContainerStyle={styles.scrollContentContainer}
        // Performance optimizations for ScrollView
        removeClippedSubviews={true}
        scrollEventThrottle={16}
      >
        <View style={styles.codeWrapper}>
          <Text style={styles.codeText}>{formattedCode}</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

// Optimized formatting function that returns a single string with ANSI-like styling
const formatCodeOptimized = (rawCode: string): string => {
  const lines = rawCode.split("\n");
  return lines.join("\n");
};

// Alternative approach using individual Text components but with better performance
const CodeBlockWithSyntaxHighlighting: React.FC<CodeBlockProps> = ({
  code,
  title = "Solution Code:",
}) => {
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [code]);

  // Memoize the syntax highlighting
  const highlightedLines = useMemo(() => {
    return formatCodeWithHighlighting(code);
  }, [code]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      <Text style={styles.title}>{title}</Text>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        style={styles.codeContainer}
        contentContainerStyle={styles.scrollContentContainer}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
      >
        <View style={styles.codeWrapper}>{highlightedLines}</View>
      </ScrollView>
    </Animated.View>
  );
};

// More efficient syntax highlighting that creates fewer components
const formatCodeWithHighlighting = (rawCode: string): React.ReactElement[] => {
  const lines = rawCode.split("\n");

  return lines.map((line, index) => {
    // Simple regex-based highlighting (much faster than tokenization)
    const segments = parseLineSimple(line);

    return (
      <Text key={index} style={styles.codeLine}>
        {segments}
      </Text>
    );
  });
};

const parseLineSimple = (line: string): React.ReactElement[] => {
  const segments: React.ReactElement[] = [];

  // Handle comments first (entire line)
  if (line.trim().startsWith("#")) {
    return [
      <Text key="comment" style={styles.comment}>
        {line}
      </Text>,
    ];
  }

  // Simple regex patterns for basic highlighting
  const patterns = [
    {
      regex:
        /(def|if|else|elif|for|while|return|import|from|class|try|except|finally|with|as|in|not|and|or)\b/g,
      style: styles.keyword,
    },
    { regex: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, style: styles.string },
    { regex: /\b\d+\b/g, style: styles.number },
    {
      regex:
        /(enumerate|len|range|str|int|float|list|dict|set|tuple|print|input)\b/g,
      style: styles.builtin,
    },
  ];

  let lastIndex = 0;
  let matchFound = false;

  // Find all matches and sort by position
  const allMatches: Array<{
    index: number;
    length: number;
    style: any;
    text: string;
  }> = [];

  patterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.regex);
    while ((match = regex.exec(line)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        style: pattern.style,
        text: match[0],
      });
    }
  });

  // Sort matches by index
  allMatches.sort((a, b) => a.index - b.index);

  // Build segments
  allMatches.forEach((match, i) => {
    // Add text before match
    if (match.index > lastIndex) {
      segments.push(
        <Text key={`text-${i}`} style={styles.defaultText}>
          {line.substring(lastIndex, match.index)}
        </Text>,
      );
    }

    // Add highlighted match
    segments.push(
      <Text key={`match-${i}`} style={match.style}>
        {match.text}
      </Text>,
    );

    lastIndex = match.index + match.length;
  });

  // Add remaining text
  if (lastIndex < line.length) {
    segments.push(
      <Text key="end" style={styles.defaultText}>
        {line.substring(lastIndex)}
      </Text>,
    );
  }

  return segments.length > 0
    ? segments
    : [
        <Text key="full" style={styles.defaultText}>
          {line}
        </Text>,
      ];
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    // Removed shadow for better performance
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  codeContainer: {
    backgroundColor: "#4B5563",
    borderRadius: 6,
  },
  scrollContentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  codeWrapper: {
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 8,
  },
  // Single text component approach
  codeText: {
    fontSize: 13,
    lineHeight: 16,
    color: "#FFFFFF",
    fontFamily: "monospace",
    textAlign: "left",
  },
  // Individual component styles
  codeLine: {
    fontSize: 13,
    lineHeight: 16,
    color: "#FFFFFF",
    fontFamily: "monospace",
    textAlign: "left",
  },
  keyword: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  string: {
    color: "#10B981",
  },
  comment: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  number: {
    color: "#F472B6",
  },
  builtin: {
    color: "#60A5FA",
  },
  defaultText: {
    color: "#FFFFFF",
  },
});

// Export the simpler version by default for better performance
export default React.memo(CodeBlock);

// Export the syntax-highlighted version as an alternative
export { CodeBlockWithSyntaxHighlighting };
