import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

export default function CorePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopic = async () => {
      try {
        const filePath = FileSystem.documentDirectory + `topics/${id}.json`;
        const jsonString = await FileSystem.readAsStringAsync(filePath);
        const data = JSON.parse(jsonString);
        setTopic(data);
      } catch (error) {
        console.error("Error loading topic:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadTopic();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" />;
  if (!topic) return <Text>Topic not found</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Stack.Screen options={{ title: topic.topicName }} />
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {topic.topicName}
      </Text>
      <Text>Cards: {topic.totalCards}</Text>
    </View>
  );
}
