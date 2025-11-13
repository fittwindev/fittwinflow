"use client";
import "@fitted/ui-lit";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraPreview, useCamera } from "../components/camera";
export default function Page(){
  const camera = useCamera();
  const { capture } = camera;
  const countdownRef = useRef<any>(null);
  const router = useRouter();
  const [shot, setShot] = useState<string | null>(null);
  const handleCapture = useCallback(() => {
    const data = capture();
    if (!data) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sidePhoto", data);
    }
    setShot(data);
    setTimeout(()=>router.push("/processing"), 700);
  }, [capture, router]);
  useEffect(() => {
    const el = countdownRef.current;
    if (!el) return;
    const onZero = () => handleCapture();
    el.addEventListener("zero", onZero);
    return () => el.removeEventListener("zero", onZero);
  }, [handleCapture]);
  return (
    <main className="e-container py-8">
      <h2 className="text-2xl font-semibold">Rotate / Side Capture</h2>
      <fit-lidar-banner active></fit-lidar-banner>
      <div className="e-card p-4 flex items-center gap-6 mt-3">
        <fit-countdown ref={countdownRef} seconds="5" label="Auto-capture at"></fit-countdown>
        <div className="text-sm e-muted">Turn 90° left; side capture at 0</div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <CameraPreview controller={camera} />
        <div className="space-y-3">
          <p className="text-sm e-muted">Turn your body left to capture the profile. Auto-capture after 5 seconds.</p>
          <button className="e-btn" onClick={handleCapture} disabled={!camera.ready}>Capture now</button>
          {shot && <img src={shot} alt="Side capture" className="rounded-lg border border-[rgb(226_232_240)] w-full" />}
        </div>
      </div>
    </main>
  );
}
