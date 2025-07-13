// data/mock/dummySystemDesignTopics.ts
import { SystemDesignTopic } from "../../types/types"; // Adjust path

export const dummySystemDesignTopics: SystemDesignTopic[] = [
  {
    id: "sd-topic-1",
    categoryId: "sd-cat-1", // Belongs to Scalability Concepts
    name: "Load Balancing",
  },
  {
    id: "sd-topic-2",
    categoryId: "sd-cat-1", // Belongs to Scalability Concepts
    name: "Microservices Architecture",
  },
  {
    id: "sd-topic-3",
    categoryId: "sd-cat-2", // Belongs to Database Design
    name: "Database Sharding",
  },
];
