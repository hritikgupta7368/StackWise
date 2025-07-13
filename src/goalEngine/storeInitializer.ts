// /src/goalEngine/storeInitializer.ts
import { useAppStore } from "@/store/useStore";
import { logDebug } from "@/utils/logUtils";

export function ensureStoreInitialized() {
  const store = useAppStore.getState();
  const updates: any = {};
  let needsUpdate = false;

  // Check goal object exists
  if (!store.goal) {
    updates.goal = {
      dailyGoals: [],
      historyLogs: [],
      metrics: null,
      memory: null,
      scheduledPlans: [],
      timePatterns: [],
      goalDigest: null,
      userConfig: {
        mode: "normal",
        allowAutoAdjustment: true,
        forecastEnabled: true,
        revisionIntensity: 0.3,
        preferredDailyLoad: 4,
        streakProtection: true,
        createdAt: new Date().toISOString(),
      },
      lastSyncTime: null,
    };
    needsUpdate = true;
  } else {
    // Check individual properties
    if (!store.goal.scheduledPlans) {
      if (!updates.goal) updates.goal = { ...store.goal };
      updates.goal.scheduledPlans = [];
      needsUpdate = true;
    }

    if (!store.goal.timePatterns) {
      if (!updates.goal) updates.goal = { ...store.goal };
      updates.goal.timePatterns = [];
      needsUpdate = true;
    }

    if (!store.goal.memory) {
      if (!updates.goal) updates.goal = { ...store.goal };
      updates.goal.memory = {
        id: Date.now().toString(),
        userTraits: {},
        learningPatterns: [],
        lastUpdated: new Date().toISOString(),
      };
      needsUpdate = true;
    }

    if (!store.goal.userConfig) {
      if (!updates.goal) updates.goal = { ...store.goal };
      updates.goal.userConfig = {
        mode: "normal",
        allowAutoAdjustment: true,
        forecastEnabled: true,
        revisionIntensity: 0.3,
        preferredDailyLoad: 4,
        streakProtection: true,
        createdAt: new Date().toISOString(),
      };
      needsUpdate = true;
    }
  }

  // Apply updates if needed
  if (needsUpdate) {
    logDebug("🔧 Initializing missing store properties", updates);
    useAppStore.setState((state: any) => {
      // Create a new state instead of mutating
      return {
        ...state,
        goal: {
          ...(state.goal || {}),
          ...(updates.goal || {}),
        },
      };
    });
  }

  return needsUpdate; // Return true if updates were made
}
