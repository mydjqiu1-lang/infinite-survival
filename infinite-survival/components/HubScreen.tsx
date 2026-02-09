import React, { useState } from 'react';
import { ShoppingCart, Zap, Book, Box, Play, Settings, Users, MessageSquare } from 'lucide-react';
import { HUB_NPCS, INITIAL_DIALOGUES } from '../constants';
import { Teammate, DialogueNode } from '../types';
import DialogueSystem from './DialogueSystem';
import SettingsModal from './SettingsModal';

interface HubScreenProps {
  onEnterMap: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExitTitle: () => void;
  teammateIds: string[];
  onRecruit: (id: string) => void;
}

const HubScreen: React.FC<HubScreenProps> = ({ onEnterMap, onSave, onLoad, onExitTitle, teammateIds, onRecruit }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'social'>('main');
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleTalk = (npc: Teammate) => {
    let dialogueId = npc.dialogueId;
    if (teammateIds.includes(npc.id)) {
        if (npc.id === 'npc_veteran') dialogueId = 'hub_veteran_recruited';
        if (npc.id === 'npc_smart') dialogueId = 'hub_smart_recruited';
        if (npc.id === 'npc_healer') dialogueId = 'hub_healer_recruited';
    }
    
    const node = INITIAL_DIALOGUES[dialogueId];
    if (node) setActiveDialogue(node);
  };

  const handleDialogueAction = (action: string) => {
      if (action.startsWith('recruit_')) {
          const npcId = 'npc_' + action.split('recruit_npc_')[1];
          onRecruit(npcId);
      }
  };

  const menuItems = [
    { label: '物品兑换', icon: <Box size={18} />, id: 'items' },
    { label: '血统强化', icon: <Zap size={18} />, id: 'bloodline' },
    { label: '技能传承', icon: <Book size={18} />, id: 'skills' },
    { label: '广场/社交', icon: <Users size={18} />, id: 'social' },
  ];

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Sphere (God Sphere) - Updated to White Glowing Orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-[500px] h-[500px] rounded-full bg-white shadow-[0_0_100px_rgba(255,255,255,0.8),_0_0_200px_rgba(255,255,255,0.5),_inset_0_0_100px_rgba(200,200,200,0.8)] z-10 relative animate-pulse opacity-90">
             <div className="absolute -inset-10 rounded-full bg-white opacity-20 blur-3xl animate-spin-slow" />
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-100 to-white opacity-50 mix-blend-overlay" />
         </div>
      </div>

      <div className="z-20 w-full h-full flex">
         {/* Sidebar Menu */}
         <div className="w-64 h-full bg-black/80 backdrop-blur-md border-r border-gray-800 pt-20 pl-8 flex flex-col justify-between pb-8">
            <div>
                <h2 className="text-3xl font-thin text-white mb-10 tracking-widest">GOD SPACE</h2>
                
                <ul className="space-y-6">
                {menuItems.map((item, idx) => (
                    <li 
                        key={idx} 
                        onClick={() => setActiveTab(item.id === 'social' ? 'social' : 'main')}
                        className={`flex items-center gap-4 hover:translate-x-2 transition-all cursor-pointer group ${activeTab === item.id ? 'text-white drop-shadow-[0_0_5px_white]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <span>{item.icon}</span>
                        <span className="text-lg font-light tracking-wide">{item.label}</span>
                    </li>
                ))}
                </ul>

                <div className="mt-20 border-t border-gray-800 pt-6">
                    <div className="text-xs text-gray-600 mb-1">CURRENT POINTS</div>
                    <div className="text-2xl text-white font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">65225</div>
                    <div className="text-xs text-gray-600 mt-4 mb-1">AUTHORITY</div>
                    <div className="text-xl text-gray-400 font-mono">1C 1D 2E</div>
                </div>
            </div>

            {/* Settings button */}
            <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors"
            >
                <Settings size={18} />
                <span className="text-sm font-mono uppercase">SYSTEM</span>
            </button>
         </div>
         
         {/* Main Area */}
         <div className="flex-1 flex flex-col p-10">
            {activeTab === 'social' ? (
                <div className="w-full h-full flex flex-col bg-black/50 backdrop-blur-sm p-6 border border-gray-800 rounded-lg">
                    <h3 className="text-2xl text-gray-200 font-light border-b border-gray-800 pb-4 mb-6 flex items-center gap-2">
                        <Users /> 主神广场人员列表
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                        {HUB_NPCS.map(npc => {
                            const isTeammate = teammateIds.includes(npc.id);
                            return (
                                <div key={npc.id} className={`border p-6 relative transition-colors ${isTeammate ? 'border-blue-900 bg-blue-900/10' : 'border-gray-800 bg-gray-900/80 hover:border-gray-600'}`}>
                                    {isTeammate && <div className="absolute top-2 right-2 text-xs text-blue-400 font-mono">[ TEAMMATE ]</div>}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full" style={{backgroundColor: npc.avatarPlaceholder}}></div>
                                        <div>
                                            <div className="text-white font-bold text-lg">{npc.name}</div>
                                            <div className="text-xs text-gray-500 uppercase">{npc.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-6 h-12 overflow-hidden">{npc.description}</p>
                                    
                                    <button 
                                        onClick={() => handleTalk(npc)}
                                        className="w-full border border-gray-700 text-gray-300 py-2 text-sm hover:bg-gray-800 hover:text-white flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <MessageSquare size={14} /> 交谈
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-end justify-end">
                    <button 
                    onClick={onEnterMap}
                    className="bg-white text-black px-8 py-3 flex items-center gap-2 hover:bg-gray-200 transition-colors font-bold tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.6)] z-30"
                    >
                    ENTER WORLD <Play size={16} fill="black" />
                    </button>
                </div>
            )}
         </div>
      </div>

      {/* Dialogue Layer */}
      {activeDialogue && (
        <div className="absolute inset-x-0 bottom-0 pointer-events-auto z-50">
           <DialogueSystem 
              node={activeDialogue} 
              onClose={() => setActiveDialogue(null)} 
              onNext={(nextNode) => {
                  setActiveDialogue(nextNode)
              }}
              onAction={handleDialogueAction} 
           />
        </div>
      )}

      {/* Settings Modal Layer */}
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

export default HubScreen;
