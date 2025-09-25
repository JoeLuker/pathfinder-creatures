import fs from 'fs';

console.log('Loading raw data...'); // noqa
const rawData = JSON.parse(fs.readFileSync('../public/data_clean.json', 'utf8')); // noqa
const creatures = Object.values(rawData);
console.log(`Loaded ${creatures.length} creatures`); // noqa

// Helper function to extract number from string like "21 (in water only)"
function extractNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/^(-?\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[0]) : null;
  }
  return null;
}

// Helper to extract notes from strings like "21 (in water only)"
function extractNotes(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
}

// Clean string values (trim but preserve original)
function cleanString(str) {
  if (!str || typeof str !== 'string') return str;
  return str.trim();
}

// Parse speeds object to add normalized versions
function parseAndAddSpeeds(speeds) {
  if (!speeds) return speeds;

  const parsed = {
    ...speeds, // Keep all original data
    _parsed: {
      base: null,
      burrow: null,
      climb: null,
      fly: null,
      swim: null,
      special: []
    }
  };

  for (const [key, value] of Object.entries(speeds)) {
    const numValue = extractNumber(value);

    if (key === 'base' || key === '0 ft. or') {
      parsed._parsed.base = numValue;
    } else if (key.startsWith('burrow')) {
      parsed._parsed.burrow = numValue || parsed._parsed.burrow;
      if (key.includes('(') && key !== 'burrow') {
        parsed._parsed.special.push({ type: 'burrow', condition: key, value: numValue });
      }
    } else if (key.startsWith('climb')) {
      parsed._parsed.climb = numValue || parsed._parsed.climb;
    } else if (key.startsWith('fly') && key !== 'fly_maneuverability') {
      parsed._parsed.fly = numValue || parsed._parsed.fly;
    } else if (key === 'fly_maneuverability') {
      parsed._parsed.flyManeuverability = value;
    } else if (key.startsWith('swim')) {
      parsed._parsed.swim = numValue || parsed._parsed.swim;
    } else if (!key.includes('_other') && key !== 'other') {
      // Store special movement types
      parsed._parsed.special.push({ type: key, value: numValue || value });
    }
  }

  if (parsed._parsed.special.length === 0) delete parsed._parsed.special;

  return parsed;
}

// Parse special abilities to add structured version
function parseAndAddSpecialAbilities(abilities) {
  if (!abilities) return abilities;

  const parsed = {
    ...abilities, // Keep all original data
    _parsed: []
  };

  for (const [key, value] of Object.entries(abilities)) {
    if (key === '_parsed') continue; // Skip if already processed

    // Parse ability name and type
    let cleanName = key;
    let abilityType = null;

    // Extract (Ex), (Su), (Sp), etc.
    const typeMatch = key.match(/\(([A-Z][a-z])\)$/);
    if (typeMatch) {
      abilityType = typeMatch[1];
      cleanName = key.replace(/\s*\([^)]+\)\s*$/, '').trim();
    }

    // Skip numeric prefixes like "1-2: Ability Name"
    const numericPrefix = cleanName.match(/^\d+[-–]\d+:\s*(.+)$/);
    if (numericPrefix) {
      cleanName = numericPrefix[1];
    }

    if (cleanName && cleanName !== '') {
      parsed._parsed.push({
        name: cleanName,
        type: abilityType,
        description: typeof value === 'string' ? value : JSON.stringify(value),
        originalKey: key
      });
    }
  }

  if (parsed._parsed.length === 0) delete parsed._parsed;

  return parsed;
}

// Parse damage reduction while keeping original
function parseAndAddDR(dr) {
  if (!dr || !Array.isArray(dr)) return dr;

  const result = [...dr]; // Keep original array
  const parsed = dr.map(entry => {
    if (typeof entry === 'string') {
      // Parse string like "10/magic" or "5/cold iron or good"
      const match = entry.match(/^(\d+)\/(.+)$/);
      if (match) {
        const amount = parseInt(match[1]);
        const types = match[2];

        // Handle "or" and "and" in types
        if (types.includes(' or ')) {
          return { amount, types: types.split(' or '), operator: 'or', original: entry };
        } else if (types.includes(' and ')) {
          return { amount, types: types.split(' and '), operator: 'and', original: entry };
        } else {
          return { amount, types: [types], operator: null, original: entry };
        }
      }
      return { original: entry, unparseable: true };
    }
    return entry;
  });

  result._parsed = parsed;
  return result;
}

// Convert CR decimal values to fractional display
function formatCRDisplay(crValue) {
  if (crValue === null || crValue === undefined || typeof crValue !== 'number') {
    return null;
  }

  // Handle whole numbers
  if (crValue >= 1 || crValue === 0) {
    return crValue.toString();
  }

  // Common fractional CRs in Pathfinder/D&D
  const fractions = {
    0.125: '1/8',
    0.16666666666666666: '1/6',
    0.25: '1/4',
    0.3333333333333333: '1/3',
    0.5: '1/2',
    0.6666666666666666: '2/3',
    0.75: '3/4'
  };

  // Check for exact matches (with some tolerance for floating point precision)
  for (const [decimal, fraction] of Object.entries(fractions)) {
    if (Math.abs(crValue - decimal) < 0.0001) {
      return fraction;
    }
  }

  // If no exact match, return the decimal with reasonable precision
  return crValue.toFixed(3).replace(/\.?0+$/, '');
}

// Parse numeric values from fields that might be strings
function addParsedNumericFields(creature) {
  const numericFields = [
    'cr', 'mr', 'xp', 'ac', 'touch_ac', 'flat_ac',
    'fort', 'ref', 'will', 'bab', 'cmb', 'cmd',
    'reach', 'space', 'sr', 'grapple_3_5'
  ];

  const parsed = {};

  for (const field of numericFields) {
    if (creature[field] !== undefined && creature[field] !== null) {
      const num = extractNumber(creature[field]);
      const notes = extractNotes(creature[field]);

      if (num !== null || notes !== null) {
        const parsedField = {
          value: num,
          notes: notes,
          original: creature[field]
        };

        // Add display formatting for CR field
        if (field === 'cr' && num !== null) {
          parsedField.display = formatCRDisplay(num);
        }

        parsed[`${field}_parsed`] = parsedField;
      }
    }
  }

  return parsed;
}

// Parse initiative (can be array or number)
function parseInitiative(initiative) {
  if (initiative === null || initiative === undefined) return null;

  if (Array.isArray(initiative)) {
    return {
      value: initiative[0],
      alternatives: initiative.slice(1),
      original: initiative
    };
  }

  return {
    value: extractNumber(initiative),
    original: initiative
  };
}

// Fix malformed feats that contain skills data
function fixMalformedFeats(creature) {
  if (!Array.isArray(creature.feats)) return creature;

  const cleaned = { ...creature };
  const properFeats = [];
  const extractedSkills = {};


  for (const feat of creature.feats) {
    if (typeof feat !== 'string') {
      properFeats.push(feat);
      continue;
    }


    // Check if feat contains "Skills" keyword indicating malformed data (CHECK THIS FIRST!)
    if (feat.includes(' Skills ') || feat.startsWith('+')) {
      // This is malformed data, try to extract skills
      const skillsMatch = feat.match(/(.+?)\s+Skills\s+(.+)/);

      if (skillsMatch) {
        const featPart = skillsMatch[1].trim();
        const skillsPart = skillsMatch[2];

        // Add the feat part if it's valid
        if (featPart && !featPart.includes('+')) {
          properFeats.push(featPart);
        }

        // Parse the skills part
        const skillMatch2 = skillsPart.match(/^(.+?)\s*\+(\d+)$/);
        if (skillMatch2) {
          const skillName = skillMatch2[1].trim();
          const skillValue = parseInt(skillMatch2[2]);
          extractedSkills[skillName] = skillValue;
        }
      } else if (feat.startsWith('+')) {
        // Handle "+4 Perform" style entries
        const modMatch = feat.match(/^\+(\d+)\s+(.+)$/);
        if (modMatch) {
          if (!extractedSkills._racial_mods) extractedSkills._racial_mods = {};
          extractedSkills._racial_mods[modMatch[2].trim()] = parseInt(modMatch[1]);
        }
      }
      continue;
    }

    // Check for racial modifiers pattern
    if (feat.includes('Racial Modifiers')) {
      const racialMatch = feat.match(/^(.+?);\s*Racial Modifiers\s+(.+)$/);
      if (racialMatch) {
        const skillName = racialMatch[1].trim();
        const skillMatch2 = skillName.match(/^(.+?)\s*\+(\d+)$/);
        if (skillMatch2) {
          extractedSkills[skillMatch2[1].trim()] = parseInt(skillMatch2[2]);
        }
        // Parse racial modifiers
        const racialMods = racialMatch[2];
        const modMatches = racialMods.matchAll(/\+(\d+)\s+([^,+]+)/g);
        if (!extractedSkills._racial_mods) extractedSkills._racial_mods = {};
        for (const match of modMatches) {
          extractedSkills._racial_mods[match[2].trim()] = parseInt(match[1]);
        }
      }
      continue;
    }

    // Check if this looks like a simple skill (contains +number)
    const skillMatch = feat.match(/^(.+?)\s*\+(\d+)$/);
    if (skillMatch) {
      const skillName = skillMatch[1].trim();
      const skillValue = parseInt(skillMatch[2]);
      extractedSkills[skillName] = skillValue;
      continue;
    }

    // This appears to be a proper feat
    properFeats.push(feat);
  }

  // Update feats array
  cleaned.feats = properFeats;

  // Update feats_raw if it exists
  if (cleaned.feats_raw) {
    cleaned.feats_raw = properFeats.map(feat => ({ name: feat }));
  }

  // Clean up existing skills to remove malformed entries
  if (cleaned.skills) {
    const cleanedSkills = {};
    for (const [skillName, skillValue] of Object.entries(cleaned.skills)) {
      // Skip malformed skill names that contain feat names
      if (!skillName.includes('Weapon Focus') && !skillName.includes('Skills ')) {
        cleanedSkills[skillName] = skillValue;
      }
    }
    cleaned.skills = cleanedSkills;
  }

  // Merge extracted skills into existing skills object, avoiding duplicates
  if (Object.keys(extractedSkills).length > 0) {
    cleaned.skills = { ...cleaned.skills };
    for (const [skillName, skillValue] of Object.entries(extractedSkills)) {
      // Only add if not already present or if it's the _racial_mods object
      if (!cleaned.skills.hasOwnProperty(skillName) || skillName === '_racial_mods') {
        cleaned.skills[skillName] = skillValue;
      }
    }
  }

  return cleaned;
}

// Main enrichment function - adds parsed fields without removing anything
function enrichCreature(creature) {
  // Start with all original data
  let enriched = { ...creature };

  // Fix malformed feats first
  enriched = fixMalformedFeats(enriched);

  // Add parsed numeric fields
  const parsedNumeric = addParsedNumericFields(creature);
  Object.assign(enriched, parsedNumeric);

  // Add parsed initiative
  if (creature.initiative !== undefined) {
    enriched.initiative_parsed = parseInitiative(creature.initiative);
  }

  // Add cleaned string versions (preserve originals)
  if (creature.name) enriched.name_clean = cleanString(creature.name);
  if (creature.type) enriched.type_clean = cleanString(creature.type);
  if (creature.size) enriched.size_clean = cleanString(creature.size);
  if (creature.alignment) enriched.alignment_clean = cleanString(creature.alignment);
  if (creature.environment) enriched.environment_clean = cleanString(creature.environment);

  // Add parsed complex objects
  if (creature.speeds) {
    enriched.speeds = parseAndAddSpeeds(creature.speeds);
  }

  if (creature.special_abilities) {
    enriched.special_abilities = parseAndAddSpecialAbilities(creature.special_abilities);
  }

  if (creature.dr) {
    enriched.dr = parseAndAddDR(creature.dr);
  }

  // Add normalized arrays (ensure they're arrays)
  enriched.subtypes_normalized = Array.isArray(creature.subtypes) ? creature.subtypes : [];
  enriched.languages_normalized = Array.isArray(creature.languages) ? creature.languages : [];
  enriched.defensive_abilities_normalized = Array.isArray(creature.defensive_abilities) ? creature.defensive_abilities : [];
  enriched.special_qualities_normalized = Array.isArray(creature.special_qualities) ? creature.special_qualities : [];
  enriched.immunities_normalized = Array.isArray(creature.immunities) ? creature.immunities : [];
  enriched.weaknesses_normalized = Array.isArray(creature.weaknesses) ? creature.weaknesses : [];
  enriched.auras_normalized = Array.isArray(creature.auras) ? creature.auras : [];

  // Add metadata about data quality
  enriched._metadata = {
    hasNumericCR: typeof extractNumber(creature.cr) === 'number',
    hasValidInitiative: creature.initiative !== undefined && creature.initiative !== null,
    hasSpecialAbilities: creature.special_abilities && Object.keys(creature.special_abilities).length > 0,
    hasParsedSpeeds: enriched.speeds?._parsed !== undefined,
    processedAt: new Date().toISOString()
  };

  return enriched;
}

// Process all creatures
console.log('Enriching creature data...'); // noqa
const enrichedCreatures = {}; // noqa
let processedCount = 0;

for (const [key, creature] of Object.entries(rawData)) {
  enrichedCreatures[key] = enrichCreature(creature);
  processedCount++;

  if (processedCount % 500 === 0) {
    console.log(`  Processed ${processedCount}/${creatures.length} creatures...`); // noqa
  }
}

// Save enriched data
const outputPath = '../public/creatures_enriched.json'; // noqa
console.log(`Saving enriched data to ${outputPath}...`); // noqa
fs.writeFileSync(outputPath, JSON.stringify(enrichedCreatures, null, 2));

// Generate summary
console.log('\n=== ENRICHMENT SUMMARY ==='); // noqa
console.log(`Total creatures processed: ${processedCount}`); // noqa

// Check a sample
const sampleKey = Object.keys(enrichedCreatures)[0];
const original = rawData[sampleKey];
const enriched = enrichedCreatures[sampleKey];

console.log('\n=== SAMPLE COMPARISON ==='); // noqa
console.log('Original fields:', Object.keys(original).length); // noqa
console.log('Enriched fields:', Object.keys(enriched).length); // noqa
console.log('New fields added:', Object.keys(enriched).length - Object.keys(original).length); // noqa

console.log('\nSample enriched fields:'); // noqa
if (enriched.cr_parsed) console.log('  cr_parsed:', enriched.cr_parsed); // noqa
if (enriched.initiative_parsed) console.log('  initiative_parsed:', enriched.initiative_parsed); // noqa
if (enriched.speeds?._parsed) console.log('  speeds._parsed:', enriched.speeds._parsed); // noqa

// Verify no data loss
let dataLossDetected = false;
for (const [key, originalCreature] of Object.entries(rawData)) {
  const enrichedCreature = enrichedCreatures[key];
  for (const field of Object.keys(originalCreature)) {
    if (!(field in enrichedCreature)) {
      console.error(`DATA LOSS: Field '${field}' missing in creature '${originalCreature.name}'`); // noqa
      dataLossDetected = true;
    }
  }
}

if (!dataLossDetected) {
  console.log('\n✅ No data loss detected - all original fields preserved!'); // noqa
} else {
  console.error('\n❌ WARNING: Data loss detected!'); // noqa
}

console.log('\n✅ Data enrichment complete!'); // noqa
console.log(`Enriched data saved to ${outputPath}`); // noqa
console.log('Original file size:', (fs.statSync('../public/data_clean.json').size / 1024 / 1024).toFixed(2), 'MB'); // noqa
console.log('Enriched file size:', (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2), 'MB'); // noqa