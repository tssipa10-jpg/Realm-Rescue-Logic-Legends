import React from 'react';
import { useGame } from '../contexts/GameContext';
import { X, Volume2, VolumeX, Smartphone, Trash2, ShieldCheck, FileText } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { gameState, toggleSound, toggleHaptics, resetGame } = useGame();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-8 text-center border-b border-slate-800 pb-4">Settings</h2>

        <div className="space-y-4">
          {/* Sound Toggle */}
          <button 
            onClick={toggleSound}
            className="w-full flex items-center justify-between p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {gameState.settings.soundEnabled ? <Volume2 className="text-green-400" /> : <VolumeX className="text-slate-500" />}
              <span className="text-slate-200 font-medium">Sound Effects</span>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${gameState.settings.soundEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${gameState.settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Haptics Toggle */}
          <button 
            onClick={toggleHaptics}
            className="w-full flex items-center justify-between p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Smartphone className={gameState.settings.hapticsEnabled ? "text-blue-400" : "text-slate-500"} />
              <span className="text-slate-200 font-medium">Vibration</span>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${gameState.settings.hapticsEnabled ? 'bg-blue-500' : 'bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${gameState.settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Data Management */}
          <button 
            onClick={resetGame}
            className="w-full flex items-center justify-between p-4 bg-red-900/20 border border-red-900/50 rounded-xl hover:bg-red-900/30 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-red-200 font-medium">Reset Progress</span>
            </div>
          </button>
        </div>

        {/* Legal / Info */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-center space-x-6 text-xs text-slate-500">
           <a href="#" className="flex items-center gap-1 hover:text-slate-300">
             <ShieldCheck className="w-3 h-3" /> Privacy Policy
           </a>
           <a href="#" className="flex items-center gap-1 hover:text-slate-300">
             <FileText className="w-3 h-3" /> Terms of Service
           </a>
        </div>
        
        <div className="mt-4 text-center text-[10px] text-slate-600">
            Version 1.0.0 (Build 2025)
        </div>
      </div>
    </div>
  );
};