// data/mock/dummyCoreTopics.ts
import { CoreTopic } from "../../types/types"; // Adjust path

export const dummyCoreTopics: CoreTopic[] = [
  {
    id: "lang-py",
    categoryId: "cat-1", // Belongs to Programming Languages
    name: "Python",
  },
  {
    id: "lang-js",
    categoryId: "cat-1", // Belongs to Programming Languages
    name: "JavaScript",
  },
  {
    id: "lang-kotlin",
    categoryId: "cat-1", // Belongs to Programming Languages
    name: "Kotlin",
  },
  {
    id: "frame-rn",
    categoryId: "cat-2", // Belongs to Web Frameworks
    name: "React Native",
  },
  {
    id: "mob-kotlin",
    categoryId: "cat-3", // Belongs to Mobile Development
    name: "Kotlin",
  },
  {
    id: "sec-ssl",
    categoryId: "cat-8", // Belongs to Security
    name: "SSL/TLS",
  },
  {
    id: "sec-owasp",
    categoryId: "cat-8", // Belongs to Security
    name: "OWASP",
  },
  {
    id: "sec-crypto",
    categoryId: "cat-8", // Belongs to Security
    name: "Cryptography",
  },
  {
    id: "sec-privacy",
    categoryId: "cat-8", // Belongs to Security
    name: "Privacy",
  },
];
