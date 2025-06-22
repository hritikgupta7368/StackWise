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
    id: "lang-kotlin",
    categoryId: "cat-1", // Belongs to Programming Languages
    name: "Kotlin",
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
  {
    id: "sec-ssl",
    categoryId: "cat-8", // Belongs to Security
    name: "SSL/TLS",
    description:
      "Secure Socket Layer/Transport Layer Security protocols for encrypting data.",
  },
  {
    id: "sec-owasp",
    categoryId: "cat-8", // Belongs to Security
    name: "OWASP",
    description:
      "Open Web Application Security Project guidelines for secure software development.",
  },
  {
    id: "sec-crypto",
    categoryId: "cat-8", // Belongs to Security
    name: "Cryptography",
    description:
      "The study of techniques for secure communication in the presence of adversaries.",
  },
  {
    id: "sec-privacy",
    categoryId: "cat-8", // Belongs to Security
    name: "Privacy",
    description:
      "The protection of personal information and data from unauthorized access.",
  },
];
