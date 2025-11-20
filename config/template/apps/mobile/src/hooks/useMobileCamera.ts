import { useCallback, useMemo, useRef, useState } from "react";
import { Camera, CameraType, useCameraPermissions } from "expo-camera";

export type CapturedResult = {
  dataUrl: string;
  width: number;
  height: number;
};

type Options = {
  facing?: CameraType;
};

export function useMobileCamera({ facing = CameraType.back }: Options = {}) {
  const cameraRef = useRef<Camera | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const hasPermission = !!permission?.granted;

  const ensurePermission = useCallback(async () => {
    if (hasPermission) return true;
    const response = await requestPermission();
    return response.granted;
  }, [hasPermission, requestPermission]);

  const startPreview = useCallback(async () => {
    const granted = await ensurePermission();
    if (!granted) {
      setError("Camera permission is required.");
      return false;
    }
    setError(null);
    setIsActive(true);
    return true;
  }, [ensurePermission]);

  const pausePreview = useCallback(() => {
    setIsActive(false);
    setReady(false);
  }, []);

  const capture = useCallback(async (): Promise<CapturedResult | null> => {
    if (!cameraRef.current || !ready) {
      setError("Camera is not ready yet.");
      return null;
    }
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        base64: true,
        skipProcessing: true
      });
      if (!result.base64) {
        setError("Unable to capture frame.");
        return null;
      }
      return {
        dataUrl: `data:image/jpeg;base64,${result.base64}`,
        width: result.width ?? 0,
        height: result.height ?? 0
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Capture failed");
      return null;
    }
  }, [ready]);

  const onCameraReady = useCallback(() => {
    setReady(true);
  }, []);

  return {
    cameraRef,
    facing,
    ready,
    error,
    hasPermission,
    isActive,
    startPreview,
    pausePreview,
    capture,
    onCameraReady
  };
}

export type MobileCameraController = ReturnType<typeof useMobileCamera>;
