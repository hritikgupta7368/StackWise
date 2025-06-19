import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface HorizontalSelectProps {
  data: string[];
  onSelect: (value: string) => void;
  defaultSelected?: string;
  borderRadius?: number;
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  label?: string;
}

const HorizontalSelect = ({
  data,
  onSelect,
  defaultSelected,
  borderRadius = 20,
  containerStyle,
  tabStyle,
  tabTextStyle,
  label = "Topic",
}: HorizontalSelectProps) => {
  const [selected, setSelected] = useState(defaultSelected || data[0]);

  const handleSelect = (item: string) => {
    setSelected(item);
    onSelect(item);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.tab,
        tabStyle,
        { borderRadius },
        selected === item && styles.tabSelected,
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text
        style={[
          styles.tabText,
          tabTextStyle,
          selected === item && styles.tabTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

export default HorizontalSelect;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  tabSelected: {
    backgroundColor: "#4f46e5",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  tabTextSelected: {
    color: "#fff",
  },
});
s;
