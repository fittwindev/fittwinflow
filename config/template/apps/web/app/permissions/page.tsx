"use client";
export default function Page(){
  return (
    <main className="e-container py-8">
      <div className="e-card p-6">
        <h3 className="text-xl font-semibold">Camera request</h3>
        <p className="e-muted">We use your camera to capture two photos. Privacy: photos handled per your settings.</p>
      </div>
      <button className="e-btn mt-6" onClick={()=>location.href="/setup"}>Allow Camera Access</button>
      <p className="text-sm e-muted mt-2">You can enable access later in Settings.</p>
    </main>
  );
}
