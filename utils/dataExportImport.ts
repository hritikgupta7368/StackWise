// utils/dataExportImport.ts
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export interface ExportData {
  version: string;
  exportDate: string;
  topics: DsaTopic[];
  problems: ProblemWithBase64Images[];
}

interface ProblemWithBase64Images extends Omit<Problem, "images"> {
  images?: ImageData[];
}

interface ImageData {
  base64: string;
  filename: string;
  mimeType: string;
}

// Convert image URI to base64
const imageToBase64 = async (uri: string): Promise<ImageData | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Generate filename from URI or use timestamp
    const filename = uri.split("/").pop() || `image_${Date.now()}.jpg`;

    return {
      base64,
      filename,
      mimeType: "image/jpeg", // Default to JPEG
    };
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

// Convert base64 back to image file
const base64ToImage = async (imageData: ImageData): Promise<string | null> => {
  try {
    const fileUri = `${FileSystem.documentDirectory}imported_${imageData.filename}`;

    await FileSystem.writeAsStringAsync(fileUri, imageData.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  } catch (error) {
    console.error("Error converting base64 to image:", error);
    return null;
  }
};

// Export data to JSON file
export const exportAppData = async (
  topics: DsaTopic[],
  problems: Problem[],
): Promise<boolean> => {
  try {
    // Show loading alert
    Alert.alert("Exporting...", "Please wait while we prepare your data.");

    // Convert problems with images to base64
    const processedProblems: ProblemWithBase64Images[] = await Promise.all(
      problems.map(async (problem) => {
        if (!problem.images || problem.images.length === 0) {
          return { ...problem, images: [] };
        }

        // Convert all images to base64
        const imagePromises = problem.images.map((uri) => imageToBase64(uri));
        const imageResults = await Promise.all(imagePromises);
        const validImages = imageResults.filter(
          (img) => img !== null,
        ) as ImageData[];

        return {
          ...problem,
          images: validImages,
        };
      }),
    );

    const exportData: ExportData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      topics,
      problems: processedProblems,
    };

    // Create file
    const filename = `problems_backup_${new Date().toISOString().split("T")[0]}.json`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(exportData, null, 2),
    );

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export Problems Data",
      });
    } else {
      Alert.alert(
        "Export Complete",
        `Data exported to: ${filename}\nLocation: ${fileUri}`,
      );
    }

    return true;
  } catch (error) {
    console.error("Export error:", error);
    Alert.alert("Export Failed", "Failed to export data. Please try again.");
    return false;
  }
};

// Import data from JSON file
export const importAppData = async (): Promise<ExportData | null> => {
  try {
    // Pick file
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return null;
    }

    // Show loading
    Alert.alert("Importing...", "Please wait while we process your data.");

    // Read file
    const fileContent = await FileSystem.readAsStringAsync(
      result.assets[0].uri,
    );
    const importData: ExportData = JSON.parse(fileContent);

    // Validate data structure
    if (!importData.version || !importData.topics || !importData.problems) {
      throw new Error("Invalid file format");
    }

    // Convert base64 images back to files
    const processedProblems: Problem[] = await Promise.all(
      importData.problems.map(async (problem) => {
        if (!problem.images || problem.images.length === 0) {
          return { ...problem, images: [] };
        }

        // Convert base64 images back to URIs
        const imagePromises = problem.images.map((imgData) =>
          base64ToImage(imgData),
        );
        const imageResults = await Promise.all(imagePromises);
        const validImageUris = imageResults.filter(
          (uri) => uri !== null,
        ) as string[];

        return {
          ...problem,
          images: validImageUris,
        };
      }),
    );

    return {
      ...importData,
      problems: processedProblems,
    };
  } catch (error) {
    console.error("Import error:", error);
    Alert.alert(
      "Import Failed",
      "Failed to import data. Please check the file format.",
    );
    return null;
  }
};

// Get data size estimation
export const getDataSize = (
  topics: DsaTopic[],
  problems: Problem[],
): string => {
  const dataStr = JSON.stringify({ topics, problems });
  const sizeInBytes = new Blob([dataStr]).size;
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
  return `${sizeInMB} MB`;
};
