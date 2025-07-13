import { View, Dimensions, StyleSheet, InteractionManager } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, withSpring, interpolate, runOnJS } from "react-native-reanimated";
import React, { useRef, useLayoutEffect, useEffect, useCallback, useMemo } from "react";
import { backgroundImages } from "@/constants/Background";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.84;
const SPACING = screenWidth * 0.055;
const FLATLIST_PADDING_HORIZONTAL = (screenWidth - CARD_WIDTH) / 2;

const Carousel = ({ data, Component, storeActions, operations, onIndexChange, scrollToIndex = null }) => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef(null);
  const prevLength = useRef(data.length);
  const animationProgress = useSharedValue(0);
  const currentIndexRef = useRef(0);

  // Memoize background images array
  const backgroundImageList = useMemo(() => Object.values(backgroundImages), []);

  // Optimize scroll handler with throttling
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;

      const index = Math.round(event.contentOffset.x / (CARD_WIDTH + SPACING));

      // Only trigger callback if index actually changed
      if (index !== currentIndexRef.current) {
        currentIndexRef.current = index;
        if (onIndexChange) {
          runOnJS(onIndexChange)(index);
        }
      }
    },
  });

  // Initialize animation only once
  useEffect(() => {
    animationProgress.value = withSpring(1, {
      damping: 10,
      stiffness: 150,
    });
  }, []);

  // Handle scroll to index with better timing
  useLayoutEffect(() => {
    const newLength = data.length;

    if (newLength > prevLength.current && scrollToIndex !== null) {
      const task = InteractionManager.runAfterInteractions(() => {
        try {
          const targetIndex = Math.min(scrollToIndex, newLength - 1);
          flatListRef.current?.scrollToIndex({
            index: targetIndex,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (error) {
          console.warn("ScrollToIndex failed:", error);
        }
      });

      return () => task.cancel();
    }

    prevLength.current = newLength;
  }, [data.length, scrollToIndex]);

  // Optimize getItemLayout for better performance
  const getItemLayout = useCallback(
    (_, index) => ({
      length: CARD_WIDTH + SPACING,
      offset: (CARD_WIDTH + SPACING) * index,
      index,
    }),
    [],
  );

  // Improve scroll to index failed handler
  const handleScrollToIndexFailed = useCallback(
    (info) => {
      const wait = new Promise((resolve) => setTimeout(resolve, 300));
      wait.then(() => {
        try {
          if (flatListRef.current) {
            // If the requested index is beyond current data length, scroll to end
            if (info.index >= data.length) {
              flatListRef.current.scrollToEnd({ animated: true });
            } else {
              // Calculate safe offset for valid indices
              const safeIndex = Math.min(info.index, data.length - 1);
              const offset = Math.min(info.averageItemLength * safeIndex, (data.length - 1) * (CARD_WIDTH + SPACING));

              flatListRef.current.scrollToOffset({
                offset,
                animated: true,
              });
            }
          }
        } catch (error) {
          console.warn("ScrollToOffset failed:", error);
        }
      });
    },
    [data.length],
  );

  // Memoize animated container style
  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationProgress.value, [0, 1], [1.5, 1]);
    const opacity = interpolate(animationProgress.value, [0, 0.5, 1], [0, 0.7, 1]);

    return {
      opacity,
      transform: [{ perspective: 1000 }, { scale }],
    };
  });

  // Optimize renderItem with better memoization
  const renderItem = useCallback(({ item, index }) => <Component operations={operations} storeActions={storeActions} backgroundImage={backgroundImageList[index % backgroundImageList.length]()} scrollX={scrollX} data={item} index={index} cardWidth={CARD_WIDTH} spacing={SPACING} screenWidth={screenWidth} />, [operations, storeActions, backgroundImageList, scrollX]);

  // Optimize key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Memoize content container style
  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: FLATLIST_PADDING_HORIZONTAL,
      alignItems: "center",
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Animated.View style={animatedContainerStyle}>
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScrollHandler}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          scrollEventThrottle={16} // Optimized for 60fps
          contentContainerStyle={contentContainerStyle}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          windowSize={5} // Reduced from 5 for better performance
          initialNumToRender={3} // Reduced from 3
          maxToRenderPerBatch={2} // Reduced from 3
          removeClippedSubviews={true} // Enable for better performance
          updateCellsBatchingPeriod={100} // Batch updates for better performance
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 100,
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
});

export default React.memo(Carousel);
