import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface RouteItem {
  path: string;
  label: string;
  icon: (isActive: boolean) => JSX.Element;
}

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Memoize routes to prevent recreation on every render
  const routes: RouteItem[] = useMemo(
    () => [
      {
        path: "/home",
        label: "Home",
        icon: (isActive: boolean) => <MaterialIcons name="home-filled" size={22} color={isActive ? "black" : "white"} />,
      },
      {
        path: "/dsa",
        label: "DSA",
        icon: (isActive: boolean) => <Entypo name="code" size={22} color={isActive ? "black" : "white"} />,
      },
      {
        path: "/core",
        label: "Core",
        icon: (isActive: boolean) => <AntDesign name="book" size={22} color={isActive ? "black" : "white"} />,
      },
      {
        path: "/interview",
        label: "Interview",
        icon: (isActive: boolean) => <AntDesign name="layout" size={22} color={isActive ? "black" : "white"} />,
      },
      {
        path: "/systemDesign",
        label: "System",
        icon: (isActive: boolean) => <MaterialIcons name="settings-system-daydream" size={22} color={isActive ? "black" : "white"} />,
      },
    ],
    [],
  );

  // Animation values
  const translateY = useSharedValue(100);
  const indicatorTranslateX = useSharedValue(0);

  // Memoize tab width calculation
  const tabWidth = useMemo(() => 30 + 30 + 3, []);

  // Memoize the active tab index calculation
  const getActiveTabIndex = useCallback(() => {
    const index = routes.findIndex((route) => pathname === route.path || pathname.startsWith(`${route.path}/`));
    // Default to /home (index 0) if not found
    return index === -1 ? 0 : index;
  }, [routes, pathname]);

  const [activeIndex, setActiveIndex] = useState<number>(() => getActiveTabIndex());

  // Memoize animation configs to prevent recreation
  const springConfig = useMemo(
    () => ({
      damping: 15,
      stiffness: 150,
      velocity: 10,
    }),
    [],
  );

  const indicatorSpringConfig = useMemo(
    () => ({
      damping: 20,
      stiffness: 200,
    }),
    [],
  );

  useEffect(() => {
    translateY.value = withSpring(0, springConfig);
  }, [pathname, springConfig]);

  useEffect(() => {
    const newActiveIndex = getActiveTabIndex();
    setActiveIndex(newActiveIndex);
    const newPosition = newActiveIndex * tabWidth;
    indicatorTranslateX.value = withSpring(newPosition, indicatorSpringConfig);
  }, [pathname, getActiveTabIndex, tabWidth, indicatorSpringConfig]);

  // Memoize animated styles to prevent recreation
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: translateY.value }],
    }),
    [],
  );

  const indicatorAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: indicatorTranslateX.value }],
    }),
    [],
  );

  // Memoize navigation handler
  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  // Memoize rendered tabs to prevent recreation
  const renderedTabs = useMemo(() => {
    return routes.map((route, index) => {
      const isActive = index === activeIndex;
      return (
        <TouchableOpacity key={route.path} onPress={() => handleNavigation(route.path)} style={styles.tabIndex}>
          {route.icon(isActive)}
        </TouchableOpacity>
      );
    });
  }, [routes, activeIndex, handleNavigation]);

  return (
    <Animated.View style={[styles.parent, animatedStyle]}>
      <View style={styles.container}>
        {/* Animated white indicator that slides behind tabs */}
        <Animated.View style={[styles.indicator, indicatorAnimatedStyle]} />
        {renderedTabs}
      </View>
    </Animated.View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  parent: {
    alignItems: "center",
    position: "absolute", // ✅ Fixed: "fixed" is not valid in React Native
    bottom: 30,
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
