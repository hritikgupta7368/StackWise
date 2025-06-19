// data/mock/dummyInterviewQuestions.ts
import { InterviewQuestion } from "../../types/types"; // Adjust path

export const dummyInterviewQuestions: InterviewQuestion[] = [
  {
    id: "iq-001",
    question: "Explain the difference between SQL and NoSQL databases.",
    answer: [
      {
        type: "paragraph",
        value:
          "SQL databases are relational, using structured query language and a predefined schema. They are vertically scalable and best for complex queries and ACID compliance.",
      },
      {
        type: "paragraph",
        value:
          "NoSQL databases are non-relational, providing flexible schemas, horizontal scalability, and are suitable for large volumes of unstructured data. They come in various types like document, key-value, column-family, and graph.",
      },
      {
        type: "list",
        value: [
          "**SQL:** Relational, rigid schema, vertical scaling, ACID properties, good for complex joins.",
          "**NoSQL:** Non-relational, dynamic schema, horizontal scaling, BASE properties, good for big data/high traffic.",
        ],
      },
    ],
  },
  {
    id: "iq-002",
    question: "What is a RESTful API? What are its key principles?",
    answer: [
      {
        type: "paragraph",
        value:
          "A RESTful API (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication model and uses standard HTTP methods.",
      },
      {
        type: "paragraph",
        value: "Key principles include:",
      },
      {
        type: "list",
        value: [
          "**Stateless:** Each request from client to server must contain all the information needed to understand the request.",
          "**Client-Server:** Separation of concerns, client handles UI, server handles data storage and processing.",
          "**Cacheable:** Responses must explicitly or implicitly define themselves as cacheable or non-cacheable.",
          "**Layered System:** A client cannot ordinarily tell whether it is connected directly to the end server, or to an intermediary.",
          "**Uniform Interface:** Simplifies and decouples the architecture, allowing each part to evolve independently.",
          "**Code on Demand (Optional):** Servers can temporarily extend or customize the functionality of a client by transferring executable code.",
        ],
      },
    ],
  },
  {
    id: "iq-003",
    question: "Describe the concept of 'hoisting' in JavaScript.",
    answer: [
      {
        type: "paragraph",
        value:
          "Hoisting is a JavaScript mechanism where variable and function declarations are moved to the top of their containing scope during the compilation phase, before code execution. This means you can use variables and functions before they are declared in the code.",
      },
      {
        type: "code",
        value: `console.log(myVar); // Outputs: undefined
var myVar = 10;

myFunction(); // Outputs: "Hello from function!"
function myFunction() {
  console.log("Hello from function!");
}`,
        language: "javascript",
      },
      {
        type: "paragraph",
        value:
          "It's important to note that only declarations are hoisted, not initializations. For `let` and `const`, they are also hoisted but are in a 'temporal dead zone' until their declaration, leading to a `ReferenceError` if accessed before initialization.",
      },
    ],
  },
];
