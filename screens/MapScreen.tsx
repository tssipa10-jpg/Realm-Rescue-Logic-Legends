import React from 'react';
import { useGame } from '../contexts/GameContext';
import { LEVEL_CONFIGS } from '../constants';
import { Lock, Star, Play } from 'lucide-react';
import { Screen } from '../types';

interface MapScreenProps {
  setSelectedLevel: (id: number) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ setSelectedLevel }) => {
  const { gameState, setScreen } = useGame();

  const handleLevelSelect = (levelId: number) => {
    setSelectedLevel(levelId);
    setScreen(Screen.PUZZLE);
  };

  return (
    <div className="h-full w-full bg-slate-950 pt-20 pb-24 px-4 overflow-y-auto no-scrollbar relative">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://picsum.photos/seed/mapbg/800/1200')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <h1 className="text-2xl font-bold text-white mb-4 tracking-widest uppercase border-b-2 border-amber-500 pb-2">Campaign Map</h1>
        
        {LEVEL_CONFIGS.map((level, index) => {
          const isUnlocked = gameState.unlockedLevels.includes(level.id);
          const isCompleted = gameState.unlockedLevels.includes(level.id + 1); // Simple check for demo
          
          return (
            <div key={level.id} className="relative w-full max-w-xs flex flex-col items-center">
              {/* Connector Line */}
              {index < LEVEL_CONFIGS.length - 1 && (
                <div className="absolute top-12 left-1/2 w-1 h-16 bg-slate-800 -z-10 transform -translate-x-1/2">
                   {gameState.unlockedLevels.includes(level.id + 1) && <div className="w-full h-full bg-amber-500/50"></div>}
                </div>
              )}

              <button
                onClick={() => isUnlocked && handleLevelSelect(level.id)}
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

                {/* Level Label */}
                <div className="absolute -bottom-8 w-32 text-center">
                    <span className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                        {level.name}
                    </span>
                </div>
              </button>
            </div>
          );
        })}
        
        <div className="h-20"></div> {/* Spacer */}
      </div>
    </div>
  );
};