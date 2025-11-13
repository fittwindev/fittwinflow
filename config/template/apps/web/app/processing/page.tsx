"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
export default function Page(){
  const router = useRouter();
  const [progress, setProgress] = useState(15);
  const [stage, setStage] = useState(0);
  const stages = useMemo(()=>[
    { label: "Analyzing alignment", target: 35 },
    { label: "Creating 3D model", target: 68 },
    { label: "Calculating measurements", target: 100 }
  ],[]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const front = sessionStorage.getItem("frontPhoto");
    const side = sessionStorage.getItem("sidePhoto");
    if (!front) {
      router.replace("/front-capture");
      return;
    }
    if (!side) {
      router.replace("/rotate-side");
      return;
    }
    const timers = stages.map((step, index) => setTimeout(()=>{
      setStage(index);
      setProgress(step.target);
      if(index === stages.length - 1){
        setTimeout(()=>router.push("/results"), 1500);
      }
    }, (index + 1) * 1200));
    return () => timers.forEach(clearTimeout);
  }, [router, stages]);
  return (
    <main className="e-container py-8">
      <h2 className="text-2xl font-semibold mb-4">Processing (~30 s)</h2>
      <div className="e-grid">
        {stages.map((step, index)=>(
          <div key={step.label} className={`e-card p-4 ${index<=stage ? "border-[rgb(16_184_166)]" : ""}`}>
            {step.label}{index===stage && "…"}
          </div>
        ))}
      </div>
      <div className="w-full h-2 bg-white border border-[rgb(226_232_240)] rounded mt-3 overflow-hidden">
        <div className="h-full transition-all duration-500" style={{background:"rgb(16 184 166)",width:`${progress}%`}}/>
      </div>
      <p className="text-sm e-muted mt-2">We’re using your front and side captures to derive measurements.</p>
    </main>
  );
}
