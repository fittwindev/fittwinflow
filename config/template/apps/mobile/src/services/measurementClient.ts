import type { CapturedPhoto } from "../state/FlowContext";

export type MeasurementRequest = {
  frontImage: CapturedPhoto;
  sideImage: CapturedPhoto;
  heightCm?: number;
  metadata?: Record<string, unknown>;
};

export type MeasurementResult = {
  height: number;
  chest: number;
  waist: number;
  hips: number;
  units: "cm" | "in";
  provenance: {
    front: string;
    side: string;
    lidar: boolean;
  };
};

function deriveValue(signature: number, base: number, spread: number) {
  return Math.round(base + (signature % spread));
}

export async function requestMeasurement(payload: MeasurementRequest): Promise<MeasurementResult> {
  // TODO: Replace mock implementation with real measurement service integration once backend is wired up.
  await new Promise((resolve) => setTimeout(resolve, 800));
  const signature = payload.frontImage.dataUrl.length + payload.sideImage.dataUrl.length + (payload.heightCm ?? 0);
  return {
    height: payload.heightCm ?? deriveValue(signature, 165, 15),
    chest: deriveValue(signature, 92, 10),
    waist: deriveValue(signature, 74, 8),
    hips: deriveValue(signature, 98, 12),
    units: "cm",
    provenance: {
      front: new Date().toISOString(),
      side: new Date().toISOString(),
      lidar: false
    }
  };
}
