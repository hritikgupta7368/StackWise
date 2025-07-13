// import React, { useRef, useEffect } from "react";
// import { Animated, Pressable, StyleSheet } from "react-native";

// const AnimatedInsightCard = ({
//   children,
//   width = 300,
//   height = 200,
//   style = {},
//   onPress,
//   disabled = false,
//   animationDuration = 150,
//   scaleValue = 0.95,
//   initialAnimationDelay = 300,
//   ...props
// }) => {
//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const pressScaleAnim = useRef(new Animated.Value(1)).current;

//   // Initial load animation
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }).start();
//     }, initialAnimationDelay);

//     return () => clearTimeout(timer);
//   }, []);

//   // Shrink animation on press
//   const handlePressIn = () => {
//     if (disabled) return;

//     Animated.timing(pressScaleAnim, {
//       toValue: scaleValue,
//       duration: animationDuration,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     if (disabled) return;

//     Animated.timing(pressScaleAnim, {
//       toValue: 1,
//       duration: animationDuration,
//       useNativeDriver: true,
//     }).start();
//   };

//   const animatedStyle = {
//     transform: [{ scale: Animated.multiply(scaleAnim, pressScaleAnim) }],
//   };

//   return (
//     <Pressable
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//       onPress={onPress}
//       disabled={disabled}
//       style={[styles.pressable, { width, height }]}
//       {...props}
//     >
//       <Animated.View
//         style={[
//           styles.container,
//           {
//             width,
//             height,
//           },
//           animatedStyle,
//           style,
//         ]}
//       >
//         {children}
//       </Animated.View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   pressable: {
//     alignSelf: "flex-start",
//   },
//   container: {
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// });

// export default AnimatedInsightCard;

import React, {
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

// Create the context
const AnimationPreventionContext = createContext(null);

// Hook for components to use - this is what you'll add to your existing components
export const usePreventContainerAnimation = () => {
  return useContext(AnimationPreventionContext);
};

// Main AnimatedInsightCard component
const AnimatedInsightCard = ({
  children,
  width = 300,
  height = 200,
  style = {},
  onPress,
  disabled = false,
  animationDuration = 150,
  scaleValue = 0.95,
  initialAnimationDelay = 300,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pressScaleAnim = useRef(new Animated.Value(1)).current;
  const shouldPreventAnimation = useRef(false);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, initialAnimationDelay);
    return () => clearTimeout(timer);
  }, []);

  // Memoized handlers
  const handlePressIn = useCallback(
    (event) => {
      if (disabled || shouldPreventAnimation.current) return;

      Animated.timing(pressScaleAnim, {
        toValue: scaleValue,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    },
    [disabled, scaleValue, animationDuration],
  );

  const handlePressOut = useCallback(
    (event) => {
      if (disabled) return;

      // Reset prevention flag
      shouldPreventAnimation.current = false;

      Animated.timing(pressScaleAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    },
    [disabled, animationDuration],
  );

  const handlePress = useCallback(
    (event) => {
      if (disabled || shouldPreventAnimation.current) return;
      onPress?.(event);
    },
    [disabled, onPress],
  );

  // This is the function your components will call
  const preventAnimation = useCallback(() => {
    shouldPreventAnimation.current = true;
  }, []);

  const animatedStyle = {
    transform: [{ scale: Animated.multiply(scaleAnim, pressScaleAnim) }],
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.pressable, { width, height }]}
      {...props}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width,
            height,
          },
          animatedStyle,
          style,
        ]}
      >
        <AnimationPreventionContext.Provider value={preventAnimation}>
          {children}
        </AnimationPreventionContext.Provider>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignSelf: "flex-start",
  },
  container: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AnimatedInsightCard;

// ============================================
// EXAMPLES: How to modify your existing components
// ============================================

// // Example 1: Your existing button component
// const MyExistingButton = ({ onPress, title, style }) => {
//   const preventAnimation = usePreventContainerAnimation();

//   const handlePress = () => {
//     preventAnimation?.(); // Add this single line
//     onPress?.();
//   };

//   return (
//     <TouchableOpacity onPress={handlePress} style={style}>
//       <Text>{title}</Text>
//     </TouchableOpacity>
//   );
// };

// // Example 2: Your existing popup trigger
// const MyPopupTrigger = ({ onPress, children }) => {
//   const preventAnimation = usePreventContainerAnimation();

//   const handlePress = () => {
//     preventAnimation?.(); // Add this single line
//     onPress?.();
//   };

//   return (
//     <Pressable onPress={handlePress}>
//       {children}
//     </Pressable>
//   );
// };

// // Example 3: Your existing modal trigger
// const MyModalTrigger = ({ onPress, modalVisible, setModalVisible }) => {
//   const preventAnimation = usePreventContainerAnimation();

//   const handlePress = () => {
//     preventAnimation?.(); // Add this single line
//     setModalVisible(true);
//     onPress?.();
//   };

//   return (
//     <TouchableOpacity onPress={handlePress}>
//       <Text>Open Modal</Text>
//     </TouchableOpacity>
//   );
// };

// // Example 4: Complex component with multiple interactions
// const MyComplexComponent = ({ onLike, onShare, onComment }) => {
//   const preventAnimation = usePreventContainerAnimation();

//   const handleLike = () => {
//     preventAnimation?.(); // Add this line
//     onLike?.();
//   };

//   const handleShare = () => {
//     preventAnimation?.(); // Add this line
//     onShare?.();
//   };

//   const handleComment = () => {
//     preventAnimation?.(); // Add this line
//     onComment?.();
//   };

//   return (
//     <View>
//       <Text>Some content here</Text>
//       <View style={{ flexDirection: 'row' }}>
//         <TouchableOpacity onPress={handleLike}>
//           <Text>Like</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleShare}>
//           <Text>Share</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleComment}>
//           <Text>Comment</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// // ============================================
// // UNIVERSAL WRAPPER (Alternative approach)
// // ============================================

// // If you want even less code changes, create this wrapper
// export const InteractionWrapper = ({ children, onPress, onPressIn, onPressOut, ...props }) => {
//   const preventAnimation = usePreventContainerAnimation();

//   const handlePress = (e) => {
//     preventAnimation?.();
//     onPress?.(e);
//   };

//   const handlePressIn = (e) => {
//     preventAnimation?.();
//     onPressIn?.(e);
//   };

//   const handlePressOut = (e) => {
//     onPressOut?.(e);
//   };

//   return (
//     <TouchableOpacity
//       {...props}
//       onPress={handlePress}
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//     >
//       {children}
//     </TouchableOpacity>
//   );
// };

// // Usage with wrapper (even less changes needed):
// /*
// // Before:
// <TouchableOpacity onPress={handleSomething}>
//   <Text>Button</Text>
// </TouchableOpacity>

// // After (just change the component name):
// <InteractionWrapper onPress={handleSomething}>
//   <Text>Button</Text>
// </InteractionWrapper>
// */
