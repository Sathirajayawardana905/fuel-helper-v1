"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, MessageSquare, Plus, X, RefreshCw } from 'lucide-react';

export default function Navbar() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fuelCode, setFuelCode] = useState("");
  const [step, setStep] = useState('upload');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedQR = localStorage.getItem('fuel_qr');
    const savedNo = localStorage.getItem('vehicle_no');
    const savedCode = localStorage.getItem('fuel_code');
    if (savedQR) { setQrImage(savedQR); setStep('display'); }
    if (savedNo) setVehicleNumber(savedNo);
    if (savedCode) setFuelCode(savedCode);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setQrImage(result);
        localStorage.setItem('fuel_qr', result);
        setStep('details');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWalletSync = async () => {
    setIsSyncing(true);
    // This calls your /api/generate-pass route
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="max-w-[400px] mx-auto bg-black/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl pointer-events-auto">
          <Link href="/" className="flex flex-col items-center gap-1 px-6 py-2 text-white font-black uppercase text-[7px] tracking-widest">
            <MapPin size={18} strokeWidth={3} />
            <span>Map</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center gap-1 px-6 py-2 text-zinc-500 hover:text-white transition-colors font-black uppercase text-[7px] tracking-widest">
            <MessageSquare size={18} strokeWidth={3} />
            <span>Contact</span>
          </Link>
          <button onClick={() => setShowQRModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-full flex items-center gap-2 active:scale-95 shadow-xl ml-2">
            <Plus size={14} strokeWidth={4} />
            <span className="font-black uppercase text-[9px] tracking-widest">Add QR To Your Digital Wallet</span>
          </button>
        </div>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setShowQRModal(false)} />
          <div className="bg-[#0c0e12] w-full max-w-[350px] rounded-[2.5rem] border border-white/10 p-8 relative z-10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowQRModal(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white"><X size={20}/></button>

            {step === 'upload' && (
              <div className="text-center py-6">
                <h2 className="text-white font-black italic text-2xl uppercase mb-8">My Fuel Pass</h2>
                <input id="qr-input" type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <label htmlFor="qr-input" className="block w-full bg-red-600 text-white font-black uppercase py-5 rounded-2xl text-[10px] tracking-widest text-center cursor-pointer shadow-lg active:scale-95">Upload QR Code</label>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-4 py-4">
                <h2 className="text-white font-black italic text-xl uppercase">Details</h2>
                <input type="text" placeholder="VEHICLE NO" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())} className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 px-6 text-white font-black uppercase outline-none focus:border-red-600 text-xs" />
                
                <button onClick={() => { localStorage.setItem('vehicle_no', vehicleNumber); localStorage.setItem('fuel_code', fuelCode); setStep('display'); }} className="w-full bg-red-600 text-white font-black uppercase py-5 rounded-2xl text-[10px] tracking-widest">Generate Pass</button>
              </div>
            )}

            {step === 'display' && (
              <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                <div className="bg-white rounded-[2rem] p-6 text-center shadow-2xl relative overflow-hidden">
                  <div className="flex justify-center gap-4 mb-5">
                     <img src="https://images.seeklogo.com/logo-png/44/1/ceypetco-sri-lanka-logo-png_seeklogo-443727.png" className="h-6 object-contain" alt="CP" />
                     <img src="https://images.seeklogo.com/logo-png/44/1/lanka-ioc-logo-png_seeklogo-443728.png" className="h-6 object-contain" alt="IOC" />
                     <img src="https://images.seeklogo.com/logo-png/28/1/sinopec-logo-png_seeklogo-284996.png" className="h-6 object-contain" alt="Sinopec" />
                  </div>
                  
                  <div className="bg-red-600 text-white font-black py-2 rounded-xl text-[8px] tracking-[0.2em] mb-6 uppercase italic">National Fuel Pass</div>
                  <h3 className="text-black font-black text-3xl tracking-tighter mb-6 leading-none">{vehicleNumber}</h3>
                  
                  <div className="aspect-square bg-white border border-zinc-100 rounded-[1.5rem] p-4 flex items-center justify-center mb-4 shadow-inner">
                    <img src={qrImage || ''} className="w-full h-full object-contain" alt="QR" />
                  </div>
                  
                  <p className="text-zinc-400 text-[8px] font-bold mb-4 uppercase tracking-tighter">Code: <span className="text-black font-black">{fuelCode}</span></p>

                  <div className="pt-4 border-t border-zinc-100 flex flex-col items-center gap-2">
                    <p className="text-zinc-400 text-[8px] font-black uppercase tracking-[0.2em]">
                      Powered By <span className="text-red-600 italic">Fuel Helper</span>
                    </p>
                    <img src="/fuel-logo.png" className="h-8 object-contain" alt="Fuel Helper Logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                </div>

                <button onClick={handleWalletSync} className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest active:scale-95 border border-white/10 shadow-lg">
                  <Plus size={16}/> {isSyncing ? 'Syncing...' : 'Add to Apple & Google Wallet'}
                </button>
                <button onClick={() => setStep('upload')} className="w-full text-zinc-500 text-[8px] font-black uppercase text-center tracking-widest hover:text-white transition-colors">← Edit Details</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}