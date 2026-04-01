"use client";
import { useState } from 'react';

export default function WalletPage() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGeneratePass = async () => {
    if (!vehicleNumber) return;
    setIsSyncing(true);

    try {
      const response = await fetch('/api/generate-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber }),
      });

      if (!response.ok) throw new Error('API Error');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FuelPass_${vehicleNumber}.pkpass`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900/40 border border-white/10 rounded-[3rem] p-12 text-center backdrop-blur-2xl">
        <div className="w-20 h-20 bg-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-600/20">
          <div className={`w-10 h-10 bg-red-600 rounded-xl ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
        </div>
        <h1 className="text-white font-black text-3xl italic uppercase tracking-tighter mb-10">My Fuel Pass</h1>
        <input 
          type="text" 
          placeholder="VEHICLE NO (E.G. WP ABC-1234)"
          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white text-lg uppercase font-bold outline-none focus:border-red-600 mb-8"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <button 
          onClick={handleGeneratePass}
          disabled={isSyncing}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl transition-all active:scale-95 disabled:opacity-30"
        >
          {isSyncing ? "GENERATING..." : "ADD TO WALLET"}
        </button>
        <p className="text-[10px] text-zinc-600 mt-10 uppercase font-bold tracking-widest leading-relaxed">
          Technical Excellence • Privacy Secured<br/>We do not save or see your data.
        </p>
      </div>
    </div>
  );
}