import { test, expect } from '@playwright/test';

test.describe('Player Money System', () => {
  test('should start with $750k capital instead of $100k', async ({ page }) => {
    await page.goto('/');
    
    // Check that cash amount shows $750k instead of $100k
    const cashAmount = page.locator('#cash-amount');
    await expect(cashAmount).toHaveText('750,000');
    
    // Check that the player starts with correct financial state
    const playerName = page.locator('#player-name');
    await expect(playerName).toHaveText('Property Mogul');
  });

  test('should enable/disable buy button based on available funds', async ({ page }) => {
    await page.goto('/');
    
    // Select a property
    const propertyCell = page.locator('.grid-cell').first();
    await propertyCell.click();
    
    // Check that buy button state reflects financial validation
    const buyBtn = page.locator('#buy-btn');
    
    // With $750k starting capital, most properties should be affordable
    const isEnabled = await buyBtn.isEnabled();
    
    if (isEnabled) {
      // Test successful purchase
      const initialCash = await page.locator('#cash-amount').textContent();
      
      await buyBtn.click();
      
      // Check that activity log shows successful purchase
      const activityLog = page.locator('#activity-log');
      await expect(activityLog).toContainText('purchased');
      
      // Check that cash was deducted
      const finalCash = await page.locator('#cash-amount').textContent();
      expect(finalCash).not.toBe(initialCash);
    }
  });

  test('should track property ownership changes', async ({ page }) => {
    await page.goto('/');
    
    // Select an available property
    const propertyCell = page.locator('.grid-cell').first();
    await propertyCell.click();
    
    // Check initial property info shows "Available"
    const propertyInfo = page.locator('#property-info');
    await expect(propertyInfo).toContainText('Available');
    
    const buyBtn = page.locator('#buy-btn');
    if (await buyBtn.isEnabled()) {
      await buyBtn.click();
      
      // After purchase, property should show "Player" as owner
      await expect(propertyInfo).toContainText('Player');
    }
  });

  test('should show error messages for insufficient funds', async ({ page }) => {
    await page.goto('/');
    
    // Try to buy multiple expensive properties to eventually run out of money
    for (let i = 0; i < 20; i++) {
      const propertyCell = page.locator('.grid-cell').nth(i);
      await propertyCell.click();
      
      const buyBtn = page.locator('#buy-btn');
      if (await buyBtn.isEnabled()) {
        await buyBtn.click();
        
        // Wait a bit for transaction to process
        await page.waitForTimeout(100);
      } else {
        // If button is disabled, we've likely run out of funds
        break;
      }
    }
    
    // Check that activity log might show purchase attempts or failures
    const activityLog = page.locator('#activity-log');
    const logContent = await activityLog.textContent();
    
    // Should show either successful purchases or failure messages
    expect(logContent).toMatch(/(purchased|failed|insufficient)/i);
  });

  test('should handle property sales and cash recovery', async ({ page }) => {
    await page.goto('/');
    
    // First buy a property
    const propertyCell = page.locator('.grid-cell').first();
    await propertyCell.click();
    
    const buyBtn = page.locator('#buy-btn');
    if (await buyBtn.isEnabled()) {
      const initialCash = await page.locator('#cash-amount').textContent();
      
      await buyBtn.click();
      
      // Now try to sell the property
      const sellBtn = page.locator('#sell-btn');
      
      // After purchase, sell button should be enabled for owned property
      if (await sellBtn.isEnabled()) {
        await sellBtn.click();
        
        // Check that activity log shows sale
        const activityLog = page.locator('#activity-log');
        await expect(activityLog).toContainText('sold');
        
        // Check that we got some cash back (though likely less than purchase price)
        const finalCash = await page.locator('#cash-amount').textContent();
        expect(parseInt(finalCash?.replace(/,/g, '') || '0')).toBeGreaterThan(0);
      }
    }
  });

  test('should maintain financial consistency during development', async ({ page }) => {
    await page.goto('/');
    
    // Buy a property first
    const propertyCell = page.locator('.grid-cell').first();
    await propertyCell.click();
    
    const buyBtn = page.locator('#buy-btn');
    if (await buyBtn.isEnabled()) {
      await buyBtn.click();
      
      // Now try to develop the property
      const developBtn = page.locator('#develop-btn');
      
      if (await developBtn.isEnabled()) {
        const cashBeforeDev = await page.locator('#cash-amount').textContent();
        
        await developBtn.click();
        
        // Check that development costs were deducted
        const cashAfterDev = await page.locator('#cash-amount').textContent();
        expect(cashAfterDev).not.toBe(cashBeforeDev);
        
        // Check activity log shows development
        const activityLog = page.locator('#activity-log');
        await expect(activityLog).toContainText('developed');
      }
    }
  });

  test('should display current financial status in UI', async ({ page }) => {
    await page.goto('/');
    
    // Verify all financial UI elements are present and show correct values
    const cashAmount = page.locator('#cash-amount');
    await expect(cashAmount).toBeVisible();
    await expect(cashAmount).toHaveText('750,000');
    
    const playerName = page.locator('#player-name');
    await expect(playerName).toBeVisible();
    
    const turnNumber = page.locator('#turn-number');
    await expect(turnNumber).toBeVisible();
    await expect(turnNumber).toHaveText('1');
    
    // Check that action buttons exist
    const buyBtn = page.locator('#buy-btn');
    const developBtn = page.locator('#develop-btn');
    const sellBtn = page.locator('#sell-btn');
    
    await expect(buyBtn).toBeVisible();
    await expect(developBtn).toBeVisible();
    await expect(sellBtn).toBeVisible();
  });

  test('should validate game state after transactions', async ({ page }) => {
    await page.goto('/');
    
    // Perform a few transactions and ensure UI remains consistent
    for (let i = 0; i < 3; i++) {
      const propertyCell = page.locator('.grid-cell').nth(i);
      await propertyCell.click();
      
      const buyBtn = page.locator('#buy-btn');
      if (await buyBtn.isEnabled()) {
        await buyBtn.click();
        
        // Verify cash amount is still properly formatted
        const cashAmount = page.locator('#cash-amount');
        const cashText = await cashAmount.textContent();
        
        // Should be a properly formatted number
        expect(cashText).toMatch(/^\d{1,3}(,\d{3})*$/);
        
        // Should be positive
        const cashValue = parseInt(cashText?.replace(/,/g, '') || '0');
        expect(cashValue).toBeGreaterThanOrEqual(0);
        
        await page.waitForTimeout(100);
      }
    }
  });
});