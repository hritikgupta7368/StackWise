import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { TrashIcon, OptionsVerticalIcon } from "../ui/icons";

interface ActionSheetOption {
  id: string;
  title: string;
  icon: "trash" | "edit";
  color?: string;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
  options: ActionSheetOption[];
}

const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  onSelect,
  options,
}) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleOptionPress = (optionId: string) => {
    onSelect(optionId);
  };

  const renderIcon = (iconType: string, color: string) => {
    switch (iconType) {
      case "trash":
        return <TrashIcon size={20} color={color} />;
      case "edit":
        return <OptionsVerticalIcon size={20} color={color} />;
      default:
        return null;
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}
        >
          <Pressable style={styles.backdropPress} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>Choose Action</Text>

          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <Pressable
                key={option.id}
                style={styles.option}
                onPress={() => handleOptionPress(option.id)}
                android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
              >
                <View style={styles.optionContent}>
                  {renderIcon(option.icon, option.color || "#ffffff")}
                  <Text
                    style={[
                      styles.optionText,
                      { color: option.color || "#ffffff" },
                    ]}
                  >
                    {option.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropPress: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#2d2d30",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area
    minHeight: 200,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#3a3a3c",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ActionSheet;
