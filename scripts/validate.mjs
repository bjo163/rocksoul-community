import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const [pkgRaw, lockRaw, main, pages, router, identity, readme] = await Promise.all([
  readFile("package.json", "utf8"),
  readFile("package-lock.json", "utf8"),
  readFile("src/main.tsx", "utf8"),
  readFile("src/community-pages.tsx", "utf8"),
  readFile("src/router.ts", "utf8"),
  readFile("src/identity.ts", "utf8"),
  readFile("README.md", "utf8"),
])

const pkg = JSON.parse(pkgRaw)
const lock = JSON.parse(lockRaw)
assert.equal(lock.lockfileVersion, 3)
assert.equal(lock.packages[""].dependencies["@rocksoul/ui"], pkg.dependencies["@rocksoul/ui"])
assert.match(pkg.dependencies["@rocksoul/ui"], /^github:bjo163\/rocksoul-ui#[0-9a-f]{40}$/)
assert.equal(pkg.engines.node, "24.x")
assert.ok(main.includes("MOONWITNESS_STABLE_REPOSITORY_BASE"))
assert.ok(!main.includes("rocksoul-assets/main"))
assert.ok(!pages.includes("#method"))
assert.ok(!pages.includes("#case"))
assert.ok(pages.includes('navItems={communityNavigation}'))
assert.ok(identity.includes("VITE_ROCKSOUL_PLATFORM_IDENTITY_URL"))

for (const route of [
  "/community",
  "/community/cases/",
  "/community/threads/",
  "/community/saved",
  "/community/notifications",
  "/community/proposals",
  "/community/profile",
  "/auth",
  "/community/system-states",
]) {
  assert.ok(router.includes(route), `missing route contract: ${route}`)
}

for (const surface of ["CommunityHomePage", "CommunityCasePage", "ThreadsPage", "SavedPage", "NotificationsPage", "ProposalsPage", "ProfilePage", "AuthPage", "CommunityStatesPage", "NotFoundPage"]) {
  assert.ok(pages.includes(`function ${surface}`) || pages.includes(`function ${surface}(`), `missing surface: ${surface}`)
}

for (const boundary of [
  "discussion ≠ evidence",
  "proposal ≠ canonical record",
  "authentication compatibility ≠ IAM ownership",
]) {
  assert.ok(readme.toLowerCase().includes(boundary.toLowerCase()), `README missing boundary: ${boundary}`)
}

console.log("rocksoul-community contract validation passed")
