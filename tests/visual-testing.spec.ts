import { test, expect } from '@playwright/test'

const paths = ['/', '/resume']

test.describe.configure({ mode: 'parallel' })

for (const path of paths) {
  test(path, async ({ page }) => {
    await page.goto(path)

    await expect(page).toHaveScreenshot({
      fullPage: true,
      // Apply mask over all images.
      // Some images, like GIFs, can change between snapshots
      // and lead to flaky tests.
      mask: await page.getByRole('img').all(),
    })
  })
}
