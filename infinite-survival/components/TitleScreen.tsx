import React from 'react';
import { Trash2 } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  onLoad: () => void;
  onDeleteSave: () => void;
  saveMeta: { timestamp: number; name: string } | null;
}

const desktopIcons = [
  { label: '我的文档', emoji: '📁' },
  { label: '我的电脑', emoji: '🖥️' },
  { label: '网上邻居', emoji: '🌐' },
  { label: '回收站', emoji: '🗑️' },
  { label: 'Internet\nExplorer', emoji: '🧭' },
  { label: '腾讯QQ', emoji: '🐧' },
];

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLoad, onDeleteSave, saveMeta }) => {
  return (
    <div className="w-full h-screen relative overflow-hidden text-white font-sans select-none">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#5ea7ff_0%,#78bcff_42%,#98d1ff_50%,#7bc857_51%,#63b541_70%,#4fa03a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_15%),radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_18%),radial-gradient(circle_at_70%_26%,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_16%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_14%)] opacity-95" />
      </div>

      <div className="relative z-10 h-full pb-12">
        <div className="p-4 grid gap-5 w-24">
          {desktopIcons.map((icon) => (
            <div key={icon.label} className="flex flex-col items-center gap-1 text-center drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
              <span className="text-3xl">{icon.emoji}</span>
              <span className="text-sm leading-4 whitespace-pre-line">{icon.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[560px] max-w-[92vw] border border-[#245edc] rounded-[3px] shadow-[0_12px_30px_rgba(0,0,0,0.5)] bg-[#ece9d8] text-black">
        <div className="h-8 px-2 bg-[linear-gradient(180deg,#3b8bf5_0%,#0053cf_100%)] flex items-center justify-between text-white rounded-t-[2px]">
          <span className="text-sm font-bold tracking-wide">无限求生</span>
          <button
            onClick={onLoad}
            disabled={!saveMeta}
            className={`w-5 h-5 border border-white/70 rounded-sm text-xs leading-none ${saveMeta ? 'bg-[#f05f57]' : 'bg-gray-400 cursor-not-allowed'}`}
            title={saveMeta ? '读取存档' : '暂无存档'}
          >
            ×
          </button>
        </div>

        <div className="px-6 py-8 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-yellow-300 border border-yellow-700 flex items-center justify-center font-bold">!</div>
          <p className="text-[21px] leading-relaxed" style={{ fontFamily: 'SimSun, serif' }}>
            想明白生命的意义吗？想真正的……活着吗？
          </p>
        </div>

        <div className="pb-6 flex items-center justify-center gap-6">
          <button
            onClick={onStart}
            className="min-w-28 h-9 px-6 border border-[#245edc] bg-[linear-gradient(180deg,#ffffff_0%,#d8e6ff_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,1)] hover:brightness-95 active:translate-y-[1px]"
          >
            是 (Y)
          </button>
          <button
            onClick={onLoad}
            disabled={!saveMeta}
            className={`min-w-28 h-9 px-6 border border-[#245edc] shadow-[inset_0_1px_0_rgba(255,255,255,1)] ${
              saveMeta
                ? 'bg-[linear-gradient(180deg,#ffffff_0%,#d8e6ff_100%)] hover:brightness-95 active:translate-y-[1px]'
                : 'bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            否 (N)
          </button>
        </div>

        {saveMeta && (
          <div className="pb-4 text-center text-xs text-gray-700">
            当前存档：{saveMeta.name} · {new Date(saveMeta.timestamp).toLocaleString()}
          </div>
        )}

        {saveMeta && (
          <button
            onClick={() => {
              if (window.confirm('确定删除当前存档吗？')) {
                onDeleteSave();
              }
            }}
            className="absolute bottom-3 right-4 text-gray-600 hover:text-red-700 transition-colors flex items-center gap-1 text-xs"
          >
            <Trash2 size={12} /> 删除存档
          </button>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 h-12 bg-[linear-gradient(180deg,#2f6fe2_0%,#0b49c6_100%)] border-t border-[#8ec0ff] z-30 flex items-center px-2">
        <div className="h-9 px-5 rounded-md bg-[linear-gradient(180deg,#41bf46_0%,#2a9532_100%)] border border-[#1f6c22] text-white text-xl italic font-bold flex items-center">
          开始
        </div>
        <div className="ml-auto text-white text-lg pr-3">3:32</div>
      </div>
    </div>
  );
};

export default TitleScreen;
