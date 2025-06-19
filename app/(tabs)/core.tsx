import { View, Text, StyleSheet } from "react-native";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import CategoryAccordion from "@/components/Preview/nestedList";

const categoryData = [
  {
    id: "Languages",
    items: [
      { id: "Python", route: "/core/python" },
      { id: "Java", route: "/core/java" },
      { id: "C", route: "/core/c" },
    ],
  },
  {
    id: "Databases",
    items: [
      { id: "MySQL", route: "/core/mysql" },
      { id: "PostgreSQL", route: "/core/postgres" },
    ],
  },
];

export default function Core() {
  return (
    <BackgroundWrapper>
      {/* header */}
      <View style={styles.container}>
        <Text>core Subjects</Text>
        <Text>add icons</Text>
      </View>
      <CategoryAccordion data={categoryData} />;
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
  },
  scroll: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
  },
});
