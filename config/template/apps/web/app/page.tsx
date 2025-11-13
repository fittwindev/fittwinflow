"use client";
export default function Page(){
  return (
    <main className="min-h-dvh e-bg flex flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-5xl font-bold e-hero">Meet Your Digital Twin</h1>
      <button className="e-btn" onClick={()=>location.href="/how-it-works"}>Get Started</button>
    </main>
  );
}
