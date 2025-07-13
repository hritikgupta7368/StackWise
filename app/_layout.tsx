import { Stack } from "expo-router";
import { GlobalUIOverlay } from "@/components/global-ui/GlobalUIOverlay";
// import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { startGoalEngine } from "@/src/goalEngine";
import { useEffect } from "react";
import { useAppStore } from "@/store/useStore";
import { ensureStoreInitialized } from "@/src/goalEngine/storeInitializer";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { logDebug } from "@/utils/logUtils";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [loaded, error] = useFonts({
  //   Michroma: require("../assets/fonts/Michroma-Regular.ttf"),
  // });

  // if (!loaded && !error) {
  //   return null;
  // }

  useEffect(() => {
    // This function will run the engine ONLY after the store is ready.
    const initializeAndStartEngine = async () => {
      try {
        logDebug("🚀 Initializing Goal Engine...");
        ensureStoreInitialized();
        await startGoalEngine(); // Make sure startGoalEngine is async if it needs to be

        // ... any other initialization logic
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBehaviorAsync("overlay-swipe");
        logDebug("✅ Goal Engine initialization complete");
        logDebug("<---------------------END OF INITIALIZATION------------------->");
      } catch (error) {
        logDebug(error, {
          label: "RootLayout",
          level: "error",
          stringify: true,
          trace: true,
        });
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    // Subscribe to the hydration state. The listener will be called when rehydration is done.
    const unsubscribe = useAppStore.persist.onFinishHydration((state) => {
      logDebug("💧 Store has rehydrated.");
      initializeAndStartEngine();
      unsubscribe(); // Unsubscribe after running once to prevent memory leaks.
    });

    // Also handle the case where the store is already hydrated on component mount
    if (useAppStore.persist.hasHydrated()) {
      logDebug("💧 Store was already hydrated.");
      initializeAndStartEngine();
    }
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalUIOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="core/[id]" />
        <Stack.Screen name="dsa/[topic]" />

        <Stack.Screen name="systemDesign/[id]" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}
