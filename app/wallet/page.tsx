"use client";
import { useState } from 'react';

export default function WalletPage() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGeneratePass = async () => {
    if (!vehicleNumber) {
      alert("Please enter your Vehicle Number");
      return;
    }

    setIsSyncing(true);

    try {
      const response = await fetch('/api/generate-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber }), // Sending only vehicleNumber
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const blob = await response.blob();
      
      // Trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FuelPass_${vehicleNumber}.pkpass`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      alert("Success! Your Fuel Pass is downloading.");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-sm bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-xl">
        
        {/* Animated Status Icon */}
        <div className="w-20 h-20 bg-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <div className={`w-10 h-10 bg-red-600 rounded-xl ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
        </div>

        <h2 className="text-white font-black text-2xl italic uppercase tracking-tighter">My Fuel Pass</h2>
        <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Secure Wallet Generation</p>
        
        <div className="mt-10">
          <input 
            type="text" 
            placeholder="VEHICLE NO (e.g. WP CAB-1234)"
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white text-sm uppercase font-bold outline-none focus:border-red-600 transition-colors"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGeneratePass}
          disabled={isSyncing}
          className="mt-8 w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isSyncing ? "GENERATING..." : "ADD TO WALLET"}
        </button>

        <p className="text-[9px] text-zinc-700 mt-8 uppercase font-bold tracking-widest">
          Privacy: No data is saved on our servers.
        </p>
      </div>
    </div>
  );
}