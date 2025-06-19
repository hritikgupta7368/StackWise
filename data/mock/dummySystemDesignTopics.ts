// data/mock/dummySystemDesignTopics.ts
import { SystemDesignTopic } from "../../types/types"; // Adjust path

export const dummySystemDesignTopics: SystemDesignTopic[] = [
  {
    id: "sd-topic-1",
    categoryId: "sd-cat-1", // Belongs to Scalability Concepts
    name: "Load Balancing",
    description:
      "Distributing network traffic across multiple servers to ensure no single server is overloaded.",
  },
  {
    id: "sd-topic-2",
    categoryId: "sd-cat-1", // Belongs to Scalability Concepts
    name: "Microservices Architecture",
    description:
      "Designing software as a suite of small, independently deployable services.",
  },
  {
    id: "sd-topic-3",
    categoryId: "sd-cat-2", // Belongs to Database Design
    name: "Database Sharding",
    description:
      "Horizontal partitioning of database to distribute data across multiple machines.",
  },
];
