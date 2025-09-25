const fs = require('fs');

// Read the JSON file
const data = JSON.parse(fs.readFileSync('public/data_clean.json', 'utf8'));
const creatures = Object.values(data);

// Analyze all unique fields and their types
const fieldAnalysis = {};
const uniqueValues = {};

creatures.forEach(creature => {
  Object.keys(creature).forEach(key => {
    if (!fieldAnalysis[key]) {
      fieldAnalysis[key] = {
        count: 0,
        types: new Set(),
        examples: new Set(),
        hasNulls: false,
        isArray: false,
        isObject: false,
        uniqueCount: new Set()
      };
    }

    fieldAnalysis[key].count++;
    const value = creature[key];
    const type = typeof value;

    if (value === null) {
      fieldAnalysis[key].hasNulls = true;
    } else if (Array.isArray(value)) {
      fieldAnalysis[key].isArray = true;
      fieldAnalysis[key].types.add('array');

      // Track array values
      if (!uniqueValues[key]) uniqueValues[key] = new Set();
      value.forEach(v => {
        if (typeof v === 'string') {
          uniqueValues[key].add(v);
        }
      });

      if (fieldAnalysis[key].examples.size < 3) {
        fieldAnalysis[key].examples.add(JSON.stringify(value).substring(0, 100));
      }
    } else if (type === 'object' && value !== null) {
      fieldAnalysis[key].isObject = true;
      fieldAnalysis[key].types.add('object');
      if (fieldAnalysis[key].examples.size < 3) {
        fieldAnalysis[key].examples.add(JSON.stringify(value).substring(0, 100));
      }
    } else {
      fieldAnalysis[key].types.add(type);

      // Track unique values for strings and numbers
      if ((type === 'string' || type === 'number') && value !== null) {
        if (!uniqueValues[key]) uniqueValues[key] = new Set();
        uniqueValues[key].add(value);
        fieldAnalysis[key].uniqueCount.add(value);
      }

      if (fieldAnalysis[key].examples.size < 5) {
        fieldAnalysis[key].examples.add(value);
      }
    }
  });
});

console.log('=== CREATURE DATA ANALYSIS ===\n');
console.log(`Total creatures: ${creatures.length}\n`);

console.log('=== ALL AVAILABLE FIELDS ===\n');
Object.entries(fieldAnalysis).forEach(([field, analysis]) => {
  console.log(`${field}:`);
  console.log(`  Coverage: ${analysis.count}/${creatures.length} (${Math.round(analysis.count/creatures.length*100)}%)`);
  console.log(`  Types: ${Array.from(analysis.types).join(', ')}`);
  console.log(`  Unique values: ${analysis.uniqueCount.size || 'N/A'}`);
  console.log(`  Has nulls: ${analysis.hasNulls}`);
  console.log(`  Examples: ${Array.from(analysis.examples).slice(0, 3).join(', ')}`);
  console.log();
});

console.log('=== INTERESTING FILTERABLE FIELDS ===\n');

// Find fields with good filtering potential
const filterableFields = Object.entries(uniqueValues)
  .filter(([key, values]) => values.size > 1 && values.size < 100)
  .sort((a, b) => a[1].size - b[1].size);

filterableFields.forEach(([field, values]) => {
  console.log(`${field}: ${values.size} unique values`);
  if (values.size <= 20) {
    console.log(`  Values: ${Array.from(values).sort().join(', ')}`);
  } else {
    console.log(`  Sample: ${Array.from(values).slice(0, 10).sort().join(', ')}...`);
  }
  console.log();
});

// Analyze special fields
console.log('=== SPECIAL FIELDS BREAKDOWN ===\n');

// Subtypes
const allSubtypes = new Set();
creatures.forEach(c => {
  if (c.subtypes && Array.isArray(c.subtypes)) {
    c.subtypes.forEach(s => allSubtypes.add(s));
  }
});
console.log(`Subtypes (${allSubtypes.size} unique):`);
console.log(Array.from(allSubtypes).sort().slice(0, 30).join(', '));
console.log();

// Environment
const environments = new Set();
creatures.forEach(c => {
  if (c.environment) environments.add(c.environment);
});
console.log(`Environments (${environments.size} unique):`);
console.log(Array.from(environments).sort().slice(0, 20).join(', '));
console.log();

// Organization
const organizations = new Set();
creatures.forEach(c => {
  if (c.organization) organizations.add(c.organization);
});
console.log(`Organizations (${organizations.size} unique):`);
console.log(Array.from(organizations).sort().slice(0, 20).join(', '));
console.log();

// Speed types
const speedTypes = new Set();
creatures.forEach(c => {
  if (c.speed && typeof c.speed === 'string') {
    // Extract speed types like fly, swim, burrow, climb
    const matches = c.speed.match(/\b(fly|swim|burrow|climb|land)\b/gi);
    if (matches) {
      matches.forEach(m => speedTypes.add(m.toLowerCase()));
    }
  }
});
console.log(`Movement types found in speed field:`);
console.log(Array.from(speedTypes).join(', '));
console.log();

// Check for special abilities
const specialAbilities = new Set();
creatures.forEach(c => {
  if (c.special_abilities && Array.isArray(c.special_abilities)) {
    c.special_abilities.forEach(ability => {
      if (ability.name) specialAbilities.add(ability.name);
    });
  }
});
console.log(`Special abilities (${specialAbilities.size} unique):`);
console.log(Array.from(specialAbilities).slice(0, 20).sort().join(', '));
console.log();

// Analyze numeric ranges
const numericFields = ['cr', 'xp', 'initiative', 'ac', 'bab', 'cmb', 'cmd'];
console.log('=== NUMERIC FIELD RANGES ===\n');
numericFields.forEach(field => {
  const values = creatures
    .map(c => c[field])
    .filter(v => v !== null && v !== undefined && !isNaN(v));

  if (values.length > 0) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    console.log(`${field}: min=${min}, max=${max}, avg=${avg.toFixed(2)}, count=${values.length}`);
  }
});