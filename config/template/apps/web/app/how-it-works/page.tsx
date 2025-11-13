"use client";
export default function Page(){
  return (
    <main className="e-container py-8">
      <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
      <div className="e-grid">
        <div className="e-card p-4"><div className="font-semibold">Capture</div><div className="e-muted">2 photos (front & side)</div></div>
        <div className="e-card p-4"><div className="font-semibold">Create</div><div className="e-muted">3D twin</div></div>
        <div className="e-card p-4"><div className="font-semibold">Shop</div><div className="e-muted">size recs</div></div>
      </div>
      <button className="e-btn mt-6" onClick={()=>location.href="/permissions"}>Continue</button>
    </main>
  );
}
