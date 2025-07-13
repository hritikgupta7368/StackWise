import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useAppStore } from "@/store/useStore";
import { importAppData, exportAppData, getDataSize } from "@/utils/dataExportImport";
import { useOverlayStore } from "@/store/useOverlayStore";
import Header from "@/components/common/NewHeader";
import AnimatedButton from "@/components/common/button";

type SettingsItemBase = {
  label: string;
  description?: string;
  danger?: boolean;
};

type ActionItem = SettingsItemBase & {
  type: "action";
  onPress: () => void;
  trailingValue?: string; // e.g., "4.3 MB"
};

type OptionItem = SettingsItemBase & {
  type: "option";
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

type SettingsItem = ActionItem | OptionItem;

type SettingsSection = {
  title?: string;
  items: SettingsItem[];
};

const Settings = () => {
  const importData = useAppStore((state) => state.importData);
  const clearAllData = useAppStore((state) => state.clearAllData);
  const { showDialogModal, showToast } = useOverlayStore(); // Assuming this exists in your store
  const [engineMode, setEngineMode] = useState("adaptive");
  const store = useAppStore();
  const today = new Date().toISOString().slice(0, 10);

  const handleExport = () => {
    showDialogModal({
      type: "default",
      title: "Export Data",
      content: (
        <View>
          <Text style={styles.modalTitle}>Export Data </Text>
          <Text style={styles.modalText}>This will export all your app data to a file. Are you sure you want to continue?</Text>
          <AnimatedButton
            title="Proceed"
            backgroundColor="red"
            onPress={async () => {
              const success = await exportAppData();

              if (success) {
                Alert.alert("Success", "Data exported successfully!");
              } else {
                throw new Error("Export failed");
              }
            }}
          />
        </View>
      ),
    });
  };

  const handleImport = () => {
    showDialogModal({
      type: "warning",
      content: (
        <View>
          <Text style={styles.modalTitle}>Import Data</Text>
          <Text style={styles.modalText}>This will replace all current data with imported data. This action cannot be undone. Are you sure?</Text>
          <AnimatedButton
            title="Proceed"
            backgroundColor="red"
            onPress={async () => {
              const importedState = await importAppData();
              if (importedState) {
                importData(importedState);
                Alert.alert("Success", "Data imported successfully!");
              } else {
                throw new Error("Import failed or cancelled");
              }
            }}
          />
        </View>
      ),
    });
  };

  const handleClearData = () => {
    showDialogModal({
      type: "warning",
      content: (
        <View>
          <Text style={[styles.modalTitle, { color: "#FF4C4C" }]}>Clear All Data</Text>
          <Text style={styles.modalText}>This will permanently delete all your app data. This action cannot be undone. Are you absolutely sure?</Text>
          <AnimatedButton
            title="Proceed"
            backgroundColor="red"
            onPress={async () => {
              clearAllData();
              Alert.alert("Success", "All data cleared successfully!");
            }}
          />
        </View>
      ),
    });
  };

  // Settings data
  const sections: SettingsSection[] = [
    {
      title: "Goal Engine Settings",
      items: [
        {
          type: "option",
          label: "Engine Mode",
          description: "Choose how the engine generates daily goals",
          value: store.goal?.userConfig?.mode,
          options: ["Light", "Normal", "Boost"],
          onChange: (val) => store.updateUserConfig({ mode: val }),
        },
      ],
    },
    {
      title: "Goal Engine (Experimental)",
      items: [
        {
          type: "action",
          label: "Hourly Update",
          onPress: () => store.runHourlyUpdate(today),
          description: "Run hourly analytics and update progress tracking",
        },
        {
          type: "action",
          label: "Generate Goals",
          onPress: () => store.generateGoalsFromEngine,
          description: "Manually trigger goal generation",
        },
        {
          type: "action",
          label: "Evaluate Mode",
          onPress: () => store.evaluateAndUpdateMode,
          description: "Evaluate if engine mode needs switching",
        },
        {
          type: "action",
          label: "Restructure Goals",
          onPress: () => store.restructureFutureGoals,
          description: "Rebuild future plan based on updated metrics",
        },
        {
          type: "action",
          label: "Update Time Patterns",
          onPress: () => store.updateTimePatterns,
          description: "Refresh your behavior patterns and active hours",
        },
        {
          type: "action",
          label: "Refresh Memory",
          onPress: () => store.refreshMemory,
          description: "Reload memory used for engine decisions",
        },
        {
          type: "action",
          label: "Refresh Metrics",
          onPress: () => store.refreshMetrics,
          description: "Force recomputation of current goal metrics",
        },
        {
          type: "action",
          label: "Refresh Schedule",
          onPress: () => {},
          description: "Recalculate daily time allocation for goals (empty)",
        },
        {
          type: "action",
          label: "Update Forecast",
          onPress: () => store.updateForecast,
          description: "Update learning forecast based on progress",
        },
        {
          type: "action",
          label: "Generate Schedule for Today",
          onPress: () => {},
          description: "Generate today's optimal task schedule(empty)",
        },
      ],
    },
    {
      title: "Data Settings",
      items: [
        {
          type: "action",
          label: "Import Data",
          onPress: handleImport,
          description: "Load saved backup from storage",
        },
        {
          type: "action",
          label: "Export Data",
          onPress: handleExport,
          trailingValue: getDataSize(), // Shows "4.2MB"
          description: "Backup current progress",
        },
      ],
    },

    {
      title: "Reset Settings",
      items: [{ type: "action", label: "Clear All Data", onPress: handleClearData, danger: true, description: "Delete all data and start fresh" }],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <Header title="Settings" leftIcon="back" rightIcon="none" theme="dark" backgroundColor="#121212" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

            {section.items.map((item, idx) => {
              const isLast = idx === section.items.length - 1;
              const baseStyle = [styles.item, item.danger && styles.dangerItem, isLast && { borderBottomWidth: 0 }];

              return (
                <View key={idx}>
                  {/* Action */}
                  {item.type === "action" && (
                    <TouchableOpacity onPress={item.onPress} style={baseStyle}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={[styles.itemText, item.danger && { color: "#FF4C4C" }]}>{item.label}</Text>
                        {item.trailingValue && <Text style={{ color: "#888", fontSize: 14 }}>{item.trailingValue}</Text>}
                      </View>
                      {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
                    </TouchableOpacity>
                  )}

                  {/* Option */}
                  {item.type === "option" && (
                    <View style={baseStyle}>
                      <Text style={styles.itemText}>{item.label}</Text>
                      {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          marginTop: 8,
                        }}
                      >
                        {item.options.map((opt, optIdx) => (
                          <TouchableOpacity
                            key={optIdx}
                            onPress={() => item.onChange(opt)}
                            style={{
                              backgroundColor: opt === item.value ? "#3b85de" : "#2a2a2a",
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              borderRadius: 8,
                              marginRight: 8,
                              marginBottom: 8,
                            }}
                          >
                            <Text style={{ color: "#fff", fontSize: 14 }}>{opt}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  section: {
    marginBottom: 32,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#A1A1A1",
    marginBottom: 8,
    marginLeft: 12,
    fontWeight: "500",
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: "#2A2A2A",
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#EAEAEA",
  },
  dangerItem: {
    backgroundColor: "#2a1a1a",
    borderRadius: 8,
    marginTop: 8,
    borderBottomWidth: 0,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#EAEAEA",
    textAlign: "center",
    lineHeight: 22,
  },
  itemDescription: {
    fontSize: 13,
    color: "#A1A1A1",
    marginTop: 4,
    lineHeight: 18,
  },
});
