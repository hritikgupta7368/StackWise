// data/mock/dummyCoreTopics.ts
import { CoreTopic } from "../../types/types"; // Adjust path

export const dummyCoreTopics: CoreTopic[] = [
  {
    id: "lang-py",
    categoryId: "cat-1", // Belongs to Programming Languages
    name: "Python",
    description:
      "A versatile, high-level programming language known for its readability and vast libraries.",
  },
  {
    id: "lang-js",
    categoryId: "cat-1", // Belongs to Programming Languages
    name: "JavaScript",
    description:
      "The programming language for the web, enabling interactive and dynamic content.",
  },
  {
    id: "frame-rn",
    categoryId: "cat-2", // Belongs to Web Frameworks
    name: "React Native",
    description:
      "A JavaScript framework for building native mobile applications.",
  },
  {
    id: "mob-kotlin",
    categoryId: "cat-3", // Belongs to Mobile Development
    name: "Kotlin",
    description:
      "A modern, concise, and safe programming language for Android development.",
  },
];
