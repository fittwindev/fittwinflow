import { useEffect, useState } from "react";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, Alert, View, StyleSheet } from "react-native";
import { Screen, Heading, Card, MutedText, BodyText, Button, Stack } from "@fitted/ui-native";
import type { FlowStackParamList } from "../navigation/FlowNavigator";
import { useFlow } from "../state/FlowContext";
import { requestMeasurement } from "../services/measurementClient";

const metrics = [
  { key: "height", label: "Height" },
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" }
] as const;

type MetricKey = (typeof metrics)[number]["key"];

export default function ResultsScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "Results">) {
  const { frontPhoto, sidePhoto, measurement, setMeasurement, reset } = useFlow();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!frontPhoto) {
      navigation.replace("Front-Capture");
      return;
    }
    if (!sidePhoto) {
      navigation.replace("Rotate-Side");
    }
  }, [frontPhoto, navigation, sidePhoto]);

  useEffect(() => {
    if (measurement || !frontPhoto || !sidePhoto || loading) return;
    setLoading(true);
    requestMeasurement({ frontImage: frontPhoto, sideImage: sidePhoto })
      .then((result) => setMeasurement(result))
      .finally(() => setLoading(false));
  }, [frontPhoto, loading, measurement, setMeasurement, sidePhoto]);

  const valueFor = (key: MetricKey) => {
    if (!measurement) return "Processing…";
    return `${measurement[key]} ${measurement.units}`;
  };

  return (
    <Screen>
      <Stack gap={16}>
        <Heading level={2}>Your Results</Heading>
        <Stack gap={12}>
          {metrics.map((metric) => (
            <Card key={metric.key}>
              <Heading level={3}>{metric.label}</Heading>
              <MutedText>{valueFor(metric.key)}</MutedText>
            </Card>
          ))}
        </Stack>
        <View style={styles.imageGrid}>
          {frontPhoto && <Image source={{ uri: frontPhoto.dataUrl }} style={styles.preview} />}
          {sidePhoto && <Image source={{ uri: sidePhoto.dataUrl }} style={styles.preview} />}
        </View>
        <Stack gap={12}>
          <Button label="View All Measurements" onPress={() => Alert.alert("Coming soon", "Full measurement packets ship with the backend service.")} />
          <Button label="Start Shopping" variant="secondary" onPress={() => Alert.alert("Shop", "Connect commerce client here.")} />
          <Button
            label="Restart Flow"
            variant="ghost"
            onPress={() => {
              reset();
              navigation.replace("Welcome");
            }}
          />
        </Stack>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageGrid: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap"
  },
  preview: {
    flex: 1,
    minWidth: "45%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(226,232,240,1)"
  }
});
