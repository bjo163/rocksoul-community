import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/community")
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test("community home exposes real routes and unknown paths show 404", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Discuss the record/i })).toBeVisible()
  await page.goto("/this-route-does-not-exist")
  await expect(page.getByText("404 / COMMUNITY ROUTE")).toBeVisible()
  await expect(page.getByRole("heading", { name: /Nothing is silently mapped here/i })).toBeVisible()
})

test("member can sign in, follow, save, ask and submit context", async ({ page }) => {
  await page.goto("/auth")
  await page.getByLabel("Email").fill("member@example.com")
  await page.getByLabel("Password").fill("fixture-password")
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await expect(page).toHaveURL(/\/community$/)

  await page.goto("/community/cases/mw-0042")
  await page.getByRole("button", { name: "Follow", exact: true }).click()
  await expect(page.getByRole("button", { name: "Following", exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Save", exact: true }).click()
  await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible()

  const question = "What source would reduce the remaining identity uncertainty?"
  await page.getByLabel("Question").fill(question)
  await page.getByRole("button", { name: "Ask question" }).click()
  await expect(page.getByText(question)).toBeVisible()

  const context = "A source-linked timeline note that still needs review."
  await page.getByLabel("Source / provenance").fill("SRC-COMMUNITY-E2E")
  await page.getByLabel("Context").fill(context)
  await page.getByRole("button", { name: "Submit context" }).click()
  await expect(page.getByRole("paragraph").filter({ hasText: context })).toBeVisible()
  await expect(page.getByText("unverified", { exact: true }).first()).toBeVisible()

  await page.goto("/community/threads/thread-mw0042-identity")
  await expect(page.getByText("EDIT / MODERATION HISTORY")).toBeVisible()
  const reply = "This reply remains attributed community discussion."
  await page.getByLabel("Reply").fill(reply)
  await page.getByLabel("Source / provenance").fill("https://example.com/source-locator")
  await page.getByRole("button", { name: "Add reply" }).click()
  await expect(page.getByText(reply)).toBeVisible()
})

test("mobile community keeps essential status visible without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/community/cases/mw-0042")
  await expect(page.getByText("13 / Community / MW-0042", { exact: true })).toBeVisible()
  await expect(page.getByText(/case unresolved/i)).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  expect(overflow).toBeFalsy()
})

test("semantic loading and failure states stay distinct", async ({ page }) => {
  await page.goto("/community/system-states")
  await expect(page.getByText("Loading", { exact: true }).first()).toBeVisible()
  await expect(page.getByText("Error", { exact: true }).first()).toBeVisible()
  await expect(page.getByText("Backend offline", { exact: true }).first()).toBeVisible()
  await expect(page.getByText("Empty", { exact: true }).first()).toBeVisible()
})
