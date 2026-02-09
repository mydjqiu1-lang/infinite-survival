import React from 'react';
import { Save, Upload, X, LogOut } from 'lucide-react';

interface SettingsModalProps {
  onSave: () => void;
  onLoad: () => void;
  onClose: () => void;
  onTitle: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onSave, onLoad, onClose, onTitle }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-gray-800 p-8 w-80 shadow-[0_0_50px_rgba(0,0,0,1)] relative flex flex-col gap-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50" />
        
        <h2 className="text-xl text-gray-400 font-light border-b border-gray-900 pb-4 mb-2 tracking-[0.2em] uppercase text-center">
          System
        </h2>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <button 
          onClick={() => { onSave(); }}
          className="flex items-center gap-4 p-4 border border-gray-800 bg-gray-900/30 hover:bg-gray-800 hover:border-gray-600 hover:text-white text-gray-400 transition-all group"
        >
          <Save className="group-hover:text-green-500 transition-colors" size={20} /> 
          <span className="tracking-widest text-sm">SAVE GAME</span>
        </button>

        <button 
          onClick={() => { onLoad(); onClose(); }}
          className="flex items-center gap-4 p-4 border border-gray-800 bg-gray-900/30 hover:bg-gray-800 hover:border-gray-600 hover:text-white text-gray-400 transition-all group"
        >
          <Upload className="group-hover:text-blue-500 transition-colors" size={20} /> 
          <span className="tracking-widest text-sm">LOAD GAME</span>
        </button>

        <div className="h-px bg-gray-900 my-2" />

        <button 
          onClick={() => { 
            if(window.confirm("Return to title screen? Unsaved progress will be lost.")) {
                onTitle(); 
            }
          }}
          className="flex items-center gap-4 p-4 border border-gray-800 bg-red-950/10 hover:bg-red-900/20 hover:border-red-900 hover:text-red-400 text-gray-600 transition-all group"
        >
          <LogOut size={20} /> 
          <span className="tracking-widest text-sm">TITLE SCREEN</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;