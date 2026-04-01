"use client";
import { useState } from 'react';

export default function WalletPage() {
  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleDownload = () => {
    if (!vehicleNumber) {
      alert("Please enter a vehicle number");
      return;
    }
    // DIRECT BROWSER REDIRECT
    window.location.href = `/api/generate-pass?v=${encodeURIComponent(vehicleNumber.toUpperCase())}`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 text-center">
        <h1 className="text-white font-black text-2xl italic uppercase mb-10">Fuel Pass Wallet</h1>
        
        <input 
          type="text" 
          placeholder="ABC-1234"
          className="w-full bg-white/5 border border-white/20 p-5 rounded-2xl text-white text-center font-bold mb-8 outline-none"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />

        <button 
          onClick={handleDownload}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl active:scale-95 transition-all"
        >
          DOWNLOAD PASS
        </button>
      </div>
    </div>
  );
}