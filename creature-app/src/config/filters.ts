import { Shield, Heart, Zap, ShieldCheck, Sparkles, Footprints, Eye, Swords, Target, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type FilterType = 'range' | 'multiSelect' | 'boolean' | 'combobox';

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  icon?: LucideIcon;
  category: string;
  description?: string;

  // Range filter properties
  min?: number;
  max?: number;
  step?: number;

  // Multi-select properties
  options?: string[] | (() => string[]);
  searchable?: boolean;
  excludeMode?: boolean;

  // Data extraction function
  getValue?: (creature: any) => any;

  // UI properties
  defaultExpanded?: boolean;
  priority?: number; // Lower numbers show first
}

export const FILTER_CATEGORIES = {
  BASIC: 'Basic Info',
  CHALLENGE: 'Challenge & Experience',
  COMBAT: 'Combat Stats',
  ABILITIES: 'Ability Scores',
  SAVES: 'Saving Throws',
  DEFENSES: 'Defenses',
  MOVEMENT: 'Movement & Speed',
  SPECIAL: 'Special Abilities',
  ENVIRONMENT: 'Environment & Senses',
  ATTACKS: 'Attacks & Actions'
} as const;

export const FILTER_DEFINITIONS: FilterConfig[] = [
  // Basic Info
  {
    key: 'types',
    label: 'Creature Types',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.BASIC,
    searchable: true,
    excludeMode: true,
    defaultExpanded: true,
    priority: 1,
    getValue: (creature) => creature.type
  },
  {
    key: 'sizes',
    label: 'Size',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.BASIC,
    excludeMode: true,
    priority: 2,
    getValue: (creature) => creature.size
  },
  {
    key: 'alignments',
    label: 'Alignment',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.BASIC,
    excludeMode: true,
    priority: 3,
    getValue: (creature) => creature.alignment
  },
  {
    key: 'subtypes',
    label: 'Subtypes',
    type: 'multiSelect',
    icon: Shield,
    category: FILTER_CATEGORIES.BASIC,
    searchable: true,
    excludeMode: true,
    priority: 4,
    getValue: (creature) => creature.subtypes_normalized
  },

  // Challenge & Experience
  {
    key: 'cr',
    label: 'Challenge Rating',
    type: 'range',
    category: FILTER_CATEGORIES.CHALLENGE,
    min: 0,
    max: 30,
    step: 0.5,
    defaultExpanded: true,
    priority: 5,
    getValue: (creature) => creature.cr_parsed?.value ?? creature.cr
  },
  {
    key: 'mr',
    label: 'Mythic Rank',
    type: 'range',
    category: FILTER_CATEGORIES.CHALLENGE,
    min: 1,
    max: 10,
    step: 1,
    priority: 6,
    getValue: (creature) => creature.mr_parsed?.value ?? creature.mr
  },
  {
    key: 'xp',
    label: 'Experience Points',
    type: 'range',
    category: FILTER_CATEGORIES.CHALLENGE,
    min: 0,
    max: 1000000,
    step: 100,
    priority: 7,
    getValue: (creature) => creature.xp
  },

  // Combat Stats - AC
  {
    key: 'ac',
    label: 'Total AC',
    type: 'range',
    icon: Shield,
    category: FILTER_CATEGORIES.COMBAT,
    min: 1,
    max: 50,
    step: 1,
    priority: 8,
    getValue: (creature) => creature.ac
  },
  {
    key: 'touchAc',
    label: 'Touch AC',
    type: 'range',
    category: FILTER_CATEGORIES.COMBAT,
    min: 1,
    max: 30,
    step: 1,
    priority: 9,
    getValue: (creature) => creature.touch_ac
  },
  {
    key: 'flatFootedAc',
    label: 'Flat-Footed AC',
    type: 'range',
    category: FILTER_CATEGORIES.COMBAT,
    min: 1,
    max: 50,
    step: 1,
    priority: 10,
    getValue: (creature) => creature.flat_ac
  },

  // Hit Points
  {
    key: 'hp',
    label: 'Hit Points',
    type: 'range',
    icon: Heart,
    category: FILTER_CATEGORIES.COMBAT,
    min: 1,
    max: 1000,
    step: 1,
    priority: 11,
    getValue: (creature) => creature.hp?.total
  },

  // Initiative
  {
    key: 'initiative',
    label: 'Initiative',
    type: 'range',
    icon: Zap,
    category: FILTER_CATEGORIES.COMBAT,
    min: -10,
    max: 20,
    step: 1,
    priority: 12,
    getValue: (creature) => {
      return creature.initiative_parsed?.value ??
        (Array.isArray(creature.initiative) ? creature.initiative[0] : creature.initiative);
    }
  },

  // Saving Throws
  {
    key: 'fort',
    label: 'Fortitude Save',
    type: 'range',
    category: FILTER_CATEGORIES.SAVES,
    min: -5,
    max: 30,
    step: 1,
    priority: 13,
    getValue: (creature) => creature.fort
  },
  {
    key: 'ref',
    label: 'Reflex Save',
    type: 'range',
    category: FILTER_CATEGORIES.SAVES,
    min: -5,
    max: 30,
    step: 1,
    priority: 14,
    getValue: (creature) => creature.ref
  },
  {
    key: 'will',
    label: 'Will Save',
    type: 'range',
    category: FILTER_CATEGORIES.SAVES,
    min: -5,
    max: 30,
    step: 1,
    priority: 15,
    getValue: (creature) => creature.will
  },

  // Ability Scores
  {
    key: 'str',
    label: 'Strength',
    type: 'range',
    category: FILTER_CATEGORIES.ABILITIES,
    min: 1,
    max: 50,
    step: 1,
    priority: 16,
    getValue: (creature) => creature.ability_scores.STR
  },
  {
    key: 'dex',
    label: 'Dexterity',
    type: 'range',
    category: FILTER_CATEGORIES.ABILITIES,
    min: 1,
    max: 50,
    step: 1,
    priority: 17,
    getValue: (creature) => creature.ability_scores.DEX
  },
  {
    key: 'con',
    label: 'Constitution',
    type: 'range',
    category: FILTER_CATEGORIES.ABILITIES,
    min: 1,
    max: 50,
    step: 1,
    priority: 18,
    getValue: (creature) => creature.ability_scores.CON
  },
  {
    key: 'int',
    label: 'Intelligence',
    type: 'range',
    category: FILTER_CATEGORIES.ABILITIES,
    min: 1,
    max: 50,
    step: 1,
    priority: 19,
    getValue: (creature) => creature.ability_scores.INT
  },
  {
    key: 'wis',
    label: 'Wisdom',
    type: 'range',
    category: FILTER_CATEGORIES.ABILITIES,
    min: 1,
    max: 50,
    step: 1,
    priority: 20,
    getValue: (creature) => creature.ability_scores.WIS
  },
  {
    key: 'cha',
    label: 'Charisma',
    type: 'range',
    category: FILTER_CATEGORIES.ABILITIES,
    min: 1,
    max: 50,
    step: 1,
    priority: 21,
    getValue: (creature) => creature.ability_scores.CHA
  },

  // Combat Values
  {
    key: 'bab',
    label: 'Base Attack Bonus',
    type: 'range',
    icon: Swords,
    category: FILTER_CATEGORIES.COMBAT,
    min: 0,
    max: 30,
    step: 1,
    priority: 22,
    getValue: (creature) => creature.bab
  },
  {
    key: 'cmb',
    label: 'Combat Maneuver Bonus',
    type: 'range',
    category: FILTER_CATEGORIES.COMBAT,
    min: -10,
    max: 40,
    step: 1,
    priority: 23,
    getValue: (creature) => creature.cmb
  },
  {
    key: 'cmd',
    label: 'Combat Maneuver Defense',
    type: 'range',
    category: FILTER_CATEGORIES.COMBAT,
    min: 1,
    max: 50,
    step: 1,
    priority: 24,
    getValue: (creature) => creature.cmd
  },

  // Space and Reach
  {
    key: 'space',
    label: 'Space',
    type: 'range',
    category: FILTER_CATEGORIES.COMBAT,
    min: 0,
    max: 30,
    step: 5,
    priority: 25,
    getValue: (creature) => creature.space
  },
  {
    key: 'reach',
    label: 'Reach',
    type: 'range',
    category: FILTER_CATEGORIES.COMBAT,
    min: 0,
    max: 30,
    step: 5,
    priority: 26,
    getValue: (creature) => creature.reach
  },

  // Speeds
  {
    key: 'baseSpeed',
    label: 'Base Speed',
    type: 'range',
    icon: Footprints,
    category: FILTER_CATEGORIES.MOVEMENT,
    min: 0,
    max: 200,
    step: 5,
    priority: 27,
    getValue: (creature) => creature.speeds?.base
  },
  {
    key: 'burrowSpeed',
    label: 'Burrow Speed',
    type: 'range',
    category: FILTER_CATEGORIES.MOVEMENT,
    min: 5,
    max: 100,
    step: 5,
    priority: 28,
    getValue: (creature) => creature.speeds?.burrow
  },
  {
    key: 'climbSpeed',
    label: 'Climb Speed',
    type: 'range',
    category: FILTER_CATEGORIES.MOVEMENT,
    min: 5,
    max: 100,
    step: 5,
    priority: 29,
    getValue: (creature) => creature.speeds?.climb
  },
  {
    key: 'flySpeed',
    label: 'Fly Speed',
    type: 'range',
    category: FILTER_CATEGORIES.MOVEMENT,
    min: 10,
    max: 300,
    step: 5,
    priority: 30,
    getValue: (creature) => creature.speeds?.fly
  },
  {
    key: 'swimSpeed',
    label: 'Swim Speed',
    type: 'range',
    category: FILTER_CATEGORIES.MOVEMENT,
    min: 5,
    max: 100,
    step: 5,
    priority: 31,
    getValue: (creature) => creature.speeds?.swim
  },

  // Movement Types
  {
    key: 'movementTypes',
    label: 'Movement Types',
    type: 'multiSelect',
    icon: Footprints,
    category: FILTER_CATEGORIES.MOVEMENT,
    priority: 32,
    options: ['burrow', 'climb', 'fly', 'swim'],
    getValue: (creature) => {
      const types: string[] = [];
      const parsedSpeeds = creature.speeds?._parsed;
      if (parsedSpeeds?.burrow !== null || creature.speeds?.burrow !== null) types.push('burrow');
      if (parsedSpeeds?.climb !== null || creature.speeds?.climb !== null) types.push('climb');
      if (parsedSpeeds?.fly !== null || creature.speeds?.fly !== null) types.push('fly');
      if (parsedSpeeds?.swim !== null || creature.speeds?.swim !== null) types.push('swim');
      return types;
    }
  },

  // Spell Resistance
  {
    key: 'sr',
    label: 'Spell Resistance',
    type: 'range',
    icon: ShieldCheck,
    category: FILTER_CATEGORIES.DEFENSES,
    min: 5,
    max: 40,
    step: 1,
    priority: 33,
    getValue: (creature) => typeof creature.sr === 'number' ? creature.sr : creature.sr_parsed?.value
  },

  // Special Abilities
  {
    key: 'specialAbilities',
    label: 'Special Abilities',
    type: 'multiSelect',
    icon: Sparkles,
    category: FILTER_CATEGORIES.SPECIAL,
    searchable: true,
    excludeMode: true,
    priority: 34,
    getValue: (creature) => creature.special_abilities?._parsed?.map((a: any) => a.name) || []
  },

  // Defensive Abilities
  {
    key: 'defensiveAbilities',
    label: 'Defensive Abilities',
    type: 'multiSelect',
    icon: ShieldCheck,
    category: FILTER_CATEGORIES.DEFENSES,
    searchable: true,
    excludeMode: true,
    priority: 35,
    getValue: (creature) => creature.defensive_abilities_normalized
  },

  // Languages
  {
    key: 'languages',
    label: 'Languages',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.ENVIRONMENT,
    searchable: true,
    excludeMode: true,
    priority: 36,
    getValue: (creature) => creature.languages_normalized
  },

  // Environment
  {
    key: 'environments',
    label: 'Environment',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.ENVIRONMENT,
    excludeMode: true,
    priority: 37,
    getValue: (creature) => creature.environment
  },

  // Senses
  {
    key: 'senseTypes',
    label: 'Senses',
    type: 'multiSelect',
    icon: Eye,
    category: FILTER_CATEGORIES.ENVIRONMENT,
    excludeMode: true,
    priority: 38,
    getValue: (creature) => creature.senses ? Object.keys(creature.senses) : []
  },

  // Damage Reduction Types
  {
    key: 'drTypes',
    label: 'DR Types',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.DEFENSES,
    excludeMode: true,
    priority: 39,
    getValue: (creature) => {
      const drEntries = creature.dr || [];
      const types: string[] = [];
      drEntries.forEach((dr: any) => {
        if (dr.types) types.push(...dr.types);
      });
      return types;
    }
  },

  // Damage Reduction Amount
  {
    key: 'drAmount',
    label: 'DR Amount',
    type: 'range',
    category: FILTER_CATEGORIES.DEFENSES,
    min: 1,
    max: 30,
    step: 1,
    priority: 40,
    getValue: (creature) => {
      const drEntries = creature.dr || [];
      const amounts = drEntries.map((dr: any) => dr.amount).filter(Boolean);
      return amounts.length > 0 ? Math.max(...amounts) : null;
    }
  },

  // Resistance Types
  {
    key: 'resistanceTypes',
    label: 'Resistance Types',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.DEFENSES,
    excludeMode: true,
    priority: 41,
    getValue: (creature) => creature.resistances ? Object.keys(creature.resistances) : []
  },

  // Resistance Amount
  {
    key: 'resistanceAmount',
    label: 'Resistance Amount',
    type: 'range',
    category: FILTER_CATEGORIES.DEFENSES,
    min: 5,
    max: 30,
    step: 5,
    priority: 42,
    getValue: (creature) => {
      if (!creature.resistances) return null;
      const amounts = Object.values(creature.resistances)
        .map((val: any) => typeof val === 'number' ? val : null)
        .filter(Boolean) as number[];
      return amounts.length > 0 ? Math.max(...amounts) : null;
    }
  },

  // Immunities
  {
    key: 'immunities',
    label: 'Immunities',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.DEFENSES,
    searchable: true,
    excludeMode: true,
    priority: 43,
    getValue: (creature) => creature.immunities_normalized
  },

  // Weaknesses
  {
    key: 'weaknesses',
    label: 'Weaknesses',
    type: 'multiSelect',
    category: FILTER_CATEGORIES.DEFENSES,
    excludeMode: true,
    priority: 44,
    getValue: (creature) => creature.weaknesses_normalized
  },

  // Attack Types (Boolean flags)
  {
    key: 'hasMeleeAttacks',
    label: 'Has Melee Attacks',
    type: 'boolean',
    icon: Swords,
    category: FILTER_CATEGORIES.ATTACKS,
    priority: 45,
    getValue: (creature) => (creature.attacks?.melee?.length ?? 0) > 0
  },
  {
    key: 'hasRangedAttacks',
    label: 'Has Ranged Attacks',
    type: 'boolean',
    icon: Target,
    category: FILTER_CATEGORIES.ATTACKS,
    priority: 46,
    getValue: (creature) => (creature.attacks?.ranged?.length ?? 0) > 0
  },
  {
    key: 'hasSpecialAttacks',
    label: 'Has Special Attacks',
    type: 'boolean',
    category: FILTER_CATEGORIES.ATTACKS,
    priority: 47,
    getValue: (creature) => (creature.attacks?.special?.length ?? 0) > 0
  },

  // Special Flags
  {
    key: 'hasSpellLikeAbilities',
    label: 'Has Spell-Like Abilities',
    type: 'boolean',
    icon: Sparkles,
    category: FILTER_CATEGORIES.SPECIAL,
    priority: 48,
    getValue: (creature) => !!(creature.spell_like_abilities?.entries?.length)
  },
  {
    key: 'hasSpells',
    label: 'Has Spells',
    type: 'boolean',
    category: FILTER_CATEGORIES.SPECIAL,
    priority: 49,
    getValue: (creature) => !!(creature.spells?.entries?.length)
  },
  {
    key: 'hasPsychicMagic',
    label: 'Has Psychic Magic',
    type: 'boolean',
    category: FILTER_CATEGORIES.SPECIAL,
    priority: 50,
    getValue: (creature) => !!(creature.psychic_magic?.entries?.length)
  },
  {
    key: 'hasRegeneration',
    label: 'Has Regeneration',
    type: 'boolean',
    icon: Heart,
    category: FILTER_CATEGORIES.SPECIAL,
    priority: 51,
    getValue: (creature) => !!(creature.hp?.regeneration)
  },
  {
    key: 'hasFastHealing',
    label: 'Has Fast Healing',
    type: 'boolean',
    category: FILTER_CATEGORIES.SPECIAL,
    priority: 52,
    getValue: (creature) => !!(creature.hp?.fast_healing)
  },
  {
    key: 'hasAuras',
    label: 'Has Auras',
    type: 'boolean',
    icon: Activity,
    category: FILTER_CATEGORIES.SPECIAL,
    priority: 53,
    getValue: (creature) => (creature.auras_normalized?.length ?? 0) > 0
  }
];

// Helper functions
export const getFiltersByCategory = (category: string): FilterConfig[] => {
  return FILTER_DEFINITIONS
    .filter(filter => filter.category === category)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

export const getFilterByKey = (key: string): FilterConfig | undefined => {
  return FILTER_DEFINITIONS.find(filter => filter.key === key);
};

export const getAllCategories = (): string[] => {
  return Object.values(FILTER_CATEGORIES);
};

export const getFilterIconMap = (): Record<string, LucideIcon> => {
  const iconMap: Record<string, LucideIcon> = {};
  FILTER_DEFINITIONS.forEach(filter => {
    if (filter.icon) {
      iconMap[filter.key] = filter.icon;
    }
  });
  return iconMap;
};