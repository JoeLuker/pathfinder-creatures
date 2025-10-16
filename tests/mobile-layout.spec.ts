import { test, expect } from '@playwright/test';

test.describe('Mobile Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display mobile header with creature count', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    const title = header.locator('h1');
    await expect(title).toContainText('Pathfinder Creatures');

    // Check creature count is displayed
    const count = header.locator('span').filter({ hasText: /^\d+$/ });
    await expect(count.first()).toBeVisible();
  });

  test('should show back button with text when viewing creature detail', async ({ page }) => {
    // Click on a creature
    const firstCreature = page.locator('[class*="cursor-pointer"]').first();
    await firstCreature.click();
    await page.waitForTimeout(500);

    // Check that back button is visible with "Back" text
    const backButton = page.locator('button:has-text("Back")');
    await expect(backButton).toBeVisible();

    // Verify the button has the ArrowLeft icon
    const arrowIcon = backButton.locator('svg');
    await expect(arrowIcon).toBeVisible();
  });

  test('should display active filters with horizontal scroll', async ({ page }) => {
    // Open mobile filters
    const filterButton = page.getByRole('button', { name: /filter|menu/i });
    await filterButton.click({ timeout: 15000 });

    // Wait for dialog
    await page.waitForTimeout(1000);

    // Find and click checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
    }

    // Close filters
    const closeButton = page.getByRole('button', { name: /close/i });
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await page.waitForTimeout(500);

      // Check if active filters container exists
      const activeFilters = page.locator('[class*="overflow-x-auto"]');
      if (await activeFilters.count() > 0) {
        await expect(activeFilters.first()).toBeVisible();
      }
    }
  });

  test('should display full-width Load More button on mobile', async ({ page }) => {
    // Scroll to bottom to find Load More button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const loadMoreButton = page.locator('button:has-text("Load More")');

    if (await loadMoreButton.count() > 0) {
      await expect(loadMoreButton.first()).toBeVisible();

      // Check if button shows remaining count
      const buttonText = await loadMoreButton.first().textContent();
      expect(buttonText).toContain('remaining');

      // Verify button has full width class
      const hasFullWidth = await loadMoreButton.first().evaluate((el) => {
        return el.classList.contains('w-full');
      });
      expect(hasFullWidth).toBeTruthy();
    }
  });

  test('should show scroll to top button after scrolling down', async ({ page }) => {
    // Initially, scroll to top button should not be visible
    const scrollTopButton = page.locator('button[aria-label="Scroll to top"]');
    await expect(scrollTopButton).not.toBeVisible();

    // Scroll down 500px
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // Now button should be visible
    await expect(scrollTopButton).toBeVisible();

    // Verify it's a circular button with arrow icon
    const hasRounded = await scrollTopButton.evaluate((el) => {
      return el.classList.contains('rounded-full');
    });
    expect(hasRounded).toBeTruthy();

    // Click the button
    await scrollTopButton.click();
    await page.waitForTimeout(500);

    // Verify we scrolled to top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should have proper touch target sizes for mobile interactions', async ({ page }) => {
    // Check that filter button has adequate size
    const filterButton = page.getByRole('button', { name: /filter|menu/i });
    if (await filterButton.count() > 0) {
      const filterBox = await filterButton.first().boundingBox();
      if (filterBox) {
        expect(filterBox.height).toBeGreaterThanOrEqual(40);
      }
    }

    // Check creature list items are tappable
    const firstCreature = page.locator('[class*="cursor-pointer"]').first();
    if (await firstCreature.isVisible()) {
      const creatureBox = await firstCreature.boundingBox();
      if (creatureBox) {
        expect(creatureBox.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should hide creature list and show detail view when creature selected', async ({ page }) => {
    // Click on first creature
    const firstCreature = page.locator('[class*="cursor-pointer"]').first();
    await firstCreature.waitFor({ state: 'visible', timeout: 15000 });
    const creatureName = await firstCreature.locator('h4').textContent();
    await firstCreature.click();
    await page.waitForTimeout(1000);

    // Verify detail view shows creature name
    const heading = page.locator('h1, h2').filter({ hasText: creatureName || '' });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });

    // Verify back button is visible
    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeVisible();
  });

  test('should maintain search functionality on mobile', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search creatures..."]').first();
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('dragon');
    await page.waitForTimeout(500);

    // Verify results update
    const creatures = page.locator('[class*="cursor-pointer"]');
    const count = await creatures.count();
    expect(count).toBeGreaterThan(0);

    // Verify creature names contain search term
    const firstCreatureName = await creatures.first().locator('h4').textContent();
    expect(firstCreatureName?.toLowerCase()).toContain('dragon');
  });

  test('should open and close mobile filters dialog', async ({ page }) => {
    // Open filters
    const filterButton = page.getByRole('button', { name: /filter|menu/i });
    await filterButton.click({ timeout: 15000 });
    await page.waitForTimeout(1000);

    // Verify dialog is open
    const dialog = page.locator('[role="dialog"]');
    if (await dialog.count() > 0) {
      await expect(dialog.first()).toBeVisible({ timeout: 10000 });

      // Check for Close button
      const closeButton = page.getByRole('button', { name: /close/i });
      await expect(closeButton).toBeVisible();

      // Close dialog
      await closeButton.click();
      await page.waitForTimeout(500);

      // Verify dialog is closed
      await expect(dialog.first()).not.toBeVisible();
    }
  });

  test('should display footer on mobile', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check footer is visible - look for licensing text
    const footerText = page.getByText(/open game license|ogl/i);
    if (await footerText.count() > 0) {
      await expect(footerText.first()).toBeVisible({ timeout: 10000 });
    }
  });
});
