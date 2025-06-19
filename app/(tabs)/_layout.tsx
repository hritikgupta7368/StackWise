import { Tabs } from "expo-router";
import CustomNavBar from "../../components/Navbar/navbar";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ✅ Hides header globally
      }}
      tabBar={(props) => <CustomNavBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="core" options={{ title: "Core" }} />
      <Tabs.Screen name="dsa" options={{ title: "DSA" }} />
      <Tabs.Screen name="interview" options={{ title: "Interview" }} />
      <Tabs.Screen name="systemDesign" options={{ title: "SystemDesign" }} />
    </Tabs>
  );
}
