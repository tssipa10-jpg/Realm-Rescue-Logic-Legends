import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { LEVEL_CONFIGS } from '../constants';
import { getOracleWisdom } from '../services/geminiService';
import { Sparkles, Scroll } from 'lucide-react';

export const OracleScreen: React.FC = () => {
  const { gameState } = useGame();
  const [wisdom, setWisdom] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Find the highest unlocked level to give relevant advice
  const currentLevelId = Math.max(...gameState.unlockedLevels);
  const currentLevel = LEVEL_CONFIGS.find(l => l.id === currentLevelId);

  const askOracle = async () => {
    if (!currentLevel) return;
    
    setLoading(true);
    setWisdom("");
    
    // Construct context from current game state
    const context = `Level ${currentLevel.name}. Objective: ${currentLevel.hint}. The player has ${gameState.gold} gold.`;
    
    const response = await getOracleWisdom(context);
    setWisdom(response);
    setLoading(false);
  };

  return (
    <div className="h-full w-full bg-slate-950 pt-20 px-6 flex flex-col items-center">
      <div className="w-32 h-32 rounded-full bg-purple-900/30 border-2 border-purple-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <Sparkles className="w-16 h-16 text-purple-400 animate-pulse" />
      </div>

      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
        The Royal Oracle
      </h1>
      <p className="text-slate-400 text-center text-sm mb-8">
        Ask for guidance on your current journey. The spirits see all.
      </p>

      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 min-h-[160px] flex items-center justify-center text-center relative overflow-hidden">
        {loading ? (
            <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-purple-400 animate-pulse">Consulting the stars...</span>
            </div>
        ) : wisdom ? (
            <p className="text-purple-100 font-serif italic text-lg leading-relaxed animate-fade-in">
                "{wisdom}"
            </p>
        ) : (
            <p className="text-slate-600 text-sm">Tap the button below to seek wisdom.</p>
        )}
      </div>

      <button
        onClick={askOracle}
        disabled={loading}
        className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition active:scale-95 flex items-center space-x-2 disabled:opacity-50"
      >
        <Scroll className="w-5 h-5" />
        <span>Seek Guidance</span>
      </button>

      <p className="mt-auto mb-24 text-xs text-slate-600 text-center">
        Powered by Gemini AI. <br/>Advice may be cryptic, as is the way of magic.
      </p>
    </div>
  );
};
