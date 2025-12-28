import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Coins, Diamond, Zap, Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export const TopBar: React.FC = () => {
  const { gameState } = useGame();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-900 to-slate-900/0 z-50 flex items-center justify-between px-4 pt-2">
        {/* Energy */}
        <div className="flex items-center space-x-1 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 shadow-md">
          <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-white">{gameState.energy}/{gameState.maxEnergy}</span>
        </div>

        {/* Resources & Settings */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 shadow-md">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-500" />
            <span className="text-sm font-bold text-white">{gameState.gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 shadow-md">
            <Diamond className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span className="text-sm font-bold text-white">{gameState.gems}</span>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-slate-800/80 backdrop-blur-md p-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-white active:scale-95 transition-all shadow-md"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};