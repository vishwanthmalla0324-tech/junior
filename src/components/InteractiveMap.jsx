import React, { useEffect, useRef } from 'react';
import { Navigation, ExternalLink } from 'lucide-react';

export default function InteractiveMap({ workerLoc, workplaceLoc, workerName, workplaceName, height = "280px" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const defaultCenter = workplaceLoc?.coordinates || { lat: 13.0324, lng: 77.5218 };
  const workerCoords = workerLoc?.coordinates || { lat: 13.0098, lng: 77.6366 };

  // Calculate approximate distance in km (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const distanceKm = calculateDistance(
    workerCoords.lat,
    workerCoords.lng,
    defaultCenter.lat,
    defaultCenter.lng
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${workerCoords.lat},${workerCoords.lng}&destination=${defaultCenter.lat},${defaultCenter.lng}`;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (window.L && !mapInstanceRef.current) {
      try {
        const map = window.L.map(mapContainerRef.current).setView([defaultCenter.lat, defaultCenter.lng], 12);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const workplaceIcon = window.L.divIcon({
          className: 'custom-map-icon',
          html: `<div style="background-color: #0284c7; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); font-size: 16px;">🏢</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const workerIcon = window.L.divIcon({
          className: 'custom-map-icon',
          html: `<div style="background-color: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); font-size: 16px;">👷</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        window.L.marker([defaultCenter.lat, defaultCenter.lng], { icon: workplaceIcon })
          .addTo(map)
          .bindPopup(`<b>Workplace Location</b><br/>${workplaceName || 'Workplace'}`);

        window.L.marker([workerCoords.lat, workerCoords.lng], { icon: workerIcon })
          .addTo(map)
          .bindPopup(`<b>Worker Location</b><br/>${workerName || 'Worker Home'}`);

        const latlngs = [
          [workerCoords.lat, workerCoords.lng],
          [defaultCenter.lat, defaultCenter.lng]
        ];
        window.L.polyline(latlngs, { color: '#38bdf8', weight: 4, dashArray: '8, 8' }).addTo(map);

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Map setup fallback', err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [defaultCenter, workerCoords, workplaceName, workerName]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-sky-400 font-semibold">
          <Navigation className="w-4 h-4" />
          <span>Workplace Route Distance: <strong className="text-white text-sm">{distanceKm} km</strong></span>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold transition-colors shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in Google Maps
        </a>
      </div>

      <div ref={mapContainerRef} style={{ height }} className="w-full relative bg-slate-950">
        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 w-fit text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Worker Resident: {workerName || 'Worker'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Verified Job Site: {workplaceName || 'Workplace'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
