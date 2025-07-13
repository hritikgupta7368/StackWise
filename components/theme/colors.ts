// theme.ts

// 🎨 Colors
export const colors = {
  background: "#17161b", // background color when not image
  backdrop: "rgba(0, 0, 0, 0.75)", // backdrop color for modal or overlay
  surface: "#050505", // surface color for cards or containers
  primary: "#8082FF", // primary color for buttons or accents
  primaryBorder: "pink", // border color for primary elements
  secondary: "#FF6F61", // secondary color for secondary elements
  Primarytext: "#FFFFFF", // text color for text elements
  secondaryText: "rgba(255, 255, 255, 0.7)", // text color for secondary text elements
  red: "#cf000f", // red color for error or negative elements
  muted: "#888", // muted color for disabled or inactive elements
  borderColor: "#2E2E2E", // border color for borders(outer) -> rgba(255, 255, 255, 0.1)
  OuterBorderRadius: 24,
};

// 🧾 Text Input Colors
export const textInput = {
  label: "#afaeaf",
  placeholder: "#424242",
  backgroundColor: "#171717",
  borderColor: colors.borderColor,
  color: "#FFFFFF",
  error: colors.red,
  mandatory: "#FF9087",
};
export const BottomSheet = {
  backgroundColor: colors.surface,
  borderRadius: colors.OuterBorderRadius,
  borderColor: colors.borderColor,
  titleColor: colors.Primarytext,
  subtitleColor: colors.secondaryText,
};

export const PopupMenu = {
  backgroundColor: colors.surface,
  borderRadius: colors.OuterBorderRadius,
  borderColor: colors.borderColor,
  labelColor: colors.Primarytext,
};
export const Model = {
  backgroundColor: colors.surface,
  borderRadius: colors.OuterBorderRadius,
  borderColor: colors.borderColor,
  titleColor: colors.Primarytext,
  subtitleColor: colors.secondaryText,
};

// 📦 Spacing (in px)
export const spacing = {
  xxxxs: 2,
  xxxs: 4,
  xxs: 6,
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  xxxxl: 64,
};

// 🔠 Typography Base
export const typography = {
  heading: {
    fontFamily: "YourFont-Bold", // replace with your actual font
    fontWeight: "700" as const,
  },
  subheading: {
    fontFamily: "YourFont-SemiBold",
    fontWeight: "600" as const,
  },
  body: {
    fontFamily: "YourFont-Regular",
    fontWeight: "400" as const,
  },
};

// 🧩 Text Variants
export const textVariants = {
  headingLarge: {
    ...typography.heading,
    fontSize: 24,
    lineHeight: 36,
    color: colors.text,
    textAlign: "center",
  },
  headingMedium: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 32,
    color: colors.text,
  },
  subheading: {
    ...typography.subheading,
    fontSize: 18,
    lineHeight: 28,
    color: colors.text,
  },
  body: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  small: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  muted: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
};
