import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import { Screen, Heading, BodyText, Button, MutedText, Stack } from "@fitted/ui-native";
import { useCameraPermissions } from "expo-camera";
import type { FlowStackParamList } from "../navigation/FlowNavigator";

export default function PermissionsScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "Permissions">) {
  const [permission, requestPermission] = useCameraPermissions();
  const granted = permission?.granted ?? false;

  const handleRequest = async () => {
    const result = await requestPermission();
    if (result.granted) {
      navigation.navigate("Setup");
    } else {
      Alert.alert("Permission needed", "Enable camera access to continue the capture flow.");
    }
  };

  return (
    <Screen>
      <Stack gap={16}>
        <Heading level={2}>Camera Request</Heading>
        <BodyText>We only use the camera to capture two silhouettes. Photos stay local unless you opt into syncing.</BodyText>
        <Button label={granted ? "Permission Granted" : "Allow Camera Access"} disabled={granted} onPress={handleRequest} />
        <MutedText>You can adjust access anytime in Settings.</MutedText>
        {granted && <Button label="Continue" variant="secondary" onPress={() => navigation.navigate("Setup")} />}
      </Stack>
    </Screen>
  );
}
