<div align="center">

# ROCKSOUL COMMUNITY

## **THE PARTICIPATION LAYER**

### **DISCUSS THE RECORD. KEEP THE SOURCE VISIBLE.**

React + Vite participation application for **MoonWitness × Rocksoul**.

</div>

---

> **COMMUNITY can discuss, annotate, propose, comment, collaborate, and link sources. It does not silently convert participation into canonical research truth or become the IAM authority.**

## Current implementation

The application now provides:

```text
/community                       community home + search
/community/cases/mw-0042         golden-case conversation
/community/threads               discussion index
/community/threads/:id           attributed thread detail
/community/saved                 saved cases
/community/notifications         reply/review/system notifications
/community/proposals             source-aware proposals
/community/profile               public participation profile
/community/system-states         loading/error/offline/empty semantics
/auth                            Platform identity compatibility bridge
unknown routes                   explicit 404
```

MW-0042 supports stateful **Follow**, **Save**, **Ask question**, **Submit context**, and attributed **thread replies**. Thread detail exposes source locators plus edit/moderation history. Community submissions remain explicitly non-canonical and start as `unverified` or `needs-context`.

## Ownership boundaries

### Identity

Canonical IAM authority belongs to `rocksoul-platform`.

```text
PLATFORM
= ACCOUNT · USER · ORGANIZATION · ROLE · PERMISSION · AUTHORIZATION · MODERATION AUTHORITY

COMMUNITY
= PUBLIC PROFILE · THREAD · COMMENT · DISCUSSION · PROPOSAL · PARTICIPATION · COMMUNITY EXPERIENCE
```

The Community auth surface is a compatibility bridge. Configure `VITE_ROCKSOUL_PLATFORM_IDENTITY_URL` when a Platform identity endpoint is available. Local compatibility state is not an IAM authority.

### Design and UI

```text
DESIGN → rocksoul-assets
UI     → @rocksoul/ui
APP    → rocksoul-community
```

`@rocksoul/ui` is pinned to an immutable Git commit. Assets are resolved through `MOONWITNESS_STABLE_REPOSITORY_BASE` exported by `@rocksoul/ui`, which itself pins the released `rocksoul-assets` source. The app does not consume `rocksoul-assets/main`.

## Canonical research boundary

```text
COMMUNITY CONTRIBUTION
      ↓
DISCUSSION / PROPOSAL
      ↓
REVIEW
      ↓
OWNING DOMAIN WORKFLOW
      ↓
CANONICALIZATION — only if accepted there
```

Research owners:

```text
STORY        → rocksoul-mftl
EVENT        → rocksoul-legend
PERSON       → rocksoul-superhero
TEXT         → rocksoul-rgbl
LAW          → rocksoul-aws
PERSPECTIVE  → rocksoul-jizz
RELATIONSHIP → rocksoul-correlation
```

## Guardrails

- discussion ≠ evidence;
- popularity ≠ validity;
- proposal ≠ canonical record;
- public profile ≠ canonical PERSON research record;
- authentication compatibility ≠ IAM ownership;
- moderation workflow ≠ research adjudication;
- source/provenance state stays visible;
- unknown routes never silently fall through to the golden case.

## Quality gates

```bash
npm run validate
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run ci
```

GitHub Actions validates the contract/build on every push and runs Playwright against desktop Chromium plus a 390px mobile viewport. The responsive target follows the canonical `rocksoul-assets` contract: thread/feed first on mobile and content + contextual rail on desktop.

## Runtime

- React 19
- Vite 8
- TypeScript 7
- Node 22.x
- Vercel SPA rewrite

<div align="center">

## **PARTICIPATE WITHOUT LOSING PROVENANCE.**

`COMMUNITY / MoonWitness × Rocksoul`

</div>


## Participation visual contract

Community participation visuals are owned upstream by `rocksoul-assets` and consumed through typed `@rocksoul/ui` components. The application renders dedicated semantics for source linkage, discussion, proposal review, identity bridging, saved cases, notifications, moderation history, and attributed replies. Source locators are resolved by the shared UI ecosystem-link contract; this repository does not carry a duplicate Rocksoul asset SHA or GitHub source URL.
