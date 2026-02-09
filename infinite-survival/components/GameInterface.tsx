import React, { useState, useEffect, useRef } from 'react';
import { GameWorld, Entity, PlayerStats, DialogueNode } from '../types';
import { Target, Users, Backpack, Settings, ShieldAlert, Ghost } from 'lucide-react';
import DialogueSystem from './DialogueSystem';
import StatusMenu from './StatusMenu';
import SettingsModal from './SettingsModal';

interface GameInterfaceProps {
  initialWorld: GameWorld;
  playerData: {
    name: string;
    stats: PlayerStats;
  };
  onReturnToHub: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExitTitle: () => void;
  onRecruit: (id: string) => void;
}

const TILE_SIZE = 50; // Visual scale factor

const GameInterface: React.FC<GameInterfaceProps> = ({ initialWorld, playerData, onReturnToHub, onSave, onLoad, onExitTitle, onRecruit }) => {
  const [playerPos, setPlayerPos] = useState({ x: 1000, y: 1000 }); // Start middle
  const [world] = useState<GameWorld>(initialWorld);
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [nearbyEntities, setNearbyEntities] = useState<Entity[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<Record<string, boolean>>({});

  // Movement Logic loop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;
    const speed = 4; // pixels per frame

    const loop = () => {
      if (activeDialogue || showStatus || showSettings) {
         animationFrameId = requestAnimationFrame(loop);
         return;
      }

      setPlayerPos(prev => {
        let { x, y } = prev;
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) y -= speed;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) y += speed;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) x -= speed;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) x += speed;

        // Simple boundary check
        x = Math.max(25, Math.min(x, world.width - 25));
        y = Math.max(25, Math.min(y, world.height - 25));

        // Simple Wall Collision (AABB)
        const playerRect = { x: x - 20, y: y - 20, w: 40, h: 40 };
        const hitWall = world.walls.some(w => 
          playerRect.x < w.x + w.w &&
          playerRect.x + playerRect.w > w.x &&
          playerRect.y < w.y + w.h &&
          playerRect.y + playerRect.h > w.y
        );

        return hitWall ? prev : { x, y };
      });
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [world, activeDialogue, showStatus, showSettings]);

  // Entity Detection
  useEffect(() => {
    const nearby = world.entities.filter(e => {
      const dx = e.x - playerPos.x;
      const dy = e.y - playerPos.y;
      return Math.sqrt(dx * dx + dy * dy) < 80; // Interaction radius
    });
    setNearbyEntities(nearby);
  }, [playerPos, world]);

  // Interaction Handler
  const handleInteraction = () => {
    const target = nearbyEntities.find(e => e.interactable);
    if (target) {
       if (target.type === 'exit') {
         onReturnToHub();
       } else if (target.dialogueId) {
         import('../constants').then(mod => {
            const dialogue = mod.INITIAL_DIALOGUES[target.dialogueId!];
            if(dialogue) setActiveDialogue(dialogue);
         });
       }
    }
  };

  const handleDialogueAction = (action: string) => {
      if (action.startsWith('recruit_')) {
          const npcId = 'npc_' + action.split('recruit_npc_')[1];
          onRecruit(npcId);
      }
  };

  // Keyboard 'E' or 'Space' for interaction
  useEffect(() => {
     const handler = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.key === 'e') {
           handleInteraction();
        }
        if (e.key === 'Escape') {
           if (showSettings) setShowSettings(false);
           else if (showStatus) setShowStatus(false);
           else if (activeDialogue) setActiveDialogue(null);
           else setShowSettings(true); // Open settings on Escape if nothing else is open
        }
     };
     window.addEventListener('keydown', handler);
     return () => window.removeEventListener('keydown', handler);
  }, [nearbyEntities, showSettings, showStatus, activeDialogue]);


  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      
      {/* Map Layer */}
      <div 
        ref={mapRef}
        className="absolute top-1/2 left-1/2 will-change-transform"
        style={{
           transform: `translate3d(${-playerPos.x}px, ${-playerPos.y}px, 0)`,
        }}
      >
        {/* World Background (Grid) */}
        <div 
          className="absolute border border-gray-800 bg-[#111]"
          style={{ 
            width: world.width, 
            height: world.height,
            backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}
        >
           {/* Region Text on Floor */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-[#1a1a1a] select-none pointer-events-none whitespace-nowrap">
              {world.name.toUpperCase()}
           </div>
        </div>

        {/* Walls */}
        {world.walls.map((w, i) => (
          <div 
            key={i} 
            className="absolute bg-[#0a0a0a] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-[#222]"
            style={{ left: w.x, top: w.y, width: w.w, height: w.h }}
          />
        ))}

        {/* Entities */}
        {world.entities.map(e => (
          <div 
            key={e.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300"
            style={{ left: e.x, top: e.y, width: e.radius * 2, height: e.radius * 2 }}
          >
             {/* Main Circle */}
             <div 
               className="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2"
               style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderColor: e.color,
                  backgroundColor: `${e.color}33` // 20% opacity hex
               }} 
             />
             {/* Label */}
             <span className="mt-2 text-[10px] text-gray-400 whitespace-nowrap bg-black/50 px-1 rounded">
               {e.name}
             </span>
          </div>
        ))}

        {/* Player Character */}
        <div 
           className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
           style={{ left: playerPos.x, top: playerPos.y }}
        >
           <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse" />
        </div>
      </div>

      {/* Fog of War Overlay */}
      <div className="absolute inset-0 pointer-events-none fog-of-war" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        
        {/* Top Left Status */}
        <div className="flex gap-4 pointer-events-auto">
           <button 
             onClick={() => setShowStatus(true)}
             className="w-12 h-12 rounded-full border border-gray-600 bg-black/80 flex items-center justify-center hover:border-white transition-colors group"
           >
              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-black group-hover:from-gray-600" />
              </div>
           </button>
           <div className="flex flex-col justify-center gap-1 text-xs font-mono">
              <div className="bg-gray-900 w-32 h-2 rounded border border-gray-700 relative">
                 <div className="bg-red-600 h-full w-[90%]" />
              </div>
              <div className="bg-gray-900 w-32 h-2 rounded border border-gray-700 relative">
                 <div className="bg-green-600 h-full w-[80%]" />
              </div>
              <div className="bg-gray-900 w-32 h-2 rounded border border-gray-700 relative">
                 <div className="bg-blue-600 h-full w-[100%]" />
              </div>
           </div>
        </div>

        {/* Right Interactions */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
            {nearbyEntities.map(e => (
               <div key={e.id} className="flex items-center gap-2 justify-end animate-in fade-in slide-in-from-right-4">
                  <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">{e.name}</span>
                  <div className="w-10 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center bg-black/50">
                     {e.type === 'enemy' ? <Ghost size={16} className="text-red-500"/> : <Users size={16} className="text-blue-500"/>}
                  </div>
               </div>
            ))}
        </div>

        {/* Left Action Menu - GEAR ICON IS HERE */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-auto text-gray-500">
           <button className="hover:text-white transition-colors"><Target /></button>
           <button className="hover:text-white transition-colors"><Backpack /></button>
           <button className="hover:text-white transition-colors"><Users /></button>
           <button 
             onClick={() => setShowSettings(true)}
             className="hover:text-white transition-colors"
           >
             <Settings />
           </button>
        </div>

        {/* Bottom Interaction Prompt */}
        <div className="flex justify-center mb-10 pointer-events-auto">
           {nearbyEntities.some(e => e.interactable) && !activeDialogue && (
              <div className="bg-black/80 border border-white/20 text-white px-6 py-2 rounded-full animate-bounce cursor-pointer" onClick={handleInteraction}>
                 Interac (SPACE)
              </div>
           )}
        </div>
      </div>

      {/* Dialogue System */}
      {activeDialogue && (
        <div className="absolute inset-x-0 bottom-0 pointer-events-auto">
           <DialogueSystem 
              node={activeDialogue} 
              onClose={() => setActiveDialogue(null)} 
              onNext={(nextNode) => setActiveDialogue(nextNode)}
              onAction={handleDialogueAction}
           />
        </div>
      )}

      {/* Status Menu Overlay */}
      {showStatus && (
         <div className="absolute inset-0 bg-black/90 z-50 pointer-events-auto p-10 flex items-center justify-center">
            <StatusMenu stats={playerData.stats} name={playerData.name} onClose={() => setShowStatus(false)} />
         </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
            onSave={onSave}
            onLoad={onLoad}
            onClose={() => setShowSettings(false)}
            onTitle={onExitTitle}
        />
      )}
    </div>
  );
};

export default GameInterface;
