import { Camera } from "expo-camera";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@fitted/ui-native";
import type { MobileCameraController } from "../hooks/useMobileCamera";

export function CameraPreview({ controller }: { controller: MobileCameraController }) {
  const overlayMessage = useMemo(() => {
    if (controller.error) return controller.error;
    if (!controller.hasPermission) return "Camera permission needed";
    if (!controller.ready) return controller.isActive ? "Preparing camera…" : "Start camera to preview";
    return null;
  }, [controller.error, controller.hasPermission, controller.isActive, controller.ready]);

  return (
    <View style={styles.wrapper}>
      {controller.isActive && controller.hasPermission ? (
        <Camera
          ref={(ref) => {
            controller.cameraRef.current = ref;
          }}
          style={StyleSheet.absoluteFill}
          ratio="4:3"
          onCameraReady={controller.onCameraReady}
          type={controller.facing}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
          <Text style={styles.placeholderText}>Camera inactive</Text>
        </View>
      )}
      {overlayMessage && (
        <View style={[StyleSheet.absoluteFill, styles.overlay]}>
          <Text style={styles.overlayText}>{overlayMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "black",
    position: "relative"
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  placeholderText: {
    color: "white"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center"
  },
  overlayText: {
    color: "white",
    textAlign: "center",
    paddingHorizontal: 12
  }
});
