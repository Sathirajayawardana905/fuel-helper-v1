"use client";
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Send, Mail, User, CheckCircle, 
  Heart, Facebook, MessageCircle, Globe 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  
  const WHATSAPP_LINK = "https://chat.whatsapp.com/F6oZ0sTNlONDf0LfCywJlg";
  const FACEBOOK_LINK = "https://web.facebook.com/profile.php?id=61578420038313";
  const OFFICIAL_SITE = "https://fuelhelper.info";
  const DEV_EMAIL = "contact@fuelhelper.info";
  // -------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);

    if (!error) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-32">
      {/* Header */}
      <div className="max-w-md mx-auto pt-10 mb-12">
        <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-[10px] tracking-widest">Back to Map</span>
        </Link>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Get in <span className="text-red-600">Touch</span></h1>
        <p className="text-zinc-500 text-xs font-bold mt-2 uppercase tracking-wide">Help us improve the Pilot Project</p>
      </div>

      <div className="max-w-md mx-auto">
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-10 text-center animate-in zoom-in duration-300">
            <CheckCircle className="text-emerald-500 mx-auto mb-6" size={48} />
            <h2 className="text-xl font-black uppercase italic mb-2">Message Sent!</h2>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-tight">We'll get back to you soon.</p>
            <button onClick={() => setSubmitted(false)} className="mt-8 text-emerald-500 text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Send Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input required type="text" placeholder="YOUR NAME" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900/50 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black uppercase outline-none focus:border-red-600 transition-all" />
            </div>

            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input required type="email" placeholder="EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900/50 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black uppercase outline-none focus:border-red-600 transition-all" />
            </div>

            <textarea required rows={5} placeholder="MESSAGE" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-zinc-900/50 border border-white/10 rounded-[2rem] py-6 px-8 text-xs font-black uppercase outline-none focus:border-red-600 transition-all resize-none" />

            <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-5 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl disabled:opacity-50">
              {loading ? "Sending..." : <>SEND MESSAGE <Send size={16} /></>}
            </button>
          </form>
        )}

        {/* --- OFFICIAL LINKS SECTION --- */}
        <div className="mt-20">
          <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.4em] text-center mb-6">Join the Network</p>
          <div className="grid grid-cols-1 gap-3">
            {/* WhatsApp */}
            <a href={WHATSAPP_LINK} target="_blank" className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all p-5 rounded-[1.5rem] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <MessageCircle size={20} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Community</span>
              </div>
              <ArrowLeft size={14} className="rotate-180 text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Facebook */}
            <a href={FACEBOOK_LINK} target="_blank" className="bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all p-5 rounded-[1.5rem] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <Facebook size={20} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Facebook Page</span>
              </div>
              <ArrowLeft size={14} className="rotate-180 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Official Web */}
            <a href={OFFICIAL_SITE} target="_blank" className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all p-5 rounded-[1.5rem] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <Globe size={20} className="text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Official Website</span>
              </div>
              <ArrowLeft size={14} className="rotate-180 text-red-500 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* --- DEVELOPER FOOTER --- */}
        <div className="mt-24 pt-10 border-t border-white/5 text-center">
          <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.4em] mb-6">Lead Developer</p>
          <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-white font-black italic text-2xl uppercase tracking-tighter mb-1">Sathira Jayawardena</h3>
            <a href={`mailto:${DEV_EMAIL}`} className="text-zinc-400 hover:text-red-600 transition-colors text-[10px] font-bold uppercase tracking-widest lowercase">
              {DEV_EMAIL}
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-zinc-700">
            <span className="text-[9px] font-black uppercase tracking-widest">Made with</span>
            <Heart size={10} className="text-red-600 fill-red-600 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">in Sri Lanka</span>
          </div>
        </div>
      </div>
    </main>
  );
}