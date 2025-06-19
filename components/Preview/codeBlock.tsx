import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

interface CodeBlockProps {
  code: string;
  title?: string;
}

interface Token {
  type: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  title = "Solution Code:",
}) => {
  // Animation values
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerScale = useRef(new Animated.Value(0.95)).current;
  const titleTranslateY = useRef(new Animated.Value(15)).current;
  const codeTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // REPLACE the entire Animated.parallel with this:
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(containerScale, {
        toValue: 1,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }),
      // REMOVE the shadowOpacity animation completely
    ]).start();

    // Keep the setTimeout parts unchanged
    setTimeout(() => {
      Animated.spring(titleTranslateY, {
        toValue: 0,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }, 50);

    setTimeout(() => {
      Animated.spring(codeTranslateY, {
        toValue: 0,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }, 100);
  }, [code]);

  const formatCode = (rawCode: string): React.ReactElement[] => {
    const lines = rawCode.split("\n");

    return lines.map((line, index) => {
      const formattedLine = formatLine(line);
      return (
        <Text key={index} style={styles.codeLine}>
          {formattedLine}
        </Text>
      );
    });
  };

  const formatLine = (line: string): React.ReactElement[] => {
    const segments: React.ReactElement[] = [];
    let currentIndex = 0;

    // Handle indentation
    const indentMatch = line.match(/^(\s+)/);
    if (indentMatch) {
      segments.push(
        <Text key={`indent-${currentIndex}`} style={styles.indent}>
          {indentMatch[1]}
        </Text>,
      );
      currentIndex += indentMatch[1].length;
    }

    const remainingLine = line.slice(currentIndex);

    // Check if line is a comment
    if (
      remainingLine.trim().startsWith("#") ||
      remainingLine.trim().startsWith('"""') ||
      remainingLine.trim().includes('"""')
    ) {
      segments.push(
        <Text key={`comment-${currentIndex}`} style={styles.comment}>
          {remainingLine}
        </Text>,
      );
      return segments;
    }

    // Check if line contains docstring
    if (remainingLine.includes('"""') || remainingLine.includes("'''")) {
      segments.push(
        <Text key={`docstring-${currentIndex}`} style={styles.docstring}>
          {remainingLine}
        </Text>,
      );
      return segments;
    }

    // Parse keywords, strings, and other elements
    const tokens = tokenizeLine(remainingLine);
    tokens.forEach((token, tokenIndex) => {
      segments.push(
        <Text
          key={`token-${currentIndex}-${tokenIndex}`}
          style={getTokenStyle(token)}
        >
          {token.value}
        </Text>,
      );
    });

    return segments;
  };

  const tokenizeLine = (line: string): Token[] => {
    const tokens: Token[] = [];
    const keywords = [
      "def",
      "if",
      "else",
      "elif",
      "for",
      "while",
      "return",
      "import",
      "from",
      "class",
      "try",
      "except",
      "finally",
      "with",
      "as",
      "in",
      "not",
      "and",
      "or",
    ];
    const builtins = [
      "enumerate",
      "len",
      "range",
      "str",
      "int",
      "float",
      "list",
      "dict",
      "set",
      "tuple",
      "print",
      "input",
    ];

    let currentToken = "";
    let inString = false;
    let stringChar = "";
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (!inString && (char === '"' || char === "'")) {
        if (currentToken) {
          tokens.push({ type: "default", value: currentToken });
          currentToken = "";
        }
        inString = true;
        stringChar = char;
        currentToken = char;
      } else if (inString && char === stringChar) {
        currentToken += char;
        tokens.push({ type: "string", value: currentToken });
        currentToken = "";
        inString = false;
        stringChar = "";
      } else if (inString) {
        currentToken += char;
      } else if (/\s/.test(char)) {
        if (currentToken) {
          const tokenType = getTokenType(currentToken, keywords, builtins);
          tokens.push({ type: tokenType, value: currentToken });
          currentToken = "";
        }
        tokens.push({ type: "whitespace", value: char });
      } else if (/[(){}[\],.:=+\-*/<>!]/.test(char)) {
        if (currentToken) {
          const tokenType = getTokenType(currentToken, keywords, builtins);
          tokens.push({ type: tokenType, value: currentToken });
          currentToken = "";
        }
        tokens.push({ type: "operator", value: char });
      } else {
        currentToken += char;
      }

      i++;
    }

    if (currentToken) {
      const tokenType = inString
        ? "string"
        : getTokenType(currentToken, keywords, builtins);
      tokens.push({ type: tokenType, value: currentToken });
    }

    return tokens;
  };

  const getTokenType = (
    token: string,
    keywords: string[],
    builtins: string[],
  ): string => {
    if (keywords.includes(token)) return "keyword";
    if (builtins.includes(token)) return "builtin";
    if (/^\d+$/.test(token)) return "number";
    return "default";
  };

  const getTokenStyle = (token: Token) => {
    switch (token.type) {
      case "keyword":
        return styles.keyword;
      case "string":
        return styles.string;
      case "comment":
        return styles.comment;
      case "number":
        return styles.number;
      case "builtin":
        return styles.builtin;
      case "operator":
        return styles.operator;
      case "whitespace":
        return styles.whitespace;
      default:
        return styles.defaultText;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ scale: containerScale }],
          // shadowOpacity removed - will use static shadow from styles
        },
      ]}
    >
      <Animated.Text
        style={[
          styles.title,
          {
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        {title}
      </Animated.Text>

      <Animated.View
        style={{
          transform: [{ translateY: codeTranslateY }],
        }}
      >
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          style={styles.codeContainer}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.codeWrapper}>{formatCode(code)}</View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#374151", // gray-700
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  codeContainer: {
    backgroundColor: "#4B5563", // gray-600
    borderRadius: 6,
  },
  scrollContentContainer: {
    paddingHorizontal: 0, // Remove horizontal padding from scroll container
    paddingVertical: 0, // Remove vertical padding from scroll container
  },
  codeWrapper: {
    paddingLeft: 0, // Minimal left padding - just 4px
    paddingRight: 8, // Small right padding for readability
    paddingVertical: 8, // Keep some vertical padding
  },
  codeLine: {
    fontSize: 13, // Increased from 10 to 12 for better readability
    lineHeight: 16, // Increased line height proportionally
    color: "#FFFFFF",
    fontFamily: "monospace",
    textAlign: "left",
    includeFontPadding: false,
    paddingLeft: 0, // Ensure no additional left padding
    marginLeft: 0, // Ensure no left margin
  },
  indent: {
    color: "transparent",
  },
  keyword: {
    color: "#F59E0B", // amber-500 - for def, if, return, etc.
    fontWeight: "600",
  },
  string: {
    color: "#10B981", // emerald-500 - for strings
  },
  comment: {
    color: "#9CA3AF", // gray-400 - for comments
    fontStyle: "italic",
  },
  docstring: {
    color: "#9CA3AF", // gray-400 - for docstrings
    fontStyle: "italic",
  },
  number: {
    color: "#F472B6", // pink-400 - for numbers
  },
  builtin: {
    color: "#60A5FA", // blue-400 - for built-in functions
  },
  operator: {
    color: "#FBBF24", // amber-400 - for operators
  },
  whitespace: {
    color: "transparent",
  },
  defaultText: {
    color: "#FFFFFF",
  },
});

export default CodeBlock;
