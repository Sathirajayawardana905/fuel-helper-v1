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

      if (!response.ok) throw new Error('API failed');

      // 1. Get binary data
      const blob = await response.blob();
      
      // 2. Create the file URL
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/vnd.apple.pkpass' }));
      
      // 3. Create a real link and CLICK it automatically
      const link = document.createElement('a');
      link.href = url;
      link.download = `FuelPass_${vehicleNumber}.pkpass`;
      document.body.appendChild(link);
      link.click();
      
      // 4. Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert("Download failed. Make sure your vehicle number is correct.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 text-center">
        <h1 className="text-white font-black text-2xl italic uppercase mb-8">My Fuel Pass</h1>
        
        <input 
          type="text" 
          placeholder="VEHICLE NUMBER"
          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-center font-bold mb-6"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />

        <button 
          onClick={handleGeneratePass}
          disabled={isSyncing}
          className="w-full bg-red-600 text-white font-black py-4 rounded-2xl active:scale-95 disabled:opacity-50"
        >
          {isSyncing ? "GENERATING FILE..." : "DOWNLOAD WALLET PASS"}
        </button>
      </div>
    </div>
  );
}