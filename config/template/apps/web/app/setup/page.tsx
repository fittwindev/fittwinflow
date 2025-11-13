"use client";
import "@fitted/ui-lit";
import { CameraPreview, useCamera } from "../components/camera";
export default function Page(){
  const camera = useCamera({ autoStart: false });
  return (
    <main className="e-container py-8">
      <h2 className="text-2xl font-semibold mb-4">Setup / Guidance</h2>
      <div className="e-card p-4 e-shadow">
        <div className="text-sm">Align to outline · Step back 6–8 ft</div>
        <fit-lidar-banner></fit-lidar-banner>
      </div>
      <div className="mt-4">
        <CameraPreview controller={camera} />
        <div className="flex gap-3 mt-3 flex-wrap">
          <button className="e-btn" onClick={()=>camera.start()}>Enable Camera</button>
          <button className="e-btn" onClick={()=>camera.stop()} disabled={!camera.ready}>Pause Stream</button>
          <button className="e-btn" onClick={()=>location.href="/front-capture"} disabled={!camera.ready}>I’m Ready</button>
        </div>
        {!camera.hasPermission && <p className="e-muted text-sm mt-2">Grant camera permission to continue.</p>}
        {camera.error && <p className="text-sm text-red-600 mt-2">{camera.error}</p>}
      </div>
    </main>
  );
}
