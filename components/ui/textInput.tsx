import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  mandatory = false,
  error = null,
  style = {},
  inputStyle = {},
  fontFamily = "default",
  ...props
}) => {
  const getInputHeight = () => {
    if (multiline) {
      if (label?.toLowerCase().includes("code")) return styles.inputCode;
      if (
        label?.toLowerCase().includes("explanation") ||
        label?.toLowerCase().includes("description")
      )
        return styles.inputLarge;
      return styles.inputMedium;
    }
    return styles.inputSmall;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label} {mandatory && <Text style={styles.mandatory}>*</Text>}
      </Text>

      <TextInput
        style={[
          getInputHeight(),
          error && styles.inputError,
          fontFamily === "monospace" && styles.monospace,
          inputStyle,
          {
            backgroundColor: "#313131",
            borderColor: "#313131",
            color: "#ffffff",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor="#646464"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        returnKeyType={multiline ? "default" : "next"}
        {...props}
        editable={true}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 8,
    color: "#a2a2a2",
  },
  mandatory: {
    color: "#FF4444",
    fontWeight: "bold",
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 48,
  },
  inputMedium: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 100,
  },
  inputLarge: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 150,
  },
  inputCode: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f8f9fa",
    minHeight: 120,
    fontFamily: "monospace",
  },
  inputError: {
    borderColor: "#FF4444",
    borderWidth: 2,
  },
  monospace: {
    fontFamily: "monospace",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
});

export default FormInput;
