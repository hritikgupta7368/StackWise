import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { theme } from "../theme";

interface HorizontalSelectProps {
  data: string[];
  onSelect: (value: string) => void;
  defaultSelected?: string;

  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  label?: string;
  mandatory?: boolean;
}

const HorizontalSelect = ({ data, onSelect, defaultSelected, containerStyle, tabStyle, tabTextStyle, label = "Topic", mandatory = false }: HorizontalSelectProps) => {
  const [selected, setSelected] = useState(defaultSelected || data[0]);

  const handleSelect = (item: string) => {
    setSelected(item);
    onSelect(item);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={[styles.tab, tabStyle, selected === item && styles.tabSelected]} onPress={() => handleSelect(item)}>
      <Text style={[styles.title, tabTextStyle, selected === item && styles.tabTextSelected]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {/* label */}
      <View style={styles.labelContainer}>
        {label.length > 0 && (
          <Text style={styles.label}>
            {label} {mandatory && <Text style={styles.mandatory}>*</Text>}
          </Text>
        )}
      </View>
      <FlatList data={data} horizontal keyExtractor={(item) => item} renderItem={renderItem} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillContainer} />
    </View>
  );
};

export default HorizontalSelect;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginBottom: 24,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontFamily: "body",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22.4,
    color: theme.textInput.color,
    letterSpacing: 0,
    textAlignVertical: "center",
  },
  mandatory: {
    color: theme.textInput.mandatory,
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 22.4,
    letterSpacing: 0,
    textAlignVertical: "center",
  },
  pillContainer: {},
  tab: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
    borderColor: theme.textInput.borderColor,
  },
  tabSelected: {
    borderColor: "#4A2BE4",
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    color: "#BDBDBD",
    textAlignVertical: "center",
    lineHeight: 19.2,
    letterSpacing: 0,
  },
  tabTextSelected: {
    color: "#4A2BE4",
  },
});
