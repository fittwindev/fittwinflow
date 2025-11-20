import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Heading, MutedText, colors } from "@fitted/ui-native";

type Props = {
  seconds: number;
  label?: string;
  onComplete?: () => void;
};

export function Countdown({ seconds, label = "Auto-capture at", onComplete }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const completedRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    completedRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }
    const timer = setTimeout(() => setRemaining((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearTimeout(timer);
  }, [onComplete, remaining]);

  return (
    <Card style={styles.card}>
      <MutedText>{label}</MutedText>
      <Heading level={2}>{remaining}s</Heading>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});
