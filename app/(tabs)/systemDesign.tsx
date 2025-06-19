import { View, Text, StyleSheet } from "react-native";

export default function SystemDesign() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>System page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
