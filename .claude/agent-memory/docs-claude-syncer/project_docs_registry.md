---
name: Docs registry in CLAUDE.md
description: Current list of /docs files referenced in the Documentation-First Rule section of CLAUDE.md, and observed naming/ordering conventions
type: project
---

The Documentation-First Rule section in CLAUDE.md currently lists these docs files (in order):

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md
- /docs/routing.md
- /docs/server-components.md

**Why:** CLAUDE.md instructs Claude Code to consult these files before generating any code. Keeping this list in sync ensures new docs are actually used.

**How to apply:** When a new /docs file is added, insert it into this list in alphabetical order by filename and update MEMORY.md accordingly.

Ordering convention: entries are roughly alphabetical by filename (auth, data-fetching, data-mutations, routing, server-components, ui). "ui.md" appears first despite alphabetical order — preserve its position at the top as it was placed there originally.

Added 2026-03-27: /docs/routing.md — covers route structure (all app routes under /dashboard), route protection via Clerk middleware, and middleware configuration pattern.
