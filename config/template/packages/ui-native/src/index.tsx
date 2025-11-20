import type { ReactNode } from "react";
import { StyleSheet, Text, type TextProps, View, type ViewProps, ViewStyle, ScrollView, Pressable, type PressableProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const colors = {
  background: "rgb(246,249,252)",
  card: "#fff",
  line: "rgb(226,232,240)",
  ink: "rgb(18,24,38)",
  muted: "rgb(95,105,120)",
  accent: "rgb(16,184,166)"
};

export const radius = 12;

const baseShadow = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3
};

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export function Screen({ children, scroll = true, style, contentStyle }: ScreenProps) {
  const content = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>{content}</ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

type ButtonProps = Omit<PressableProps, "style"> & {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ label, variant = "primary", ...rest }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}` as const],
        rest.disabled && styles.button_disabled,
        pressed && !rest.disabled && styles.button_pressed
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          variant !== "primary" && { color: colors.ink },
          rest.disabled && styles.buttonLabelDisabled
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type CardProps = ViewProps & { children: ReactNode };
export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View {...rest} style={[styles.card, style]}>
      {children}
    </View>
  );
}

type HeadingProps = TextProps & { level?: 1 | 2 | 3 };
export function Heading({ level = 1, style, ...rest }: HeadingProps) {
  const size = level === 1 ? 32 : level === 2 ? 24 : 18;
  return <Text {...rest} style={[styles.heading, { fontSize: size }, style]} />;
}

export function BodyText({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[styles.body, style]} />;
}

export function MutedText({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[styles.body, styles.muted, style]} />;
}

export function Stack({ gap = 12, style, children }: { gap?: number; style?: ViewStyle; children: ReactNode | ReactNode[] }) {
  const normalized = (Array.isArray(children) ? children : [children]).filter((child) => child !== null && child !== undefined);
  return (
    <View style={style}>
      {normalized.map((child, index) => (
        <View key={index} style={index === 0 ? undefined : { marginTop: gap }}>
          {child}
        </View>
      ))}
    </View>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    padding: 24
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    ...baseShadow
  },
  heading: {
    color: colors.ink,
    fontWeight: "700"
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22
  },
  muted: {
    color: colors.muted
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  button_primary: {
    backgroundColor: colors.accent
  },
  button_secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line
  },
  button_ghost: {
    backgroundColor: "transparent"
  },
  button_pressed: {
    opacity: 0.8
  },
  button_disabled: {
    opacity: 0.5
  },
  buttonLabel: {
    color: "white",
    fontWeight: "600",
    fontSize: 16
  },
  buttonLabelDisabled: {
    opacity: 0.6
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    width: "100%"
  }
});
