import React from 'react';
import { PlayerStats } from '../types';
import { X, Activity, Zap, Brain } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface StatusMenuProps {
  stats: PlayerStats;
  name: string;
  onClose: () => void;
}

const StatusMenu: React.FC<StatusMenuProps> = ({ stats, name, onClose }) => {
  const chartData = [
    { subject: '力量', A: stats.strength * 10, fullMark: 150 },
    { subject: '敏捷', A: stats.agility * 10, fullMark: 150 },
    { subject: '强韧', A: stats.resilience * 10, fullMark: 150 },
    { subject: '运气', A: stats.luck, fullMark: 150 },
    { subject: '感知', A: stats.intuition * 10, fullMark: 150 },
    { subject: '速度', A: (stats.agility + stats.strength) * 5, fullMark: 150 },
  ];

  return (
    <div className="w-full max-w-5xl bg-[#111] border border-gray-700 shadow-2xl flex flex-col h-[80vh]">
       {/* Header */}
       <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black">
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-light tracking-widest text-white">{name}</h2>
             <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded">无职业者</span>
             <span className="text-xs text-gray-500">[ 权限 F ]</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X /></button>
       </div>

       <div className="flex flex-1 p-6 gap-8 overflow-hidden">
          {/* Left: Stats List */}
          <div className="w-1/3 flex flex-col gap-6 border-r border-gray-800 pr-6">
             {/* Vitals */}
             <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                   <span className="flex items-center gap-2 text-red-400"><Activity size={16}/> 生命</span>
                   <div className="flex-1 mx-4 bg-gray-900 h-2 rounded-full overflow-hidden"><div style={{width: `${(stats.hp/stats.maxHp)*100}%`}} className="h-full bg-red-600"/></div>
                   <span className="text-gray-300 font-mono">{stats.hp}/{stats.maxHp}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="flex items-center gap-2 text-green-400"><Zap size={16}/> 体力</span>
                   <div className="flex-1 mx-4 bg-gray-900 h-2 rounded-full overflow-hidden"><div style={{width: `${(stats.stamina/stats.maxStamina)*100}%`}} className="h-full bg-green-600"/></div>
                   <span className="text-gray-300 font-mono">{stats.stamina}/{stats.maxStamina}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="flex items-center gap-2 text-blue-400"><Brain size={16}/> 精神</span>
                   <div className="flex-1 mx-4 bg-gray-900 h-2 rounded-full overflow-hidden"><div style={{width: `${(stats.spirit/stats.maxSpirit)*100}%`}} className="h-full bg-blue-600"/></div>
                   <span className="text-gray-300 font-mono">{stats.spirit}/{stats.maxSpirit}</span>
                </div>
             </div>

             {/* Detailed Stats */}
             <div className="bg-black/30 p-4 rounded text-sm space-y-2 font-mono text-gray-400">
                <div className="flex justify-between"><span>力量 (STR)</span> <span className="text-white">{stats.strength}</span></div>
                <div className="flex justify-between"><span>敏捷 (AGI)</span> <span className="text-white">{stats.agility}</span></div>
                <div className="flex justify-between"><span>强韧 (VIT)</span> <span className="text-white">{stats.resilience}</span></div>
                <div className="flex justify-between"><span>感知 (SEN)</span> <span className="text-white">{stats.intuition}</span></div>
                <div className="flex justify-between border-t border-gray-800 pt-2"><span>体术</span> <span className="text-white">{stats.physical}</span></div>
                <div className="flex justify-between"><span>枪械</span> <span className="text-white">{stats.shooting}</span></div>
                <div className="flex justify-between"><span>冷兵器</span> <span className="text-white">{stats.melee}</span></div>
             </div>
          </div>

          {/* Center: Radar Chart */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black/20 rounded relative">
             <div className="absolute top-2 right-2 text-xs text-gray-600">战斗素质分析</div>
             <ResponsiveContainer width="100%" height="80%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="Stats"
                    dataKey="A"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </RadarChart>
             </ResponsiveContainer>
          </div>

          {/* Right: Info/Inventory Summary */}
          <div className="w-1/4 border-l border-gray-800 pl-6 flex flex-col gap-4">
             <div className="bg-gray-900 p-3">
                <h4 className="text-gray-500 text-xs mb-2">当前积分</h4>
                <p className="text-2xl text-yellow-500 font-mono">0</p>
             </div>
             <div className="bg-gray-900 p-3 flex-1">
                <h4 className="text-gray-500 text-xs mb-2">队友</h4>
                <div className="text-gray-600 text-sm text-center mt-10">
                   暂无队友
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default StatusMenu;
