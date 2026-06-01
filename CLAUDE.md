# HabitPet — Claude Code Context File

Last updated: 2026-05-31

## What This Is
A family habit tracking app combining Tamagotchi and Finch-style mechanics.
Kids bond with personal AI-coached pet companions that grow with their habits.
Built for a Samsung Galaxy Tab as a home touchpoint for the whole family.

## Stack
- React + Vite (frontend framework)
- Tailwind CSS (styling)
- Anthropic API via claude-sonnet-4-20250514 (AI pet coach)
- localStorage (Phase 1 data layer)
- Supabase (Phase 6 migration — schema already written)
- Vercel (hosting + preview deploys)
- PWA configured (installs to tablet home screen)
- vite-plugin-pwa (service worker + manifest)

## Key Files
- /docs/HABITPET_PROJECT_PLAN.md — Full project plan and strategy
- /src/ai/habitpet-ai-prompt.js — AI system prompt builder (all conversation modes)
- /src/data/habitpet-task-templates.js — Task library, pet roster, XP thresholds
- /supabase/migrations/001_habitpet_initial.sql — Full DB schema (use as localStorage shape now)

## Folder Structure
/src/ai/          → Anthropic API integration, prompt builders
/src/data/        → Task templates, constants, static data
/src/components/  → UI components (pet/, tasks/, chat/, parent/, shared/)
/src/pages/       → Top-level route pages
/src/utils/       → Pure functions (XP calc, streak logic, date helpers)
/src/hooks/       → Custom React hooks (useChild, usePet, useTasks, etc.)
/src/context/     → React context providers (FamilyContext, etc.)
/docs/            → Project documentation
/supabase/        → Database schema and migrations

## Users
- Children: age brackets 4–7, 8–12, 13+
- Parents: PIN-protected admin dashboard
- Family: shared Family Pet (collective effort)

## Personal Pet Options
Dragon, Fox, Bunny, Owl, Puppy, Kitten, Hamster, Bee, Unicorn

## Family Pet Options
Phoenix, Lizard, Capybara, Snow Leopard, Elephant, Whale, Red Panda, Otter, Manta Ray

## Data Layer (Phase 1)
All data in localStorage. Key: 'habitpet_data'. Shape mirrors Supabase schema.
See /supabase/migrations/001_habitpet_initial.sql for full shape.
See /src/data/habitpet-task-templates.js for helper functions.

## Data Layer (Phase 6)
Migrate localStorage → Supabase. Write migration script at /src/utils/migrateToSupabase.js.
ENV vars for Supabase are already stubbed in .env.local.

## AI Integration (Phase 3)
Anthropic API key in VITE_ANTHROPIC_API_KEY env var.
All prompt building via /src/ai/habitpet-ai-prompt.js — do not write inline prompts.
Model: claude-sonnet-4-20250514. Age-aware, values-embedded, in-character as the pet.

## Phase Status
- [x] Phase 1: Scaffold + profile system + pet selection + home screen
- [x] Phase 2: Task engine + check-in windows + XP + streaks
- [ ] Phase 3: AI pet coach integration
- [ ] Phase 4: Gamification + animations + badge system
- [ ] Phase 5: Parent dashboard
- [ ] Phase 6: Supabase migration + PWA install + deploy

## Build Rules (follow these every session)
1. Commit to GitHub after every significant feature. Don't wait until end of session.
2. Commit message format: "feat: [what was built]" or "fix: [what was fixed]"
3. Write Vitest unit tests for every utility function in /src/utils/ as you go.
4. Touch-first UI — minimum tap targets 44×44px, designed for 10-inch tablet.
5. Never write inline AI prompts — always use /src/ai/habitpet-ai-prompt.js builders.
6. Never store API keys in code — always use import.meta.env.VITE_* variables.
7. Grace-first UX — no shame, no lost progress, no punitive mechanics.

## Current Phase 1 Goal
Build:
1. Home screen: animated Family Pet (CSS/emoji) + child profile tiles + parent lock icon
2. Child profile creation: name, age bracket, pet selection (9 options), optional PIN
3. Family pet selection: 9 options with personality descriptions
4. Navigation: home → child world → back
5. localStorage data layer matching the Supabase schema shape
Make it beautiful and touch-friendly for a 10-inch tablet.
