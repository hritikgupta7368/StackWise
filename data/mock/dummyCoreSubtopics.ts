// data/mock/dummyCoreSubtopics.ts
import { CoreSubtopic } from "../../types/types"; // Adjust path

export const dummyCoreSubtopics: CoreSubtopic[] = [
  // --- Python Subtopics (lang-py) ---
  {
    id: "py-sub-001",
    topicId: "lang-py", // Belongs to Python
    title: "Variables and Data Types",
    content: [
      {
        type: "paragraph",
        value: `Variables are used to store data in computer programs.\n Python supports various data types including numbers, strings, lists, tuples, dictionaries, and sets.`,
      },
      {
        type: "code",
        value: `name = "Alice" # String
age = 30      # Integer
height = 5.9  # Float
is_student = True # Boolean
my_list = [1, 2, 3] # List`,
        language: "python",
      },
    ],
  },
  {
    id: "py-sub-002",
    topicId: "lang-py", // Belongs to Python
    title: "Control Flow (If/Else, Loops)",
    content: [
      {
        type: "paragraph",
        value:
          "Control flow statements determine the order in which code is executed. Key constructs include conditional statements (`if`, `elif`, `else`) and loops (`for`, `while`).",
      },
      {
        type: "code",
        value: `temperature = 25
if temperature > 30:
    print("It's hot!")
elif temperature > 20:
    print("It's pleasant.")
else:
    print("It's cool.")

# For loop example
for i in range(3):
    print(f"Iteration {i}")

# While loop example
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1`,
        language: "python",
      },
    ],
  },

  // --- React Native Subtopics (frame-rn) ---
  {
    id: "rn-sub-001",
    topicId: "frame-rn", // Belongs to React Native
    title: "Core Components",
    content: [
      {
        type: "paragraph",
        value:
          "React Native provides a set of core components that map directly to native UI elements, allowing you to build native-like user interfaces. Essential components include `View`, `Text`, `Image`, `TextInput`, and `ScrollView`.",
      },
      {
        type: "code",
        value: `import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello React Native!</Text>
      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.logo}
      />
      <Text>This is a paragraph of text.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default MyComponent;`,
        language: "jsx", // For React Native/JSX code
      },
      {
        type: "list",
        value: [
          "**View:** The most fundamental UI building block, similar to a `div` in web.",
          "**Text:** For displaying text.",
          "**Image:** For displaying various types of images.",
          "**TextInput:** For accepting user input.",
          "**ScrollView:** For scrollable content.",
          "**FlatList/SectionList:** For efficient rendering of long lists.",
        ],
      },
    ],
  },
  {
    id: "rn-sub-002",
    topicId: "frame-rn", // Belongs to React Native
    title: "State Management with Hooks",
    content: [
      {
        type: "paragraph",
        value:
          "React Hooks, like `useState` and `useEffect`, allow functional components to manage state and side effects. They are the cornerstone of modern React Native development.",
      },
      {
        type: "code",
        value: `import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
    </View>
  );
};

export default Counter;`,
        language: "jsx",
      },
    ],
  },
];
