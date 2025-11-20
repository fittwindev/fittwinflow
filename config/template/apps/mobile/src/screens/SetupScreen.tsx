import { useCallback, useState } from "react";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { TextInput, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Heading, BodyText, Button, Card, MutedText, Stack, colors } from "@fitted/ui-native";
import type { FlowStackParamList } from "../navigation/FlowNavigator";
import { useMobileCamera } from "../hooks/useMobileCamera";
import { CameraPreview } from "../components/CameraPreview";
import { LidarBanner } from "../components/LidarBanner";
import { useFlow } from "../state/FlowContext";

export default function SetupScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "Setup">) {
  const camera = useMobileCamera();
  const { heightCm, setHeightCm } = useFlow();
  const [heightInput, setHeightInput] = useState(heightCm ? String(heightCm) : "");

  useFocusEffect(
    useCallback(() => {
      return () => camera.pausePreview();
    }, [camera])
  );

  const handleHeightChange = (value: string) => {
    setHeightInput(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setHeightCm(parsed);
    } else {
      setHeightCm(undefined);
    }
  };

  return (
    <Screen>
      <Stack gap={16}>
        <Heading level={2}>Setup & Guidance</Heading>
        <BodyText>Align to the outline, step back 6–8 ft, enable LiDAR overlay if available.</BodyText>
        <Card>
          <MutedText>Height (cm)</MutedText>
          <TextInput
            keyboardType="number-pad"
            value={heightInput}
            onChangeText={handleHeightChange}
            placeholder="170"
            style={styles.input}
          />
          <MutedText>Helps the measurement engine calibrate scale.</MutedText>
        </Card>
        <LidarBanner active={camera.isActive} />
        <CameraPreview controller={camera} />
        <Stack gap={12}>
          <Button label="Enable Camera" onPress={() => camera.startPreview()} />
          <Button label="Pause Stream" variant="secondary" onPress={camera.pausePreview} disabled={!camera.isActive} />
          <Button label="I'm Ready" onPress={() => navigation.navigate("Front-Capture")} disabled={!camera.ready} />
        </Stack>
        {!camera.hasPermission && <MutedText>Grant camera permission to continue.</MutedText>}
        {camera.error && <MutedText style={styles.error}>{camera.error}</MutedText>}
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 6,
    fontSize: 16,
    color: colors.ink
  },
  error: {
    color: "#dc2626"
  }
});
