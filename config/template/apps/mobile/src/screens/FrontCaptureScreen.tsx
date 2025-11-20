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

export default function FrontCaptureScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "Front-Capture">) {
  const camera = useMobileCamera();
  const { setFrontPhoto, frontPhoto } = useFlow();
  const [localPreview, setLocalPreview] = useState(frontPhoto?.dataUrl ?? null);

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
    setFrontPhoto(shot);
    setLocalPreview(shot.dataUrl);
    setTimeout(() => navigation.navigate("Rotate-Side"), 600);
  }, [camera, navigation, setFrontPhoto]);

  return (
    <Screen>
      <Stack gap={16}>
        <Heading level={2}>Front Capture</Heading>
        <LidarBanner active />
        <Countdown seconds={10} onComplete={handleCapture} />
        <BodyText>Overlay the outline, keep arms relaxed, and hold still as the timer finishes.</BodyText>
        <CameraPreview controller={camera} />
        <Button label="Capture Now" onPress={handleCapture} disabled={!camera.ready} />
        {!camera.ready && <MutedText>Camera is preparing preview…</MutedText>}
        {localPreview && (
          <>
            <Heading level={3}>Latest capture</Heading>
            <Image source={{ uri: localPreview }} style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 12 }} />
          </>
        )}
      </Stack>
    </Screen>
  );
}
