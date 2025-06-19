import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import RadialProgressChart from "../../components/Charts/radialChart";
import OverlappingCirclesCard from "../../components/LiveTiles/DsaTiles";
import DummyTile from "../../components/LiveTiles/DummyTile";
import { SettingsIcon } from "../../components/ui/icons";

export default function Home() {
  const chartData1 = [
    {
      id: "ring1",
      color: "#1E90FF", // Dodger Blue (Outer - Darker)
      label: "Chrome",
      current: 850,
      goal: 1000,
    },
    {
      id: "ring2",
      color: "#4682B4", // Steel Blue (Mid-outer)
      label: "Safari",
      current: 70,
      goal: 100,
    },
    {
      id: "ring3",
      color: "#87CEEB", // Sky Blue (Mid-inner)
      label: "Firefox",
      current: 50,
      goal: 60,
    },
    {
      id: "ring4",
      color: "#ADD8E6", // Light Blue (Inner - Lightest)
      label: "Edge",
      current: 20,
      goal: 40,
    },
  ];

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.HeaderContainer}>
          <Text style={styles.title}>Hi Hritik</Text>
          <SettingsIcon />
        </View>

        <ScrollView style={styles.Contents}>
          <RadialProgressChart data={chartData1} />
          <View style={styles.tileRow}>
            <OverlappingCirclesCard />
            <DummyTile />
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 70,
  },
  HeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  Contents: {
    paddingHorizontal: 20,
  },
  tileRow: {
    flexDirection: "row",

    alignItems: "center",
  },
});
