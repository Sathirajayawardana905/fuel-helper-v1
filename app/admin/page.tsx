"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { 
  ChevronLeft, MessageSquare, Trash2, Clock, 
  User, Mail, RefreshCw, Lock, ShieldCheck 
} from 'lucide-react';

export default function AdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessKey, setAccessKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. SIMPLE SECURITY CHECK (Change 'admin123' to your secret password)
  const checkAccess = () => {
    if (accessKey === 'Sathira@20091129') {
      setIsAuthorized(true);
      fetchMessages();
    } else {
      alert("Invalid Access Key");
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setMessages(data);
    setLoading(false);
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) setMessages(messages.filter(m => m.id !== id));
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-zinc-900/50 border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl backdrop-blur-3xl">
          <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-600/20">
            <Lock className="text-red-600" size={24} />
          </div>
          <h1 className="text-white font-black uppercase italic text-xl mb-8">Admin Access</h1>
          <input 
            type="password" 
            placeholder="ENTER ACCESS KEY" 
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-2xl py-5 px-6 text-xs font-black uppercase text-center outline-none focus:border-red-600 mb-6"
          />
          <button onClick={checkAccess} className="w-full bg-red-600 text-white font-black uppercase py-5 rounded-2xl text-[10px] tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all">
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 pt-12">
      <div className="max-w-2xl mx-auto">
        
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-red-600" size={16} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Secured Dashboard</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              User <span className="text-red-600">Messages</span>
            </h1>
          </div>
          <button 
            onClick={fetchMessages}
            className="p-4 bg-zinc-900 rounded-2xl border border-white/10 active:scale-90 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        <div className="space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-white/10 rounded-[3rem]">
              <MessageSquare className="mx-auto text-zinc-800 mb-4" size={40} />
              <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No messages received yet</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] shadow-xl hover:border-white/10 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-sm tracking-tight">{msg.name}</h3>
                    <p className="text-zinc-500 text-[10px] font-bold lowercase">{msg.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteMessage(msg.id)}
                  className="p-3 text-zinc-700 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-6">
                <p className="text-zinc-300 text-sm leading-relaxed">{msg.message}</p>
              </div>

              <div className="flex items-center gap-2 text-zinc-600">
                <Clock size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <Link href="/" className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all shadow-2xl">
          Exit Admin
        </Link>
      </div>
    </main>
  );
}