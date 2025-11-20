import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import HowItWorksScreen from "../screens/HowItWorksScreen";
import PermissionsScreen from "../screens/PermissionsScreen";
import SetupScreen from "../screens/SetupScreen";
import FrontCaptureScreen from "../screens/FrontCaptureScreen";
import RotateSideScreen from "../screens/RotateSideScreen";
import ProcessingScreen from "../screens/ProcessingScreen";
import ResultsScreen from "../screens/ResultsScreen";

export type FlowStackParamList = {
  Welcome: undefined;
  "How-It-Works": undefined;
  Permissions: undefined;
  Setup: undefined;
  "Front-Capture": undefined;
  "Rotate-Side": undefined;
  Processing: undefined;
  Results: undefined;
};

const Stack = createNativeStackNavigator<FlowStackParamList>();

export default function FlowNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="How-It-Works" component={HowItWorksScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="Front-Capture" component={FrontCaptureScreen} />
      <Stack.Screen name="Rotate-Side" component={RotateSideScreen} />
      <Stack.Screen name="Processing" component={ProcessingScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}
