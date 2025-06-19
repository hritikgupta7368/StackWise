// data/mock/dummySystemDesignSubtopics.ts
import { SystemDesignSubtopic } from "../../types/types"; // Adjust path

export const dummySystemDesignSubtopics: SystemDesignSubtopic[] = [
  // --- Load Balancing Subtopics ---
  {
    id: "sd-sub-101",
    topicId: "sd-topic-1", // Load Balancing
    title: "Types of Load Balancers",
    content: [
      {
        type: "paragraph",
        value:
          "Load balancers come in various forms, each with specific use cases and advantages. They can operate at different layers of the OSI model.",
      },
      {
        type: "list",
        value: [
          "**Layer 4 (Transport Layer):** Distributes client requests based on IP address and port. Simple and fast.",
          "**Layer 7 (Application Layer):** Distributes requests based on application-level data (e.g., HTTP headers, URL paths). More intelligent and flexible.",
          "**Hardware Load Balancers:** Dedicated physical devices, high performance but costly.",
          "**Software Load Balancers:** Runs on commodity servers or VMs, flexible and cost-effective.",
          "**DNS-based Load Balancers:** Distributes traffic by returning different IP addresses for DNS queries.",
        ],
      },
      {
        type: "image",
        value: "systemdesign/load_balancer_types.png",
        alt: "Diagram illustrating different types of load balancers",
      },
    ],
  },
  {
    id: "sd-sub-102",
    topicId: "sd-topic-1", // Load Balancing
    title: "Load Balancing Algorithms",
    content: [
      {
        type: "paragraph",
        value: "Algorithms determine how traffic is distributed among servers.",
      },
      {
        type: "list",
        value: [
          "**Round Robin:** Distributes requests sequentially to each server in a list.",
          "**Weighted Round Robin:** Servers with higher weights receive more requests.",
          "**Least Connections:** Directs traffic to the server with the fewest active connections.",
          "**Least Response Time:** Directs traffic to the server with the fewest active connections and the fastest average response time.",
          "**IP Hash:** Uses a hash of the client's IP address to determine the server, ensuring client always connects to the same server.",
        ],
      },
    ],
  },
  // --- Microservices Architecture Subtopics ---
  {
    id: "sd-sub-201",
    topicId: "sd-topic-2", // Microservices Architecture
    title: "Monolithic vs. Microservices",
    content: [
      {
        type: "paragraph",
        value:
          "Understanding the trade-offs between monolithic and microservices architectures is crucial for system design.",
      },
      {
        type: "list",
        value: [
          "**Monolithic:** Single, tightly coupled application. Easier to deploy initially, but difficult to scale specific parts and slower development at scale.",
          "**Microservices:** Collection of small, loosely coupled services. Independent deployment, better scalability, but complex to manage and operate.",
        ],
      },
    ],
  },
];
