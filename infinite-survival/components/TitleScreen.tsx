import React from 'react';
import { Infinity, Trash2 } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  onLoad: () => void;
  onDeleteSave: () => void;
  saveMeta: { timestamp: number; name: string } | null;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLoad, onDeleteSave, saveMeta }) => {
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#333_0%,_#000_70%)] opacity-50 animate-pulse" />
      
      <div className="z-10 flex flex-col items-center">
        <div className="mb-8 relative">
           <Infinity size={120} className="text-gray-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={1} />
        </div>
        
        <h1 className="text-5xl font-thin tracking-[0.5em] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 font-serif">
          INFINITE
        </h1>
        <p className="text-sm text-gray-500 tracking-[1em] mb-12 uppercase">
          求生无限
        </p>

        <div className="flex flex-col gap-6 w-64">
          <button 
            onClick={onStart}
            className="text-xl font-light hover:text-white text-gray-400 transition-all duration-300 hover:tracking-widest bg-black/50 py-2 border border-transparent hover:border-gray-800"
          >
            New Game
          </button>
          
          <div className="relative group">
            <button 
                onClick={onLoad}
                disabled={!saveMeta}
                className={`w-full text-xl font-light transition-all duration-300 py-2 border border-transparent 
                ${saveMeta 
                    ? 'text-gray-400 hover:text-white hover:tracking-widest hover:border-gray-800 cursor-pointer bg-black/50' 
                    : 'text-gray-800 cursor-not-allowed'}`}
            >
                Load Game
            </button>
            {/* Save Metadata Tooltip/Subtext */}
            {saveMeta && (
                <div className="text-[10px] text-gray-600 text-center mt-1 font-mono group-hover:text-gray-400 transition-colors">
                    {saveMeta.name} • {new Date(saveMeta.timestamp).toLocaleString()}
                </div>
            )}
          </div>

          <button 
             className="text-xl font-light hover:text-white text-gray-400 transition-all duration-300 hover:tracking-widest py-2"
          >
            Options
          </button>
        </div>
        
        {/* Delete Save Button */}
        {saveMeta && (
            <button 
                onClick={(e) => {
                    if(window.confirm("Are you sure you want to delete your save data?")) {
                        onDeleteSave();
                    }
                }}
                className="mt-12 text-gray-800 hover:text-red-900 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
            >
                <Trash2 size={12} /> Delete Save
            </button>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 text-xs text-gray-700">
        Ver 0.1.3 Alpha (Persistent)
      </div>
    </div>
  );
};

export default TitleScreen;
