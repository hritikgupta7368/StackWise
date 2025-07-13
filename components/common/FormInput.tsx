import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

const FormInput = ({ label, value, onChangeText, placeholder = "Enter text", multiline = false, mandatory = false, error = null, style = {}, inputStyle = {}, fontFamily = "default", ...props }) => {
  const getInputHeight = () => {
    if (multiline) {
      if (label?.toLowerCase().includes("code")) return styles.inputCode;
      if (label?.toLowerCase().includes("explanation") || label?.toLowerCase().includes("description")) return styles.inputLarge;
      return styles.inputMedium;
    }
    return styles.inputSmall;
  };

  return (
    <View style={[styles.inputFieldSkeleton, style]}>
      {/* label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label} {mandatory && <Text style={styles.mandatory}>*</Text>}
        </Text>
      </View>
      {/* input */}
      <TextInput
        style={[
          getInputHeight(),
          error && styles.inputError,
          fontFamily === "monospace" && styles.monospace,
          inputStyle,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.textInput.borderColor,
            color: theme.textInput.color,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.textInput.placeholder}
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
  inputFieldSkeleton: {
    marginBottom: 16,
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
  inputSmall: {
    borderWidth: 1,
    borderColor: theme.textInput.borderColor,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: theme.textInput.backgroundColor,
    minHeight: 48,
    lineHeight: 22.4,
  },
  inputMedium: {
    borderWidth: 1,
    borderColor: theme.textInput.borderColor,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: theme.textInput.backgroundColor,
    minHeight: 100,
    lineHeight: 22.4,
  },
  inputLarge: {
    borderWidth: 1,
    borderColor: theme.textInput.borderColor,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: theme.textInput.backgroundColor,
    minHeight: 120,
    lineHeight: 22.4,
  },
  inputCode: {
    borderWidth: 1,
    borderColor: theme.textInput.borderColor,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: theme.textInput.backgroundColor,
    minHeight: 120,
    fontFamily: "monospace",
    lineHeight: 22.4,
  },
  inputError: {
    borderColor: theme.textInput.error,
    borderWidth: 2,
  },
  monospace: {
    fontFamily: "monospace",
  },
  errorText: {
    color: theme.textInput.error,
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
});

export default FormInput;
