import { test, expect } from '@playwright/test';

test.describe('Real Estate Empire Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle('Real Estate Empire');
    
    // Check header bar structure
    const headerBar = page.locator('.header-bar');
    await expect(headerBar).toBeVisible();
    
    // Check player info is displayed
    const playerName = page.locator('#player-name');
    await expect(playerName).toBeVisible();
    await expect(playerName).toHaveText('Property Mogul');
    
    // Check cash display
    const cashDisplay = page.locator('#cash-amount');
    await expect(cashDisplay).toBeVisible();
    await expect(cashDisplay).toHaveText('100,000');
    
    // Check turn counter
    const turnNumber = page.locator('#turn-number');
    await expect(turnNumber).toBeVisible();
    await expect(turnNumber).toHaveText('1');
  });

  test('should display game UI layout from main.js', async ({ page }) => {
    await page.goto('/');
    
    // Check main game layout is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check central area with property grid placeholder
    const centralArea = page.locator('.central-area');
    await expect(centralArea).toBeVisible();
    
    const gridPlaceholder = page.locator('.grid-placeholder');
    await expect(gridPlaceholder).toBeVisible();
    await expect(gridPlaceholder).toContainText('Property Grid Coming Soon');
    
    // Check action panel
    const actionPanel = page.locator('.action-panel');
    await expect(actionPanel).toBeVisible();
    
    // Check property details section
    const propertyDetails = page.locator('.property-details');
    await expect(propertyDetails).toBeVisible();
    await expect(propertyDetails).toContainText('Select a property to view details');
  });

  test('should have interactive action buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check that action buttons are present
    const buyBtn = page.locator('#buy-btn');
    const developBtn = page.locator('#develop-btn');
    const sellBtn = page.locator('#sell-btn');
    const passBtn = page.locator('#pass-btn');
    const nextTurnBtn = page.locator('#next-turn-btn');
    
    await expect(buyBtn).toBeVisible();
    await expect(developBtn).toBeVisible();
    await expect(sellBtn).toBeVisible();
    await expect(passBtn).toBeVisible();
    await expect(nextTurnBtn).toBeVisible();
    
    // Check that some buttons are disabled initially (no property selected)
    await expect(buyBtn).toBeDisabled();
    await expect(developBtn).toBeDisabled();
    await expect(sellBtn).toBeDisabled();
    await expect(passBtn).toBeEnabled();
    await expect(nextTurnBtn).toBeEnabled();
  });

  test('should update turn counter when next turn is clicked', async ({ page }) => {
    await page.goto('/');
    
    const turnNumber = page.locator('#turn-number');
    await expect(turnNumber).toHaveText('1');
    
    const nextTurnBtn = page.locator('#next-turn-btn');
    await nextTurnBtn.click();
    
    await expect(turnNumber).toHaveText('2');
  });

  test('should have proper viewport responsiveness', async ({ page }) => {
    await page.goto('/');
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    const actionPanel = page.locator('.action-panel');
    await expect(actionPanel).toBeVisible();
  });

  test('should respond to window resize events', async ({ page }) => {
    await page.goto('/');
    
    // Test initial layout
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Resize to small screen and check layout changes
    await page.setViewportSize({ width: 800, height: 500 });
    
    // Give a moment for resize handler to execute
    await page.waitForTimeout(100);
    
    // Check that activity log shows resize event
    const activityLog = page.locator('#activity-log');
    await expect(activityLog).toContainText('Window resized to 800x500');
    
    // Resize back to larger screen
    await page.setViewportSize({ width: 1200, height: 700 });
    await page.waitForTimeout(100);
    
    // Check that another resize event was logged
    await expect(activityLog).toContainText('Window resized to 1200x700');
  });

  test('should load the main.js script', async ({ page }) => {
    await page.goto('/');
    
    const scriptTag = page.locator('script[src="js/main.js"]');
    await expect(scriptTag).toHaveAttribute('type', 'module');
    
    // Verify the UI was actually initialized by checking if elements are present
    const headerBar = page.locator('.header-bar');
    await expect(headerBar).toBeVisible();
  });
});