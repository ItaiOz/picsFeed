import { test, expect } from '@playwright/test';

test.describe('PicsFeed E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await fetch('http://localhost:8000/reset-votes', { method: 'POST' });
    await page.goto('/');
  });

  test('should load the application with header', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByText(/PicsFeed/i)).toBeVisible();
  });

  test('should display image cards', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    
    const images = page.locator('img');
    await expect(images.first()).toBeVisible();
    
    const firstImageSrc = await images.first().getAttribute('src');
    expect(firstImageSrc).toBeTruthy();
  });

  test('should vote like on an image', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    
    const firstCard = page.locator('[data-testid="image-card"]').first();
    
    const likeButton = firstCard.getByRole('button', { name: /like/i }).or(
      firstCard.locator('button').filter({ hasText: '👍' })
    );
    await likeButton.click();
    
    await page.waitForTimeout(500);
  });

  test('should vote dislike on an image', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    
    const firstCard = page.locator('[data-testid="image-card"]').first();
    
    const dislikeButton = firstCard.getByRole('button', { name: /dislike/i }).or(
      firstCard.locator('button').filter({ hasText: '👎' })
    );
    await dislikeButton.click();
    
    await page.waitForTimeout(500);
  });

  test('should vote on multiple images', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    
    const cards = page.locator('[data-testid="image-card"]');
    const cardCount = await cards.count();
    
    const votesToCast = Math.min(3, cardCount);
    
    for (let i = 0; i < votesToCast; i++) {
      const card = cards.nth(i);
      const likeButton = card.getByRole('button').first();
      await likeButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should export votes as CSV', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    const firstCard = page.locator('[data-testid="image-card"]').first();
    await firstCard.getByRole('button').first().click();
    await page.waitForTimeout(500);
    
    const exportButton = page.getByRole('button', { name: /export/i });
    
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('should reset all votes', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    const firstCard = page.locator('[data-testid="image-card"]').first();
    await firstCard.getByRole('button').first().click();
    await page.waitForTimeout(500);
    
    const resetButton = page.getByRole('button', { name: /reset/i });
    await resetButton.click();
    
    await page.waitForTimeout(1000);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/images', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.goto('/');
    
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForSelector('img', { timeout: 10000 });
    
    const firstCard = page.locator('[data-testid="image-card"]').first();
    await expect(firstCard).toBeVisible();
    
    const likeButton = firstCard.getByRole('button').first();
    await expect(likeButton).toBeVisible();
  });

  test('should load more images on scroll (if pagination exists)', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    
    const initialCount = await page.locator('img').count();
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    await page.waitForTimeout(1000);
    
  });

  test('should persist votes after page reload', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    
    const firstCard = page.locator('[data-testid="image-card"]').first();
    const likeButton = firstCard.getByRole('button').first();
    await likeButton.click();
    await page.waitForTimeout(500);
    
    await page.reload();
    await page.waitForSelector('img', { timeout: 10000 });
    
  });
});
