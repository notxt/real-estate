import { test, expect } from '@playwright/test';

test.describe('Real Estate Empire Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle('Real Estate Empire');
    
    const header = page.locator('header h1');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('Real Estate Empire');
    
    const tagline = page.locator('header p');
    await expect(tagline).toBeVisible();
    await expect(tagline).toHaveText('Build your property development empire');
  });

  test('should display the game container', async ({ page }) => {
    await page.goto('/');
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    
    const welcomeHeading = gameContainer.locator('h2');
    await expect(welcomeHeading).toHaveText('Welcome to Real Estate Empire');
    
    const welcomeText = gameContainer.locator('p');
    await expect(welcomeText).toContainText('Your journey to becoming a property mogul starts here');
  });

  test('should have proper viewport responsiveness', async ({ page, viewport }) => {
    await page.goto('/');
    
    if (viewport && viewport.width < 768) {
      await expect(page.locator('main')).toHaveCSS('padding', '32px');
    }
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should load the main.js script', async ({ page }) => {
    let scriptLoaded = false;
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('main.js')) {
        scriptLoaded = false;
      }
    });
    
    await page.goto('/');
    
    const scriptTag = page.locator('script[src="js/main.js"]');
    await expect(scriptTag).toHaveAttribute('type', 'module');
  });
});