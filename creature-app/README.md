# Pathfinder Creature Browser

A comprehensive, high-performance web application for browsing and filtering Pathfinder creatures with advanced search capabilities.

## Features

- **Advanced Filtering**: Comprehensive filter system covering all creature attributes including CR, ability scores, special abilities, and more
- **Predictive Filter Counts**: Shows how many creatures will remain when selecting filter options
- **Smart Search**: Fuzzy search across creature names, types, abilities, and descriptions
- **Configuration-Driven Architecture**: Centralized filter definitions for maintainability
- **Responsive Design**: Adaptive UI with collapsible panels for desktop and mobile
- **Performance Optimized**: Efficient pagination for large datasets

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Search**: Fuse.js for fuzzy search
- **Architecture**: Configuration-driven filtering system

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

### Configuration-Driven Filtering

The application uses a centralized filter configuration system in `/src/config/filters.ts` that defines:
- Filter types (multiselect, range, boolean)
- Data extraction logic
- UI rendering parameters
- Validation rules

### Key Components

- **useCreatures Hook**: Central data management with filtering, sorting, and pagination
- **Predictive Filtering**: Shows result counts for filter options before selection
- **Smart Search**: Multi-field fuzzy search with weighted results
- **Responsive Layout**: Adaptive UI for desktop and mobile

### Data Processing

Creature data is enriched with parsed numeric fields and normalized arrays for efficient filtering and sorting operations.

## Development

The codebase follows strict TypeScript patterns with:
- Comprehensive type definitions
- Configuration-driven architecture
- Single responsibility principle