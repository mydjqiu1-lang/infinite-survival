import React, { useState, useEffect } from 'react';
import { GameState, PlayerStats, Trait, SaveData, Item } from './types';
import { TUTORIAL_MAP } from './constants';
import TitleScreen from './components/TitleScreen';
import CharacterCreator from './components/CharacterCreator';
import GameInterface from './components/GameInterface';
import HubScreen from './components/HubScreen';

const SAVE_KEY = 'infinite_survival_save_v1';
const CURRENT_VERSION = '0.1.0';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [player, setPlayer] = useState<{
    name: string;
    gender: string;
    stats: PlayerStats;
    traits: Trait[];
  } | null>(null);
  
  const [inventory, setInventory] = useState<Item[]>([]);
  const [teammateIds, setTeammateIds] = useState<string[]>([]);
  const [saveMeta, setSaveMeta] = useState<{timestamp: number, name: string} | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Load save metadata on mount (without loading full game)
  useEffect(() => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      try {
        const data: SaveData = JSON.parse(raw);
        setSaveMeta({
          timestamp: data.timestamp,
          name: data.player.name
        });
      } catch (e) {
        console.error("Corrupt save metadata");
      }
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartGame = () => {
    setGameState('CREATE');
  };

  const handleCharacterCreated = (name: string, gender: string, stats: PlayerStats, traits: Trait[], initialItems: Item[]) => {
    setPlayer({ name, gender, stats, traits });
    setInventory(initialItems);
    setTeammateIds([]);
    setGameState('HUB'); 
    showNotification("Welcome to the Infinite Space");
  };

  const handleEnterMap = () => {
    setGameState('EXPLORE');
  };

  const handleReturnToHub = () => {
     setGameState('HUB');
  };

  const handleReturnToTitle = () => {
      setGameState('TITLE');
  };

  const handleSaveGame = () => {
    if (!player) return;
    
    const data: SaveData = {
        player,
        inventory,
        teammates: teammateIds,
        points: 0, 
        timestamp: Date.now(),
        version: CURRENT_VERSION
    };
    
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      setSaveMeta({ timestamp: data.timestamp, name: player.name });
      showNotification("Game Saved Successfully");
    } catch (e) {
      showNotification("Failed to Save Game");
    }
  };

  const handleLoadGame = () => {
      try {
          const raw = localStorage.getItem(SAVE_KEY);
          if (!raw) return;
          const data: SaveData = JSON.parse(raw);
          
          setPlayer(data.player);
          setInventory(data.inventory || []); // Backwards compat
          setTeammateIds(data.teammates || []);
          setGameState('HUB');
          showNotification("Game Loaded");
      } catch (e) {
          console.error("Failed to load save", e);
          showNotification("Save File Corrupted");
      }
  };

  const handleDeleteSave = () => {
      localStorage.removeItem(SAVE_KEY);
      setSaveMeta(null);
      showNotification("Save Deleted");
  };

  const handleRecruitTeammate = (id: string) => {
      if (!teammateIds.includes(id)) {
          setTeammateIds(prev => [...prev, id]);
          showNotification("New Teammate Recruited!");
      }
  };

  return (
    <div className="w-full h-screen bg-black text-white font-sans relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-bounce font-bold tracking-widest text-sm pointer-events-none">
           {notification.toUpperCase()}
        </div>
      )}

      {gameState === 'TITLE' && (
          <TitleScreen 
            onStart={handleStartGame} 
            onLoad={handleLoadGame} 
            onDeleteSave={handleDeleteSave}
            saveMeta={saveMeta} 
          />
      )}
      
      {gameState === 'CREATE' && <CharacterCreator onComplete={handleCharacterCreated} />}
      
      {gameState === 'HUB' && (
          <HubScreen 
            onEnterMap={handleEnterMap} 
            onSave={handleSaveGame}
            onLoad={handleLoadGame}
            onExitTitle={handleReturnToTitle}
            teammateIds={teammateIds}
            onRecruit={handleRecruitTeammate}
          />
      )}
      
      {gameState === 'EXPLORE' && player && (
        <GameInterface 
          initialWorld={TUTORIAL_MAP} 
          playerData={player}
          onReturnToHub={handleReturnToHub}
          onSave={handleSaveGame}
          onLoad={handleLoadGame}
          onExitTitle={handleReturnToTitle}
          onRecruit={handleRecruitTeammate}
        />
      )}
    </div>
  );
};

export default App;
