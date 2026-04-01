"use client";
import { useState } from 'react';

export default function WalletPage() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGeneratePass = async () => {
    if (!vehicleNumber) {
      alert("Please enter your Vehicle Number first.");
      return;
    }

    setIsSyncing(true);

    try {
      // 1. Calling your API
      const response = await fetch('/api/generate-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber }),
      });

      // 2. Handling errors from your API
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }

      // 3. Getting the file
      const blob = await response.blob();
      if (blob.size < 100) throw new Error("The generated file is empty. Check your PassSlot template.");

      // 4. Forcing the browser to download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FuelPass_${vehicleNumber.replace(/\s+/g, '_')}.pkpass`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("🎉 Your Fuel Pass is ready! Check your downloads.");
    } catch (err: any) {
      console.error("Wallet Error:", err);
      alert(`Launch Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md bg-zinc-900/40 border border-white/10 rounded-[3rem] p-12 text-center backdrop-blur-2xl shadow-2xl">
        
        {/* Status Light */}
        <div className="w-24 h-24 bg-red-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-600/20">
          <div className={`w-12 h-12 bg-red-600 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)] ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
        </div>

        <h1 className="text-white font-black text-3xl italic uppercase tracking-tighter mb-2">My Fuel Pass</h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-10">Smart Wallet Integration</p>
        
        <div className="space-y-4">
          <label className="block text-left text-[10px] text-zinc-500 font-bold uppercase ml-2">Vehicle Identification</label>
          <input 
            type="text" 
            placeholder="WP ABC-1234"
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white text-lg uppercase font-bold outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGeneratePass}
          disabled={isSyncing}
          className="mt-10 w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
        >
          {isSyncing ? "SYNCING..." : "ADD TO WALLET"}
        </button>

        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest leading-relaxed">
            Privacy Guaranteed<br/>Data processed in-memory. Nothing is stored.
          </p>
        </div>
      </div>
    </div>
  );
}