import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

// ✅ Tree-shakable icon imports
import Ionicons from "@expo/vector-icons/build/Ionicons";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/build/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";
import Fontisto from "@expo/vector-icons/build/Fontisto";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import Feather from "@expo/vector-icons/build/Feather";

// === Props ===
type IconProps = {
  size?: number;
  color?: string;
  onPress?: () => void;
  isPressable?: boolean;
  showBackground?: boolean;
  backgroundColor?: string;
};

// === Defaults ===
const defaultSize = 20;
const defaultColor = "#868482";
const defaultBackground = "#1e1c1a";

// === Icon Wrapper ===
const IconContainer = ({ children, onPress, isPressable = true, showBackground = false, backgroundColor = defaultBackground, size = defaultSize + 12 }: { children: React.ReactNode; onPress?: () => void; isPressable?: boolean; showBackground?: boolean; backgroundColor?: string; size?: number }) => {
  const style: ViewStyle = {
    width: size,
    height: size,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: showBackground ? backgroundColor : "transparent",
  };

  if (isPressable && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={style}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{children}</View>;
};

// === Icon Factory ===
const createIcon = (IconComponent: any, iconName: string, defaultIconColor?: string) =>
  React.memo(({ size = defaultSize, color = defaultIconColor ?? defaultColor, onPress, isPressable = true, showBackground = false, backgroundColor }: IconProps) => (
    <IconContainer size={size + 12} onPress={onPress} isPressable={isPressable} showBackground={showBackground} backgroundColor={backgroundColor}>
      <IconComponent name={iconName} size={size} color={color} />
    </IconContainer>
  ));

// === Exported Icons ===
export const BlankCheckBoxIcon = createIcon(MaterialIcons, "check-box-outline-blank");
export const CheckedCheckBoxIcon = createIcon(MaterialIcons, "check-box");
export const OptionsVerticalIcon = createIcon(SimpleLineIcons, "options-vertical");
export const ExpandIcon = createIcon(Ionicons, "chevron-down");
export const CollapseIcon = createIcon(Ionicons, "chevron-up");
export const CloseIcon = createIcon(Ionicons, "close");
export const SettingsIcon = createIcon(Ionicons, "settings");
export const BackIcon = createIcon(Ionicons, "arrow-back");
export const FileIcon = createIcon(Ionicons, "document");
export const ShareIcon = createIcon(Ionicons, "share-social", "#4f46e5");
export const CheckIcon = createIcon(Ionicons, "checkmark-circle", "#10b981");
export const WarningIcon = createIcon(Ionicons, "alert", "#fbbf24");
export const AddIcon = createIcon(Ionicons, "add-circle", "#4f46e5");
export const TrashIcon = createIcon(Ionicons, "trash-outline", "#f43f5e");
export const MenuUnfoldIcon = createIcon(AntDesign, "menuunfold", "#4f46e5");
export const BookmarkIcon = createIcon(Ionicons, "bookmark-outline", "#4f46e5");
export const CameraIcon = createIcon(Ionicons, "camera-sharp", "#4f46e5");
export const EditIcon = createIcon(FontAwesome, "edit", "#4f46e5");
export const CautionIcon = createIcon(FontAwesome5, "exclamation", "#4f46e5");
export const RainbowIcon = createIcon(Fontisto, "rainbow", "#4f46e5");
export const PersonIcon = createIcon(FontAwesome5, "running", "#4f46e5");
export const FireIcon = createIcon(FontAwesome6, "fire", "orange");
export const ArrowUpRightIcon = createIcon(Feather, "arrow-up-right", "white");
