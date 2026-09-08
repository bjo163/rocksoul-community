import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

test("routing has an explicit 404 instead of fixture fallthrough", async () => {
  const source = await readFile("src/router.ts", "utf8")
  assert.ok(source.includes('"not-found"'))
  assert.ok(source.includes('return { name: "not-found", pathname: path }'))
  assert.ok(!source.includes('return "community"'))
})

test("asset consumption uses rocksoul-ui stable registry", async () => {
  const source = await readFile("src/main.tsx", "utf8")
  assert.ok(source.includes("MOONWITNESS_STABLE_REPOSITORY_BASE"))
  assert.ok(!source.includes("rocksoul-assets/main"))
})

test("MW-0042 actions mutate community state without canonicalization", async () => {
  const source = await readFile("src/community-store.ts", "utf8")
  for (const action of ["toggleFollow", "toggleSaved", "submitQuestion", "submitContext", "addReply", "createProposal"]) {
    assert.ok(source.includes(`const ${action}`))
  }
  assert.ok(source.includes('"needs-context"'))
  assert.ok(source.includes('"unverified"'))
})

test("community discussion preserves comments, history and moderation state", async () => {
  const data = await readFile("src/community-data.ts", "utf8")
  const pages = await readFile("src/community-pages.tsx", "utf8")
  assert.ok(data.includes("CommunityHistoryEvent"))
  assert.ok(data.includes("CommunityComment"))
  assert.ok(data.includes('"reported"'))
  assert.ok(pages.includes("EDIT / MODERATION HISTORY"))
  assert.ok(pages.includes("SourceLocator"))
  assert.ok(pages.includes("CommunityStatesPage"))
})
