import { test, expect } from '@playwright/test';

test.describe('Right Sidebar Functionality', () => {
  test('should display "No solution selected." when no solutions are selected', async ({ page }) => {
    // Navigate to the app's main page
    await page.goto('/');

    // Verify that the sidebar contains "No solution selected."
    const noSolutionMessage = page.locator('text=No solution selected.');
    await expect(noSolutionMessage).toBeVisible();
  });

  test('should display solution statistics when a solution is selected', async ({ page }) => {
    // Navigate to the app's main page
    await page.goto('/');

    // Simulate selecting a solution in the left sidebar
    const solutionItem = page.locator('li:has-text("Solution 1")');
    await expect(solutionItem).toBeVisible();
    await solutionItem.click();

    // Verify the sidebar shows solution statistics
    const statisticsHeading = page.locator('text=Solution Statistics');
    await expect(statisticsHeading).toBeVisible();

    // Check features count and total area
    const featuresText = page.locator('text=Features:');
    await expect(featuresText).toContainText('Features:');

    const totalAreaText = page.locator('text=Total Area of selected polygons:');
    await expect(totalAreaText).toContainText('Total Area of selected polygons:');
  });
});
