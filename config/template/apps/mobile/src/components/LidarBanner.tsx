import { StyleSheet, Text, View } from "react-native";
import { colors } from "@fitted/ui-native";

export function LidarBanner({ active = false }: { active?: boolean }) {
  return (
    <View style={[styles.banner, active && styles.active]}>
      <Text style={styles.title}>LiDAR Alignment</Text>
      <Text style={styles.subtitle}>{active ? "Live depth assist enabled" : "Align silhouette and stand back 6–8 ft"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(16,184,166,0.08)"
  },
  active: {
    borderColor: colors.accent
  },
  title: {
    color: colors.ink,
    fontWeight: "600"
  },
  subtitle: {
    color: colors.muted,
    marginTop: 4
  }
});
