import json
from genson import SchemaBuilder
from collections import defaultdict
import sys

# Load the JSON file
print("Loading JSON file...")
with open('public/data_clean.json', 'r') as f:
    data = json.load(f)

print(f"Loaded {len(data)} entries")

# Build schema from all entries
print("Building schema from all entries...")
builder = SchemaBuilder()

# Convert dict to array of values
creatures = list(data.values())

# Add each creature to the schema builder
for i, creature in enumerate(creatures):
    builder.add_object(creature)
    if i % 500 == 0:
        print(f"  Processed {i}/{len(creatures)} creatures...")

# Generate the final schema
print("Generating final schema...")
schema = builder.to_schema()

# Save the full schema
with open('creature_schema.json', 'w') as f:
    json.dump(schema, f, indent=2)
print("Schema saved to creature_schema.json")

# Analyze field presence and variations
print("\n=== FIELD ANALYSIS ===\n")
field_counts = defaultdict(int)
field_types = defaultdict(set)
field_examples = defaultdict(list)
array_item_counts = defaultdict(set)
object_keys = defaultdict(set)

for creature in creatures:
    for key, value in creature.items():
        field_counts[key] += 1

        # Track types
        if value is None:
            field_types[key].add('null')
        elif isinstance(value, bool):
            field_types[key].add('boolean')
        elif isinstance(value, int):
            field_types[key].add('integer')
        elif isinstance(value, float):
            field_types[key].add('number')
        elif isinstance(value, str):
            field_types[key].add('string')
        elif isinstance(value, list):
            field_types[key].add('array')
            # Track array lengths
            array_item_counts[key].add(len(value))
            # Sample array items
            if len(field_examples[key]) < 3 and len(value) > 0:
                field_examples[key].append(value[0] if len(value) > 0 else None)
        elif isinstance(value, dict):
            field_types[key].add('object')
            # Track object keys
            object_keys[key].update(value.keys())
            # Sample object
            if len(field_examples[key]) < 3:
                field_examples[key].append(list(value.keys())[:5])

# Report on fields
total = len(creatures)
print(f"Total creatures: {total}\n")

# Sort by coverage percentage
field_info = []
for field in field_counts.keys():
    count = field_counts[field]
    percent = (count / total) * 100
    types = sorted(field_types[field])
    field_info.append((percent, field, count, types))

field_info.sort(reverse=True)

print("FIELD COVERAGE AND TYPES:")
print("-" * 80)
for percent, field, count, types in field_info:
    type_str = ', '.join(types)
    print(f"{field:30s} {percent:6.1f}% ({count:4}/{total})  Types: {type_str}")

    # Show additional info for complex types
    if 'array' in types and field in array_item_counts:
        lengths = sorted(array_item_counts[field])
        if len(lengths) <= 10:
            print(f"{'':30s} Array lengths: {lengths}")
        else:
            print(f"{'':30s} Array lengths: {lengths[:5]}...{lengths[-5:]}")

    if 'object' in types and field in object_keys:
        keys = sorted(object_keys[field])[:10]
        print(f"{'':30s} Object keys: {', '.join(keys)}")

# Extract properties from schema for easier viewing
print("\n=== SCHEMA PROPERTIES ===\n")
if 'properties' in schema:
    for prop_name, prop_schema in sorted(schema['properties'].items()):
        print(f"\n{prop_name}:")
        # Show the type(s)
        if 'type' in prop_schema:
            if isinstance(prop_schema['type'], list):
                print(f"  Types: {', '.join(prop_schema['type'])}")
            else:
                print(f"  Type: {prop_schema['type']}")

        # Show enum values if present (for fields with limited options)
        if 'enum' in prop_schema:
            enum_vals = prop_schema['enum']
            if len(enum_vals) <= 20:
                print(f"  Possible values ({len(enum_vals)}): {', '.join(str(v) for v in enum_vals[:20])}")
            else:
                print(f"  Possible values ({len(enum_vals)}): {', '.join(str(v) for v in enum_vals[:10])}...")

        # For arrays, show item types
        if 'items' in prop_schema:
            if 'type' in prop_schema['items']:
                print(f"  Array item type: {prop_schema['items']['type']}")
            if 'enum' in prop_schema['items']:
                unique_items = prop_schema['items']['enum']
                print(f"  Unique array values ({len(unique_items)}): {', '.join(str(v) for v in unique_items[:10])}...")

print("\n✅ Schema generation complete!")
print("Check creature_schema.json for the full schema")