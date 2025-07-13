// store/useOverlayStore.ts
import { create } from "zustand";
import { ReactNode } from "react";

type BottomSheetConfig = {
  visible: boolean;
  height?: number;
  variant?: "default" | "full" | "compact";
  content: ReactNode | null;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
};

type DialogModalConfig = {
  visible: boolean;
  content: ReactNode | null;
  height?: number;
  title?: string;
  subtitle?: string;
  type?: "default" | "warning";
};

type PopupMenuOption = {
  label: string;
  onPress: () => void;
  icon?: ReactNode; // Optional icon for menu item
};

type PopupMenuConfig = {
  visible: boolean;
  options: PopupMenuOption[];
};

type ToastConfig = {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info";
};

type OverlayState = {
  // ✅ Bottom Sheet
  bottomSheet: BottomSheetConfig;
  showBottomSheet: (config: Omit<BottomSheetConfig, "visible" | "isLoading">) => void;
  hideBottomSheet: () => void;
  setBottomSheetLoading: (loading: boolean) => void;

  // ✅ Dialog Modal
  dialogModal: DialogModalConfig;
  showDialogModal: (config: Omit<DialogModalConfig, "visible">) => void;
  hideDialogModal: () => void;

  // ✅ Popup Menu
  popupMenu: PopupMenuConfig;
  showPopupMenu: (options: PopupMenuOption[]) => void;
  hidePopupMenu: () => void;

  // ✅ Toast
  toast: ToastConfig;
  showToast: (config: Omit<ToastConfig, "visible">) => void;
};

export const useOverlayStore = create<OverlayState>((set) => ({
  // 🟢 Bottom Sheet State
  bottomSheet: {
    visible: false,
    content: null,
    isLoading: false,
    title: "",
  },
  showBottomSheet: (config) =>
    set({
      bottomSheet: {
        ...config,
        visible: true,
        isLoading: false,
      },
    }),
  hideBottomSheet: () =>
    set((state) => ({
      bottomSheet: {
        ...state.bottomSheet,
        visible: false,
        isLoading: false,
      },
    })),
  setBottomSheetLoading: (loading) =>
    set((state) => ({
      bottomSheet: {
        ...state.bottomSheet,
        isLoading: loading,
      },
    })),

  // 🟣 Dialog Modal State
  dialogModal: {
    visible: false,
    content: null,
  },
  showDialogModal: (config) =>
    set({
      dialogModal: {
        ...config,
        visible: true,
      },
    }),
  hideDialogModal: () =>
    set((state) => ({
      dialogModal: {
        ...state.dialogModal,
        visible: false,
      },
    })),

  //popup State
  popupMenu: {
    visible: false,
    options: [],
  },
  showPopupMenu: (options) =>
    set({
      popupMenu: {
        visible: true,
        options,
      },
    }),
  hidePopupMenu: () =>
    set((state) => ({
      popupMenu: {
        ...state.popupMenu,
        visible: false,
        options: [],
      },
    })),

  // 🔴 Toast State
  toast: {
    visible: false,
    message: "",
    type: "info",
  },
  showToast: (config) => {
    set({
      toast: {
        ...config,
        visible: true,
      },
    });
    setTimeout(() => {
      set((state) => ({
        toast: {
          ...state.toast,
          visible: false,
        },
      }));
    }, 2500);
  },
}));
