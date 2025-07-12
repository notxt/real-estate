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

  test('should display working message from main.js', async ({ page }) => {
    await page.goto('/');
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
    await expect(main).toHaveText('working!');
  });

  test('should have proper viewport responsiveness', async ({ page, viewport }) => {
    await page.goto('/');
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Verify main element has proper styling
    if (viewport && viewport.width < 768) {
      await expect(main).toHaveCSS('padding', '32px');
    }
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