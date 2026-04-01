"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { 
  ChevronLeft, MapPin, ChevronDown, CheckCircle2, 
  Clock, Timer, Loader2, AlertTriangle, Info 
} from 'lucide-react';

// FIXES THE VERCEL BUILD ERROR:
export const dynamic = 'force-dynamic';

export default function StationDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  // 1. DATA LOADING STATES
  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. PENDING STATES (Saves your taps locally before you hit Submit)
  const [selectedFuel, setSelectedFuel] = useState("p92");
  const [pendingStatus, setPendingStatus] = useState("");
  const [pendingQueue, setPendingQueue] = useState("");

  useEffect(() => {
    async function getStation() {
      const stationId = Number(id); // Ensure ID is a number
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .eq('id', stationId)
        .single();

      if (data) {
        setStation(data);
        setPendingQueue(data.queue || "No Queue");
        setPendingStatus(data[selectedFuel] || "Out of Stock");
      }
      setLoading(false);
    }
    if (id) getStation();
  }, [id, selectedFuel]);

  // 3. THE SUBMIT FUNCTION
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const stationId = Number(id);

    const { error } = await supabase
      .from('stations')
      .update({ 
        [selectedFuel]: pendingStatus, 
        queue: pendingQueue,
        updated_at: new Date().toISOString() 
      })
      .eq('id', stationId);
    
    if (error) {
      alert("Update Failed: " + error.message);
    } else {
      alert("Fuel Feed Updated Successfully!");
      // Update local state so UI reflects the change
      setStation({ ...station, [selectedFuel]: pendingStatus, queue: pendingQueue });
    }
    setIsSubmitting(false);
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-red-600" size={32} />
      <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest italic">Syncing Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-white pb-32">
      
      {/* HEADER BAR */}
      <div className="p-6 pt-12 flex items-center gap-4 sticky top-0 bg-[#05070a]/90 backdrop-blur-xl z-20">
        <button onClick={() => router.push('/')} className="p-3 bg-zinc-900 rounded-2xl border border-white/5 active:scale-95 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">Station <span className="text-red-600">Report</span></h1>
      </div>

      <div className="px-6 space-y-8">
        
        {/* STATION BANNER */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-7 space-y-3">
          <h2 className="text-3xl font-black tracking-tighter leading-none">{station?.name}</h2>
          <p className="text-zinc-500 text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest">
            <MapPin size={12} className="text-red-600"/> {station?.address || 'Wattala, Sri Lanka'}
          </p>
        </div>

        {/* FUEL AVAILABILITY UPDATE */}
        <div className="bg-[#0c0e12] border border-white/5 rounded-[2.5rem] p-6 space-y-6 shadow-2xl">
          <h3 className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] pl-2">Update Fuel Availability</h3>
          
          <div className="relative">
            <select 
              value={selectedFuel} 
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold appearance-none outline-none focus:border-red-600/50 transition-all text-white"
            >
              <option value="p92">Petrol 92</option>
              <option value="p95">Petrol 95</option>
              <option value="diesel">Auto Diesel</option>
              <option value="super_diesel">Super Diesel</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
          </div>

          <div className="space-y-2">
            {["Available", "Low Stock", "Out of Stock"].map((status) => (
              <button 
                key={status}
                onClick={() => setPendingStatus(status)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all active:scale-[0.98] ${
                  pendingStatus === status 
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                  : 'border-white/5 bg-zinc-900/50 text-zinc-600'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-tight">{status}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pendingStatus === status ? 'border-blue-500' : 'border-zinc-800'}`}>
                  {pendingStatus === status && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* QUEUE CONDITION UPDATE */}
        <div className="bg-[#0c0e12] border border-white/5 rounded-[2.5rem] p-6 space-y-6">
          <h3 className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] pl-2">Update Queue Condition</h3>
          
          <div className="grid grid-cols-3 gap-3">
             <QueueCard label="No Queue" icon="🏃" active={pendingQueue === 'No Queue'} onClick={() => setPendingQueue('No Queue')} />
             <QueueCard label="Medium" icon="🚶‍♂️🚶" active={pendingQueue === 'Medium'} onClick={() => setPendingQueue('Medium')} />
             <QueueCard label="Long" icon="🚗🚕" active={pendingQueue === 'Long'} onClick={() => setPendingQueue('Long')} />
          </div>

          {/* THE BIG BLUE SUBMIT BUTTON */}
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-3xl text-[11px] tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Update"}
          </button>
        </div>

      </div>
    </div>
  );
}

// SUB-COMPONENTS (Defined outside to prevent re-render bugs)
function QueueCard({ label, icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all active:scale-95 ${
      active ? 'bg-blue-600/10 border-blue-600/40 text-blue-400 shadow-lg' : 'bg-zinc-900 border-white/5 text-zinc-700'
    }`}>
      <span className="text-2xl drop-shadow-md">{icon}</span>
      <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{label}</span>
    </button>
  );
}