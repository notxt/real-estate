import { test, expect } from '@playwright/test';

test.describe('Property Grid Interactive Display', () => {
  test('should render 20x15 property grid with all 300 cells', async ({ page }) => {
    await page.goto('/');
    
    // Grid should be visible and replace placeholder
    const propertyGrid = page.locator('.property-grid');
    await expect(propertyGrid).toBeVisible();
    
    // Should have exactly 300 grid cells (20x15)
    const gridCells = page.locator('.grid-cell');
    await expect(gridCells).toHaveCount(300);
    
    // Grid should use CSS Grid layout
    await expect(propertyGrid).toHaveCSS('display', 'grid');
  });

  test('should display property types with visual distinctions', async ({ page }) => {
    await page.goto('/');
    
    // Check for vacant lot styling
    const vacantLots = page.locator('.grid-cell[data-property-type="vacant_lot"]');
    await expect(vacantLots.first()).toHaveCSS('background-color', 'rgb(245, 245, 245)'); // #f5f5f5
    
    // Check for residential property styling  
    const residential = page.locator('.grid-cell[data-property-type="residential"]');
    if (await residential.count() > 0) {
      await expect(residential.first()).toHaveCSS('background-color', 'rgb(76, 175, 80)'); // #4CAF50
    }
    
    // Check for commercial property styling
    const commercial = page.locator('.grid-cell[data-property-type="commercial"]');
    if (await commercial.count() > 0) {
      await expect(commercial.first()).toHaveCSS('background-color', 'rgb(33, 150, 243)'); // #2196F3
    }
    
    // Check for industrial property styling
    const industrial = page.locator('.grid-cell[data-property-type="industrial"]');
    if (await industrial.count() > 0) {
      await expect(industrial.first()).toHaveCSS('background-color', 'rgb(255, 152, 0)'); // #FF9800
    }
  });

  test('should show property ownership with player-colored borders', async ({ page }) => {
    await page.goto('/');
    
    // Check for owned properties having ownership indicators
    const ownedProperties = page.locator('.grid-cell[data-owner]');
    if (await ownedProperties.count() > 0) {
      const firstOwnedProperty = ownedProperties.first();
      const ownershipIndicator = firstOwnedProperty.locator('.ownership-indicator');
      await expect(ownershipIndicator).toBeVisible();
    }
  });

  test('should handle property selection with visual highlighting', async ({ page }) => {
    await page.goto('/');
    
    // Click on first property
    const firstProperty = page.locator('.grid-cell').first();
    await firstProperty.click();
    
    // Property should be selected with gold border
    await expect(firstProperty).toHaveClass(/selected/);
    await expect(firstProperty).toHaveCSS('border-color', 'rgb(255, 215, 0)'); // #FFD700
    
    // Action panel should update with property details
    const propertyDetails = page.locator('.property-details');
    await expect(propertyDetails).not.toContainText('Select a property to view details');
    
    // Property coordinates should be shown
    const coordinates = await firstProperty.getAttribute('data-x');
    const yCoordinate = await firstProperty.getAttribute('data-y');
    await expect(propertyDetails).toContainText(`Property (${coordinates},${yCoordinate})`);
  });

  test('should show hover tooltips with basic property information', async ({ page }) => {
    await page.goto('/');
    
    // Hover over first property
    const firstProperty = page.locator('.grid-cell').first();
    await firstProperty.hover();
    
    // Tooltip should appear with property info
    const tooltip = page.locator('.property-tooltip');
    await expect(tooltip).toBeVisible();
    
    // Tooltip should contain basic property information
    await expect(tooltip).toContainText('Property');
    await expect(tooltip).toContainText('Value:');
    await expect(tooltip).toContainText('Type:');
  });

  test('should support keyboard navigation with arrow keys', async ({ page }) => {
    await page.goto('/');
    
    // Focus on the property grid
    const propertyGrid = page.locator('.property-grid');
    await propertyGrid.focus();
    
    // Should initially select first property when grid is focused
    await expect(page.locator('.grid-cell.selected')).toHaveCount(1);
    const initialSelected = page.locator('.grid-cell[data-x="0"][data-y="0"]');
    await expect(initialSelected).toHaveClass(/selected/);
    
    // Press arrow key to navigate right
    await page.keyboard.press('ArrowRight');
    
    // Should move selection to next property
    const nextSelected = page.locator('.grid-cell[data-x="1"][data-y="0"]');
    await expect(nextSelected).toHaveClass(/selected/);
    
    // Should be able to confirm selection with Enter/Space
    await page.keyboard.press('Enter');
    await expect(nextSelected).toHaveClass(/selected/);
  });

  test('should update action panel when property is selected', async ({ page }) => {
    await page.goto('/');
    
    // Select a vacant lot property
    const vacantLot = page.locator('.grid-cell[data-property-type="vacant_lot"]').first();
    await vacantLot.click();
    
    // Buy button should be enabled for vacant lots
    const buyBtn = page.locator('#buy-btn');
    await expect(buyBtn).toBeEnabled();
    
    // Develop and sell buttons should be disabled for unowned properties
    const developBtn = page.locator('#develop-btn');
    const sellBtn = page.locator('#sell-btn');
    await expect(developBtn).toBeDisabled();
    await expect(sellBtn).toBeDisabled();
  });

  test('should maintain responsive design and aspect ratio', async ({ page }) => {
    await page.goto('/');
    
    const propertyGrid = page.locator('.property-grid');
    
    // Test on desktop size
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(propertyGrid).toBeVisible();
    
    // Test on tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(propertyGrid).toBeVisible();
    
    // Grid should maintain its structure
    const gridCells = page.locator('.grid-cell');
    await expect(gridCells).toHaveCount(300);
  });

  test('should synchronize grid state with game state', async ({ page }) => {
    await page.goto('/');
    
    // Select a specific property by coordinates
    const property = page.locator('.grid-cell[data-x="0"][data-y="0"]');
    await property.click();
    
    // Wait for selection to be processed
    await expect(property).toHaveClass(/selected/);
    
    // Perform next turn action
    const nextTurnBtn = page.locator('#next-turn-btn');
    await nextTurnBtn.click();
    
    // Wait for turn processing to complete by checking turn number
    await expect(page.locator('#turn-number')).toContainText('2');
    
    // Grid selection should persist through game state changes - re-query after state change
    const selectedProperty = page.locator('.grid-cell[data-x="0"][data-y="0"]');
    await expect(selectedProperty).toHaveClass(/selected/);
    
    // Activity log should show property selection
    const activityLog = page.locator('#activity-log');
    await expect(activityLog).toContainText('Property selected');
  });

  test('should handle property interactions smoothly with 300 cells', async ({ page }) => {
    await page.goto('/');
    
    // Test performance with multiple rapid selections
    const properties = page.locator('.grid-cell');
    
    // Select first property
    await properties.nth(0).click();
    await expect(properties.nth(0)).toHaveClass(/selected/);
    
    // Select property in middle
    await properties.nth(150).click();
    await expect(properties.nth(150)).toHaveClass(/selected/);
    await expect(properties.nth(0)).not.toHaveClass(/selected/);
    
    // Select last property
    await properties.nth(299).click();
    await expect(properties.nth(299)).toHaveClass(/selected/);
    await expect(properties.nth(150)).not.toHaveClass(/selected/);
  });

  test('should display correct grid coordinates for each cell', async ({ page }) => {
    await page.goto('/');
    
    // Check first cell has coordinates (0,0)
    const firstCell = page.locator('.grid-cell').first();
    await expect(firstCell).toHaveAttribute('data-x', '0');
    await expect(firstCell).toHaveAttribute('data-y', '0');
    
    // Check last cell has coordinates (19,14)
    const lastCell = page.locator('.grid-cell').last();
    await expect(lastCell).toHaveAttribute('data-x', '19');
    await expect(lastCell).toHaveAttribute('data-y', '14');
    
    // Check a middle cell has correct coordinates
    const middleCell = page.locator('.grid-cell').nth(150); // Cell at position 150
    const expectedX = 150 % 20; // Column
    const expectedY = Math.floor(150 / 20); // Row
    await expect(middleCell).toHaveAttribute('data-x', expectedX.toString());
    await expect(middleCell).toHaveAttribute('data-y', expectedY.toString());
  });

  test('should show property development levels with visual indicators', async ({ page }) => {
    await page.goto('/');
    
    // Check for development level indicators
    const developedProperties = page.locator('.grid-cell[data-development-level]');
    if (await developedProperties.count() > 0) {
      const firstDeveloped = developedProperties.first();
      const developmentIndicator = firstDeveloped.locator('.property-type-indicator');
      await expect(developmentIndicator).toBeVisible();
    }
  });
});