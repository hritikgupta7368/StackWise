// components/global-ui/GlobalUIOverlay.tsx
import React, { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useOverlayStore } from "@/store/useOverlayStore";
import { Backdrop } from "./Backdrop";
import { BottomSheet } from "./BottomSheet";
import { DialogModal } from "./DialogModal";
import { ToastMessage } from "./ToastMessage";
import { PopupMenu } from "./PopupMenu";

export const GlobalUIOverlay = () => {
  const { bottomSheet, hideBottomSheet, dialogModal, hideDialogModal, popupMenu, hidePopupMenu } = useOverlayStore();

  // Track if components were ever visible to allow animation completion
  const [shouldRenderBottomSheet, setShouldRenderBottomSheet] = useState(false);
  const [shouldRenderDialogModal, setShouldRenderDialogModal] = useState(false);

  // Update render states when components become visible
  useEffect(() => {
    if (bottomSheet.visible) {
      setShouldRenderBottomSheet(true);
    }
  }, [bottomSheet.visible]);

  useEffect(() => {
    if (dialogModal.visible) {
      setShouldRenderDialogModal(true);
    }
  }, [dialogModal.visible]);

  // Handle the completion of animations
  const handleBottomSheetAnimationComplete = () => {
    setShouldRenderBottomSheet(false);
  };

  const handleDialogModalAnimationComplete = () => {
    setShouldRenderDialogModal(false);
  };

  const handleBack = () => {
    if (popupMenu.visible) {
      hidePopupMenu();
      return true;
    }
    if (dialogModal.visible) {
      hideDialogModal();
      return true;
    }
    if (bottomSheet.visible) {
      hideBottomSheet();
      return true;
    }
    return false;
  };

  const handleBackdropPress = () => {
    if (popupMenu.visible) {
      hidePopupMenu();
    } else if (dialogModal.visible) {
      hideDialogModal();
    } else if (bottomSheet.visible) {
      hideBottomSheet();
    }
  };

  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => back.remove();
  }, [dialogModal.visible, bottomSheet.visible, popupMenu.visible]);

  const showBackdrop = popupMenu.visible || dialogModal.visible || bottomSheet.visible;

  return (
    <>
      {showBackdrop && <Backdrop visible={showBackdrop} onPress={handleBackdropPress} />}
      {shouldRenderBottomSheet && <BottomSheet onAnimationComplete={handleBottomSheetAnimationComplete} />}
      {shouldRenderDialogModal && <DialogModal onAnimationComplete={handleDialogModalAnimationComplete} />}
      <PopupMenu />
      <ToastMessage />
    </>
  );
};
