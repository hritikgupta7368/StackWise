import { SafeAreaView } from "react-native";

import React from "react";
import BackgroundWrapper from "@/components/Background/backgroundWrapper";

const Test = () => {
  return (
    <BackgroundWrapper>
      <SafeAreaView edges={["top"]}></SafeAreaView>
    </BackgroundWrapper>
  );
};

export default Test;
