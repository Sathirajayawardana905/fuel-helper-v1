"use client"; // This tells Next.js: "I need a browser!"

import dynamic from 'next/dynamic';
import { RefreshCcw } from 'lucide-react';

// We move the dynamic import HERE
const FuelMap = dynamic(() => import('./FuelMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-900 animate-pulse rounded-[2.5rem] flex flex-col items-center justify-center text-gray-500 gap-4 border border-gray-800">
      <RefreshCcw className="animate-spin w-8 h-8 text-green-500" />
      <p className="font-bold tracking-widest text-xs uppercase">Waking up the map...</p>
    </div>
  )
});

export default function MapSection({ stations }: { stations: any[] }) {
  return <FuelMap stations={stations} />;
}