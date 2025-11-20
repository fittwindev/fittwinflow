import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen, Heading, BodyText, Button, Stack } from "@fitted/ui-native";
import type { FlowStackParamList } from "../navigation/FlowNavigator";

export default function WelcomeScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "Welcome">) {
  return (
    <Screen>
      <Stack gap={24}>
        <Heading level={1}>Meet Your Digital Twin</Heading>
        <BodyText>
          Capture two quick photos and we’ll build a body model that powers personalized fit, measurement provenance, and size recommendations.
        </BodyText>
        <Button label="Get Started" onPress={() => navigation.navigate("How-It-Works")} />
      </Stack>
    </Screen>
  );
}
