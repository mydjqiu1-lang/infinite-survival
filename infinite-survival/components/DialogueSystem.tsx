import React from 'react';
import { DialogueNode } from '../types';
import { INITIAL_DIALOGUES } from '../constants';

interface DialogueSystemProps {
  node: DialogueNode;
  onClose: () => void;
  onNext: (node: DialogueNode) => void;
  onAction?: (action: string) => void;
}

const DialogueSystem: React.FC<DialogueSystemProps> = ({ node, onClose, onNext, onAction }) => {
  const handleOptionClick = (nextId?: string, action?: string) => {
    if (action && onAction) {
        onAction(action);
    }
    
    if (nextId && INITIAL_DIALOGUES[nextId]) {
      onNext(INITIAL_DIALOGUES[nextId]);
    } else {
      onClose();
    }
  };

  return (
    <div className="w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-8 px-8 md:px-20 flex flex-col md:flex-row gap-6 items-end">
       {/* Avatar */}
       {node.avatarUrl && (
         <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-gray-600 bg-gray-900 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <img src={node.avatarUrl} alt={node.speakerName} className="w-full h-full object-cover grayscale contrast-125" />
         </div>
       )}

       {/* Text Area */}
       <div className="flex-1 bg-black/80 border border-gray-700 p-6 min-h-[160px] flex flex-col justify-between backdrop-blur-md w-full shadow-2xl">
          <div>
            <h3 className="text-blue-400 font-bold mb-2 tracking-wide uppercase text-sm border-b border-gray-800 pb-1 inline-block">{node.speakerName}</h3>
            <p className="text-gray-200 leading-relaxed font-light text-lg typing-effect">
               {node.text}
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 justify-end">
             {node.options.map((opt, idx) => (
               <button 
                  key={idx}
                  onClick={() => handleOptionClick(opt.nextId, opt.action)}
                  className="px-4 py-2 border border-gray-600 hover:bg-gray-200 hover:text-black hover:border-white transition-all text-sm text-gray-400"
               >
                  {opt.label}
               </button>
             ))}
          </div>
       </div>
    </div>
  );
};

export default DialogueSystem;
