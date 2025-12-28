import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { EntityType, LevelConfig, Difficulty } from '../types';
import { LEVEL_CONFIGS } from '../constants';
import { Screen } from '../types';
import { RotateCcw, X, ShieldCheck, Flame, Skull, Droplets, Coins, User } from 'lucide-react';

interface PuzzleScreenProps {
  levelId: number;
  difficulty: Difficulty;
}

// Visual mapping for entities
const EntityIcon: React.FC<{ type: EntityType }> = ({ type }) => {
  switch (type) {
    case EntityType.HERO: return <User className="w-8 h-8 text-white drop-shadow-md animate-bounce" />;
    case EntityType.ENEMY: return <Skull className="w-8 h-8 text-green-500 drop-shadow-md" />;
    case EntityType.TREASURE: return <Coins className="w-8 h-8 text-amber-400 drop-shadow-md" />;
    case EntityType.LAVA: return <Flame className="w-full h-full text-red-500 opacity-80 animate-pulse" />;
    case EntityType.WATER: return <Droplets className="w-full h-full text-blue-500 opacity-60" />;
    default: return null;
  }
};

export const PuzzleScreen: React.FC<PuzzleScreenProps> = ({ levelId, difficulty }) => {
  const { setScreen, completeLevel } = useGame();
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  
  // Local Game State
  const [zones, setZones] = useState<any[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const [status, setStatus] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [message, setMessage] = useState('');
  
  // Ref to track mounted state to prevent state updates after unmount
  const isMounted = useRef(true);
  
  useEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
  }, []);

  // Initialize Level
  useEffect(() => {
    const config = LEVEL_CONFIGS.find(l => l.id === levelId);
    if (config) {
      setLevelConfig(config);
      // Deep clone initial state
      setZones(JSON.parse(JSON.stringify(config.layout.zones)));
      setPins(config.layout.connections.map(c => c.pinId));
      setStatus('PLAYING');
      setMessage('');
    }
  }, [levelId]);

  // The Physics Engine (Simulated)
  const processPhysics = useCallback(() => {
    if (!levelConfig || status !== 'PLAYING') return;

    // Deep clone to safely mutate
    const newZones = JSON.parse(JSON.stringify(zones));
    let somethingChanged = false;
    const connections = levelConfig.layout.connections;

    // Check all connections
    for (const conn of connections) {
      // If pin is removed
      if (!pins.includes(conn.pinId)) {
        const fromZoneIndex = newZones.findIndex((z: any) => z.id === conn.from);
        const toZoneIndex = newZones.findIndex((z: any) => z.id === conn.to);

        if (fromZoneIndex !== -1 && toZoneIndex !== -1) {
            const fromZone = newZones[fromZoneIndex];
            const toZone = newZones[toZoneIndex];

            if (fromZone.content !== EntityType.EMPTY) {
                // INTERACTION LOGIC
                const contentA = fromZone.content;
                const contentB = toZone.content;

                // 1. Movement into Empty
                if (contentB === EntityType.EMPTY) {
                    toZone.content = contentA;
                    fromZone.content = EntityType.EMPTY;
                    somethingChanged = true;
                }
                // 2. Lava + Water = Stone (Empty/Safe)
                else if ((contentA === EntityType.LAVA && contentB === EntityType.WATER) || 
                        (contentA === EntityType.WATER && contentB === EntityType.LAVA)) {
                    toZone.content = EntityType.EMPTY; // Stone representation
                    fromZone.content = EntityType.EMPTY;
                    somethingChanged = true;
                }
                // 3. Lava + Enemy = Enemy Dies
                else if (contentA === EntityType.LAVA && contentB === EntityType.ENEMY) {
                    toZone.content = EntityType.LAVA;
                    fromZone.content = EntityType.EMPTY;
                    somethingChanged = true;
                }
                // 4. Hero + Treasure = WIN
                else if ((contentA === EntityType.HERO && contentB === EntityType.TREASURE) ||
                        (contentA === EntityType.TREASURE && contentB === EntityType.HERO)) {
                    setStatus('WON');
                    setMessage("Treasures Secured!");
                    return; // End loop
                }
                // 5. Hero + Lava = LOSS
                else if ((contentA === EntityType.HERO && contentB === EntityType.LAVA) ||
                        (contentA === EntityType.LAVA && contentB === EntityType.HERO)) {
                    setStatus('LOST');
                    setMessage(" burned to a crisp!");
                    return;
                }
                // 6. Hero + Enemy = LOSS
                else if ((contentA === EntityType.HERO && contentB === EntityType.ENEMY) ||
                        (contentA === EntityType.ENEMY && contentB === EntityType.HERO)) {
                    setStatus('LOST');
                    setMessage("Ambushed by Goblins!");
                    return;
                }
            }
        }
      }
    }

    if (somethingChanged && isMounted.current) {
        setZones(newZones);
    }
  }, [zones, pins, levelConfig, status]);

  // Trigger physics loop - using a simple interval effect that depends on zones/pins
  useEffect(() => {
    if (status !== 'PLAYING') return;

    const timer = setTimeout(() => {
        processPhysics();
    }, 400); // Physics tick

    return () => clearTimeout(timer);
  }, [zones, pins, status, processPhysics]);


  const pullPin = (pinId: string) => {
    if (status !== 'PLAYING') return;
    setPins(prev => prev.filter(p => p !== pinId));
  };

  const getRewardMultiplier = () => {
    switch(difficulty) {
        case Difficulty.EASY: return 0.5;
        case Difficulty.NORMAL: return 1.0;
        case Difficulty.HARD: return 1.5;
        default: return 1.0;
    }
  };

  const handleWin = () => {
    if (levelConfig) {
        const finalReward = Math.floor(levelConfig.reward * getRewardMultiplier());
        completeLevel(levelConfig.id, finalReward);
        setScreen(Screen.MAP);
    }
  };

  if (!levelConfig) return <div>Loading...</div>;

  return (
    <div className="h-full w-full bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-slate-900/50 backdrop-blur-sm">
        <button onClick={() => setScreen(Screen.MAP)} className="p-2 bg-slate-800 rounded-full text-white">
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white font-bold text-lg">Level {levelConfig.id}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                ${difficulty === Difficulty.HARD ? 'bg-red-500/20 text-red-400' : 
                  difficulty === Difficulty.EASY ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {difficulty} Mode
            </span>
        </div>
        <button onClick={() => { 
            // Reset
            setZones(JSON.parse(JSON.stringify(levelConfig.layout.zones))); 
            setPins(levelConfig.layout.connections.map(c => c.pinId)); 
            setStatus('PLAYING'); 
        }} className="p-2 bg-slate-800 rounded-full text-white">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-sm bg-slate-800 rounded-3xl p-2 border-4 border-slate-700 shadow-2xl overflow-hidden" style={{ height: '500px' }}>
          
          {/* Render Zones (Simplified Vertical Stack Visualization) */}
          <div className="h-full w-full flex flex-col gap-1 relative">
             {/* Map zones visually based on their ID string sort. z1 (top) -> zN (bottom) */}
             {zones.sort((a: any,b: any) => a.id.localeCompare(b.id)).map((zone: any) => {
                 let bgClass = "bg-slate-900/50";
                 if (zone.content === EntityType.LAVA) bgClass = "bg-red-600/20";
                 if (zone.content === EntityType.WATER) bgClass = "bg-blue-600/20";

                 return (
                    <div key={zone.id} className={`flex-1 w-full rounded-lg relative flex items-center justify-center transition-colors duration-500 ${bgClass} border border-slate-700/30`}>
                        {/* Content */}
                        <div className="z-10 transition-all duration-500 transform">
                             <EntityIcon type={zone.content} />
                        </div>
                    </div>
                 );
             })}
          </div>

          {/* Render Pins (Absolute positioning over the gaps) */}
          {levelConfig.layout.connections.map((conn, idx) => {
             // Heuristic to place pins visually between zones based on simplified layout
             if (!pins.includes(conn.pinId)) return null;

             const zoneIndex = zones.findIndex((z: any) => z.id === conn.from);
             // Visually place pin below the 'from' zone.
             // Note: In constants, we ensured logical flow (z1->z2).
             const topPos = ((zoneIndex + 1) / zones.length) * 100;

             return (
                 <div 
                    key={conn.pinId}
                    className="absolute left-0 w-full h-8 cursor-pointer flex items-center z-30 group"
                    style={{ top: `calc(${topPos}% - 16px)` }}
                    onClick={() => pullPin(conn.pinId)}
                 >
                    {/* The Pin Graphic */}
                    <div className="w-full h-4 bg-amber-600 border-y-2 border-amber-300 rounded-full shadow-lg transform transition-transform group-hover:scale-105 group-active:scale-95 flex items-center justify-end pr-4">
                        <div className="w-8 h-8 rounded-full bg-amber-200 border-4 border-amber-600 -mr-2 shadow-sm"></div>
                    </div>
                 </div>
             )
          })}

        </div>
      </div>

      {/* Result Overlay */}
      {status !== 'PLAYING' && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          {status === 'WON' ? (
              <>
                <ShieldCheck className="w-24 h-24 text-green-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-bold text-white mb-2">VICTORY!</h2>
                <p className="text-slate-300 mb-8">{message}</p>
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xl mb-8">
                    <span>+{Math.floor(levelConfig.reward * getRewardMultiplier())}</span>
                    <Coins />
                </div>
                <button 
                    onClick={handleWin}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                >
                    Claim & Continue
                </button>
              </>
          ) : (
              <>
                <Skull className="w-24 h-24 text-red-500 mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold text-white mb-2">DEFEAT</h2>
                <p className="text-slate-300 mb-8">{message}</p>
                <button 
                    onClick={() => { 
                        setZones(JSON.parse(JSON.stringify(levelConfig.layout.zones))); 
                        setPins(levelConfig.layout.connections.map(c => c.pinId)); 
                        setStatus('PLAYING'); 
                    }}
                    className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                >
                    Try Again
                </button>
              </>
          )}
        </div>
      )}
    </div>
  );
};