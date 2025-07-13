// theme/index.ts
import { colors, textInput, BottomSheet, PopupMenu, Model } from "./colors";
import { typography } from "./typography";

export const theme = {
  colors,
  typography,
  textInput,
  BottomSheet,
  PopupMenu,
  Model,
};

export type Theme = typeof theme;
