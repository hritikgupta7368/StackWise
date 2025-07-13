import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import BackgroundWrapper from "../../components/Background/backgroundWrapper";
import RadialProgressChart from "../../components/Charts/radialChart";
import OverlappingCirclesCard from "../../components/LiveTiles/DsaTiles";
import DummyTile from "../../components/LiveTiles/DummyTile";
import { SettingsIcon } from "@/components/common/icons";
import { Link } from "expo-router";
import TargetWidget from "@/components/Cards/TargetWidget";

import DailyGoalWidget from "@/components/Charts/DailyGoalWidget";
import TodaysTasks from "@/components/Charts/TasksListWidget";

export default function Home() {
  return (
    <BackgroundWrapper>
      {/* Header */}
      <View style={styles.HeaderContainer}>
        <Text style={styles.title}>Hi Hritik</Text>
        <Link href="/settings">
          <SettingsIcon size={24} color="white" />
        </Link>
      </View>

      <ScrollView style={styles.Contents}>
        <View style={{ paddingHorizontal: 4 }}>
          <DailyGoalWidget />
        </View>
        <View style={{ paddingHorizontal: 4, flexDirection: "row", gap: 4 }}>
          <TodaysTasks />
          <RadialProgressChart />
        </View>

        {/* <View style={styles.tileRow}>
          <OverlappingCirclesCard />
        </View> */}
        <TargetWidget />
        <Link href="/test">
          <Text>go to test</Text>
        </Link>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  Contents: {
    paddingHorizontal: 4,
  },
  tileRow: {
    flexDirection: "row",

    alignItems: "center",
  },
});
