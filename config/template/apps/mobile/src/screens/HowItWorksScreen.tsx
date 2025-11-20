import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen, Heading, BodyText, Card, Button, Stack, MutedText } from "@fitted/ui-native";
import type { FlowStackParamList } from "../navigation/FlowNavigator";

const steps = [
  { title: "Capture", copy: "2 photos (front & side)" },
  { title: "Create", copy: "3D twin" },
  { title: "Shop", copy: "size recs" }
];

export default function HowItWorksScreen({ navigation }: NativeStackScreenProps<FlowStackParamList, "How-It-Works">) {
  return (
    <Screen>
      <Stack gap={16}>
        <Heading level={2}>How It Works</Heading>
        <BodyText>Same flow as the web experience, optimized for sensors and camera guidance.</BodyText>
        <Stack gap={12}>
          {steps.map((step) => (
            <Card key={step.title}>
              <Heading level={3}>{step.title}</Heading>
              <MutedText>{step.copy}</MutedText>
            </Card>
          ))}
        </Stack>
        <Button label="Continue" onPress={() => navigation.navigate("Permissions")} />
      </Stack>
    </Screen>
  );
}
