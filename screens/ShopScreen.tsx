import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Diamond, Coins, Zap, Shield } from 'lucide-react';

export const ShopScreen: React.FC = () => {
  const { addGold } = useGame();

  const packs = [
    { id: 1, name: "Handful of Gold", amount: 1000, cost: "Free (Daily)", icon: Coins, color: "text-amber-400" },
    { id: 2, name: "Sack of Gems", amount: 50, cost: "$4.99", icon: Diamond, color: "text-blue-400" },
    { id: 3, name: "Energy Elixir", amount: 10, cost: "$1.99", icon: Zap, color: "text-yellow-400" },
    { id: 4, name: "Royal Guard", amount: 1, cost: "$9.99", icon: Shield, color: "text-red-400" },
  ];

  return (
    <div className="h-full w-full bg-slate-950 pt-20 px-4 pb-24 overflow-y-auto no-scrollbar">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Royal Treasury</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {packs.map((pack) => (
          <button 
            key={pack.id}
            onClick={() => pack.cost.includes("Free") && addGold(1000)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-between aspect-square hover:border-amber-500/50 transition-colors"
          >
            <div className={`p-4 rounded-full bg-slate-800 ${pack.color} bg-opacity-10 mb-2`}>
                <pack.icon className={`w-8 h-8 ${pack.color}`} />
            </div>
            <div className="text-center">
                <h3 className="font-bold text-slate-200 text-sm mb-1">{pack.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{pack.amount > 10 ? `+${pack.amount}` : 'Unlock'}</p>
            </div>
            <div className="w-full py-2 bg-slate-800 rounded-lg text-center font-bold text-sm text-white border border-slate-700">
                {pack.cost}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-slate-800">
        <h3 className="text-amber-500 font-bold mb-2">VIP Membership</h3>
        <p className="text-slate-400 text-sm mb-4">Get daily gems, auto-collection, and remove ads.</p>
        <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg">
            Subscribe ($9.99/mo)
        </button>
      </div>
    </div>
  );
};
