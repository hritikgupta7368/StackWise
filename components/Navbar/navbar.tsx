import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface RouteItem {
  path: string;
  label: string;
  icon: (isActive: boolean) => JSX.Element;
}

const CustomNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const routes: RouteItem[] = [
    {
      path: "/home",
      label: "Home",
      icon: (isActive: boolean) => (
        <MaterialIcons
          name="home-filled"
          size={22}
          color={isActive ? "black" : "white"}
        />
      ),
    },
    {
      path: "/dsa",
      label: "DSA",
      icon: (isActive: boolean) => (
        <Entypo name="code" size={22} color={isActive ? "black" : "white"} />
      ),
    },
    {
      path: "/core",
      label: "Core",
      icon: (isActive: boolean) => (
        <AntDesign name="book" size={22} color={isActive ? "black" : "white"} />
      ),
    },
    {
      path: "/interview",
      label: "Interview",
      icon: (isActive: boolean) => (
        <AntDesign
          name="layout"
          size={22}
          color={isActive ? "black" : "white"}
        />
      ),
    },
    {
      path: "/systemDesign",
      label: "System",
      icon: (isActive: boolean) => (
        <MaterialIcons
          name="settings-system-daydream"
          size={22}
          color={isActive ? "black" : "white"}
        />
      ),
    },
  ];

  // Animation values
  const translateY = useSharedValue(100);
  const indicatorTranslateX = useSharedValue(0);

  // Calculate tab width (including margins and padding)
  const tabWidth = 30 + 30 + 3;

  const getActiveTabIndex = () => {
    const index = routes.findIndex(
      (route) =>
        pathname === route.path || pathname.startsWith(`${route.path}/`),
    );
    // Default to /home (index 0) if not found
    return index === -1 ? 0 : index;
  };

  const [activeIndex, setActiveIndex] = useState<number>(getActiveTabIndex());

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
      velocity: 10,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const newActiveIndex = getActiveTabIndex();
    setActiveIndex(newActiveIndex);

    const newPosition = newActiveIndex * tabWidth;
    indicatorTranslateX.value = withSpring(newPosition, {
      damping: 20,
      stiffness: 200,
    });
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorTranslateX.value }],
  }));

  return (
    <Animated.View style={[styles.parent, animatedStyle]}>
      <View style={styles.container}>
        {/* Animated white indicator that slides behind tabs */}
        <Animated.View style={[styles.indicator, indicatorAnimatedStyle]} />

        {routes.map((route, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              key={route.path}
              onPress={() => router.push(route.path)}
              style={styles.tabIndex}
            >
              {route.icon(isActive)}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default CustomNavBar;

const styles = StyleSheet.create({
  parent: {
    alignItems: "center",
    position: "absolute", // ✅ Fixed: "fixed" is not valid in React Native
    bottom: 40,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "black",
    paddingVertical: 4,
    borderRadius: 30,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  tabIndex: {
    backgroundColor: "transparent",
    borderRadius: 30,
    height: 55,
    paddingHorizontal: 17,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    zIndex: 2,
  },
  indicator: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 30,
    height: 55,
    width: 60,
    top: 4,
    left: 4,
    zIndex: 1,
  },
});
