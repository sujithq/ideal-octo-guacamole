import { test, expect } from '@playwright/test'

import matter from 'gray-matter'
import * as fs from 'node:fs'
import { globSync } from 'glob'
import path from 'node:path'

let files = globSync(['content/posts/**/*.md'])

let paths = files.flatMap(file => {
  // Some posts are content/posts/{slug}/index.md
  // others are content/posts/{slug}.md
  // Extract {slug}.
  let slug = (path.basename(file) === 'index.md')
    ? path.dirname(file).slice("content/".length)
    : `posts/${path.basename(file, '.md')}`

  let frontmatter = matter(fs.readFileSync(file))
  return frontmatter.data.draft ? [] : [slug]
})

// Add default taxonomy list pages (tags, categories, series)
const taxonomies = ['tags', 'categories', 'series']
paths.push(...taxonomies) // Include `/tags`, `/categories`, `/series` as paths

test.describe.configure({ mode: 'parallel' })

for (const path of paths) {
  test(path, async ({ page }) => {
    await page.goto(path)

    await expect(page).toHaveScreenshot({
      fullPage: true,
      // Apply mask over all images.
      // Some images, like GIFs, can change between snapshots
      // and lead to flaky tests.
      // mask: await page.getByRole('img').all(),
    })
  })
}
