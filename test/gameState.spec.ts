import { test, expect } from '@playwright/test';

test.describe('Game State Management', () => {
  test('should initialize game with valid starting state', async ({ page }) => {
    await page.goto('/');
    
    // Check initial player state
    const playerName = page.locator('#player-name');
    await expect(playerName).toHaveText('Property Mogul');
    
    const cashAmount = page.locator('#cash-amount');
    await expect(cashAmount).toHaveText('100,000');
    
    const turnNumber = page.locator('#turn-number');
    await expect(turnNumber).toHaveText('1');
    
    const phaseIndicator = page.locator('#phase-indicator');
    await expect(phaseIndicator).toHaveText('Planning Phase');
    
    // Check market status
    const marketStatus = page.locator('#market-status');
    await expect(marketStatus).toHaveText('Stable');
  });

  test('should handle turn progression correctly', async ({ page }) => {
    await page.goto('/');
    
    const turnNumber = page.locator('#turn-number');
    await expect(turnNumber).toHaveText('1');
    
    const nextTurnBtn = page.locator('#next-turn-btn');
    await nextTurnBtn.click();
    
    await expect(turnNumber).toHaveText('2');
    
    // Verify activity log updates
    const activityLog = page.locator('#activity-log');
    await expect(activityLog).toContainText('Turn 2');
  });

  test('should maintain state consistency during property interactions', async ({ page }) => {
    await page.goto('/');
    
    // Click pass button to test state updates
    const passBtn = page.locator('#pass-btn');
    await expect(passBtn).toBeEnabled();
    await passBtn.click();
    
    // Check that activity log reflects the action
    const activityLog = page.locator('#activity-log');
    await expect(activityLog).toContainText('Turn passed');
  });

  test('should validate game actions against current state', async ({ page }) => {
    await page.goto('/');
    
    // Initially no property selected, so buy/develop/sell should be disabled
    const buyBtn = page.locator('#buy-btn');
    const developBtn = page.locator('#develop-btn');
    const sellBtn = page.locator('#sell-btn');
    
    await expect(buyBtn).toBeDisabled();
    await expect(developBtn).toBeDisabled();
    await expect(sellBtn).toBeDisabled();
    
    // Pass and next turn should always be available
    const passBtn = page.locator('#pass-btn');
    const nextTurnBtn = page.locator('#next-turn-btn');
    
    await expect(passBtn).toBeEnabled();
    await expect(nextTurnBtn).toBeEnabled();
  });

  test('should update activity log with game events', async ({ page }) => {
    await page.goto('/');
    
    const activityLog = page.locator('#activity-log');
    
    // Check initial log entries
    await expect(activityLog).toContainText('Game started');
    await expect(activityLog).toContainText('Turn 1');
    await expect(activityLog).toContainText('Select a property');
    
    // Perform an action and check log updates
    const passBtn = page.locator('#pass-btn');
    await passBtn.click();
    
    await expect(activityLog).toContainText('Turn passed');
  });

  test('should maintain game phase transitions', async ({ page }) => {
    await page.goto('/');
    
    const phaseIndicator = page.locator('#phase-indicator');
    await expect(phaseIndicator).toHaveText('Planning Phase');
    
    // Phase should remain consistent during interactions
    const passBtn = page.locator('#pass-btn');
    await passBtn.click();
    
    // Phase might change based on game logic
    await expect(phaseIndicator).toBeVisible();
  });

  test('should handle window resize events and update state', async ({ page }) => {
    await page.goto('/');
    
    // Resize window
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(100);
    
    const activityLog = page.locator('#activity-log');
    await expect(activityLog).toContainText('Window resized to 800x600');
    
    // Resize again
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(100);
    
    await expect(activityLog).toContainText('Window resized to 1024x768');
  });

  test('should display current market conditions', async ({ page }) => {
    await page.goto('/');
    
    const marketStatus = page.locator('#market-status');
    await expect(marketStatus).toBeVisible();
    await expect(marketStatus).toHaveText('Stable');
  });

  test('should show action status based on current state', async ({ page }) => {
    await page.goto('/');
    
    const actionStatus = page.locator('#action-status');
    await expect(actionStatus).toBeVisible();
    
    // Should indicate no property selected initially
    await expect(actionStatus).toContainText('Choose your next action');
  });
});