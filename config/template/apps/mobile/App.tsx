import "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlowNavigator from "./src/navigation/FlowNavigator";
import { FlowProvider } from "./src/state/FlowContext";
import { colors } from "@fitted/ui-native";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.ink,
    border: colors.line
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <FlowProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <FlowNavigator />
        </NavigationContainer>
      </FlowProvider>
    </SafeAreaProvider>
  );
}
