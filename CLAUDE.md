# Pathfinder Creature Database

## Deployment Instructions

This application is production-ready and can be deployed to various hosting platforms.

### Build Requirements
- Node.js 18+
- npm or yarn
- TypeScript compilation
- Vite build system

### Build Commands
```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Build Output
- **App Bundle**: 483KB JS, 33KB CSS (optimized)
- **Data**: 37MB JSON (compresses to ~6MB with gzip)
- **Total Deploy Size**: ~37MB (optimized with .vercelignore)
- **Build Time**: ~1.8s
- **Output Directory**: `dist/`

### Deployment Options

#### 1. Netlify
- Configuration: `netlify.toml` is included
- Simply connect your Git repository
- Build command: `npm run build`
- Publish directory: `dist`

#### 2. Vercel
- Configuration: `vercel.json` is included
- Connect repository and deploy
- Zero-config deployment supported

#### 3. Static Hosting
- Build the project: `npm run build`
- Upload `dist/` contents to any static host
- Ensure SPA routing is configured (redirect /* to /index.html)

### Features
- 3,654+ Pathfinder creatures with complete data validation
- Advanced filtering with O(1) indexing performance
- Responsive design (mobile/desktop)
- Theme support (light/dark)
- Full-text search and complex filtering
- Alternate form support for transformation creatures
- Complete stat block display
- TypeScript type safety throughout

### Performance
- Fast initial load with optimized bundles
- Efficient filtering engine
- Virtualized creature lists for large datasets
- Minimal runtime dependencies