import { useCallback, useState } from "react";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Heading, BodyText, Button, Stack, MutedText } from "@fitted/ui-native";
import type { FlowStackParamList } from "../navigation/FlowNavigator";
import { useMobileCamera } from "../hooks/useMobileCamera";
import { CameraPreview } from "../components/CameraPreview";
import { Countdown } from "../components/Countdown";
import { LidarBanner } from "../components/LidarBanner";
import { useFlow } from "../state/FlowContext";

export default function RotateSideScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "Rotate-Side">) {
  const camera = useMobileCamera();
  const { setSidePhoto, sidePhoto } = useFlow();
  const [localPreview, setLocalPreview] = useState(sidePhoto?.dataUrl ?? null);

  useFocusEffect(
    useCallback(() => {
      camera.startPreview();
      return () => camera.pausePreview();
    }, [camera])
  );

  const handleCapture = useCallback(async () => {
    const shot = await camera.capture();
    if (!shot) {
      Alert.alert("Capture failed", camera.error ?? "Try again.");
      return;
    }
    setSidePhoto(shot);
    setLocalPreview(shot.dataUrl);
    setTimeout(() => navigation.navigate("Processing"), 600);
  }, [camera, navigation, setSidePhoto]);

  return (
    <Screen>
      <Stack gap={16}>
        <Heading level={2}>Rotate & Side Capture</Heading>
        <LidarBanner active />
        <Countdown seconds={5} label="Auto-capture at" onComplete={handleCapture} />
        <BodyText>Turn 90° left, keep shoulders relaxed, and let the countdown finish.</BodyText>
        <CameraPreview controller={camera} />
        <Button label="Capture Now" onPress={handleCapture} disabled={!camera.ready} />
        {localPreview && (
          <>
            <Heading level={3}>Side capture</Heading>
            <Image source={{ uri: localPreview }} style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 12 }} />
          </>
        )}
        {!camera.ready && <MutedText>Camera is preparing preview…</MutedText>}
      </Stack>
    </Screen>
  );
}
