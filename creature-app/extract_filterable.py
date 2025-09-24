import json
from collections import defaultdict

# Load the JSON file
with open('public/data_clean.json', 'r') as f:
    data = json.load(f)

creatures = list(data.values())

# Extract unique values for key filterable fields
unique_values = defaultdict(set)

for creature in creatures:
    # Simple string fields
    for field in ['type', 'size', 'alignment', 'environment']:
        if field in creature and creature[field]:
            unique_values[field].add(creature[field])

    # Array fields
    if 'subtypes' in creature and creature['subtypes']:
        for subtype in creature['subtypes']:
            if subtype:
                unique_values['subtypes'].add(subtype)

    # Extract movement types from speeds
    if 'speeds' in creature and creature['speeds']:
        for key in creature['speeds'].keys():
            # Clean up movement type
            movement = key.replace('_other', '').replace('_', ' ')
            if movement not in ['base', 'base other', '0 ft. or', '0 ft. or other']:
                unique_values['movement_types'].add(movement)

    # Extract special abilities
    if 'special_abilities' in creature and creature['special_abilities']:
        for ability_key in creature['special_abilities'].keys():
            if ability_key and not ability_key.startswith(('1', '2', '3', '4', '5', '6', '7', '8', '9')):
                # Clean up ability name
                ability = ability_key.split('(')[0].strip()
                if ability:
                    unique_values['special_abilities'].add(ability)

    # Extract defensive abilities
    if 'defensive_abilities' in creature and creature['defensive_abilities']:
        for ability in creature['defensive_abilities']:
            if ability:
                unique_values['defensive_abilities'].add(ability)

# Generate TypeScript/JavaScript compatible output
print("=== FILTERABLE VALUES FOR UI ===\n")

# Types
types = sorted(unique_values['type'])
print(f"CREATURE TYPES ({len(types)}):")
print("export const CREATURE_TYPES = [")
for t in types:
    print(f"  '{t}',")
print("];\n")

# Sizes (in logical order)
size_order = ['Fine', 'Diminutive', 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan', 'Colossal']
print(f"SIZES ({len(size_order)}):")
print("export const CREATURE_SIZES = [")
for s in size_order:
    if s in unique_values['size']:
        print(f"  '{s}',")
print("];\n")

# Alignments
alignments = sorted(unique_values['alignment'])
print(f"ALIGNMENTS ({len(alignments)}):")
print("export const ALIGNMENTS = [")
for a in alignments[:20]:  # Limit to first 20
    print(f"  '{a}',")
print("];\n")

# Subtypes (most common)
subtypes = sorted(unique_values['subtypes'])
print(f"SUBTYPES ({len(subtypes)} total, showing first 30):")
print("export const COMMON_SUBTYPES = [")
for s in subtypes[:30]:
    print(f"  '{s}',")
print("];\n")

# Movement types
movements = sorted(unique_values['movement_types'])
print(f"MOVEMENT TYPES ({len(movements)}):")
print("export const MOVEMENT_TYPES = [")
for m in movements:
    if len(m) < 30:  # Filter out weird long ones
        print(f"  '{m}',")
print("];\n")

# Common special abilities
abilities = sorted(unique_values['special_abilities'])
print(f"SPECIAL ABILITIES ({len(abilities)} total, showing first 30):")
print("[")
for a in abilities[:30]:
    print(f"  '{a}',")
print("];\n")

# Common defensive abilities
def_abilities = sorted(unique_values['defensive_abilities'])
print(f"DEFENSIVE ABILITIES ({len(def_abilities)} total, showing first 20):")
print("[")
for a in def_abilities[:20]:
    print(f"  '{a}',")
print("];\n")

# Environment samples
environments = sorted(unique_values['environment'])
print(f"ENVIRONMENTS ({len(environments)} total)")
# Group by keyword
env_keywords = defaultdict(list)
for env in environments:
    if 'any' in env.lower():
        env_keywords['any'].append(env)
    elif 'underground' in env.lower():
        env_keywords['underground'].append(env)
    elif 'forest' in env.lower():
        env_keywords['forest'].append(env)
    elif 'desert' in env.lower():
        env_keywords['desert'].append(env)
    elif 'water' in env.lower() or 'ocean' in env.lower() or 'aquatic' in env.lower():
        env_keywords['water'].append(env)
    elif 'cold' in env.lower():
        env_keywords['cold'].append(env)
    elif 'mountain' in env.lower():
        env_keywords['mountain'].append(env)
    elif 'plane' in env.lower():
        env_keywords['planes'].append(env)

print("Common environment categories:")
for category, envs in sorted(env_keywords.items()):
    print(f"  {category}: {len(envs)} variants")
    for e in envs[:3]:
        print(f"    - {e}")

print("\n✅ Filterable values extracted!")