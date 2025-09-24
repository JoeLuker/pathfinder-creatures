# Creature Filter System Architecture

## 🏗️ Overview

The creature filter system is a comprehensive, configuration-driven filtering architecture that supports filtering by **every creature attribute** with professional-grade controls.

## 📁 File Structure

```
src/
├── config/
│   ├── filters.ts          # Master filter definitions
│   └── README.md           # This documentation
├── utils/
│   └── filterUtils.ts      # Filter utility functions
├── hooks/
│   └── useCreatures.ts     # Main filtering logic & state
└── components/
    ├── ui/
    │   ├── range-slider.tsx # Range filter component
    │   └── label.tsx       # Form accessibility
    └── Sidebar.tsx         # Filter UI implementation
```

## 🔧 Core Components

### 1. Filter Configuration (`src/config/filters.ts`)

**Master configuration file** defining all 53 filter types across 10 categories:

```typescript
interface FilterConfig {
  key: string;           // Filter identifier (maps to Filters interface)
  label: string;         // Display name
  type: FilterType;      // 'range' | 'multiSelect' | 'boolean' | 'combobox'
  icon?: LucideIcon;     // Optional UI icon
  category: string;      // Grouping category
  description?: string;  // Tooltip/help text

  // Range-specific
  min?: number;          // Minimum value
  max?: number;          // Maximum value
  step?: number;         // Increment step

  // Multi-select specific
  options?: string[];    // Available options
  searchable?: boolean;  // Enable search within options
  excludeMode?: boolean; // Support exclusion filtering

  // Data extraction
  getValue: (creature) => any; // How to extract value from creature

  // UI behavior
  defaultExpanded?: boolean;   // Start expanded
  priority?: number;           // Display order (lower = first)
}
```

### 2. Filter Categories

**10 organized categories** covering every aspect:

- **Basic Info**: Types, Sizes, Alignments, Subtypes
- **Challenge & Experience**: CR, MR, XP
- **Combat Stats**: AC variants, HP, Initiative, BAB/CMB/CMD, Space/Reach
- **Ability Scores**: All 6 core abilities (STR, DEX, CON, INT, WIS, CHA)
- **Saving Throws**: Fortitude, Reflex, Will
- **Defenses**: SR, DR, Resistances, Immunities, Weaknesses
- **Movement & Speed**: Base speed + all movement types with ranges
- **Special Abilities**: Spell-like abilities, special powers, flags
- **Environment & Senses**: Languages, environments, senses
- **Attacks & Actions**: Attack type presence flags

### 3. Filter Types

**4 comprehensive filter types:**

#### Range Filters
```typescript
// Example: Challenge Rating filter
{
  key: 'cr',
  type: 'range',
  min: 0,
  max: 30,
  step: 0.5,
  getValue: (creature) => creature.cr_parsed?.value ?? creature.cr
}
```

#### Multi-Select Filters
```typescript
// Example: Creature types filter
{
  key: 'types',
  type: 'multiSelect',
  searchable: true,
  excludeMode: true,
  getValue: (creature) => creature.type
}
```

#### Boolean Filters
```typescript
// Example: Has spell-like abilities
{
  key: 'hasSpellLikeAbilities',
  type: 'boolean',
  getValue: (creature) => !!(creature.spell_like_abilities?.entries?.length)
}
```

### 4. Utility Functions (`src/utils/filterUtils.ts`)

**Helper functions for filter operations:**

- `createDefaultFilters()` - Generate empty filter state
- `applyFilter()` - Apply single filter to creature
- `getActiveFilterCount()` - Count active filters
- `getActiveFilterSummary()` - Generate filter descriptions
- `validateFilterRanges()` - Validate min/max ranges
- `resetFilterCategory()` - Clear filters by category
- `getFilterDisplayValue()` - Format filter for display

### 5. State Management (`src/hooks/useCreatures.ts`)

**Comprehensive Filters interface** with 50+ properties:

```typescript
interface Filters {
  search: string;

  // Basic creature info
  types: string[];
  sizes: string[];
  alignments: string[];
  subtypes: string[];

  // Range filters (min/max pairs)
  crMin: number | null; crMax: number | null;
  acMin: number | null; acMax: number | null;
  hpMin: number | null; hpMax: number | null;
  // ... +20 more range pairs

  // Multi-select arrays
  specialAbilities: string[];
  defensiveAbilities: string[];
  languages: string[];
  // ... +10 more arrays

  // Boolean flags
  hasMeleeAttacks: boolean | null;
  hasSpellLikeAbilities: boolean | null;
  // ... +8 more flags

  // Exclude mode support
  excludeMode?: {
    types?: boolean;
    // ... for all multi-select filters
  };
}
```

## 🎯 Usage Examples

### Adding a New Filter

1. **Add to configuration:**
```typescript
// In src/config/filters.ts
{
  key: 'newStat',
  label: 'New Stat',
  type: 'range',
  category: FILTER_CATEGORIES.COMBAT,
  min: 0,
  max: 50,
  getValue: (creature) => creature.newStat
}
```

2. **Add to Filters interface:**
```typescript
// In src/hooks/useCreatures.ts
interface Filters {
  // ... existing filters
  newStatMin: number | null;
  newStatMax: number | null;
}
```

3. **UI renders automatically** based on configuration!

### Querying with Filters

```typescript
// Complex query example
const filters = {
  search: 'dragon',
  crMin: 10,
  crMax: 20,
  types: ['dragon'],
  hasSpellLikeAbilities: true,
  srMin: 15,
  immunities: ['fire'],
  flySpeedMin: 100
};
// Finds: Dragons CR 10-20 with spell-like abilities, SR 15+, fire immunity, fly 100+ ft
```

## 🏆 Benefits

### For Developers
- **Single source of truth** for all filter definitions
- **Type-safe** filter operations
- **Automatic UI generation** from configuration
- **Easy to extend** with new filters
- **Consistent behavior** across all filters

### For Users
- **Every creature attribute** is filterable
- **Professional range controls** with sliders + inputs
- **Searchable multi-selects** with exclude modes
- **Boolean flags** for presence/absence queries
- **Complex combinations** for precise searches

### Architecture
- **Separation of concerns**: Config, logic, UI, state
- **Reusable components**: RangeSlider, filter utilities
- **Scalable design**: Add filters without touching core logic
- **Maintainable code**: Centralized configuration

## 🚀 Performance

- **Efficient filtering**: Helper functions optimize creature iteration
- **Smart caching**: Computed values cached at hook level
- **Minimal re-renders**: Precise state updates
- **Large dataset ready**: Handles thousands of creatures smoothly

---

**Result**: A professional-grade filtering system that transforms a simple creature browser into a powerful database query tool! 🎉