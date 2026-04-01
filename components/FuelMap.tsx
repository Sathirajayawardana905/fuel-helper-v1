"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function FuelMap({ stations }: { stations: any[] }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-[#05070a]" />;

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[6.9897, 79.9144]} // Wattala
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        {stations?.map((s) => {
          const lat = parseFloat(s.lat || s.latitude);
          const lng = parseFloat(s.lng || s.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={s.id} position={[lat, lng]} icon={icon}>
              <Popup minWidth={200}>
                 <div className="p-2 bg-white rounded-lg">
                    <h3 className="font-black text-black uppercase text-sm mb-1 leading-tight">{s.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-3 font-bold uppercase tracking-wider">{s.address || 'Wattala'}</p>
                    
                    <button 
                      onClick={() => router.push(`/station/${s.id}`)}
                      className="w-full bg-red-600 text-white font-black uppercase py-2 px-4 rounded-xl text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
                    >
                      View Details
                    </button>
                 </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}