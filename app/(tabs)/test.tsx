import { View, StyleSheet, ScrollView } from "react-native";
import InputOptionsCard from "@/components/Renderer/inputOptionsCard";
import SubTopicCard from "@/components/ui/SubTopicCard";
import React, { useState } from "react";

const Test = () => {
  return (
    <ScrollView style={styles.container}>
      <SubTopicCard
        title="Chat Settings"
        description="This is a test"
        paragraph={`1. Using -webkit-line-clamp
      The -webkit-line-clamp property is a convenient way to limit text to a specific number of lines and add an ellipsis.`}
        code={`<html>
        <head>
            <style>
                .js-truncate {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: block;
                }
            </style>
            <script>
                function truncateText(selector, lines) {
                    const element = document.querySelector(selector);
                    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
                    element.style.maxHeight = ;
                }
                window.onload = () => truncateText('.js-truncate', 3);
            </script>
        </head>
        <body>
            <div class="js-truncate">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vivamus lacinia odio vitae vestibulum. Fusce volutpat odio nec luctus dapibus.
              Praesent a vehicula sapien, ac feugiat nisl. Integer accumsan turpis at ligula fermentum.
            </div>
        </body>
        </html>`}
      />
      <InputOptionsCard />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

export default Test;
