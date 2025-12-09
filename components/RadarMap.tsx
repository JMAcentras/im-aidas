
import React, { useState, useEffect } from 'react';
import { Loader } from './Loader';

interface MapPoint {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  distance: number; // in meters
  compatibility: number; // 0-100
  seeking: string;
  name: string;
}

export const RadarMap: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Generate random points on mount
  useEffect(() => {
    const newPoints: MapPoint[] = [];
    const count = 8; // Number of people nearby
    
    const seekings = [
      "Hiking partner for weekends",
      "Co-founder for SaaS idea",
      "Gym buddy (mornings)",
      "Someone to practice Spanish with",
      "Board game group",
      "Coffee & Deep talk",
      "Travel companion to Japan"
    ];

    for (let i = 0; i < count; i++) {
      // Random angle
      const angle = Math.random() * 2 * Math.PI;
      // Random radius (keeping away from center 50%)
      // We want to distribute them visually. 
      // Let's use 10% to 45% radius from center.
      const r = 10 + Math.random() * 35; 
      
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);

      // Random distance logic (6m to 6000m)
      // Visual radius r doesn't strictly map to distance to keep UI clean, 
      // but we can correlate loosely.
      // Small r = Close.
      const distFactor = (r - 10) / 35; // 0 to 1
      // Logarithmic-ish scale for distance
      const minDst = 6;
      const maxDst = 6000;
      const distance = Math.floor(minDst + (maxDst - minDst) * (distFactor * distFactor));

      newPoints.push({
        id: `user-${i}`,
        x,
        y,
        distance,
        compatibility: Math.floor(70 + Math.random() * 29), // 70-99%
        seeking: seekings[Math.floor(Math.random() * seekings.length)],
        name: `User ${Math.floor(Math.random() * 1000)}`
      });
    }
    setPoints(newPoints);
    
    // Stop scanning animation after a few seconds
    const timer = setTimeout(() => setIsScanning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatDistance = (d: number) => {
    return d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${d} m`;
  };

  return (
    <div className="w-full h-full bg-gray-950 relative overflow-hidden flex flex-col">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          Nearby Radar
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-xs text-green-400 font-mono">
            {isScanning ? 'SCANNING SECTOR...' : 'SCAN COMPLETE'}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow relative flex items-center justify-center">
         {/* Radar Background */}
         <div className="relative w-[350px] h-[350px] sm:w-[500px] sm:h-[500px]">
            {/* Concentric Circles */}
            <div className="absolute inset-0 border border-green-900/30 rounded-full"></div>
            <div className="absolute inset-[15%] border border-green-900/30 rounded-full"></div>
            <div className="absolute inset-[30%] border border-green-900/30 rounded-full"></div>
            <div className="absolute inset-[45%] border border-green-500/20 rounded-full"></div>
            
            {/* Crosshairs */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-green-900/30"></div>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-green-900/30"></div>

            {/* Scanning Line */}
            {isScanning && (
               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-spin-slow origin-center" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}></div>
            )}

            {/* Center (User) */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full border-4 border-green-500 transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(34,197,94,0.6)] z-20"></div>

            {/* Points */}
            {points.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPoint(p)}
                className="absolute w-3 h-3 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-150 hover:bg-white cursor-pointer z-30 animate-pulse-slow"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                 <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-ping opacity-75"></div>
              </button>
            ))}
         </div>
      </div>

      {/* Selected Point Details Modal/Panel */}
      {selectedPoint && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-green-500/30 p-6 rounded-t-3xl animate-slide-up z-40 shadow-2xl">
           <button 
             onClick={() => setSelectedPoint(null)}
             className="absolute top-4 right-4 text-gray-500 hover:text-white"
           >✕</button>

           <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center border border-green-500/50 text-green-400 font-bold text-lg">
                {selectedPoint.compatibility}%
              </div>
              <div className="flex-grow">
                 <h3 className="text-xl font-bold text-white mb-1">Anonymous Match</h3>
                 <div className="flex items-center gap-3 text-xs font-mono text-green-400 mb-3">
                    <span className="bg-green-900/30 px-2 py-0.5 rounded border border-green-900">
                        DIST: {formatDistance(selectedPoint.distance)}
                    </span>
                    <span className="bg-green-900/30 px-2 py-0.5 rounded border border-green-900">
                        MATCH: {selectedPoint.compatibility}%
                    </span>
                 </div>
                 
                 <div className="bg-gray-800 p-3 rounded-lg border-l-2 border-green-500 mb-4">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Seeking</p>
                    <p className="text-gray-200 text-sm">"{selectedPoint.seeking}"</p>
                 </div>

                 <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/50 transition-colors">
                    Send Signal
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
