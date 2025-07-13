import React from "react";
import { Dimensions } from "react-native";
import {} from "react-native-reanimated-dnd";

// Grid config
const GRID_COLUMNS = 2;
const GRID_PADDING = 8;
const GRID_GAP = 8;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const UNIT_SIZE = (SCREEN_WIDTH - 2 * GRID_PADDING - (GRID_COLUMNS - 1) * GRID_GAP) / GRID_COLUMNS;

export default function GridContainer({ widgets, setWidgets, deleteMode = false, renderWidget }) {
  // Each widget must have a unique key or id
  const keyExtractor = (item) => item.id;

  // Default render if no renderWidget provided
  const defaultRenderWidget = ({ item }) => <WidgetBox w={item.w} h={item.h} color={item.color} />;

  return (
    <DndDraggableFlatList
      data={widgets}
      onDragEnd={({ data }) => setWidgets(data)}
      keyExtractor={keyExtractor}
      numColumns={GRID_COLUMNS}
      activationDistance={deleteMode ? 1 : 10000} // Drag only in deleteMode
      isDragEnabled={deleteMode}
      containerStyle={{
        padding: GRID_PADDING,
      }}
      showsVerticalScrollIndicator={false}
      renderItem={renderWidget ? (params) => renderWidget(params, UNIT_SIZE) : (params) => defaultRenderWidget({ ...params, UNIT_SIZE })}
      itemSpacing={GRID_GAP}
      columnSpacing={GRID_GAP}
      // If you want to customize scrolling, pass scrollEnabled={true}
    />
  );
}

// Simple colored box for default render
function WidgetBox({ w, h, color }) {
  return (
    <div
      style={{
        width: UNIT_SIZE * w + (w - 1) * GRID_GAP,
        height: UNIT_SIZE * h + (h - 1) * GRID_GAP,
        backgroundColor: color,
        borderRadius: 10,
        marginBottom: GRID_GAP,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    />
  );
}
