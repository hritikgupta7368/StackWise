import { View, StyleSheet, Text } from "react-native";

const DummyTile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dummy Tile</Text>
    </View>
  );
};

export default DummyTile;

const styles = StyleSheet.create({
  container: {
    width: 110,
    height: 200,
    backgroundColor: "black",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginLeft: 12, // spacing between the two tiles
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
