"use client";
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../lib/supabase';
import { 
  RefreshCw, Search, MapPin, 
  CheckCircle, Clock, X, Info, AlertTriangle, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

// Dynamically import map to prevent SSR errors
const FuelMap = dynamic(() => import('../components/FuelMap'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full bg-black flex items-center justify-center text-[10px] text-zinc-800 font-black tracking-widest uppercase">Loading Map...</div>
});

export default function Home() {
  const [stations, setStations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('stations').select('*').order('name');
    if (data) setStations(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filteredStations = useMemo(() => {
    return stations.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [stations, searchQuery]);

  return (
    <main className="h-screen w-full bg-black relative overflow-hidden text-white">
      
      {/* 1. PILOT BANNER */}
      {showBanner && (
        <div className="absolute top-0 left-0 right-0 z-[100] bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 p-4 px-6">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/10 rounded-lg">
                <AlertTriangle size={14} className="text-red-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-white font-black uppercase italic text-[11px] tracking-tighter leading-tight mb-1">
                   Pilot Project / <span className="text-red-600">නියමු ව්‍යාපෘතිය</span>
                </p>
                <p className="text-zinc-500 text-[10px] font-bold leading-snug">
                  Limited to selected stations only. / දැනට තෝරාගත් පිරවුම්හල් කිහිපයකට පමණි.
                </p>
              </div>
            </div>
            {/* Banner button with Info icon */}
            <button onClick={() => setShowBanner(false)} className="p-2.5 bg-zinc-900 rounded-xl border border-white/10">
              <Info size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* 2. MAP BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <FuelMap stations={filteredStations} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 pointer-events-none" />
      </div>

      {/* 3. HEADER & SEARCH */}
      <div className={`absolute left-0 right-0 z-20 p-6 pointer-events-none transition-all duration-500 ${showBanner ? 'top-20' : 'top-0 pt-14'}`}>
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-white font-black italic uppercase text-3xl tracking-tighter">
               FUEL<span className="text-red-600">HELPER</span>
             </h1>
             <button onClick={loadData} className="p-4 bg-zinc-900/80 rounded-2xl border border-white/10 active:scale-90">
               <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
             </button>
          </div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search fuel station..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full py-5 pl-14 pr-8 text-sm outline-none focus:border-red-600/50 font-bold" 
            />
          </div>
        </div>
      </div>

      {/* 4. STATION LIST */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[48vh] pointer-events-none overflow-y-auto pb-44 px-5 scrollbar-hide">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          {filteredStations.map((station) => (
            <div key={station.id} className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-6 mb-4 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[75%]">
                  <h3 className="font-bold text-lg leading-tight">{station.name}</h3>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase mt-2 flex items-center gap-2 leading-none">
                    <MapPin size={10} className="text-red-600"/> {station.address || 'Sri Lanka'}
                  </p>
                </div>

                {/* STATION BUTTON WITH EXCLAMATION ICON */}
                <Link href={`/station/${station.id}`} className="p-4 bg-zinc-800 rounded-2xl border border-white/5 shadow-lg active:scale-90 transition-all flex items-center justify-center">
                  <AlertCircle size={20} className="text-white" strokeWidth={2.5} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <FuelBadge label="P92" status={station.p92} />
                 <FuelBadge label="P95" status={station.p95} />
                 <FuelBadge label="Diesel" status={station.diesel} />
                 <FuelBadge label="Super" status={station.super_diesel} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function FuelBadge({ label, status }: { label: string, status: string }) {
  const isAvailable = status === "Available";
  let styles = "bg-zinc-900 border-white/5 text-zinc-700";
  if (isAvailable) styles = "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
  else if (status === "Out of Stock") styles = "bg-red-500/10 border-red-500/20 text-red-500";
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${styles}`}>
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
      {isAvailable && <CheckCircle size={10} strokeWidth={3} />}
    </div>
  );
}