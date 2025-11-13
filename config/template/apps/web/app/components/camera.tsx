"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type FacingMode = MediaTrackConstraints["facingMode"];
type CameraOptions = { facingMode?: FacingMode; autoStart?: boolean };

const waitForVideo = async (ref: React.RefObject<HTMLVideoElement>) => {
  if (ref.current) return ref.current;
  for (let i = 0; i < 12; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    if (ref.current) return ref.current;
  }
  return ref.current;
};

async function waitForMetadata(video: HTMLVideoElement) {
  if (video.readyState >= 1) return;
  await new Promise<void>((resolve) => {
    const handler = () => {
      video.removeEventListener("loadedmetadata", handler);
      resolve();
    };
    video.addEventListener("loadedmetadata", handler, { once: true });
  });
}

async function waitForDimensions(video: HTMLVideoElement) {
  if (video.videoWidth > 0 && video.videoHeight > 0) return;
  await new Promise<void>((resolve) => {
    const handler = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        video.removeEventListener("loadeddata", handler);
        resolve();
      }
    };
    video.addEventListener("loadeddata", handler);
  });
}

export function useCamera({ facingMode = "environment", autoStart = true }: CameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const startingRef = useRef(false);

  const detach = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.srcObject = null;
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    startingRef.current = false;
    detach();
    setReady(false);
  }, [detach]);

  const attach = useCallback(async (stream: MediaStream) => {
    const video = await waitForVideo(videoRef);
    if (!video) throw new Error("Camera preview missing.");
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    video.setAttribute("playsinline", "true");
    video.muted = true;
    await waitForMetadata(video);
    await video.play().catch(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      await video.play().catch(() => undefined);
    });
    await waitForDimensions(video);
  }, []);

  const start = useCallback(async () => {
    if (startingRef.current) return;
    if (streamRef.current) {
      setReady(true);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera not supported in this browser.");
      return;
    }
    try {
      startingRef.current = true;
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      streamRef.current = stream;
      await attach(stream);
      setHasPermission(true);
      setReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to access camera.");
      stop();
    } finally {
      startingRef.current = false;
    }
  }, [attach, facingMode, stop]);

  useEffect(() => {
    if (!autoStart) return;
    let cancelled = false;
    (async () => {
      await start();
      if (cancelled) stop();
    })();
    return () => {
      cancelled = true;
      stop();
    };
  }, [autoStart, start, stop]);

  useEffect(() => {
    if (!streamRef.current) return;
    attach(streamRef.current).catch((err) => setError(err instanceof Error ? err.message : "Camera preview error."));
  }, [attach]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !ready || !video.videoWidth || !video.videoHeight) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  }, [ready]);

  return { videoRef, ready, error, capture, stop, start, hasPermission };
}

export function CameraPreview({ controller }: { controller: ReturnType<typeof useCamera> }) {
  const overlayMessage = controller.error ?? (!controller.ready ? "Requesting camera access…" : null);
  return (
    <div className="relative rounded-lg overflow-hidden border border-[rgb(226_232_240)] bg-black/40">
      <video ref={controller.videoRef} playsInline muted className="w-full aspect-[3/4] object-cover bg-black" />
      {overlayMessage && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/60 text-center p-4">
          {overlayMessage}
        </div>
      )}
    </div>
  );
}
