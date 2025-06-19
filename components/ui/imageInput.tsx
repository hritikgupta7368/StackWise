// components/ImagePicker.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

interface ImagePickerComponentProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  images,
  onImagesChange,
  maxImages = 4,
}) => {
  // Request permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and media library permissions to add images.",
        [{ text: "OK" }],
      );
      return false;
    }
    return true;
  };

  // Compress image while maintaining quality
  const compressImage = async (uri: string): Promise<string> => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [
          // Resize if image is too large (max 1200px on longest side)
          { resize: { width: 1200 } },
        ],
        {
          compress: 0.8, // 80% quality - good balance between size and quality
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );
      return manipResult.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      return uri; // Return original URI if compression fails
    }
  };

  const showImagePicker = async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only add up to ${maxImages} images`,
      );
      return;
    }

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    Alert.alert("Select Image", "Choose an option", [
      { text: "Camera", onPress: () => openCamera() },
      { text: "Gallery", onPress: () => openGallery() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1, // Max quality for camera, we'll compress later
      });

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        onImagesChange([...images, compressedUri]);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: maxImages - images.length,
        quality: 1, // Max quality from gallery, we'll compress later
      });

      if (!result.canceled && result.assets) {
        // Compress all selected images
        const compressedImages = await Promise.all(
          result.assets.map((asset) => compressImage(asset.uri)),
        );
        onImagesChange([...images, ...compressedImages]);
      }
    } catch (error) {
      console.error("Error opening gallery:", error);
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const removeImage = (index: number) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const updatedImages = images.filter((_, i) => i !== index);
          onImagesChange(updatedImages);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Images (Optional) - {images.length}/{maxImages}
      </Text>
      <Text style={styles.subtitle}>
        Add diagrams, screenshots, or visual explanations
      </Text>

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollView}
          contentContainerStyle={styles.imageScrollContent}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} resizeMode="cover" />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
              <View style={styles.imageNumber}>
                <Text style={styles.imageNumberText}>{index + 1}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {images.length < maxImages && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={showImagePicker}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonIcon}>📷</Text>
          <Text style={styles.addButtonText}>Add Image</Text>
          <Text style={styles.addButtonSubtext}>Camera or Gallery</Text>
        </TouchableOpacity>
      )}

      {images.length > 0 && (
        <Text style={styles.infoText}>
          💡 Images are automatically compressed to optimize storage
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#495057",
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 12,
  },
  imageScrollView: {
    marginBottom: 15,
  },
  imageScrollContent: {
    paddingRight: 10,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(220, 53, 69, 0.9)",
    borderRadius: 15,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18,
  },
  imageNumber: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imageNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    borderWidth: 2,
    borderColor: "#007bff",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9ff",
    minHeight: 100,
  },
  addButtonIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  addButtonText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  addButtonSubtext: {
    color: "#6c757d",
    fontSize: 12,
  },
  infoText: {
    fontSize: 12,
    color: "#28a745",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default ImagePickerComponent;
