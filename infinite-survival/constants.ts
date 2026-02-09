import { Trait, DialogueNode, GameWorld, Entity, Teammate } from './types';

export const AVATAR_PLACEHOLDER = "https://picsum.photos/200";
export const NPC_AVATAR_1 = "https://picsum.photos/201";
export const NPC_AVATAR_2 = "https://picsum.photos/202";

export const STARTING_TRAITS: Trait[] = [
  { id: 'ordinary', name: '普通', description: '没有任何突出的特点' },
  { id: 'strong', name: '巨力', description: '力量 +10' },
  { id: 'agile', name: '迅捷', description: '敏捷 +10' },
  { id: 'otaku', name: '技术宅', description: '智力 +5, 社交 -5' },
  { id: 'rich', name: '富二代', description: '初始携带大量现金' },
  { id: 'unlucky', name: '倒霉蛋', description: '运气极差' },
];

// --- Hub NPCs (Potential Teammates) ---

export const HUB_NPCS: Teammate[] = [
  {
    id: 'npc_veteran',
    name: '雷虎',
    role: '资深者 / 强攻手',
    description: '一名满脸伤疤的壮汉，在这个地狱活过了五场恐怖片。性格暴躁但经验丰富。',
    personality: 'Aggressive',
    isRecruited: false,
    avatarPlaceholder: '#ef4444', // Red
    dialogueId: 'hub_veteran_start',
    stats: { strength: 12, physical: 40 }
  },
  {
    id: 'npc_smart',
    name: '楚轩 (伪)',
    role: '布局者',
    description: '戴着眼镜的冷漠男子，总是在啃苹果。据说智商极高，但毫无感情。',
    personality: 'Cold',
    isRecruited: false,
    avatarPlaceholder: '#3b82f6', // Blue
    dialogueId: 'hub_smart_start',
    stats: { intuition: 15, shooting: 30 }
  },
  {
    id: 'npc_healer',
    name: '小雅',
    role: '精神力者 / 辅助',
    description: '看起来很柔弱的高中女生，但觉醒了精神力扫描技能。',
    personality: 'Kind',
    isRecruited: false,
    avatarPlaceholder: '#ec4899', // Pink
    dialogueId: 'hub_healer_start',
    stats: { spirit: 20, resilience: 2 }
  }
];

export const INITIAL_DIALOGUES: Record<string, DialogueNode> = {
  // Intro NPC in Tutorial
  'intro_npc': {
    id: 'intro_npc',
    speakerName: '神秘声音',
    text: '欢迎来到新手试炼。活着走到出口，你才有资格见到主神。',
    avatarUrl: NPC_AVATAR_1,
    options: [
      { label: '谁在那里？', nextId: undefined },
    ]
  },

  // --- Hub/Map NPC Dialogues ---

  // Veteran (Lei Hu)
  'hub_veteran_start': {
    id: 'hub_veteran_start',
    speakerName: '雷虎',
    text: '喂！那边那个菜鸟！别乱跑引怪，过来帮忙！',
    options: [
      { label: '我来帮你！', nextId: 'hub_veteran_recruit' },
      { label: '你自己保重。', nextId: undefined },
    ]
  },
  'hub_veteran_recruit': {
    id: 'hub_veteran_recruit',
    speakerName: '雷虎',
    text: '哼，还算有点胆色。这把枪先借你用，跟紧我！',
    options: [
      { label: '加入队伍 (Recruit)', nextId: undefined, action: 'recruit_npc_veteran' },
      { label: '我还是单独行动吧。', nextId: undefined },
    ]
  },
  'hub_veteran_recruited': {
    id: 'hub_veteran_recruited',
    speakerName: '雷虎',
    text: '火力覆盖！别让它们靠近！',
    options: [{ label: '收到！', nextId: undefined }]
  },

  // Smart (Chu)
  'hub_smart_start': {
    id: 'hub_smart_start',
    speakerName: '楚轩 (伪)',
    text: '（看着手中的仪器）这里的空间坐标在发生偏移...有趣。你也迷路了吗？',
    options: [
      { label: '你知道怎么出去？', nextId: 'hub_smart_explain' },
      { label: '借过。', nextId: undefined },
    ]
  },
  'hub_smart_explain': {
    id: 'hub_smart_explain',
    speakerName: '楚轩 (伪)',
    text: '我知道最短路径。但我需要一个人清理路障。合作吗？概率上讲这是最优解。',
    options: [
      { label: '我相信你的判断。 (Recruit)', nextId: undefined, action: 'recruit_npc_smart' },
      { label: '我不信任你。', nextId: undefined },
    ]
  },
  'hub_smart_recruited': {
    id: 'hub_smart_recruited',
    speakerName: '楚轩 (伪)',
    text: '左转，三点钟方向有埋伏。直接突破。',
    options: [{ label: '行动。', nextId: undefined }]
  },

  // Healer (Xiao Ya)
  'hub_healer_start': {
    id: 'hub_healer_start',
    speakerName: '小雅',
    text: '谁...谁在哪里？别过来...啊，是人类？太好了...',
    options: [
      { label: '你受伤了吗？', nextId: 'hub_healer_recruit' },
      { label: '躲远点。', nextId: undefined },
    ]
  },
  'hub_healer_recruit': {
    id: 'hub_healer_recruit',
    speakerName: '小雅',
    text: '我没事，只是精神力透支了。我能感应到前面有危险，可以带上我吗？我可以帮忙侦查！',
    options: [
      { label: '一起来吧。 (Recruit)', nextId: undefined, action: 'recruit_npc_healer' },
    ]
  },
  'hub_healer_recruited': {
    id: 'hub_healer_recruited',
    speakerName: '小雅',
    text: '前方五十米有两个红点反应，大家小心！',
    options: [{ label: '做得好。', nextId: undefined }]
  },
};

export const TUTORIAL_MAP: GameWorld = {
  id: 'region-1',
  name: 'Region-1: Dark Alley',
  width: 2000,
  height: 2000,
  entities: [
    // Intro Guide
    { id: 'npc_guide', name: '引导者', type: 'npc', x: 1000, y: 900, color: '#9ca3af', radius: 15, dialogueId: 'intro_npc', interactable: true },
    
    // Recruitable NPCs placed in map
    { id: 'npc_veteran', name: '雷虎', type: 'npc', x: 800, y: 1200, color: '#ef4444', radius: 20, dialogueId: 'hub_veteran_start', interactable: true },
    { id: 'npc_smart', name: '楚轩', type: 'npc', x: 1600, y: 500, color: '#3b82f6', radius: 20, dialogueId: 'hub_smart_start', interactable: true },
    { id: 'npc_healer', name: '小雅', type: 'npc', x: 400, y: 1600, color: '#ec4899', radius: 20, dialogueId: 'hub_healer_start', interactable: true },

    // Enemies
    { id: 'enemy_1', name: '丧尸', type: 'enemy', x: 1200, y: 1100, color: '#dc2626', radius: 15, interactable: false },
    { id: 'enemy_2', name: '爬行者', type: 'enemy', x: 1250, y: 1050, color: '#7f1d1d', radius: 18, interactable: false },
    { id: 'enemy_3', name: '丧尸犬', type: 'enemy', x: 1300, y: 1200, color: '#991b1b', radius: 12, interactable: false },
    
    // Items
    { id: 'item_1', name: '急救包', type: 'item', x: 800, y: 800, color: '#22c55e', radius: 10, interactable: true },
    { id: 'item_2', name: '弹药箱', type: 'item', x: 1550, y: 550, color: '#fbbf24', radius: 10, interactable: true },

    // Exit
    { id: 'exit_hub', name: '传送光柱', type: 'exit', x: 1000, y: 1000, color: '#a855f7', radius: 40, interactable: true },
  ],
  walls: [
    { x: 0, y: 0, w: 2000, h: 50 }, // Top border
    { x: 0, y: 1950, w: 2000, h: 50 }, // Bottom border
    { x: 0, y: 0, w: 50, h: 2000 }, // Left border
    { x: 1950, y: 0, w: 50, h: 2000 }, // Right border
    { x: 500, y: 500, w: 200, h: 200 }, // Block
    { x: 1400, y: 600, w: 100, h: 800 }, // Vertical wall
  ]
};
