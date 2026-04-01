"use client";
import { useState } from 'react';

export default function WalletPage() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGeneratePass = async () => {
    alert("Step 1: Button Clicked!"); // Debug Alert

    if (!vehicleNumber) {
      alert("Error: Please enter a vehicle number.");
      return;
    }

    setIsSyncing(true);

    try {
      alert("Step 2: Sending request to /api/generate-pass..."); // Debug Alert
      const response = await fetch('/api/generate-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber }),
      });

      alert(`Step 3: Server responded with status: ${response.status}`); // Debug Alert

      if (!response.ok) {
        const text = await response.text();
        alert(`Step 3.5: Server Error Details: ${text}`);
        throw new Error('Server rejected the request');
      }

      alert("Step 4: Getting the file blob..."); // Debug Alert
      const blob = await response.blob();
      alert(`Step 5: File received! Size: ${blob.size} bytes`);

      // Final Download Trigger
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FuelPass.pkpass`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      alert("Step 6: Download triggered! Check your notification bar.");
    } catch (err: any) {
      alert(`Final Catch Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 text-center">
        <h2 className="text-white font-black text-2xl italic uppercase tracking-tighter mb-6">My Fuel Pass</h2>
        
        <input 
          type="text" 
          placeholder="VEHICLE NUMBER"
          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white mb-6 outline-none"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />

        <button 
          onClick={handleGeneratePass}
          disabled={isSyncing}
          className="w-full bg-red-600 text-white font-black py-4 rounded-2xl active:scale-95 disabled:opacity-50"
        >
          {isSyncing ? "PROCESSING..." : "ADD TO WALLET"}
        </button>
      </div>
    </div>
  );
}