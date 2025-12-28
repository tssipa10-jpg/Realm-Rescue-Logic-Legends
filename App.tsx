import React, { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { Screen } from './types';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { CastleScreen } from './screens/CastleScreen';
import { MapScreen } from './screens/MapScreen';
import { PuzzleScreen } from './screens/PuzzleScreen';
import { ShopScreen } from './screens/ShopScreen';
import { OracleScreen } from './screens/OracleScreen';

const MainLayout: React.FC = () => {
  const { currentScreen } = useGame();
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);

  return (
    <div className="relative w-full h-screen max-w-md mx-auto bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
      {/* HUD (Hide on Puzzle) */}
      {currentScreen !== Screen.PUZZLE && <TopBar />}

      {/* Screens */}
      <div className="flex-1 overflow-hidden relative">
        {currentScreen === Screen.CASTLE && <CastleScreen />}
        {currentScreen === Screen.MAP && <MapScreen setSelectedLevel={setSelectedLevelId} />}
        {currentScreen === Screen.PUZZLE && <PuzzleScreen levelId={selectedLevelId} />}
        {currentScreen === Screen.SHOP && <ShopScreen />}
        {currentScreen === Screen.ORACLE && <OracleScreen />}
      </div>

      {/* Nav (Hide on Puzzle) */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
}
