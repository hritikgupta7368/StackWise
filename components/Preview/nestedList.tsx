import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CategoryAccordion = ({ data }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const router = useRouter();

  const toggleAccordion = (categoryId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleItemPress = (route) => {
    router.push(route);
  };

  const renderAccordionItem = (category, index) => {
    const isExpanded = expandedItems[category.id];
    const isFirst = index === 0;
    const isLast = index === data.length - 1;

    return (
      <View key={category.id} style={styles.accordionItem}>
        {/* Header */}
        <TouchableOpacity
          style={[
            styles.accordionHeader,
            isFirst && styles.firstHeader,
            isLast && !isExpanded && styles.lastHeader,
            isExpanded && styles.expandedHeader,
          ]}
          onPress={() => toggleAccordion(category.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.headerText}>{category.id}</Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        {/* Content */}
        {isExpanded && (
          <View style={[styles.accordionContent, isLast && styles.lastContent]}>
            {category.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.contentItem,
                  itemIndex === category.items.length - 1 &&
                    styles.lastContentItem,
                ]}
                onPress={() => handleItemPress(item.route)}
                activeOpacity={0.6}
              >
                <Text style={styles.contentText}>{item.id}</Text>
                <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {data.map((category, index) => renderAccordionItem(category, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00000088",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    width: "90%",
    alignSelf: "center",
  },
  accordionItem: {
    backgroundColor: "#FFFFFF",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1f1f1f",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    minHeight: 64,
  },
  firstHeader: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastHeader: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  expandedHeader: {
    backgroundColor: "#DBEAFE",
    borderBottomColor: "#E5E7EB",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    flex: 1,
  },
  accordionContent: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  lastContent: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  contentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  lastContentItem: {
    borderBottomWidth: 0,
  },
  contentText: {
    fontSize: 15,
    color: "#6B7280",
    flex: 1,
  },
});

// Example usage component

export default CategoryAccordion;
