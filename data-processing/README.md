# Data Processing Scripts

This folder contains scripts for processing and enriching the Pathfinder creature data.

## Files

- **`clean-data.js`** - Main data enrichment script that processes raw creature data
- **`analyze-data.js`** - Data analysis and validation script
- **`extract_filterable.py`** - Python script to extract filterable properties
- **`generate_schema.py`** - Python script to generate TypeScript schema
- **`creature_schema.json`** - JSON schema definition for creature data

## Usage

Run from the root directory:

```bash
# Enrich the creature data
cd data-processing
node clean-data.js

# Analyze the data
node analyze-data.js

# Extract filterable properties (Python)
python extract_filterable.py

# Generate TypeScript schema (Python)
python generate_schema.py
```

## Data Flow

1. Raw creature data → `clean-data.js` → `../public/creatures_enriched.json`
2. Enriched data is consumed by the React application
3. Analysis scripts help validate and understand the data structure