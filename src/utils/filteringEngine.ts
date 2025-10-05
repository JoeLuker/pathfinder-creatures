import type { CreatureEnriched } from '@/types/creature-complete';
import type { CreatureIndexes } from './indexing';
import type { Filters } from '@/hooks/useCreatures';
import { intersectSets, getRangeFromSortedArray } from './indexing';

// High-performance indexed filtering
export function filterCreaturesWithIndexes(
  indexes: CreatureIndexes,
  filters: Filters
): CreatureEnriched[] {
  const filterSets: Set<CreatureEnriched>[] = [];

  // Type filter
  if (filters.types.length > 0) {
    const typeSet = new Set<CreatureEnriched>();
    filters.types.forEach(type => {
      const creatures = indexes.byType.get(type.toLowerCase());
      if (creatures) {
        creatures.forEach(c => typeSet.add(c));
      }
    });
    if (filters.excludeMode?.types) {
      // Exclude mode: get all EXCEPT these types
      const excludeSet = new Set(indexes.all);
      typeSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(typeSet);
    }
  }

  // Size filter
  if (filters.sizes.length > 0) {
    const sizeSet = new Set<CreatureEnriched>();
    filters.sizes.forEach(size => {
      const creatures = indexes.bySize.get(size.toLowerCase());
      if (creatures) {
        creatures.forEach(c => sizeSet.add(c));
      }
    });
    if (filters.excludeMode?.sizes) {
      const excludeSet = new Set(indexes.all);
      sizeSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(sizeSet);
    }
  }

  // Alignment filter
  if (filters.alignments.length > 0) {
    const alignmentSet = new Set<CreatureEnriched>();
    filters.alignments.forEach(alignment => {
      const creatures = indexes.byAlignment.get(alignment.toLowerCase());
      if (creatures) {
        creatures.forEach(c => alignmentSet.add(c));
      }
    });
    if (filters.excludeMode?.alignments) {
      const excludeSet = new Set(indexes.all);
      alignmentSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(alignmentSet);
    }
  }

  // Subtypes filter
  if (filters.subtypes.length > 0) {
    const subtypeSet = new Set<CreatureEnriched>();
    filters.subtypes.forEach(subtype => {
      const creatures = indexes.bySubtype.get(subtype.toLowerCase());
      if (creatures) {
        creatures.forEach(c => subtypeSet.add(c));
      }
    });
    const mode = filters.filterMode?.subtypes || 'any';
    if (mode === 'all') {
      // ALL mode: creature must have ALL selected subtypes
      const allSubtypesSet = new Set<CreatureEnriched>();
      indexes.all.forEach(creature => {
        const creatureSubtypes = (creature.subtypes_normalized || creature.subtypes || [])
          .map(s => String(s).toLowerCase());
        if (filters.subtypes.every(st => creatureSubtypes.includes(st.toLowerCase()))) {
          allSubtypesSet.add(creature);
        }
      });
      filterSets.push(allSubtypesSet);
    } else if (filters.excludeMode?.subtypes) {
      const excludeSet = new Set(indexes.all);
      subtypeSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(subtypeSet);
    }
  }

  // Environment filter
  if (filters.environments.length > 0) {
    const envSet = new Set<CreatureEnriched>();
    filters.environments.forEach(env => {
      const creatures = indexes.byEnvironment.get(env.toLowerCase());
      if (creatures) {
        creatures.forEach(c => envSet.add(c));
      }
    });
    if (filters.excludeMode?.environments) {
      const excludeSet = new Set(indexes.all);
      envSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(envSet);
    }
  }

  // Languages filter
  if (filters.languages.length > 0) {
    const langSet = new Set<CreatureEnriched>();
    filters.languages.forEach(lang => {
      const creatures = indexes.byLanguage.get(lang.toLowerCase());
      if (creatures) {
        creatures.forEach(c => langSet.add(c));
      }
    });
    const mode = filters.filterMode?.languages || 'any';
    if (mode === 'all') {
      const allLangSet = new Set<CreatureEnriched>();
      indexes.all.forEach(creature => {
        const creatureLangs = (creature.languages_normalized || creature.languages || [])
          .map(l => String(l).toLowerCase());
        if (filters.languages.every(lang => creatureLangs.includes(lang.toLowerCase()))) {
          allLangSet.add(creature);
        }
      });
      filterSets.push(allLangSet);
    } else if (filters.excludeMode?.languages) {
      const excludeSet = new Set(indexes.all);
      langSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(langSet);
    }
  }

  // Special abilities filter
  if (filters.specialAbilities.length > 0) {
    const abilitySet = new Set<CreatureEnriched>();
    filters.specialAbilities.forEach(ability => {
      const creatures = indexes.bySpecialAbility.get(ability.toLowerCase());
      if (creatures) {
        creatures.forEach(c => abilitySet.add(c));
      }
    });
    const mode = filters.filterMode?.specialAbilities || 'any';
    if (mode === 'all') {
      const allAbilitiesSet = new Set<CreatureEnriched>();
      indexes.all.forEach(creature => {
        const creatureAbilities = Object.keys(creature.special_abilities || {})
          .map(a => a.toLowerCase());
        if (filters.specialAbilities.every(ab => creatureAbilities.includes(ab.toLowerCase()))) {
          allAbilitiesSet.add(creature);
        }
      });
      filterSets.push(allAbilitiesSet);
    } else if (filters.excludeMode?.specialAbilities) {
      const excludeSet = new Set(indexes.all);
      abilitySet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(abilitySet);
    }
  }

  // Defensive abilities filter
  if (filters.defensiveAbilities.length > 0) {
    const defSet = new Set<CreatureEnriched>();
    filters.defensiveAbilities.forEach(ability => {
      const creatures = indexes.byDefensiveAbility.get(ability.toLowerCase());
      if (creatures) {
        creatures.forEach(c => defSet.add(c));
      }
    });
    if (filters.excludeMode?.defensiveAbilities) {
      const excludeSet = new Set(indexes.all);
      defSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(defSet);
    }
  }

  // Immunities filter
  if (filters.immunities.length > 0) {
    const immunitySet = new Set<CreatureEnriched>();
    filters.immunities.forEach(immunity => {
      const creatures = indexes.byImmunity.get(immunity.toLowerCase());
      if (creatures) {
        creatures.forEach(c => immunitySet.add(c));
      }
    });
    if (filters.excludeMode?.immunities) {
      const excludeSet = new Set(indexes.all);
      immunitySet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(immunitySet);
    }
  }

  // Weaknesses filter
  if (filters.weaknesses.length > 0) {
    const weaknessSet = new Set<CreatureEnriched>();
    filters.weaknesses.forEach(weakness => {
      const creatures = indexes.byWeakness.get(weakness.toLowerCase());
      if (creatures) {
        creatures.forEach(c => weaknessSet.add(c));
      }
    });
    if (filters.excludeMode?.weaknesses) {
      const excludeSet = new Set(indexes.all);
      weaknessSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(weaknessSet);
    }
  }

  // Sense types filter
  if (filters.senseTypes.length > 0) {
    const senseSet = new Set<CreatureEnriched>();
    filters.senseTypes.forEach(sense => {
      const creatures = indexes.bySenseType.get(sense.toLowerCase());
      if (creatures) {
        creatures.forEach(c => senseSet.add(c));
      }
    });
    if (filters.excludeMode?.senseTypes) {
      const excludeSet = new Set(indexes.all);
      senseSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(senseSet);
    }
  }

  // Movement types filter
  if (filters.movementTypes.length > 0) {
    const moveSet = new Set<CreatureEnriched>();
    filters.movementTypes.forEach(movement => {
      const creatures = indexes.byMovementType.get(movement.toLowerCase());
      if (creatures) {
        creatures.forEach(c => moveSet.add(c));
      }
    });
    if (filters.excludeMode?.movementTypes) {
      const excludeSet = new Set(indexes.all);
      moveSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(moveSet);
    }
  }

  // Sources filter
  if (filters.sources.length > 0) {
    const sourceSet = new Set<CreatureEnriched>();
    filters.sources.forEach(source => {
      const creatures = indexes.bySource.get(source.toLowerCase());
      if (creatures) {
        creatures.forEach(c => sourceSet.add(c));
      }
    });
    if (filters.excludeMode?.sources) {
      const excludeSet = new Set(indexes.all);
      sourceSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(sourceSet);
    }
  }

  // DR types filter
  if (filters.drTypes.length > 0) {
    const drSet = new Set<CreatureEnriched>();
    filters.drTypes.forEach(dr => {
      const creatures = indexes.byDRType.get(dr.toLowerCase());
      if (creatures) {
        creatures.forEach(c => drSet.add(c));
      }
    });
    if (filters.excludeMode?.drTypes) {
      const excludeSet = new Set(indexes.all);
      drSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(drSet);
    }
  }

  // Resistance types filter
  if (filters.resistanceTypes.length > 0) {
    const resSet = new Set<CreatureEnriched>();
    filters.resistanceTypes.forEach(res => {
      const creatures = indexes.byResistanceType.get(res.toLowerCase());
      if (creatures) {
        creatures.forEach(c => resSet.add(c));
      }
    });
    if (filters.excludeMode?.resistanceTypes) {
      const excludeSet = new Set(indexes.all);
      resSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(resSet);
    }
  }

  // Feats filter
  if (filters.feats.length > 0) {
    const featSet = new Set<CreatureEnriched>();
    filters.feats.forEach(feat => {
      const creatures = indexes.byFeat.get(feat.toLowerCase());
      if (creatures) {
        creatures.forEach(c => featSet.add(c));
      }
    });
    const mode = filters.filterMode?.feats || 'any';
    if (mode === 'all') {
      // ALL mode: creature must have ALL selected feats
      const allFeatsSet = new Set<CreatureEnriched>();
      indexes.all.forEach(creature => {
        const creatureFeats = (creature.feats_normalized || creature.feats || [])
          .map(f => String(f).toLowerCase());
        if (filters.feats.every(feat => creatureFeats.includes(feat.toLowerCase()))) {
          allFeatsSet.add(creature);
        }
      });
      filterSets.push(allFeatsSet);
    } else if (filters.excludeMode?.feats) {
      const excludeSet = new Set(indexes.all);
      featSet.forEach(c => excludeSet.delete(c));
      filterSets.push(excludeSet);
    } else {
      filterSets.push(featSet);
    }
  }

  // CR range filter (using binary search)
  if (filters.crMin !== null || filters.crMax !== null) {
    const crSet = getRangeFromSortedArray(
      indexes.byCR,
      item => item.cr,
      filters.crMin,
      filters.crMax
    );
    filterSets.push(crSet);
  }

  // HP range filter
  if (filters.hpMin !== null || filters.hpMax !== null) {
    const hpSet = getRangeFromSortedArray(
      indexes.byHP,
      item => item.hp,
      filters.hpMin,
      filters.hpMax
    );
    filterSets.push(hpSet);
  }

  // AC range filter
  if (filters.acMin !== null || filters.acMax !== null) {
    const acSet = getRangeFromSortedArray(
      indexes.byAC,
      item => item.ac,
      filters.acMin,
      filters.acMax
    );
    filterSets.push(acSet);
  }

  // Initiative range filter
  if (filters.initiativeMin !== null || filters.initiativeMax !== null) {
    const initSet = getRangeFromSortedArray(
      indexes.byInitiative,
      item => item.value,
      filters.initiativeMin,
      filters.initiativeMax
    );
    filterSets.push(initSet);
  }

  // Boolean filters
  if (filters.hasSpells === true) {
    filterSets.push(indexes.withSpells);
  } else if (filters.hasSpells === false) {
    const noSpells = new Set(indexes.all);
    indexes.withSpells.forEach(c => noSpells.delete(c));
    filterSets.push(noSpells);
  }

  if (filters.hasSpellLikeAbilities === true) {
    filterSets.push(indexes.withSpellLikeAbilities);
  } else if (filters.hasSpellLikeAbilities === false) {
    const noSLA = new Set(indexes.all);
    indexes.withSpellLikeAbilities.forEach(c => noSLA.delete(c));
    filterSets.push(noSLA);
  }

  if (filters.hasPsychicMagic === true) {
    filterSets.push(indexes.withPsychicMagic);
  } else if (filters.hasPsychicMagic === false) {
    const noPsychic = new Set(indexes.all);
    indexes.withPsychicMagic.forEach(c => noPsychic.delete(c));
    filterSets.push(noPsychic);
  }

  if (filters.hasRegeneration === true) {
    filterSets.push(indexes.withRegeneration);
  } else if (filters.hasRegeneration === false) {
    const noRegen = new Set(indexes.all);
    indexes.withRegeneration.forEach(c => noRegen.delete(c));
    filterSets.push(noRegen);
  }

  if (filters.hasFastHealing === true) {
    filterSets.push(indexes.withFastHealing);
  } else if (filters.hasFastHealing === false) {
    const noFastHeal = new Set(indexes.all);
    indexes.withFastHealing.forEach(c => noFastHeal.delete(c));
    filterSets.push(noFastHeal);
  }

  if (filters.hasAuras === true) {
    filterSets.push(indexes.withAuras);
  } else if (filters.hasAuras === false) {
    const noAuras = new Set(indexes.all);
    indexes.withAuras.forEach(c => noAuras.delete(c));
    filterSets.push(noAuras);
  }

  if (filters.hasMeleeAttacks === true) {
    filterSets.push(indexes.withMeleeAttacks);
  } else if (filters.hasMeleeAttacks === false) {
    const noMelee = new Set(indexes.all);
    indexes.withMeleeAttacks.forEach(c => noMelee.delete(c));
    filterSets.push(noMelee);
  }

  if (filters.hasRangedAttacks === true) {
    filterSets.push(indexes.withRangedAttacks);
  } else if (filters.hasRangedAttacks === false) {
    const noRanged = new Set(indexes.all);
    indexes.withRangedAttacks.forEach(c => noRanged.delete(c));
    filterSets.push(noRanged);
  }

  if (filters.hasSpecialAttacks === true) {
    filterSets.push(indexes.withSpecialAttacks);
  } else if (filters.hasSpecialAttacks === false) {
    const noSpecial = new Set(indexes.all);
    indexes.withSpecialAttacks.forEach(c => noSpecial.delete(c));
    filterSets.push(noSpecial);
  }

  // Handle remaining range filters that need creature-by-creature checks
  // (These can't be pre-indexed efficiently)
  const additionalFilters: ((c: CreatureEnriched) => boolean)[] = [];

  // Ability score ranges
  if (filters.strMin !== null || filters.strMax !== null) {
    additionalFilters.push(c => {
      const str = c.ability_scores?.STR;
      if (str === undefined || str === null) return false;
      if (filters.strMin !== null && str < filters.strMin) return false;
      if (filters.strMax !== null && str > filters.strMax) return false;
      return true;
    });
  }

  if (filters.dexMin !== null || filters.dexMax !== null) {
    additionalFilters.push(c => {
      const dex = c.ability_scores?.DEX;
      if (dex === undefined || dex === null) return false;
      if (filters.dexMin !== null && dex < filters.dexMin) return false;
      if (filters.dexMax !== null && dex > filters.dexMax) return false;
      return true;
    });
  }

  if (filters.conMin !== null || filters.conMax !== null) {
    additionalFilters.push(c => {
      const con = c.ability_scores?.CON;
      if (con === undefined || con === null) return false;
      if (filters.conMin !== null && con < filters.conMin) return false;
      if (filters.conMax !== null && con > filters.conMax) return false;
      return true;
    });
  }

  if (filters.intMin !== null || filters.intMax !== null) {
    additionalFilters.push(c => {
      const int = c.ability_scores?.INT;
      if (int === undefined || int === null) return false;
      if (filters.intMin !== null && int < filters.intMin) return false;
      if (filters.intMax !== null && int > filters.intMax) return false;
      return true;
    });
  }

  if (filters.wisMin !== null || filters.wisMax !== null) {
    additionalFilters.push(c => {
      const wis = c.ability_scores?.WIS;
      if (wis === undefined || wis === null) return false;
      if (filters.wisMin !== null && wis < filters.wisMin) return false;
      if (filters.wisMax !== null && wis > filters.wisMax) return false;
      return true;
    });
  }

  if (filters.chaMin !== null || filters.chaMax !== null) {
    additionalFilters.push(c => {
      const cha = c.ability_scores?.CHA;
      if (cha === undefined || cha === null) return false;
      if (filters.chaMin !== null && cha < filters.chaMin) return false;
      if (filters.chaMax !== null && cha > filters.chaMax) return false;
      return true;
    });
  }

  // Save ranges
  if (filters.fortMin !== null || filters.fortMax !== null) {
    additionalFilters.push(c => {
      const fort = c.fort;
      if (fort === undefined || fort === null) return false;
      if (filters.fortMin !== null && fort < filters.fortMin) return false;
      if (filters.fortMax !== null && fort > filters.fortMax) return false;
      return true;
    });
  }

  if (filters.refMin !== null || filters.refMax !== null) {
    additionalFilters.push(c => {
      const ref = c.ref;
      if (ref === undefined || ref === null) return false;
      if (filters.refMin !== null && ref < filters.refMin) return false;
      if (filters.refMax !== null && ref > filters.refMax) return false;
      return true;
    });
  }

  if (filters.willMin !== null || filters.willMax !== null) {
    additionalFilters.push(c => {
      const will = c.will;
      if (will === undefined || will === null) return false;
      if (filters.willMin !== null && will < filters.willMin) return false;
      if (filters.willMax !== null && will > filters.willMax) return false;
      return true;
    });
  }

  // Touch AC and flat-footed AC ranges
  if (filters.touchAcMin !== null || filters.touchAcMax !== null) {
    additionalFilters.push(c => {
      const touch = c.touch_ac;
      if (touch === undefined || touch === null) return false;
      if (filters.touchAcMin !== null && touch < filters.touchAcMin) return false;
      if (filters.touchAcMax !== null && touch > filters.touchAcMax) return false;
      return true;
    });
  }

  if (filters.flatFootedAcMin !== null || filters.flatFootedAcMax !== null) {
    additionalFilters.push(c => {
      const flat = c.flat_ac;
      if (flat === undefined || flat === null) return false;
      if (filters.flatFootedAcMin !== null && flat < filters.flatFootedAcMin) return false;
      if (filters.flatFootedAcMax !== null && flat > filters.flatFootedAcMax) return false;
      return true;
    });
  }

  // BAB, CMB, CMD ranges
  if (filters.babMin !== null || filters.babMax !== null) {
    additionalFilters.push(c => {
      const bab = c.bab;
      if (bab === undefined || bab === null) return false;
      if (filters.babMin !== null && bab < filters.babMin) return false;
      if (filters.babMax !== null && bab > filters.babMax) return false;
      return true;
    });
  }

  if (filters.cmbMin !== null || filters.cmbMax !== null) {
    additionalFilters.push(c => {
      const cmb = c.cmb;
      if (cmb === undefined || cmb === null) return false;
      if (filters.cmbMin !== null && cmb < filters.cmbMin) return false;
      if (filters.cmbMax !== null && cmb > filters.cmbMax) return false;
      return true;
    });
  }

  if (filters.cmdMin !== null || filters.cmdMax !== null) {
    additionalFilters.push(c => {
      const cmd = c.cmd;
      if (cmd === undefined || cmd === null) return false;
      if (filters.cmdMin !== null && cmd < filters.cmdMin) return false;
      if (filters.cmdMax !== null && cmd > filters.cmdMax) return false;
      return true;
    });
  }

  // Space and reach ranges
  if (filters.spaceMin !== null || filters.spaceMax !== null) {
    additionalFilters.push(c => {
      const space = c.space;
      if (space === undefined || space === null) return false;
      if (filters.spaceMin !== null && space < filters.spaceMin) return false;
      if (filters.spaceMax !== null && space > filters.spaceMax) return false;
      return true;
    });
  }

  if (filters.reachMin !== null || filters.reachMax !== null) {
    additionalFilters.push(c => {
      const reach = c.reach;
      if (reach === undefined || reach === null) return false;
      if (filters.reachMin !== null && reach < filters.reachMin) return false;
      if (filters.reachMax !== null && reach > filters.reachMax) return false;
      return true;
    });
  }

  // Speed ranges
  if (filters.baseSpeedMin !== null || filters.baseSpeedMax !== null) {
    additionalFilters.push(c => {
      const speed = c.speeds?.base;
      if (speed === undefined || speed === null) return false;
      if (filters.baseSpeedMin !== null && speed < filters.baseSpeedMin) return false;
      if (filters.baseSpeedMax !== null && speed > filters.baseSpeedMax) return false;
      return true;
    });
  }

  // MR and SR ranges
  if (filters.mrMin !== null || filters.mrMax !== null) {
    additionalFilters.push(c => {
      const mr = c.mr;
      if (mr === undefined || mr === null) return false;
      if (filters.mrMin !== null && mr < filters.mrMin) return false;
      if (filters.mrMax !== null && mr > filters.mrMax) return false;
      return true;
    });
  }

  if (filters.srMin !== null || filters.srMax !== null) {
    additionalFilters.push(c => {
      const sr = typeof c.sr === 'number' ? c.sr : null;
      if (sr === null) return false;
      if (filters.srMin !== null && sr < filters.srMin) return false;
      if (filters.srMax !== null && sr > filters.srMax) return false;
      return true;
    });
  }

  // XP range
  if (filters.xpMin !== null || filters.xpMax !== null) {
    additionalFilters.push(c => {
      const xp = c.xp;
      if (xp === undefined || xp === null) return false;
      if (filters.xpMin !== null && xp < filters.xpMin) return false;
      if (filters.xpMax !== null && xp > filters.xpMax) return false;
      return true;
    });
  }

  // If no filters active, return all creatures
  if (filterSets.length === 0 && additionalFilters.length === 0) {
    return indexes.all;
  }

  // Intersect all filter sets to get final result
  let result: Set<CreatureEnriched>;
  if (filterSets.length > 0) {
    result = intersectSets(...filterSets);
  } else {
    result = new Set(indexes.all);
  }

  // Apply additional filters that can't be pre-indexed
  if (additionalFilters.length > 0) {
    const filtered = Array.from(result).filter(creature =>
      additionalFilters.every(filter => filter(creature))
    );
    return filtered;
  }

  return Array.from(result);
}