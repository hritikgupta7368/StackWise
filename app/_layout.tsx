import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="core/[id]" />
      <Stack.Screen name="dsa/[topic]" />
      <Stack.Screen name="interview/[id]" />
      <Stack.Screen name="systemDesign/[id]" />
      <Stack.Screen name="settings/index" />
    </Stack>
  );
}
