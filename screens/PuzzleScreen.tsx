import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { EntityType, LevelConfig, Difficulty } from '../types';
import { LEVEL_CONFIGS } from '../constants';
import { Screen } from '../types';
import { RotateCcw, X, ShieldCheck, Flame, Skull, Droplets, Coins, User, Sparkles } from 'lucide-react';

interface PuzzleScreenProps {
  levelId: number;
  difficulty: Difficulty;
}

// Enhanced Visual Sprites
const EntitySprite: React.FC<{ type: EntityType }> = ({ type }) => {
  switch (type) {
    case EntityType.HERO:
      return (
        <div className="relative flex flex-col items-center justify-center h-full w-full z-20 transition-all duration-300">
            <div className="relative group">
                {/* Glow */}
                <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full animate-pulse"></div>
                
                {/* Character */}
                <div className="relative">
                    <User className="w-14 h-14 text-slate-100 fill-slate-800 stroke-[1.5] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
                    {/* Helmet/Armor Details */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-300 rounded-t-full border border-slate-600"></div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-8 bg-slate-700/50"></div>
                </div>

                {/* Sword (Decorative) */}
                <div className="absolute -right-4 top-2 rotate-[15deg] opacity-90">
                     <div className="w-1.5 h-10 bg-gradient-to-t from-slate-400 to-slate-100 border border-slate-600 rounded-t-full shadow-sm"></div>
                     <div className="absolute bottom-2 -left-1.5 w-4.5 h-1 bg-slate-700 rounded-full"></div>
                </div>
            </div>
            {/* Shadow */}
            <div className="absolute bottom-2 w-8 h-1.5 bg-black/60 blur-sm rounded-full"></div>
        </div>
      );
    case EntityType.ENEMY:
      return (
        <div className="relative flex flex-col items-center justify-center h-full w-full z-20">
            <div className="relative animate-[bounce_3s_infinite]">
                 <div className="absolute inset-0 bg-green-900/40 blur-xl rounded-full"></div>
                 <Skull className="w-14 h-14 text-green-200 fill-green-950 stroke-[1.5] drop-shadow-lg" />
                 
                 {/* Glowing Eyes */}
                 <div className="absolute top-4 left-3 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                 <div className="absolute top-4 right-3 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
            </div>
             <div className="absolute bottom-2 w-10 h-1.5 bg-black/60 blur-sm rounded-full"></div>
        </div>
      );
    case EntityType.TREASURE:
      return (
        <div className="relative flex flex-col items-center justify-center h-full w-full z-20">
             <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/30 blur-xl rounded-full animate-pulse"></div>
                <Coins className="w-14 h-14 text-yellow-300 fill-yellow-600 drop-shadow-xl" />
                {/* Sparkles Overlay */}
                <Sparkles className="absolute -top-5 -right-5 w-8 h-8 text-yellow-100 animate-[spin_4s_linear_infinite] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                <Sparkles className="absolute -bottom-2 -left-4 w-4 h-4 text-yellow-100 animate-[pulse_2s_infinite]" />
             </div>
             <div className="absolute bottom-2 w-12 h-2 bg-black/50 blur-sm rounded-full"></div>
        </div>
      );
    case EntityType.LAVA:
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-red-900 z-10">
            {/* Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-700 via-orange-600 to-red-500 opacity-90"></div>
            
            {/* Hot Core Pulse */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300/40 to-transparent animate-pulse"></div>
            
            {/* Rising Bubbles */}
            {[...Array(6)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute bg-orange-200 rounded-full opacity-0"
                    style={{
                        width: Math.random() * 12 + 4 + 'px',
                        height: Math.random() * 12 + 4 + 'px',
                        left: Math.random() * 90 + '%',
                        bottom: '0',
                        animation: `bubbleRise ${Math.random() * 2 + 3}s ease-in infinite`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}
             <Flame className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 text-orange-500/10 blur-xl scale-150" />
        </div>
      );
    case EntityType.WATER:
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-blue-900 z-10">
             {/* Deep Water Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-800 via-blue-600 to-cyan-500 opacity-80"></div>
             
             {/* Surface Shine */}
             <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-white/20 to-transparent"></div>
             
             {/* Bubbles */}
             {[...Array(8)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute bg-cyan-100 rounded-full opacity-0"
                    style={{
                        width: Math.random() * 8 + 3 + 'px',
                        height: Math.random() * 8 + 3 + 'px',
                        left: Math.random() * 90 + '%',
                        bottom: '0',
                        animation: `bubbleRise ${Math.random() * 3 + 2}s ease-out infinite`,
                        animationDelay: `${Math.random() * 3}s`
                    }}
                />
            ))}
            <Droplets className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-blue-950/20" />
        </div>
      );
    default:
      return null;
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
  
  // Ref to track mounted state
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

  // The Physics Engine
  const processPhysics = useCallback(() => {
    if (!levelConfig || status !== 'PLAYING') return;

    const newZones = JSON.parse(JSON.stringify(zones));
    let somethingChanged = false;
    const connections = levelConfig.layout.connections;

    for (const conn of connections) {
      if (!pins.includes(conn.pinId)) {
        const fromZoneIndex = newZones.findIndex((z: any) => z.id === conn.from);
        const toZoneIndex = newZones.findIndex((z: any) => z.id === conn.to);

        if (fromZoneIndex !== -1 && toZoneIndex !== -1) {
            const fromZone = newZones[fromZoneIndex];
            const toZone = newZones[toZoneIndex];

            if (fromZone.content !== EntityType.EMPTY) {
                const contentA = fromZone.content;
                const contentB = toZone.content;

                // 1. Movement into Empty
                if (contentB === EntityType.EMPTY) {
                    toZone.content = contentA;
                    fromZone.content = EntityType.EMPTY;
                    somethingChanged = true;
                }
                // 2. Lava + Water = Stone
                else if ((contentA === EntityType.LAVA && contentB === EntityType.WATER) || 
                        (contentA === EntityType.WATER && contentB === EntityType.LAVA)) {
                    toZone.content = EntityType.EMPTY; 
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
                    return; 
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

  // Trigger physics loop
  useEffect(() => {
    if (status !== 'PLAYING') return;

    const timer = setTimeout(() => {
        processPhysics();
    }, 400);

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
        <button onClick={() => setScreen(Screen.MAP)} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition">
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-white font-bold text-lg drop-shadow-md">Level {levelConfig.id}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                ${difficulty === Difficulty.HARD ? 'bg-red-500/20 text-red-400' : 
                  difficulty === Difficulty.EASY ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {difficulty} Mode
            </span>
        </div>
        <button onClick={() => { 
            setZones(JSON.parse(JSON.stringify(levelConfig.layout.zones))); 
            setPins(levelConfig.layout.connections.map(c => c.pinId)); 
            setStatus('PLAYING'); 
        }} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="relative w-full max-w-sm bg-slate-800 rounded-3xl p-3 border-4 border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden" style={{ height: '550px' }}>
          
          {/* Background Texture for Container */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stone.png')] opacity-30 pointer-events-none"></div>

          {/* Render Zones */}
          <div className="h-full w-full flex flex-col gap-1.5 relative">
             {zones.sort((a: any,b: any) => a.id.localeCompare(b.id)).map((zone: any) => {
                 return (
                    <div 
                      key={zone.id} 
                      className="flex-1 w-full rounded-xl relative flex items-center justify-center overflow-hidden bg-slate-900/80 border border-slate-700/50 shadow-inner"
                    >
                        <EntitySprite type={zone.content} />
                    </div>
                 );
             })}
          </div>

          {/* Render Pins */}
          {levelConfig.layout.connections.map((conn, idx) => {
             if (!pins.includes(conn.pinId)) return null;

             const zoneIndex = zones.findIndex((z: any) => z.id === conn.from);
             const topPos = ((zoneIndex + 1) / zones.length) * 100;

             return (
                 <div 
                    key={conn.pinId}
                    className="absolute left-0 w-full h-10 cursor-pointer flex items-center z-30 group"
                    style={{ top: `calc(${topPos}% - 20px)` }}
                    onClick={() => pullPin(conn.pinId)}
                 >
                    {/* The Pin Graphic */}
                    <div className="w-full h-5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full shadow-lg transform transition-transform duration-200 group-hover:scale-105 group-active:scale-95 flex items-center justify-end pr-3 border-y border-amber-900/30">
                        {/* Pin Head */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border-4 border-amber-800 -mr-2 shadow-md flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-amber-200/50"></div>
                        </div>
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
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">VICTORY!</h2>
                <p className="text-slate-300 mb-8 font-medium">{message}</p>
                <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold text-3xl mb-10 bg-slate-900/50 px-6 py-3 rounded-2xl border border-amber-500/30">
                    <span>+{Math.floor(levelConfig.reward * getRewardMultiplier())}</span>
                    <Coins className="w-8 h-8 fill-amber-400" />
                </div>
                <button 
                    onClick={handleWin}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-green-500/20 transform transition hover:scale-105 active:scale-95"
                >
                    Claim & Continue
                </button>
              </>
          ) : (
              <>
                <div className="relative mb-6">
                    <Skull className="w-24 h-24 text-red-500 animate-pulse" />
                    <Flame className="absolute bottom-0 left-0 w-24 h-24 text-red-600/50 blur-sm animate-pulse" />
                </div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 mb-2">DEFEAT</h2>
                <p className="text-slate-300 mb-8 font-medium">{message}</p>
                <button 
                    onClick={() => { 
                        setZones(JSON.parse(JSON.stringify(levelConfig.layout.zones))); 
                        setPins(levelConfig.layout.connections.map(c => c.pinId)); 
                        setStatus('PLAYING'); 
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span>Try Again</span>
                </button>
              </>
          )}
        </div>
      )}
    </div>
  );
};