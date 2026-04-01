"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="flex items-center gap-6 animate-pulse">
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Ceypetco_logo.png/150px-Ceypetco_logo.png" alt="Ceypetco" className="h-12 object-contain" />
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Lanka_IOC_logo.svg/1200px-Lanka_IOC_logo.svg.png" alt="IOC" className="h-10 object-contain" />
      </div>
      <h1 className="text-white font-black italic uppercase tracking-tighter text-2xl mt-8">
        FUEL<span className="text-red-600">HELPER</span>
      </h1>
    </div>
  );
}