import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { AppState, ContentElement } from "@/types/types";
import { getAppState } from "@/store/useStore";

// --- Interfaces ---
export interface ExportData {
  version: string;
  exportDate: string;
  data: AppState;
}

// For decoding/encoding ContentElement image values
interface ImageData {
  base64: string;
  filename: string;
  mimeType: string;
}

// --- Image Utils ---
const imageToBase64 = async (uri: string): Promise<ImageData | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const filename = uri.split("/").pop() || `image_${Date.now()}.jpg`;
    return { base64, filename, mimeType: "image/jpeg" };
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

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

// --- Transform ContentElement Images ---
const convertContentImagesToBase64 = async (content: ContentElement[]): Promise<ContentElement[]> => {
  return await Promise.all(
    content.map(async (el) => {
      if (el.type === "image" && el.value.startsWith("file")) {
        const imgData = await imageToBase64(el.value);
        if (imgData) {
          return {
            type: "image",
            value: `data:${imgData.mimeType};base64,${imgData.base64}`,
            alt: el.alt,
          };
        }
      }
      return el;
    }),
  );
};

const convertContentImagesFromBase64 = async (content: ContentElement[]): Promise<ContentElement[]> => {
  return await Promise.all(
    content.map(async (el) => {
      if (el.type === "image" && el.value.startsWith("data:") && el.value.includes("base64,")) {
        const [, base64Part] = el.value.split("base64,");
        const mimeType = el.value.match(/data:(.*);base64/)?.[1] || "image/jpeg";
        const filename = `imported_${Date.now()}.jpg`;
        const uri = await base64ToImage({
          base64: base64Part,
          filename,
          mimeType,
        });
        if (uri) {
          return {
            type: "image",
            value: uri,
            alt: el.alt,
          };
        }
      }
      return el;
    }),
  );
};

// --- Export Full App Data ---
export const exportAppData = async (): Promise<boolean> => {
  try {
    Alert.alert("Exporting", "Preparing your data...");
    const state = getAppState();

    // Convert ContentElement images in Core, Interview, SystemDesign
    for (const sub of state.core.subtopics) {
      sub.content = await convertContentImagesToBase64(sub.content);
    }
    for (const q of state.interview.questions) {
      q.answer = await convertContentImagesToBase64(q.answer);
    }
    for (const sub of state.systemDesign.subtopics) {
      sub.content = await convertContentImagesToBase64(sub.content);
    }

    const exportData: ExportData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      data: state,
    };

    const filename = `stackwise_backup_${new Date().toISOString().split("T")[0]}.json`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export StackWise Data",
      });
    } else {
      Alert.alert("Export Complete", `File saved: ${fileUri}`);
    }

    return true;
  } catch (error) {
    console.error("Export failed:", error);
    Alert.alert("Export Error", "Could not export data.");
    return false;
  }
};

// --- Import Full App Data ---
export const importAppData = async (): Promise<AppState | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return null;

    Alert.alert("Importing", "Restoring your data...");
    const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const importData: ExportData = JSON.parse(fileContent);

    if (!importData.version || !importData.data) {
      throw new Error("Invalid export format");
    }

    const data = importData.data;

    for (const sub of data.core.subtopics) {
      sub.content = await convertContentImagesFromBase64(sub.content);
    }
    for (const q of data.interview.questions) {
      q.answer = await convertContentImagesFromBase64(q.answer);
    }
    for (const sub of data.systemDesign.subtopics) {
      sub.content = await convertContentImagesFromBase64(sub.content);
    }

    return data;
  } catch (error) {
    console.error("Import failed:", error);
    Alert.alert("Import Error", "Could not import data.");
    return null;
  }
};

// --- Get Export Size (Optional) ---
export const getDataSize = (): string => {
  const state = getAppState();
  const dataStr = JSON.stringify({ data: state });
  const sizeInBytes = new Blob([dataStr]).size;
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
  return `${sizeInMB} MB`;
};
