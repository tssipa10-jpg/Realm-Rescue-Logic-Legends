import React from 'react';
import { useGame } from '../contexts/GameContext';
import { BASE_CASTLE_COST, UPGRADE_COST_MULTIPLIER } from '../constants';
import { ArrowUpCircle, Hammer } from 'lucide-react';

export const CastleScreen: React.FC = () => {
  const { gameState, upgradeCastle, addGold } = useGame();

  const upgradeCost = Math.floor(BASE_CASTLE_COST * Math.pow(UPGRADE_COST_MULTIPLIER, gameState.castleLevel - 1));
  const canAfford = gameState.gold >= upgradeCost;

  const handleUpgrade = () => {
    if (canAfford) {
      addGold(-upgradeCost);
      upgradeCastle();
    }
  };

  // Determine castle image based on level
  const castleImage = `https://picsum.photos/seed/castle${gameState.castleLevel}/800/600`;

  return (
    <div className="h-full w-full bg-slate-950 overflow-y-auto pb-24 no-scrollbar">
      {/* Header Image */}
      <div className="relative h-2/5 w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
        <img 
          src={castleImage} 
          alt="My Kingdom" 
          className="w-full h-full object-cover opacity-80" 
        />
        <div className="absolute bottom-4 left-4 z-20">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">Level {gameState.castleLevel} Keep</h1>
          <p className="text-slate-300 text-sm">Fortress of the Logic Lords</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        
        {/* Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Hourly Production</p>
                <p className="text-2xl font-bold text-amber-400 flex items-center gap-1">
                    {(gameState.castleLevel * 50).toLocaleString()} <span className="text-sm text-slate-500">Gold/hr</span>
                </p>
            </div>
             <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center">
                <Hammer className="text-slate-400 w-5 h-5" />
             </div>
        </div>

        {/* Upgrade Action */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Upgrade Fortress</h2>
            <p className="text-slate-400 text-sm">Expand your walls to increase defense and resource generation.</p>
            
            <button
                onClick={handleUpgrade}
                disabled={!canAfford}
                className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-lg transition-all active:scale-95 ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-amber-500/20 shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
                {canAfford ? <ArrowUpCircle className="w-6 h-6" /> : <Hammer className="w-6 h-6" />}
                <span>{canAfford ? `Upgrade (${upgradeCost}g)` : `Need ${upgradeCost}g`}</span>
            </button>
        </div>

        {/* Decor/Events (Static for demo) */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
                 <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">🛡️</div>
                 <h3 className="font-bold text-sm">Defenses</h3>
                 <p className="text-xs text-slate-500">Active</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
                 <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">🧙‍♂️</div>
                 <h3 className="font-bold text-sm">Mages</h3>
                 <p className="text-xs text-slate-500">Recruiting</p>
            </div>
        </div>
      </div>
    </div>
  );
};
