# HabitPet — Project Plan, Intention & Strategy

> *A family habit companion app where kids grow alongside a personal pet, powered by AI, grounded in faith, and built for real life.*

---

## 1. Vision & Intention

HabitPet exists to solve a real problem in family life: habits and character are built slowly, invisibly, and through daily friction — and most tools treat kids like tiny adults or rely on parental enforcement alone. This app puts a warm, living, AI-powered companion in the middle of that process. The pet is the coach. The pet is the accountability partner. The pet is the friend who shows up every morning and celebrates every small win.

The deepest intention is not to build a productivity app for children. It's to build a *growth environment* — one that develops grit, self-discipline, kindness, and wonder in the natural flow of daily life, without lecturing, without shame, and without requiring parents to be the bad guy.

Christian values — the Fruits of the Spirit, generosity, faithfulness, courtesy, teamwork — are woven into the fabric of the experience. They show up as character traits the pet embodies and the child grows into. They are never preached. They are caught, not taught.

---

## 2. The Family Context

**Platform:** Browser-first on a Galaxy Tab tablet mounted centrally in the home. Designed as a shared family touchpoint — always visible, always available. Progressive upgrade path to PWA (installable app) and hosted web deployment.

**Users:**
- Multiple children across three age brackets: **4–7**, **8–12**, **13+**
- Parents as administrators, approvers, configurers, and recipients of weekly insight
- The family unit as a collaborative team with shared stakes in the Family Pet

**Tone:**
- Playful and gamified (Tamagotchi energy)
- Warm and emotionally intelligent (Finch depth)
- Subtly faith-grounded (not Sunday school)
- Never shaming. Always grace-first.

---

## 3. Core Design Pillars

### Pillar 1: The Pet Is Real
The pet is not a reward mechanism. It is a *relationship*. Its mood reflects the child's effort. Its world responds to their choices. It speaks in a distinct voice tuned to the child's age. It remembers. It celebrates. It misses them when they're gone. The child should feel genuine care for their pet — and through that care, develop care for themselves.

### Pillar 2: The Child Is the Hero
Kid-initiated goals are celebrated above all else. The system rewards self-direction with bonus XP and special recognition. The app should feel like it's on the child's side, not monitoring them. Tasks are framed as adventures, not checklists.

### Pillar 3: Parents Enable, Not Enforce
The parent dashboard is a *support layer*, not a surveillance center. Parents configure, approve, review, and receive suggestions. The AI coach handles the daily emotional labor. The app reduces parent-child conflict around habits by inserting a trusted third party (the pet) into the loop.

### Pillar 4: Progress Is Always Visible, Never Lost
Kids never lose levels. Pets never die. Mood states are reflective, not punitive. The message is always: *you can come back*. Grace is structural. This mirrors a growth mindset and — intentionally — the Christian ethic of renewal and fresh starts.

### Pillar 5: The Family Is a Team
The Family Pet is the collective heart of the household. It thrives when everyone contributes. It gives siblings a reason to cheer for each other instead of compete. Family milestones trigger shared celebrations that spill into real life (movie nights, game nights, special outings).

---

## 4. Product Architecture

### Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React + Vite | Fast, component-based, Galaxy Tab optimized |
| Styling | Tailwind CSS | Touch-first, themeable per child |
| Animation | Lottie + CSS | Rich pet animations, lightweight |
| AI Coach | Anthropic API (Claude Sonnet) | Age-aware, in-character pet voice |
| Storage v1 | localStorage + IndexedDB | Zero-setup, offline-capable |
| Storage v2 | Supabase (free tier) | Multi-device sync, hosted, RLS-protected |
| Hosting | Vercel or Netlify (free tier) | One-command deploy, custom URL |
| Auth | PIN-based profiles | Kid-friendly, parent-secured |

### Screen Architecture

```
HOME SCREEN
├── Family Pet (animated, mood-reactive)
├── Family XP bar (collective progress)
├── Child profile tiles (tap to enter)
└── Parent dashboard lock

KID WORLD (per child, per session)
├── My Pet (main companion, animated, mood-reactive environment)
├── Today's Journey (daily tasks by check-in window)
├── Talk to [Pet Name] (AI chat interface)
├── My Growth (XP, level, streaks, badge wall, Trait Tree)
└── Pet's Room (unlockable customization)

PARENT DASHBOARD (PIN-protected)
├── Family overview (all kids, today's status)
├── Approval queue (tasks requiring sign-off)
├── Kid-initiated goal review + XP setting
├── Configure tasks per child
├── XP threshold / reward customization
├── Weekly report (AI-generated, per child)
├── Parent nudges (actionable suggestions)
└── Values & interest settings
```

---

## 5. The Pet System

### Personal Pets (one per child)

| Pet | Personality | Best For |
|---|---|---|
| 🐉 Dragon | Bold, brave, challenge-hungry | Competitive kids |
| 🦊 Fox | Clever, curious, witty | Intellectual/curious kids |
| 🐰 Bunny | Sweet, gentle, nurturing | Sensitive or younger kids |
| 🦉 Owl | Wise, calm, thoughtful | Reflective or older kids |
| 🐶 Puppy | Loyal, enthusiastic, energetic | Social/active kids |
| 🐱 Kitten | Sassy, independent, charming | Strong-willed kids |
| 🐹 Hamster | Scrappy, funny, determined | Underdog-lovers |
| 🐝 Bee | Hardworking, community-minded | Diligent/team-oriented kids |
| 🦄 Unicorn | Magical, expressive, joyful | Imaginative kids |

### Family Pet Options

Phoenix, Lizard, Capybara, Snow Leopard, Elephant, Whale, Red Panda, Otter, Manta Ray — each with a default name and distinct personality archetype. The family chooses together.

### Pet Mood States

```
😄 Thriving    80–100% weekly completion
😊 Happy       60–79%
😐 Okay        40–59%
😴 Tired       20–39%
😔 Struggling  0–19%
```

Mood affects: pet animations, background environment (sunny meadow → cloudy → rain), and the warmth/urgency of the AI coach's voice. Never punitive — always reflective.

---

## 6. Task Engine

### Categories
- 🧼 **Self-Care** — Hygiene, grooming, morning/bedtime routines
- 🏠 **Helping Out** — Chores, family contribution tasks
- 📚 **Learning** — Homework, reading, study, project prep, school reflection
- ⚡ **Move It** — Sports practice, solo skill work, movement breaks
- 🌟 **My Passions** — Instruments, art, coding, interests, exploration
- ❤️ **Being Good** — Kindness acts, encouraging siblings, gratitude, apology
- 👨‍👩‍👧 **Family Time** — Dinners, games, family pet care, shared tasks
- 🌙 **Big Thoughts** — Daily reflection, weekly review, gratitude moments
- 🚀 **My Own Goal** — Kid-initiated goals (bonus XP, special badge)

### Age-Calibrated XP
Every template has age-bracket-specific XP values. Older kids get less XP for the basics (they should be automatic) and more for complex tasks. Younger kids get generous XP for independence milestones.

### Check-In Windows (6 per day)
| Window | Default Time | Purpose |
|---|---|---|
| ☀️ Wake Up | 7:00 AM | Morning routine tasks |
| 🎒 Before School | 7:45 AM | Last-minute prep, pack bag |
| 🏃 Home from School | 3:30 PM | Welcome back, homework kickoff |
| 🌤️ Afternoon | 4:30 PM | Main task completion window |
| ⏰ Last Chance | 7:30 PM | Streak protection, evening tasks |
| 🌙 Bedtime | 8:30 PM | Wind-down, reflection, teeth |

### Kid-Initiated Goal Flow
1. Child taps "New Goal" or tells their pet via voice/chat
2. Pet (AI) helps them make it concrete: what does done look like? How often?
3. Task created with 1.5x XP bonus, marked `is_kid_initiated: true`
4. Parent receives nudge to review and confirm XP value
5. Kid gets special badge: "Goal Setter 🚀" on completion

### Task Intake Methods
- **Template selection** (parent or child browses library)
- **AI chat intake** (child tells pet, AI structures it)
- **Voice input** (speech-to-text → AI structures → parent approves)
- **Parent manual entry** (full control via dashboard)

---

## 7. Gamification System

### XP & Levels
- XP earned per task completion (age-calibrated)
- Bonus multipliers: kid-initiated (1.5x), apology/courage tasks (2.0x), bonus character tasks (1.5x)
- Pet levels 1–50. Each level unlocks: accessories, room themes, new animations
- **Kids never lose levels.** Progress is permanent.

### Streak System
| Streak | Badge | Trait Awarded |
|---|---|---|
| 3 days | 3-Day Spark 🔥 | Faithfulness |
| 7 days | 1-Week Warrior ⚔️ | Grit |
| 14 days | Two-Week Titan 🛡️ | Self-Control |
| 30 days | Month of Might 🏔️ | Ambition |
| 100 days | Century Club 💯 | Faithfulness |

### XP Milestone Celebrations
| XP | Label | Reward |
|---|---|---|
| 100 | First Century 🎖️ | New pet accessory |
| 250 | Building Steam ⭐ | Room decoration |
| 500 | Halfway Hero 🏆 | Family activity choice |
| 1,000 | Four Digits 👑 | Customize pet name |
| 2,500 | Grind Master 💎 | Rare pet accessory |
| 5,000 | Habit Legend 🌟 | Family celebration |

All thresholds are parent-configurable per child.

### Character Trait System
Traits are earned through *patterns of behavior* — never single events. They display on a visual **Trait Tree** that grows over time.

| Trait | How Earned |
|---|---|
| Grit 💪 | Completing hard tasks, maintaining streaks |
| Kindness 💛 | Kind acts, sibling encouragement |
| Faithfulness 🌟 | Long streaks, consistent showing up |
| Self-Control 🛡️ | Hygiene streaks, screen time tasks |
| Joy ✨ | Celebration check-ins, gratitude moments |
| Peace 🕊️ | Bedtime reflections, wind-down tasks |
| Generosity 🎁 | Helping without being asked, family tasks |
| Teamwork 🤝 | Family pet contributions, sibling tasks |
| Wonder 🔭 | Interest tasks, exploration, school reflection |
| Growth Mindset 🌱 | Completing tasks after missing days, study tasks |
| Courtesy 🎩 | Table setting, family dinner, apology tasks |
| Ambition 🏔️ | Kid-initiated goals, solo practice, long streaks |

### Family Leaderboard
Collaborative, not competitive. Weighted XP for younger kids. Collective milestones trigger shared family rewards. The Family Pet's health is the family's report card.

---

## 8. AI Coach System

### Age-Tuned Voice
- **4–7:** Silly, warm, simple words, lots of emojis, short sentences, sound effects in text
- **8–12:** Fun older-sibling energy, humor, mild challenge, genuine interest
- **13+:** Respectful peer, direct, real, no baby talk, asks meaningful questions

### Conversation Modes (8 total)
1. **Morning Nudge** — Energetic daily greeting, preview 1–2 tasks
2. **Before School** — Quick send-off, gentle last-chance nudge
3. **Home from School** — Welcome back, genuine curiosity about the day
4. **Mid-Afternoon** — Check-in, suggest one specific task
5. **Last Chance / Evening** — Warm streak protection energy
6. **Bedtime** — Calm wind-down, one reflection, grace for the day
7. **Free Chat** — Relationship-building, follow the child's lead
8. **Task Celebration** — Varied, genuine, age-appropriate celebration
9. **Struggle Support** — No guilt. Curiosity. One easy re-entry.
10. **Kid Goal Intake** — Celebrate initiative, help make it concrete
11. **Weekly Reflection** — 3-phase: Report → Child Response → Reframe

### Values Integration (Subtle)
The AI coach *embodies* values through how it responds. It never lectures. It celebrates persistence as grit. It reframes failure as "not yet." It notices and names kindness. It asks one good reflective question per conversation. It models grace when kids miss days.

### Parent-Facing AI
- **Weekly Summary Email/In-App:** AI-generated report per child — highlights, one growth area, 2 specific parent action suggestions
- **In-App Nudges:** 8 trigger types (streak at risk, missed 3 days, new kid goal, category neglected, level-up, trait earned, reflection due, family pet needs help)

---

## 9. Weekly Reflection System

**Availability:** Opens Sunday morning. Soft nudge Monday. Firm nudge Tuesday PM.

**Three Phases:**
1. **Pet Report** — AI presents the week as highlights, not a report card. Celebrates wins. Names one growth opportunity as exciting potential.
2. **Child Response** — Pet asks one age-appropriate reflection question. Child responds via chat.
3. **Reframe** — AI acknowledges their response, connects it to something real, sets up next week as a fresh chapter with specific first step.

**Philosophy:** The weekly reflection is not an assessment. It is a ritual. It teaches kids to look back with curiosity, forward with confidence, and inward with honesty.

---

## 10. Skill Tree System *(Phase 4+)*

Task completion feeds skill tree nodes across four trees:
- **Self-Care Tree:** Basic Hygiene → Solid Routine → Wellness Pro
- **Responsibility Tree:** Helper → Home Steward → Family Anchor
- **Learning Tree:** Study Starter → Deep Learner → Scholar
- **Character Tree:** Kind Heart → Servant Spirit → Community Light

Each node unlocks at a completion threshold. Unlocking nodes reveals new tasks, accessories, and AI conversation depth. This gives kids a sense of long-term progression and keeps the app fresh over months and years.

---

## 11. Future Features (Noted for Later)

### Notables
Pre-curated content library injected naturally into pet conversations:
- Bible verses (age-appropriate, thematic)
- Stoic quotes
- History trivia
- Science trivia

Parents curate which categories are active. Pet weaves them in when the moment fits — never forced.

### Celebration Emotes
Fortnite-inspired earned/unlocked animations triggered on task completion and milestones:
- Default set available from day one
- Earned through XP milestones and streaks
- Rare emotes unlocked via special achievements
- Parent-promoted custom emotes (family inside jokes, etc.)

### External Notifications
Parent weekly summary delivered externally (email or push notification) summarizing all children's week with AI-generated suggestions.

---

## 12. Phased Build Plan

### Phase 1 — Foundation *(2–3 Claude Code sessions)*
- React + Vite + Tailwind scaffold
- Child profile creation + PIN system
- Pet selection (personal + family)
- localStorage data layer (full schema)
- Home screen with Family Pet + profile tiles

### Phase 2 — Task Engine *(2–3 sessions)*
- Task template library integration
- Age-filtered daily task generation
- Check-in window scheduling
- Task check-off UI with animations
- XP system + level-up logic
- Streak tracking
- Kid-initiated goal intake (tap + voice)
- Parent approval queue

### Phase 3 — AI Pet Coach *(2 sessions)*
- Anthropic API integration
- Age-aware system prompt builder
- Chat UI (feels like texting your pet)
- All 11 conversation modes
- Morning/evening auto-prompts

### Phase 4 — Gamification & Polish *(2–3 sessions)*
- Badge system + Trait Tree visual
- Pet mood states + reactive environments
- Lottie animations for pets
- Family Pet meter + collective XP
- Pet room customization
- Skill tree progress (stub → functional)

### Phase 5 — Parent Dashboard *(1–2 sessions)*
- Full family overview
- Weekly AI-generated report
- Task configuration per child
- XP threshold customization
- In-app parent nudges
- Kid goal review + XP setting

### Phase 6 — Ship It *(1 session)*
- Supabase migration (localStorage → cloud)
- PWA configuration (installs on Galaxy Tab)
- Deploy to Vercel or Netlify
- Custom family URL

---

## 13. File Manifest

| File | Location | Purpose |
|---|---|---|
| `HABITPET_PROJECT_PLAN.md` | `/docs/` | This document |
| `habitpet-ai-prompt.js` | `/src/ai/` | AI system prompt builder — all modes, parent nudges, milestones |
| `habitpet-task-templates.js` | `/src/data/` | Complete task library, family pet roster, XP thresholds, helper functions |
| `habitpet-supabase-schema.sql` | `/supabase/migrations/` | Full production DB schema, RLS, indexes, seed data, dashboard views |

---

## 14. Claude Code Kickoff Prompt

Copy this to start Phase 1:

```
I'm building a family habit app called HabitPet. Here's the full context:

STACK: React + Vite + Tailwind CSS. Browser-first on a Galaxy Tab. localStorage now, Supabase later.

USERS: Multiple children (age brackets: 4–7, 8–12, 13+) + parent admin. Each child has a personal pet. Family shares a Family Pet.

PERSONAL PET OPTIONS: Dragon, Fox, Bunny, Owl, Puppy, Kitten, Hamster, Bee, Unicorn
FAMILY PET OPTIONS: Phoenix, Lizard, Capybara, Snow Leopard, Elephant, Whale, Red Panda, Otter, Manta Ray

FEEL: Playful + gamified (Tamagotchi meets Finch), with subtle Christian values (Fruits of the Spirit as character traits). Never preachy.

PHASE 1 GOALS:
1. Project scaffold with React + Vite + Tailwind
2. Home screen: animated Family Pet (CSS/emoji to start) + child profile tiles + parent lock icon
3. Child profile creation: name, age bracket, pet selection, optional PIN
4. Pet selection screen: all 9 personal pets displayed with personality descriptions
5. Family pet selection: all 9 family pets displayed
6. localStorage data layer using this schema: [paste schema from habitpet-supabase-schema.sql]
7. Navigation between home → child world → back

Reference files attached:
- habitpet-ai-prompt.js (AI system prompt builder — integrate in Phase 3)
- habitpet-task-templates.js (task library — integrate in Phase 2)
- habitpet-supabase-schema.sql (DB schema — use as localStorage shape now, Supabase later)

Start with the scaffold and home screen. Make it beautiful and touch-friendly for a 10-inch tablet.
```

---

## 15. Design Principles to Protect

As the project evolves, guard these principles above all else:

1. **Grace before guilt.** The app never shames. Missing a day is "not yet," not failure.
2. **The child is the hero.** Self-direction is always celebrated above compliance.
3. **The pet is a relationship.** Never reduce it to a reward widget.
4. **Parents support, they don't surveil.** The dashboard is coaching, not monitoring.
5. **Progress is permanent.** Kids never lose levels or pets. Renewal is always possible.
6. **Values are caught, not taught.** Faith shows up in *how* the app responds, not what it preaches.
7. **Small wins are real wins.** The app celebrates brushing teeth with the same genuine energy as a 30-day streak, scaled appropriately.

---

*Built with love for the [Family Name] family. May it help them grow.*
