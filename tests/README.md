# Playwright Test Suite

## Overview
Comprehensive end-to-end testing for the Pathfinder Creature Database, covering both desktop and mobile layouts with a focus on the recent mobile UX improvements.

## Test Configuration
- **File**: `playwright.config.ts`
- **Browsers**: Chromium (desktop), Pixel 5 (mobile), iPhone 12 (mobile Safari)
- **Base URL**: http://localhost:5173
- **Timeout**: 30s per test, 10s per action

## Test Files

### 1. `desktop-layout.spec.ts`
Tests for desktop three-column layout:
- Three-column layout (filters | creature list | detail)
- Sidebar toggle buttons
- Filter expansion/collapse
- Creature selection
- Sort functionality
- Infinite scroll in creature list
- Theme toggle

### 2. `mobile-layout.spec.ts`
Tests for mobile responsive layout:
- Mobile header with creature count
- Back button behavior
- Active filters display
- Touch target sizes (44px minimum)
- Creature selection
- Search functionality
- Mobile filter dialog
- Footer display

### 3. `mobile-improvements.spec.ts`
Focused tests for the 4 mobile UX improvements implemented:
- **Load More button**: Full-width, shows remaining count
- **Scroll to top**: Appears after 400px scroll, circular design
- **Back button**: Shows "Back" text on mobile
- **Active filters**: Horizontal scroll with "+X more" indicator
- **Touch targets**: Minimum 44px height
- **Creature count**: Visible in header
- **Footer**: OGL compliance visible

## Running Tests

```bash
# All tests (desktop + mobile)
npm test

# Desktop tests only
npm run test:desktop

# Mobile tests only (Chrome + Safari)
npm run test:mobile

# Interactive UI mode
npm run test:ui

# View last test report
npm run test:report
```

## Test Projects

The tests are organized into projects that match specific test files:

- `desktop-chrome`: Runs `desktop-layout.spec.ts`
- `mobile-chrome`: Runs `mobile-*.spec.ts` files
- `mobile-safari`: Runs `mobile-*.spec.ts` files

## Mobile UX Improvements Tested

### 1. Full-Width Load More Button
- Width: `w-full` class
- Height: 48px minimum (`min-h-[48px]`)
- Shows remaining count: "Load More (X remaining)"
- Location: `src/components/CreatureList.tsx:286-293`

### 2. Scroll to Top Button
- Appears after scrolling 400px down
- Circular design (`rounded-full`)
- Fixed position bottom-right
- Only visible on mobile (hidden on desktop with `md:hidden`)
- Location: `src/App.tsx:180-189`

### 3. Enhanced Back Button
- Shows "Back" text on mobile
- Icon-only on desktop
- Visible when viewing creature detail
- Location: `src/components/CreatureDetailMain.tsx:86`

### 4. Active Filters Horizontal Scroll
- Shows max 3 filters on mobile
- Horizontal scroll for remaining filters
- "+X more" indicator badge
- Location: `src/components/ActiveFilters.tsx:95-119`

## Known Issues

### Data Loading
- The 37MB creatures JSON file can take 10-15 seconds to load
- Tests may need increased timeouts for initial page load
- Consider using `waitForLoadState('networkidle')` with longer timeouts

### Viewport Considerations
- Mobile viewport: 375x667 (iPhone SE size)
- Pixel 5: 393x851
- iPhone 12: 390x844
- Desktop Chrome: 1280x720

### Recommendations
1. Add retry logic for flaky network-dependent tests
2. Consider mocking the creatures data for faster test execution
3. Add visual regression testing for UI components
4. Implement accessibility (a11y) tests using axe-core

## CI/CD Integration

The tests are configured for CI environments:
- Retries: 2 attempts in CI, 0 locally
- Workers: 1 in CI, parallel locally
- Reporter: HTML reports generated in `playwright-report/`

## Browser Installation

```bash
# Install required browsers
npx playwright install chromium webkit
```

## Test Development

When adding new tests:
1. Use semantic selectors (getByRole, getByText) over CSS selectors
2. Add appropriate timeouts for slow-loading elements
3. Test on both mobile and desktop viewports
4. Verify touch target sizes (minimum 44px)
5. Include accessibility checks

## Success Criteria

Current test results:
- Desktop tests: Configuration complete, needs data loading fixes
- Mobile layout tests: 8/20 passing (40%)
- Mobile improvements tests: Infrastructure ready, needs timeout tuning

The test infrastructure is in place and working. Fine-tuning needed for:
- Longer timeouts for 37MB data load
- Better selectors for dynamic content
- Retry logic for intermittent failures
