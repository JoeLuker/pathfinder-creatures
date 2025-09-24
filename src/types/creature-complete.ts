import { z } from 'zod';

// Enums for commonly used string fields
export const CreatureTypeEnum = z.enum([
  'aberration',
  'animal',
  'construct',
  'dragon',
  'fey',
  'humanoid',
  'magical beast',
  'monstrous humanoid',
  'ooze',
  'outsider',
  'plant',
  'undead',
  'vermin',
]);

export const SizeEnum = z.enum([
  'Fine',
  'Diminutive',
  'Tiny',
  'Small',
  'Medium',
  'Large',
  'Huge',
  'Gargantuan',
  'Colossal',
]);

export const AlignmentEnum = z.enum([
  'Any alignment',
  'Any alignment (same as creator)',
  'CE',
  'CG',
  'CG or CE',
  'CN',
  'LE',
  'LG',
  'LN',
  'LN or CN',
  'N',
  'N (but see below)',
  'NE',
  'NG',
  'NG or NE',
  'Usually CE',
  'Usually NG',
]);

// Common subtypes (there are 111 total, including most common ones)
export const SubtypeEnum = z.enum([
  'Great Old One',
  'Hive',
  'Triaxian',
  'adlet',
  'aeon',
  'aether',
  'agathion',
  'air',
  'android',
  'angel',
  'aquatic',
  'archon',
  'astomoi',
  'asura',
  'augmented',
  'augmented aberration',
  'augmented animal',
  'augmented fey',
  'augmented human',
  'augmented humanoid',
  'augmented magical beast',
  'augmented monstrous humanoid',
  'augmented vermin',
  'automaton',
  'azata',
  'behemoth',
  'blight',
  'boggard',
  'catfolk',
  'changeling',
  'chaotic',
  'clockwork',
  'cold',
  'colossus',
  'daemon',
  'dark folk',
  'demodand',
  'demon',
  'derro',
  'devil',
  'div',
  'dragon',
  'dwarf',
  'earth',
  'elemental',
  'elf',
  'evil',
  'extraplanar',
  'fire',
  'gathlain',
  'ghoran',
  'giant',
  'gnoll',
  'gnome',
  'goblin',
  'goblinoid',
  'good',
  'great old one',
  'grindylow',
  'half-construct',
  'half-elf',
  'half-orc',
  'halfling',
  'herald',
  'human',
  'ikescales',
  'incorporeal',
  'inevitable',
  'kaiju',
  'kami',
  'kasatha',
  'kineticist',
  'kitsune',
  'kyton',
  'lashunta',
  'lawful',
  'leshy',
  'locathah',
  'lycanthrope',
  'manasaputra',
  'merfolk',
  'monk',
  'mortic',
  'munavri',
  'mythic',
  'nagaji',
  'native',
  'nightshade',
  'nindoru',
  'occultist',
  'oni',
  'orc',
  'oread',
  'protean',
  'psychic',
  'psychopomp',
  'qlippoth',
  'rakshasa',
  'ratfolk',
  'reptilian',
  'robot',
  'rogue',
  'samsaran',
  'sasquatch',
  'shapechanger',
  'skald',
  'skulk',
  'slayer',
  'strix',
  'suli',
  'swarm',
  'sylph',
  'taiga giant',
  'tengu',
  'troop',
  'udaeus',
  'undead',
  'undine',
  'vanara',
  'verminous',
  'vishkanya',
  'wasp',
  'wayang',
  'wild hunt',
  'witch',
]);

// Movement types found in speeds object
export const MovementTypeEnum = z.enum([
  'base',
  'burrow',
  'climb',
  'fly',
  'swim',
  'jet',
  'water stride',
  'water walk',
  'toboggan',
  'ice burrowing',
]);

// Source schema
export const SourceSchema = z.object({
  name: z.string(),
  page: z.number(),
  link: z.string().optional(),
});

// HD (Hit Dice) schemas
export const RacialHDSchema = z.object({
  die: z.number(),
  num: z.number(),
});

export const ClassHDSchema = z.object({
  name: z.string(),
  die: z.number(),
  num: z.number(),
});

export const HDSchema = z.object({
  racial: RacialHDSchema.optional(),
  class: z.array(ClassHDSchema).optional(),
  num: z.number(),
});

// Health Points schema
export const HealthPointsSchema = z.object({
  total: z.number(),
  long: z.string(),
  HD: HDSchema.optional(),
  bonus_HP: z.number().optional(),
  fast_healing: z.number().optional(),
  fast_healing_weakness: z.string().optional(),
  regeneration: z.number().optional(),
  regeneration_weakness: z.string().optional(),
  other: z.string().optional(),
  plus: z.string().optional(),
});

// Armor Class schema
export const ArmorClassComponentsSchema = z.object({
  dex: z.number().optional(),
  natural: z.number().optional(),
  size: z.number().optional(),
  armor: z.number().optional(),
  shield: z.number().optional(),
  deflection: z.number().optional(),
  dodge: z.number().optional(),
  insight: z.number().optional(),
  luck: z.number().optional(),
  monk: z.number().optional(),
  profane: z.number().optional(),
  sacred: z.number().optional(),
  wis: z.number().optional(),
});

export const ArmorClassSchema = z.object({
  AC: z.number(),
  touch: z.number(),
  flat_footed: z.number(),
  components: ArmorClassComponentsSchema.optional(),
  other: z.string().optional(),
});

// Saving Throws schema
export const SavingThrowsSchema = z.object({
  fort: z.number(),
  ref: z.number(),
  will: z.number(),
  fort_other: z.string().optional(),
  ref_other: z.string().optional(),
  will_other: z.string().optional(),
  other: z.string().optional(),
});

// Ability Scores schema
export const AbilityScoresSchema = z.object({
  STR: z.number().nullable().optional(),
  DEX: z.number().nullable().optional(),
  CON: z.number().nullable().optional(),
  INT: z.number().nullable().optional(),
  WIS: z.number().nullable().optional(),
  CHA: z.number().nullable().optional(),
});

// Skills schema (flexible object with skill names as keys)
export const SkillsSchema = z.record(z.string(), z.union([
  z.number(),
  z.string(),
  z.object({
    value: z.number(),
    modifiers: z.string().optional(),
  })
]));

// Feats schemas
export const FeatSchema = z.object({
  name: z.string(),
  link: z.string().optional(),
  type: z.string().optional(),
  notation: z.string().optional(),
});

// Race/Class information
export const RaceClassSchema = z.object({
  raw: z.string(),
  race: z.string().optional(),
  class: z.array(z.object({
    name: z.string(),
    level: z.number(),
  })).optional(),
  prefix: z.array(z.string()).optional(),
  sources: z.array(SourceSchema).optional(),
});

// Speeds schema
export const SpeedsSchema = z.object({
  base: z.number().optional(),
  base_other: z.string().optional(),
  burrow: z.number().optional(),
  burrow_other: z.string().optional(),
  climb: z.number().optional(),
  climb_other: z.string().optional(),
  fly: z.number().optional(),
  fly_other: z.string().optional(),
  fly_maneuverability: z.string().optional(),
  swim: z.number().optional(),
  swim_other: z.string().optional(),
  jet: z.number().optional(),
  other: z.string().optional(),
}).passthrough(); // Allow additional movement types

// Attacks schema
export const AttacksSchema = z.object({
  melee: z.array(z.string()).optional(),
  ranged: z.array(z.string()).optional(),
  special: z.array(z.string()).optional(),
  _raw: z.string().optional(),
});

// Spell-like abilities and spells
export const SpellEntrySchema = z.object({
  name: z.string(),
  DC: z.number().optional(),
  level: z.number().optional(),
  concentration: z.number().optional(),
  notes: z.string().optional(),
});

export const SpellGroupSchema = z.object({
  level: z.number().optional(),
  name: z.string().optional(),
  frequency: z.string().optional(),
  spells: z.array(z.union([z.string(), SpellEntrySchema])),
});

export const SpellLikeAbilitiesSchema = z.object({
  entries: z.array(SpellGroupSchema).optional(),
  sources: z.array(SourceSchema).optional(),
  varies: z.boolean().optional(),
  symbols_special: z.boolean().optional(),
});

export const SpellsSchema = z.object({
  entries: z.array(z.any()).optional(), // Complex nested structure
  sources: z.array(SourceSchema).optional(),
});

// Senses schema
export const SensesSchema = z.record(z.string(), z.union([
  z.boolean(),
  z.number(),
  z.string(),
]));

// Resistances schema
export const ResistancesSchema = z.record(z.string(), z.union([
  z.number(),
  z.string(),
]));

// Damage Reduction schema
export const DREntrySchema = z.object({
  amount: z.number(),
  types: z.array(z.string()),
  and: z.boolean().optional(),
  notes: z.string().optional(),
});

// Tactics schema
export const TacticsSchema = z.object({
  'Before Combat': z.string().optional(),
  'During Combat': z.string().optional(),
  'Morale': z.string().optional(),
  'Base Statistics': z.string().optional(),
  'Base Statistic': z.string().optional(),
}).passthrough();

// Gear schema
export const GearSchema = z.object({
  combat: z.array(z.string()).optional(),
  other: z.array(z.string()).optional(),
  gear: z.array(z.string()).optional(),
});

// Ecology schema
export const EcologySchema = z.object({
  environment: z.string().optional(),
  organization: z.string().optional(),
  treasure: z.string().optional(),
  treasure_type: z.string().optional(),
  "advancement_3.5": z.string().optional(),
});

// Psychic Magic schema
export const PsychicMagicEntrySchema = z.object({
  name: z.string(),
  PE: z.number(),
  DC: z.number().optional(),
});

export const PsychicMagicSchema = z.object({
  PE: z.number().optional(),
  entries: z.array(PsychicMagicEntrySchema).optional(),
  sources: z.array(SourceSchema).optional(),
});

// Kineticist Wild Talents schema
export const KineticistWildTalentsSchema = z.object({
  Defense: z.array(z.string()).optional(),
  Infusions: z.array(z.string()).optional(),
  'Kinetic Blasts': z.array(z.string()).optional(),
  'Kinetic blasts': z.array(z.string()).optional(),
  Utility: z.array(z.string()).optional(),
});

// Special Abilities schema (very flexible)
export const SpecialAbilitiesSchema = z.record(z.string(), z.union([
  z.string(),
  z.object({
    description: z.string(),
    type: z.string().optional(),
    DC: z.number().optional(),
  }),
]));

// Parsed field schemas
export const ParsedNumericFieldSchema = z.object({
  value: z.number().nullable(),
  notes: z.string().nullable(),
  original: z.union([z.string(), z.number()]),
});

export const ParsedInitiativeSchema = z.object({
  value: z.number().nullable(),
  alternatives: z.array(z.number()).optional(),
  original: z.union([z.number(), z.array(z.number())]),
});

export const ParsedSpeedsSchema = z.object({
  base: z.number().nullable(),
  burrow: z.number().nullable(),
  climb: z.number().nullable(),
  fly: z.number().nullable(),
  swim: z.number().nullable(),
  flyManeuverability: z.string().optional(),
  special: z.array(z.object({
    type: z.string(),
    value: z.union([z.number(), z.string()]).nullable(),
    condition: z.string().optional(),
  })).optional(),
});

export const ParsedSpecialAbilitySchema = z.object({
  name: z.string(),
  type: z.string().nullable(),
  description: z.string(),
  originalKey: z.string(),
});

export const ParsedDRSchema = z.object({
  amount: z.number().optional(),
  types: z.array(z.string()).optional(),
  operator: z.enum(['or', 'and']).nullable().optional(),
  original: z.string(),
  unparseable: z.boolean().optional(),
});

export const MetadataSchema = z.object({
  hasNumericCR: z.boolean(),
  hasValidInitiative: z.boolean(),
  hasSpecialAbilities: z.boolean(),
  hasParsedSpeeds: z.boolean(),
  processedAt: z.string(),
});

// Main Creature Schema
export const CreatureCompleteSchema = z.object({
  // Core identification
  url: z.string(),
  name: z.string(),

  // Challenge and experience
  cr: z.number().nullable(),
  mr: z.number().nullable().optional(),
  xp: z.number().nullable(),

  // Type and subtypes
  type: CreatureTypeEnum,
  subtypes: z.array(z.string()).default([]),

  // Physical characteristics
  size: SizeEnum,
  alignment: AlignmentEnum,

  // Race/Class information
  race_class: RaceClassSchema.nullable().optional(),

  // Sources
  sources: z.array(SourceSchema),

  // Combat stats
  initiative: z.union([z.number(), z.array(z.number())]),
  hp: HealthPointsSchema,
  ac_data: ArmorClassSchema,
  ac: z.number(),
  touch_ac: z.number(),
  flat_ac: z.number(),

  // Saves
  saves_data: SavingThrowsSchema,
  fort: z.number(),
  ref: z.number(),
  will: z.number(),

  // Combat values
  bab: z.number(),
  cmb: z.number().nullable(),
  cmd: z.number().nullable(),
  cmb_other: z.string().nullable().optional(),
  cmd_other: z.string().nullable().optional(),

  // Reach and space
  reach: z.number().nullable(),
  reach_other: z.string().nullable().optional(),
  space: z.number().nullable(),

  // Abilities
  ability_scores: AbilityScoresSchema,

  // Skills
  skills: SkillsSchema,

  // Feats
  feats: z.array(z.string()).default([]),
  feats_raw: z.array(FeatSchema).default([]),

  // Movement
  speeds: SpeedsSchema,

  // Senses
  senses: SensesSchema,

  // Languages
  languages: z.array(z.string()).default([]),

  // Combat abilities
  attacks: AttacksSchema,

  // Special abilities
  special_abilities: SpecialAbilitiesSchema.optional(),
  special_qualities: z.array(z.string()).default([]),
  spell_like_abilities: SpellLikeAbilitiesSchema.optional(),
  spells: SpellsSchema.optional(),
  psychic_magic: PsychicMagicSchema.nullable().optional(),
  kineticist_wild_talents: KineticistWildTalentsSchema.nullable().optional(),

  // Defenses
  defensive_abilities: z.array(z.string()).default([]),
  dr: z.array(DREntrySchema).nullable().optional(),
  immunities: z.array(z.string()).nullable().optional(),
  resistances: ResistancesSchema.nullable().optional(),
  sr: z.union([z.number(), z.string()]).nullable().optional(),
  weaknesses: z.array(z.string()).nullable().optional(),
  auras: z.array(z.string()).nullable().optional(),

  // Ecology and environment
  environment: z.string(),
  ecology: EcologySchema.optional(),

  // Description
  desc_short: z.string(),
  desc_long: z.string(),

  // Tactics
  tactics: TacticsSchema.nullable().optional(),

  // Gear
  gear: GearSchema.nullable().optional(),

  // NPC specific
  npc_boon: z.string().nullable().optional(),

  // Legacy 3.5 fields
  is_3_5: z.boolean().nullable().optional(),
  grapple_3_5: z.union([z.number(), z.string()]).nullable().optional(),

  // Special markers
  asterisk: z.record(z.string(), z.string()).nullable().optional(),
  second_statblock: z.boolean().nullable().optional(),
});

// Enriched Creature Schema (includes all parsed fields)
export const CreatureEnrichedSchema = CreatureCompleteSchema.extend({
  // Parsed numeric fields
  cr_parsed: ParsedNumericFieldSchema.optional(),
  mr_parsed: ParsedNumericFieldSchema.optional(),
  xp_parsed: ParsedNumericFieldSchema.optional(),
  ac_parsed: ParsedNumericFieldSchema.optional(),
  touch_ac_parsed: ParsedNumericFieldSchema.optional(),
  flat_ac_parsed: ParsedNumericFieldSchema.optional(),
  fort_parsed: ParsedNumericFieldSchema.optional(),
  ref_parsed: ParsedNumericFieldSchema.optional(),
  will_parsed: ParsedNumericFieldSchema.optional(),
  bab_parsed: ParsedNumericFieldSchema.optional(),
  cmb_parsed: ParsedNumericFieldSchema.optional(),
  cmd_parsed: ParsedNumericFieldSchema.optional(),
  reach_parsed: ParsedNumericFieldSchema.optional(),
  space_parsed: ParsedNumericFieldSchema.optional(),
  sr_parsed: ParsedNumericFieldSchema.optional(),
  grapple_3_5_parsed: ParsedNumericFieldSchema.optional(),
  initiative_parsed: ParsedInitiativeSchema.optional(),

  // Clean string versions
  name_clean: z.string().optional(),
  type_clean: z.string().optional(),
  size_clean: z.string().optional(),
  alignment_clean: z.string().optional(),
  environment_clean: z.string().optional(),

  // Normalized arrays
  subtypes_normalized: z.array(z.string()),
  languages_normalized: z.array(z.string()),
  defensive_abilities_normalized: z.array(z.string()),
  special_qualities_normalized: z.array(z.string()),
  immunities_normalized: z.array(z.string()),
  weaknesses_normalized: z.array(z.string()),
  auras_normalized: z.array(z.string()),

  // Metadata
  _metadata: MetadataSchema.optional(),
});

// Override speeds and special_abilities in enriched schema
export const CreatureEnrichedWithParsedSchema = CreatureEnrichedSchema.extend({
  speeds: SpeedsSchema.extend({
    _parsed: ParsedSpeedsSchema.optional(),
  }).optional(),
  special_abilities: SpecialAbilitiesSchema.extend({
    _parsed: z.array(ParsedSpecialAbilitySchema).optional(),
  }).optional(),
  dr: z.union([
    z.array(DREntrySchema).nullable(),
    z.array(z.any()).extend({
      _parsed: z.array(ParsedDRSchema).optional(),
    }).nullable(),
  ]).optional(),
});

// Type exports
export type CreatureComplete = z.infer<typeof CreatureCompleteSchema>;
export type CreatureEnriched = z.infer<typeof CreatureEnrichedWithParsedSchema>;
export type CreatureType = z.infer<typeof CreatureTypeEnum>;
export type Size = z.infer<typeof SizeEnum>;
export type Alignment = z.infer<typeof AlignmentEnum>;
export type Subtype = z.infer<typeof SubtypeEnum>;

// Partial schema for filtering/searching (all fields optional)
export const CreatureFilterSchema = CreatureEnrichedSchema.partial();
export type CreatureFilter = z.infer<typeof CreatureFilterSchema>;