export type GameState = 'TITLE' | 'CREATE' | 'EXPLORE' | 'HUB' | 'STATUS';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  spirit: number;
  maxSpirit: number;
  
  // Radar stats
  strength: number; // 力量
  agility: number;  // 敏捷
  resilience: number; // 强韧
  intuition: number; // 感知
  luck: number; // 运气
  
  // Skill stats
  physical: number; // 体术
  shooting: number; // 枪械
  melee: number; // 冷兵器
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  effect?: (stats: PlayerStats) => PlayerStats;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: 'consumable' | 'material' | 'weapon';
}

export interface Teammate {
  id: string;
  name: string;
  role: string; // e.g. "Assault", "Strategist"
  description: string;
  personality: string;
  isRecruited: boolean;
  avatarPlaceholder: string; // color hex or url
  stats: Partial<PlayerStats>;
  dialogueId: string;
}

export interface Entity {
  id: string;
  name: string;
  type: 'npc' | 'enemy' | 'item' | 'player' | 'exit';
  x: number;
  y: number;
  color: string;
  radius: number;
  dialogueId?: string;
  interactable?: boolean;
}

export interface DialogueNode {
  id: string;
  speakerName: string;
  text: string;
  avatarUrl?: string; // Placeholder url
  options: {
    label: string;
    nextId?: string; // If null, close dialogue
    action?: string; // String key for special actions (e.g. 'recruit', 'shop')
  }[];
}

export interface GameWorld {
  id: string;
  name: string;
  width: number;
  height: number;
  entities: Entity[];
  walls: { x: number; y: number; w: number; h: number }[];
}

export interface SaveData {
  player: {
    name: string;
    gender: string;
    stats: PlayerStats;
    traits: Trait[];
  };
  inventory: Item[];
  teammates: string[]; // List of recruited IDs
  points: number;
  timestamp: number;
  version: string;
}
