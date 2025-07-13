import React, { useState } from "react";
import { View, TextInput, Image, Pressable, Text, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type InputType = "paragraph" | "code" | "image";

type Props = {
  type: InputType;
  onChange: (value: string[] | null) => void;
  value: string | string[] | null;
  placeholder?: string;
  colors?: {
    background?: string;
    text?: string;
    placeholder?: string;
    border?: string;
  };
};

// ✅ Exported complete Image Input Component
type ImageInputProps = {
  onChange: (value: string[] | null) => void;
  value: string[] | null;
  placeholder?: string;
  label?: string;
  colors?: {
    background?: string;
    placeholder?: string;
    border?: string;
    label?: string;
  };
  height?: number;
  width?: string | number;
};

export function ImageInput({ onChange, value, placeholder = "Tap to select up to 4 images", label, colors = {}, height = 180, width = "100%" }: ImageInputProps) {
  const [loading, setLoading] = useState(false);

  const bgColor = colors.background ?? "#1f1f1f";
  const placeholderColor = colors.placeholder ?? "#888";
  const borderColor = colors.border ?? "#333";
  const labelColor = colors.label ?? "#fff";

  const containerStyle: ViewStyle = {
    backgroundColor: bgColor,
    borderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    width,
    height,
    overflow: "hidden",
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 4,
    });

    if (!result.canceled && result.assets?.length) {
      setLoading(true);
      const compressedURIs: string[] = [];

      for (const asset of result.assets) {
        const manipulated = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { width: 1024 } }], {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        compressedURIs.push(manipulated.uri);
      }

      setLoading(false);
      onChange(compressedURIs);
    }
  };

  return (
    <View>
      {label && (
        <Text
          style={{
            fontFamily: "body",
            color: labelColor,
            fontSize: 14,
            fontWeight: "500",
            marginBottom: 6,
            letterSpacing: 0,
          }}
        >
          {label}
        </Text>
      )}
      <View style={containerStyle}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : value && Array.isArray(value) && value.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {value.map((uri, index) => (
              <View key={index} style={{ position: "relative" }}>
                <Image
                  source={{ uri }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 6,
                  }}
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => {
                    const newImages = value.filter((_, i) => i !== index);
                    onChange(newImages.length > 0 ? newImages : null);
                  }}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "#000000aa",
                    padding: 4,
                    borderRadius: 999,
                  }}
                >
                  <MaterialCommunityIcons name="close" color="#fff" size={14} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <Pressable
            onPress={handlePickImage}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <MaterialCommunityIcons name="image-plus" color={placeholderColor} size={36} />
            <Text style={{ color: placeholderColor, marginTop: 8 }}>{placeholder}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ✅ Your original InputRenderer component - completely unchanged
export default function InputRenderer({ type, onChange, value, placeholder, colors = {} }: Props) {
  const [loading, setLoading] = useState(false);

  const bgColor = colors.background ?? "#1f1f1f";
  const textColor = colors.text ?? "#fff";
  const placeholderColor = colors.placeholder ?? "#888";
  const borderColor = colors.border ?? "#333";

  const sharedContainerStyle: ViewStyle = {
    backgroundColor: bgColor,
    borderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: "100%",
    height: 180,
    overflow: "hidden",
  };

  const textInputStyle: TextStyle = {
    color: textColor,
    fontSize: 14,
    fontFamily: type === "code" ? "monospace" : undefined,
    flex: 1,
    textAlignVertical: "top",
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 4,
    });

    if (!result.canceled && result.assets?.length) {
      setLoading(true);
      const compressedURIs: string[] = [];

      for (const asset of result.assets) {
        const manipulated = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { width: 1024 } }], {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        compressedURIs.push(manipulated.uri);
      }

      setLoading(false);
      onChange(compressedURIs);
    }
  };

  // ✅ Main component return below
  if (type === "image") {
    return (
      <View style={[sharedContainerStyle, { padding: 6 }]}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : value && Array.isArray(value) && value.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {value.map((uri, index) => (
              <View key={index} style={{ position: "relative" }}>
                <Image
                  source={{ uri }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 6,
                  }}
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => {
                    const newImages = value.filter((_, i) => i !== index);
                    onChange(newImages.length > 0 ? newImages : null);
                  }}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "#000000aa",
                    padding: 4,
                    borderRadius: 999,
                  }}
                >
                  <MaterialCommunityIcons name="close" color="#fff" size={14} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <Pressable
            onPress={handlePickImage}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <MaterialCommunityIcons name="image-plus" color={placeholderColor} size={36} />
            <Text style={{ color: placeholderColor, marginTop: 8 }}>Tap to select up to 4 images</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Text or Code input
  return (
    <View style={sharedContainerStyle}>
      <TextInput value={value || ""} onChangeText={(val) => onChange(val ? [val] : null)} multiline placeholder={placeholder} placeholderTextColor={placeholderColor} style={textInputStyle} />
    </View>
  );
}
