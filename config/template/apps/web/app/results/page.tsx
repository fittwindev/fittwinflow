"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Measures = { height: number; chest: number; waist: number; hips: number };
export default function Page(){
  const router = useRouter();
  const [photos, setPhotos] = useState<{ front?: string; side?: string }>({});
  const [measures, setMeasures] = useState<Measures | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const front = sessionStorage.getItem("frontPhoto") ?? undefined;
    const side = sessionStorage.getItem("sidePhoto") ?? undefined;
    if (!front || !side) {
      router.replace("/front-capture");
      return;
    }
    setPhotos({ front, side });
    if (front && side) {
      const signature = front.length + side.length;
      const height = 160 + (signature % 15);
      const chest = 90 + (signature % 10);
      const waist = 72 + (signature % 8);
      const hips = 95 + (signature % 12);
      setMeasures({ height, chest, waist, hips });
    }
  }, [router]);
  const measureList = [
    { key: "height", label: "Height" },
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hips", label: "Hips" }
  ] as const;
  return (
    <main className="e-container py-8">
      <h2 className="text-2xl font-semibold mb-4">Your Results</h2>
      <div className="grid grid-cols-2 gap-4">
        {measureList.map((entry)=>(
          <div key={entry.key} className="e-card p-4">
            <div className="font-semibold">{entry.label}</div>
            <div className="e-muted text-lg">
              {measures ? `${measures[entry.key]} cm` : "Processing…"}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {photos.front && <img src={photos.front} alt="Front capture" className="rounded-lg border border-[rgb(226_232_240)] w-full" />}
        {photos.side && <img src={photos.side} alt="Side capture" className="rounded-lg border border-[rgb(226_232_240)] w-full" />}
      </div>
      <div className="flex gap-3 mt-6 flex-wrap">
        <button className="e-btn" onClick={()=>alert('All measurements are available for download soon!')}>View All Measurements</button>
        <button className="e-btn" onClick={()=>location.href="/shop"}>Start Shopping</button>
      </div>
    </main>
  );
}
