import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Screen } from '../types';
import { Castle, Map, ShoppingBag, Eye } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen } = useGame();

  const navItems = [
    { id: Screen.CASTLE, icon: Castle, label: 'Kingdom' },
    { id: Screen.MAP, icon: Map, label: 'Battle' },
    { id: Screen.ORACLE, icon: Eye, label: 'Oracle' },
    { id: Screen.SHOP, icon: ShoppingBag, label: 'Shop' },
  ];

  if (currentScreen === Screen.PUZZLE) return null; // Hide nav during gameplay

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-900 border-t border-slate-800 pb-4 flex items-center justify-around z-50 shadow-2xl">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-200 ${isActive ? 'text-amber-400 -translate-y-2' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`p-2 rounded-2xl ${isActive ? 'bg-amber-400/10' : ''}`}>
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-bold tracking-wide uppercase">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
