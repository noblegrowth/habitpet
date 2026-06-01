# Blocked / Needs Owner

Things I couldn't fully do without you. Skipped and continued elsewhere.

## Truly blocking a phase
- **Phase 3 (AI coach) — `VITE_ANTHROPIC_API_KEY` is empty** in `.env.local`.
  Need a real Anthropic API key to build/test the AI pet coach. Phase 3 can't
  start until this is set. (Phase 2 did not need it.)

## Stubbed (graceful fallback in place — not blocking)
- **Voice goal intake** — the "🚀 New Goal" modal supports typed intake now;
  voice is stubbed ("coming soon") because it's tied to the AI coach (Phase 3).
- **Felted pet art (PNGs)** — emoji-in-felt-medallion fallback is live. Drop
  `{petId}-{pose}.png` into `src/assets/pets/` to light up real art. Generating
  the felted renders is out of code-agent scope (see docs/DESIGN_SYSTEM.md §IV).

## Convenience (would help, not required)
- **Permission allowlist additions** for reliable Windows dev-server cleanup:
  `PowerShell(Get-NetTCPConnection:*)`, `PowerShell(Stop-Process:*)`,
  `PowerShell(Get-Process:*)`. Without these, killing a stuck Vite child can
  prompt. (`kill %job` only stops the npm wrapper, not the Vite child process.)
