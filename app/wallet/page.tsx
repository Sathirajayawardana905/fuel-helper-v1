"use client";
import { useState } from 'react';

export default function WalletPage() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [fuelCode, setFuelCode] = useState(''); // This is the QR data
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGeneratePass = async () => {
    if (!vehicleNumber || !fuelCode) {
      alert("Please enter both Vehicle Number and Fuel Code");
      return;
    }

    setIsSyncing(true);

    try {
      const response = await fetch('/api/generate-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber, fuelCode }),
      });

      if (!response.ok) throw new Error('Failed to generate pass');

      // 1. Get the binary file (the .pkpass file)
      const blob = await response.blob();
      
      // 2. Create a temporary download link in the browser
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FuelPass.pkpass'; // File name for the wallet
      document.body.appendChild(a);
      a.click(); // Trigger the download
      window.URL.revokeObjectURL(url);

      alert("Pass generated! Open the file to add it to your Wallet.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-md">
        
        {/* Animated Icon */}
        <div className="w-20 h-20 bg-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <div className={`w-10 h-10 bg-red-600 rounded-xl ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
        </div>

        <h2 className="text-white font-black text-2xl italic uppercase tracking-tighter">My Fuel Pass</h2>
        <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Local Device Generation</p>
        
        <div className="mt-8 space-y-4">
          <input 
            type="text" 
            placeholder="VEHICLE NUMBER (e.g. WP ABC-1234)"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs uppercase font-bold outline-none focus:border-red-600"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="PASTE QR CODE DATA HERE"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs uppercase font-bold outline-none focus:border-red-600"
            value={fuelCode}
            onChange={(e) => setFuelCode(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGeneratePass}
          disabled={isSyncing}
          className="mt-10 w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSyncing ? "SYNCING TO DEVICE..." : "GENERATE WALLET PASS"}
        </button>

        <p className="text-[8px] text-zinc-600 mt-6 uppercase font-bold italic">
          Privacy Secured: No data is saved on our servers.
        </p>
      </div>
    </div>
  );
}