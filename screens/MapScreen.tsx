import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { LEVEL_CONFIGS } from '../constants';
import { Lock, Star, Play, X, Swords, Shield, Skull } from 'lucide-react';
import { Screen, Difficulty } from '../types';

interface MapScreenProps {
  onStartLevel: (id: number, difficulty: Difficulty) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onStartLevel }) => {
  const { gameState } = useGame();
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);

  const handleLevelClick = (levelId: number) => {
    setSelectedLevelId(levelId);
    setDifficulty(Difficulty.NORMAL); // Reset to normal on open
  };

  const startLevel = () => {
    if (selectedLevelId) {
      onStartLevel(selectedLevelId, difficulty);
      setSelectedLevelId(null);
    }
  };

  const selectedLevelConfig = LEVEL_CONFIGS.find(l => l.id === selectedLevelId);

  const getMultiplier = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.EASY: return 0.5;
      case Difficulty.NORMAL: return 1.0;
      case Difficulty.HARD: return 1.5;
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
        case Difficulty.EASY: return "bg-green-500 text-white";
        case Difficulty.NORMAL: return "bg-blue-500 text-white";
        case Difficulty.HARD: return "bg-red-500 text-white";
    }
  };

  return (
    <div className="h-full w-full bg-slate-950 pt-20 pb-24 px-4 overflow-y-auto no-scrollbar relative">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://picsum.photos/seed/mapbg/800/1200')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <h1 className="text-2xl font-bold text-white mb-4 tracking-widest uppercase border-b-2 border-amber-500 pb-2">Campaign Map</h1>
        
        {LEVEL_CONFIGS.map((level, index) => {
          const isUnlocked = gameState.unlockedLevels.includes(level.id);
          const isCompleted = gameState.unlockedLevels.includes(level.id + 1); 
          
          return (
            <div key={level.id} className="relative w-full max-w-xs flex flex-col items-center">
              {/* Connector Line */}
              {index < LEVEL_CONFIGS.length - 1 && (
                <div className="absolute top-12 left-1/2 w-1 h-16 bg-slate-800 -z-10 transform -translate-x-1/2">
                   {gameState.unlockedLevels.includes(level.id + 1) && <div className="w-full h-full bg-amber-500/50"></div>}
                </div>
              )}

              <button
                onClick={() => isUnlocked && handleLevelClick(level.id)}
                disabled={!isUnlocked}
                className={`relative group w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300
                  ${isUnlocked 
                    ? 'bg-slate-800 border-amber-500 text-white hover:scale-110' 
                    : 'bg-slate-900 border-slate-700 text-slate-600 grayscale'}
                  ${isCompleted ? 'bg-amber-500/20' : ''}
                `}
              >
                {isUnlocked ? (
                  isCompleted ? <Star className="w-8 h-8 fill-amber-400 text-amber-400" /> : <Play className="w-8 h-8 fill-white ml-1" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}

                <div className="absolute -bottom-8 w-32 text-center">
                    <span className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                        {level.name}
                    </span>
                </div>
              </button>
            </div>
          );
        })}
        
        <div className="h-20"></div> 
      </div>

      {/* Level Selection Modal */}
      {selectedLevelConfig && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
                <button 
                    onClick={() => setSelectedLevelId(null)}
                    className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedLevelConfig.name}</h2>
                    <p className="text-slate-400 text-sm italic">{selectedLevelConfig.hint}</p>
                </div>

                <div className="space-y-4 mb-8">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Select Difficulty</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => setDifficulty(Difficulty.EASY)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${difficulty === Difficulty.EASY ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500 grayscale'}`}
                        >
                            <Shield className="w-6 h-6" />
                            <span className="text-xs font-bold">Easy</span>
                        </button>
                        <button 
                            onClick={() => setDifficulty(Difficulty.NORMAL)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${difficulty === Difficulty.NORMAL ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500 grayscale'}`}
                        >
                            <Swords className="w-6 h-6" />
                            <span className="text-xs font-bold">Normal</span>
                        </button>
                        <button 
                            onClick={() => setDifficulty(Difficulty.HARD)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${difficulty === Difficulty.HARD ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-500 grayscale'}`}
                        >
                            <Skull className="w-6 h-6" />
                            <span className="text-xs font-bold">Hard</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-slate-800 rounded-lg p-3 mb-6">
                    <span className="text-slate-400 text-sm">Reward:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                        {(selectedLevelConfig.reward * getMultiplier(difficulty)).toFixed(0)} Gold
                        {difficulty === Difficulty.HARD && <span className="text-xs text-red-400 ml-1">(+Bonus)</span>}
                    </span>
                </div>

                <button 
                    onClick={startLevel}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
                >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start Mission</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};