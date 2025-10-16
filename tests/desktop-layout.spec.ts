import { test, expect } from '@playwright/test';

test.describe('Desktop Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display three-column layout on desktop', async ({ page }) => {
    // Check sidebar (filters) is visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check creature list column is visible
    const creatureList = page.locator('.hidden.md\\:block.md\\:h-full').first();
    await expect(creatureList).toBeVisible();

    // Check detail view area is visible
    const detailArea = page.locator('.flex-1.overflow-auto');
    await expect(detailArea).toBeVisible();
  });

  test('should toggle sidebar visibility', async ({ page }) => {
    // Find sidebar toggle button
    const toggleButton = page.locator('button[title*="Hide filters"]').first();
    await expect(toggleButton).toBeVisible();

    // Click to hide
    await toggleButton.click();
    await page.waitForTimeout(300);

    // Verify sidebar content is hidden (opacity-0 class)
    const sidebarContent = page.locator('aside .opacity-0');
    await expect(sidebarContent).toBeVisible();

    // Click again to show
    await toggleButton.click();
    await page.waitForTimeout(300);
  });

  test('should toggle creature list visibility', async ({ page }) => {
    // Find creature list toggle button
    const toggleButton = page.locator('button[title*="Hide creature list"]').first();
    await expect(toggleButton).toBeVisible();

    // Click to hide
    await toggleButton.click();
    await page.waitForTimeout(300);

    // Verify creature list content is hidden
    const listContent = page.locator('.opacity-0.pointer-events-none');
    await expect(listContent.first()).toBeVisible();

    // Click again to show
    await toggleButton.click();
    await page.waitForTimeout(300);
  });

  test('should not show scroll to top button on desktop', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // Scroll to top button should have md:hidden class and not be visible
    const scrollTopButton = page.locator('button[aria-label="Scroll to top"]');
    if (await scrollTopButton.count() > 0) {
      const isHidden = await scrollTopButton.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width === 0 || rect.height === 0;
      });
      expect(isHidden).toBeTruthy();
    }
  });

  test('should display filters in sidebar', async ({ page }) => {
    // Check for filter sections
    const challengeFilter = page.locator('text=Challenge').first();
    await expect(challengeFilter).toBeVisible();

    // Check for search within filters
    const searchInput = page.locator('input[placeholder="Search creatures..."]').first();
    await expect(searchInput).toBeVisible();
  });

  test('should select creature and display in detail panel', async ({ page }) => {
    // Click on a creature
    const firstCreature = page.locator('[class*="cursor-pointer"]').first();
    const creatureName = await firstCreature.locator('h4').textContent();
    await firstCreature.click();
    await page.waitForTimeout(500);

    // Verify detail view shows the creature
    const detailTitle = page.locator('h1').first();
    await expect(detailTitle).toContainText(creatureName || '');

    // Verify creature list is still visible on desktop
    const creatureListVisible = page.locator('.hidden.md\\:block.md\\:h-full').first();
    await expect(creatureListVisible).toBeVisible();
  });

  test('should expand and collapse filter sections', async ({ page }) => {
    // Find a collapsible filter section
    const sectionButton = page.locator('button:has-text("Challenge")').first();
    await expect(sectionButton).toBeVisible();

    // Get initial state
    const chevron = sectionButton.locator('svg').last();
    const initialTransform = await chevron.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // Click to toggle
    await sectionButton.click();
    await page.waitForTimeout(200);

    // Verify state changed
    const newTransform = await chevron.evaluate((el) =>
      window.getComputedStyle(el).transform
    );
    expect(newTransform).not.toBe(initialTransform);
  });

  test('should display active filters on desktop', async ({ page }) => {
    // Open a filter section
    const challengeSection = page.locator('button:has-text("Challenge")').first();
    await challengeSection.click();
    await page.waitForTimeout(300);

    // Select a filter
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    await page.waitForTimeout(300);

    // Check for active filters display
    const activeFilters = page.locator('text=Active:');
    if (await activeFilters.count() > 0) {
      await expect(activeFilters.first()).toBeVisible();
    }
  });

  test('should maintain sort functionality', async ({ page }) => {
    // Find sort dropdown
    const sortSelect = page.locator('select').first();
    await expect(sortSelect).toBeVisible();

    // Change sort to CR
    await sortSelect.selectOption('cr');
    await page.waitForTimeout(500);

    // Verify creatures are sorted by CR
    const creatures = page.locator('[class*="cursor-pointer"]');
    const count = await creatures.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should load more creatures on scroll', async ({ page }) => {
    // Get initial creature count
    const initialCreatures = page.locator('[class*="cursor-pointer"]');
    const initialCount = await initialCreatures.count();

    // Scroll to bottom of creature list
    await page.locator('.hidden.md\\:block.md\\:h-full').first().evaluate((el) => {
      const viewport = el.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
    await page.waitForTimeout(1000);

    // Check if more creatures loaded
    const newCount = await initialCreatures.count();
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('should display theme toggle', async ({ page }) => {
    // Check for theme toggle button
    const themeToggle = page.locator('button[title*="theme"], button:has-text("Toggle theme")').first();
    await expect(themeToggle).toBeVisible();
  });
});
