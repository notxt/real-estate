import { test, expect } from '@playwright/test'

test.describe('Keyboard Navigation', () => {
  test('should debug focus and event listeners', async ({ page }) => {
    await page.goto('/')
    
    // Check if event listeners are attached
    const hasKeydownListener = await page.evaluate(() => {
      const grid = document.querySelector('.property-grid')
      if (!grid) return false
      
      // Try to trigger a keydown event manually
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      grid.dispatchEvent(event)
      
      // Check if there's any response
      return true
    })
    
    console.log(`Grid found and keydown event dispatched: ${hasKeydownListener}`)
    
    // Check grid properties
    const gridInfo = await page.evaluate(() => {
      const grid = document.querySelector('.property-grid')
      if (!grid) return null
      
      return {
        tabIndex: grid.getAttribute('tabindex'),
        classList: Array.from(grid.classList),
        childCount: grid.children.length
      }
    })
    
    console.log('Grid info:', gridInfo)
    
    // Focus and check what happens
    const propertyGrid = page.locator('.property-grid')
    await propertyGrid.focus()
    
    // Check focus state
    const focusInfo = await page.evaluate(() => {
      const grid = document.querySelector('.property-grid')
      const focused = document.activeElement
      return {
        gridIsFocused: focused === grid,
        activeElementTag: focused?.tagName,
        activeElementClass: focused?.className
      }
    })
    
    console.log('Focus info:', focusInfo)
  })

  test('should navigate with arrow keys and show visual feedback', async ({ page }) => {
    await page.goto('/')
    
    // Wait for grid to load
    await expect(page.locator('.property-grid')).toBeVisible()
    
    // Focus on the property grid
    const propertyGrid = page.locator('.property-grid')
    await propertyGrid.focus()
    
    // Check if any property gets selected when grid is focused
    await page.waitForTimeout(100) // Small delay for focus handling
    const selectedProperties = page.locator('.grid-cell.selected')
    const selectedCount = await selectedProperties.count()
    console.log(`Selected properties after grid focus: ${selectedCount}`)
    
    if (selectedCount > 0) {
      const firstSelected = selectedProperties.first()
      const coords = await firstSelected.getAttribute('data-x')
      console.log(`First selected property is at x: ${coords}`)
    }
    
    // Try pressing ArrowRight
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(100) // Small delay for navigation
    
    // Check selection after arrow key
    const selectedAfterArrow = page.locator('.grid-cell.selected')
    const selectedAfterCount = await selectedAfterArrow.count()
    console.log(`Selected properties after ArrowRight: ${selectedAfterCount}`)
    
    if (selectedAfterCount > 0) {
      const selectedAfter = selectedAfterArrow.first()
      const coordsAfter = await selectedAfter.getAttribute('data-x')
      console.log(`Selected property after arrow is at x: ${coordsAfter}`)
    }
    
    // Press Enter to confirm selection
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    
    // Check if property is still selected after Enter
    const selectedAfterEnter = page.locator('.grid-cell.selected')
    const selectedEnterCount = await selectedAfterEnter.count()
    console.log(`Selected properties after Enter: ${selectedEnterCount}`)
    
    // Verify we have exactly one selected property
    await expect(selectedAfterEnter).toHaveCount(1)
  })
  
  test('should handle manual click followed by keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Click on a specific property first
    const targetProperty = page.locator('.grid-cell[data-x="5"][data-y="5"]')
    await targetProperty.click()
    
    // Verify it's selected
    await expect(targetProperty).toHaveClass(/selected/)
    
    // Focus the grid and try keyboard navigation
    const propertyGrid = page.locator('.property-grid')
    await propertyGrid.focus()
    
    // Navigate right
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(100)
    
    // Should now have property at (6,5) selected
    const rightProperty = page.locator('.grid-cell[data-x="6"][data-y="5"]')
    await expect(rightProperty).toHaveClass(/selected/)
    
    // Navigate down
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)
    
    // Should now have property at (6,6) selected
    const downProperty = page.locator('.grid-cell[data-x="6"][data-y="6"]')
    await expect(downProperty).toHaveClass(/selected/)
  })
})