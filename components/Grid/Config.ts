import { Dimensions } from "react-native";

const SCREEN_DP = Dimensions.get("window").width; // ≈360 dp on A21s
const COLUMNS = 4;
export const H_GAP = 8; // dp between widgets
export const SIDE_PADDING = 16; // dp (8dp each side)
// total horizontal gaps = (COLUMNS - 1)*H_GAP + 2*SIDE_PADDING
const TOTAL_GAP = (COLUMNS - 1) * H_GAP + SIDE_PADDING * 2; // 3*8 + 32 = 56
export const UNIT = (SCREEN_DP - TOTAL_GAP) / COLUMNS; // (360 - 56)/4 ≈ 76 dp
