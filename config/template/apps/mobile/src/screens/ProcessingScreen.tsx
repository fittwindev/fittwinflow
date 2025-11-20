import { useEffect, useMemo, useRef, useState } from "react";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen, Heading, Card, MutedText, BodyText, Stack, colors } from "@fitted/ui-native";
import type { FlowStackParamList } from "../navigation/FlowNavigator";
import { useFlow } from "../state/FlowContext";
import { requestMeasurement } from "../services/measurementClient";

export default function ProcessingScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "Processing">) {
  const { frontPhoto, sidePhoto, heightCm, setMeasurement } = useFlow();
  const [progress, setProgress] = useState(15);
  const [stageIndex, setStageIndex] = useState(0);
  const submittedRef = useRef(false);

  const stages = useMemo(
    () => [
      { label: "Analyzing alignment", target: 35 },
      { label: "Creating 3D model", target: 68 },
      { label: "Calculating measurements", target: 100 }
    ],
    []
  );

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
    if (!frontPhoto || !sidePhoto || submittedRef.current) return;
    const timers = stages.map((stage, idx) =>
      setTimeout(() => {
        setStageIndex(idx);
        setProgress(stage.target);
        if (idx === stages.length - 1) {
          submittedRef.current = true;
          requestMeasurement({ frontImage: frontPhoto, sideImage: sidePhoto, heightCm })
            .then((result) => {
              setMeasurement(result);
              navigation.replace("Results");
            })
            .catch(() => {
              navigation.replace("Results");
            });
        }
      }, (idx + 1) * 1200)
    );
    return () => timers.forEach(clearTimeout);
  }, [frontPhoto, heightCm, navigation, setMeasurement, sidePhoto, stages]);

  return (
    <Screen>
      <Stack gap={16}>
        <Heading level={2}>Processing (~30 s)</Heading>
        <Stack gap={12}>
          {stages.map((stage, idx) => (
            <Card key={stage.label} style={idx <= stageIndex ? styles.activeCard : undefined}>
              <BodyText>{stage.label}{idx === stageIndex ? "…" : ""}</BodyText>
            </Card>
          ))}
        </Stack>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <MutedText>We’re using your front and side captures to derive precise measurements.</MutedText>
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  activeCard: {
    borderColor: colors.accent
  },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent
  }
});
