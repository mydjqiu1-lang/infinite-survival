import React, { useState } from 'react';
import { RefreshCw, User, Dice5 } from 'lucide-react';
import { PlayerStats, Trait, Item } from '../types';
import { STARTING_TRAITS } from '../constants';

interface CharacterCreatorProps {
  onComplete: (name: string, gender: string, stats: PlayerStats, traits: Trait[], initialItems: Item[]) => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete }) => {
  const [name, setName] = useState('新人');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [traits, setTraits] = useState<Trait[]>([STARTING_TRAITS[0]]);
  
  // Random Stat Generator
  const generateStats = (): PlayerStats => ({
    hp: Math.floor(Math.random() * 20) + 100,
    maxHp: 120,
    stamina: Math.floor(Math.random() * 20) + 100,
    maxStamina: 120,
    spirit: Math.floor(Math.random() * 10) + 10,
    maxSpirit: 20,
    strength: Math.floor(Math.random() * 10) + 1,
    agility: Math.floor(Math.random() * 10) + 1,
    resilience: Math.floor(Math.random() * 10) + 1,
    intuition: Math.floor(Math.random() * 10) + 1,
    luck: Math.floor(Math.random() * 100) + 1,
    physical: Math.floor(Math.random() * 50) + 10,
    shooting: Math.floor(Math.random() * 50) + 10,
    melee: Math.floor(Math.random() * 50) + 10,
  });

  const [stats, setStats] = useState<PlayerStats>(generateStats());

  const handleReroll = () => {
    setStats(generateStats());
    const shuffled = [...STARTING_TRAITS].sort(() => 0.5 - Math.random());
    setTraits(shuffled.slice(0, 2));
  };

  const getInitialItems = (): Item[] => [
    { id: 'water', name: '矿泉水', quantity: 1, description: '普通的饮用水。', type: 'consumable' },
    { id: 'food_1', name: '压缩饼干', quantity: 1, description: '口感很干，但能填饱肚子。', type: 'consumable' },
    { id: 'food_2', name: '巧克力', quantity: 1, description: '高热量食物。', type: 'consumable' },
    { id: 'bandage', name: '简易绷带', quantity: 1, description: '只能处理轻微伤口。', type: 'consumable' },
  ];

  return (
    <div className="w-full h-screen bg-neutral-900 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-black border border-gray-800 p-8 shadow-2xl rounded-sm">
        <h2 className="text-2xl mb-6 border-b border-gray-800 pb-2 text-gray-400 font-light">Character Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Basic Info & Stats */}
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <label className="text-gray-500 w-16">姓名</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-900 border border-gray-700 px-3 py-1 text-white focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <label className="text-gray-500 w-16">性别</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setGender('Male')}
                  className={`px-4 py-1 border ${gender === 'Male' ? 'bg-blue-900 border-blue-600 text-blue-200' : 'border-gray-700 text-gray-500'}`}
                >
                  男
                </button>
                <button 
                   onClick={() => setGender('Female')}
                   className={`px-4 py-1 border ${gender === 'Female' ? 'bg-pink-900 border-pink-600 text-pink-200' : 'border-gray-700 text-gray-500'}`}
                >
                  女
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-4 border border-gray-800">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-blue-400 text-sm font-bold">战斗素质</span>
                  <button onClick={handleReroll} className="text-xs flex items-center gap-1 hover:text-white transition-colors">
                     <Dice5 size={14} /> 随机
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex justify-between px-2"><span>体术</span> <span className="text-gray-400">{stats.physical}</span></div>
                  <div className="flex justify-between px-2"><span>枪械</span> <span className="text-gray-400">{stats.shooting}</span></div>
                  <div className="flex justify-between px-2"><span>刀术</span> <span className="text-gray-400">{stats.melee}</span></div>
                  <div className="flex justify-between px-2"><span>运气</span> <span className="text-yellow-600">{stats.luck}</span></div>
               </div>
            </div>
          </div>

          {/* Right Column: Traits & Items */}
          <div className="space-y-6">
             <div className="bg-gray-900 p-4 border border-gray-800 h-32">
                <h3 className="text-gray-500 text-sm mb-2">特征</h3>
                <div className="flex flex-wrap gap-2">
                   {traits.map(t => (
                      <span key={t.id} className="text-xs bg-gray-800 border border-gray-600 px-2 py-1 text-gray-300">
                         {t.name}
                      </span>
                   ))}
                </div>
             </div>

             <div className="bg-gray-900 p-4 border border-gray-800 h-40">
                <h3 className="text-gray-500 text-sm mb-2">初始携带物</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                   {getInitialItems().map(item => (
                       <li key={item.id} className="flex justify-between">
                           <span>{item.name}</span>
                           <span className="text-gray-600">x{item.quantity}</span>
                       </li>
                   ))}
                </ul>
             </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
           <button 
             onClick={() => onComplete(name, gender, stats, traits, getInitialItems())}
             className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-8 py-2 transition-colors uppercase tracking-widest"
           >
             OK
           </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
