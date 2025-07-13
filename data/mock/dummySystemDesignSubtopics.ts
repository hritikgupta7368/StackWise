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
        value: "Load balancers come in various forms, each with specific use cases and advantages. They can operate at different layers of the OSI model.",
      },
      {
        type: "paragraph",
        value: "Layer 4 (Transport Layer) distributes client requests based on IP address and port. It is simple and fast. Layer 7 (Application Layer) distributes requests based on application-level data such as HTTP headers or URL paths, offering more intelligent and flexible routing. Hardware load balancers are dedicated physical devices that offer high performance but can be expensive. In contrast, software load balancers run on commodity servers or virtual machines, making them more flexible and cost-effective. Finally, DNS-based load balancers distribute traffic by returning different IP addresses in response to DNS queries.",
      },
      {
        type: "image",
        value: ["systemdesign/load_balancer_types.png"],
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
        type: "paragraph",
        value: "**Round Robin:** Distributes requests sequentially to each server in a list.Weighted Round Robin:** Servers with higher weights receive more requests.**Least Connections:** Directs traffic to the server with the fewest active connections.**Least Response Time:** Directs traffic to the server with the fewest active connections and the fastest average response time.**IP Hash:** Uses a hash of the client's IP address to determine the server, ensuring client always connects to the same server.",
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
        value: "Understanding the trade-offs between monolithic and microservices architectures is crucial for system design.",
      },
      {
        type: "paragraph",
        value: "Monolithic architecture is a single, tightly coupled application that is easier to deploy initially but difficult to scale specific parts and slower development at scale. Microservices architecture is a collection of small, loosely coupled services that offer independent deployment, better scalability, but complex to manage and operate.",
      },
    ],
  },
];
