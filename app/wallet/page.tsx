"use client";
import { useState } from 'react';

export default function WalletPage() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const downloadPass = async () => {
    if (!vehicleNumber) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate-pass', {
        method: 'POST',
        body: JSON.stringify({ vehicleNumber }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Server Error: " + JSON.stringify(errorData));
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FuelPass_${vehicleNumber}.pkpass`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
    } catch (err) {
      alert("Connection Error. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          <div className={`w-6 h-6 border-4 border-white border-t-transparent rounded-full ${loading ? 'animate-spin' : ''}`} />
        </div>
        
        <h1 className="text-white font-black text-2xl italic uppercase tracking-tighter mb-8">Fuel Helper Wallet</h1>
        
        <input 
          type="text" 
          placeholder="ENTER VEHICLE NUMBER"
          className="w-full bg-white/5 border border-white/20 p-5 rounded-2xl text-white text-center font-bold mb-6 outline-none focus:border-red-600 transition-all"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
        />

        <button 
          onClick={downloadPass}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "GENERATING..." : "DOWNLOAD PASS"}
        </button>

        <p className="text-[9px] text-zinc-600 mt-8 uppercase font-bold tracking-[0.2em]">
          Zero Data Policy • Sri Lanka 2026
        </p>
      </div>
    </div>
  );
}