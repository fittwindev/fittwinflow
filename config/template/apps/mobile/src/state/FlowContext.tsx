import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { MeasurementResult } from "../services/measurementClient";

export type CapturedPhoto = {
  dataUrl: string;
  width: number;
  height: number;
};

type FlowStore = {
  frontPhoto?: CapturedPhoto;
  sidePhoto?: CapturedPhoto;
  heightCm?: number;
  measurement?: MeasurementResult | null;
  setFrontPhoto: (photo?: CapturedPhoto) => void;
  setSidePhoto: (photo?: CapturedPhoto) => void;
  setHeightCm: (value?: number) => void;
  setMeasurement: (value: MeasurementResult | null) => void;
  reset: () => void;
};

const FlowContext = createContext<FlowStore | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [frontPhoto, setFrontPhoto] = useState<CapturedPhoto | undefined>();
  const [sidePhoto, setSidePhoto] = useState<CapturedPhoto | undefined>();
  const [heightCm, setHeightCm] = useState<number | undefined>();
  const [measurement, setMeasurement] = useState<MeasurementResult | null>(null);

  const reset = useCallback(() => {
    setFrontPhoto(undefined);
    setSidePhoto(undefined);
    setMeasurement(null);
    setHeightCm(undefined);
  }, []);

  const value = useMemo(
    () => ({
      frontPhoto,
      sidePhoto,
      heightCm,
      measurement,
      setFrontPhoto,
      setSidePhoto,
      setHeightCm,
      setMeasurement,
      reset
    }),
    [frontPhoto, heightCm, measurement, sidePhoto]
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) {
    throw new Error("useFlow must be used within FlowProvider");
  }
  return ctx;
}
