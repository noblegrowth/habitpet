# HabitPet — Mascot & Visual Design System

> **Style name: "Cozy Craft Stop-Motion" (Needle-Felted Diorama)**
> Source: owner's design brief (2026-06-01). This is the canonical visual
> direction. All animals, scenes, backgrounds, and overall feel conform to it.

---

## I. Core Aesthetic

- **Audience:** kids (and parents) using a gamified habit/chore app.
- **Vibe:** warm, tactile, comforting, nostalgic, high-quality. Premium modern
  mobile app × classic Aardman stop-motion film.
- **Materiality:** every character and prop looks like a *physical object made of
  tightly needle-felted wool* — micro-fuzz, stray fibers catching light, soft
  **matte** finish. **No glossy / plastic / smooth-CGI surfaces.**
- **Lighting:** miniature photography studio. Soft, warm, directional light;
  gentle ambient-occlusion contact shadows.
- **Environment:** clean, slightly textured **off-white seamless paper / soft
  cloth** backdrop. Subject stays the focus.
- **Proportions:** slightly exaggerated, chibi-adjacent (larger heads), warm
  shiny-but-not-glassy dark button eyes, soft rounded edges.
- **Motion:** "on twos" — slightly stepped, like claymation. Characters read as
  having weight and physical presence even when still.

### Code translation (the parts we build in CSS/React)
| Brief | Implementation |
|---|---|
| Off-white seamless paper | warm paper background + subtle SVG grain (`WorldScene`) |
| Matte, no gloss | flat fills; removed radial gloss & shimmer |
| Ambient-occlusion shadows | soft warm low-opacity shadows + contact shadow under subjects |
| Wool palette | Tailwind tokens remapped to muted warm wool tones (`tailwind.config.js`) |
| "On twos" motion | stepped keyframes (`step-end`) — `animate-felt-idle` / `animate-felt-hop` |
| Weight / presence | elliptical contact shadow beneath each pet |

---

## II. Pose Structure (every character needs all three)

1. **Face Icon** — centered, symmetrical close-up headshot. Avatars, tiny UI,
   app icon. Welcoming, direct expression.
2. **Active / Task Pose** — full body, dynamic, mid-action with a habit prop
   (felt clipboard + checkmark, glowing felt stars, pencil). Rewards, level-ups,
   notifications.
3. **Contextual / Diorama** — mini-scene in the character's natural element with
   environmental props. Character-selection screens, home-base habitats.

---

## III. Character Roster (Family Pets)

These map 1:1 to `FAMILY_PET_OPTIONS` in `src/data/habitpet-task-templates.js`
(the brief's names are the existing `defaultName`s).

| Pet ID | Name | Personality (represents) | Face | Active | Contextual |
|---|---|---|---|---|---|
| `phoenix` | **Ember** | Warm, protective; rebirth / trying again tomorrow | Intense-but-friendly gaze; warm red→orange→yellow wool | Wings spread, presenting glowing felt stars + checklist | Curled in a cozy felt stone cave warming a patterned felt egg |
| `lizard` | **Sunny** | Energetic, light-seeking; morning routines | Wide happy eyes; lime green w/ darker speckles | On hind legs, tail curled, winking, placing a star sticker | Sunbathing on a felt cushion/rock under a tiny felt sun |
| `capybara` | **Capy** | Calm, unflappable; mindfulness, frictionless routines | Placid; warm heavily-textured brown wool | Standing sturdy, neat stack of felt books on head | Soaking in a felt hot spring w/ floating felt orange slices + lily pads |
| `snow_leopard` | **Storm** | Regal, agile, goal-oriented; focus, hard challenges | Striking blue eyes; white/grey w/ felted dark rosettes | Mid-pounce over a small brick wall holding a task scroll | Atop a snowy felt mountain peak surveying the landscape |
| `elephant` | **Titan** | Gentle, strong, supportive; memory, reliability | Floppy ears, soft grey, curled trunk | Standing proud, holding a clipboard with the trunk | Beneath a lush felt banyan tree w/ a tiny pink butterfly |
| `whale` | **Atlas** | Deep, steady, vast; long-term consistency | Round squishy blue-grey top, ribbed white belly, minimal features | Breaching out of felt water ripples, balancing stars on nose | Swimming by a felt lighthouse; stitched constellation behind |
| `red_panda` | **Roo** | Playful, mischievous; making chores fun | Pointy ears, white face markings on rusty red, cheeky smile | One leg, arms outstretched, holding a clipboard | Hanging upside-down by tail from felt bamboo w/ lantern + checklist |
| `otter` | **Pip** | Detail-oriented, neat, industrious; organizing, systems | Sleek brown, rounded nose, eager bright eyes | Floating on back, balancing clipboard + star on tummy | On a riverbank arranging felt pebbles into a spiral maze |
| `manta_ray` | **Ray** | Guide, explorer, smooth; flow state, navigating schedules | Flat wide dark-blue top, white underside, side eyes | Gliding, clipboard on one wing, through a felt current | Gliding through an ocean diorama w/ compass, guiding baby felt sea turtles |

### Personal Pets (one per child)
`dragon, fox, bunny, owl, puppy, kitten, hamster, bee, unicorn`
(`PERSONAL_PET_OPTIONS` in `src/data/pets.js`). Same felted style + 3 poses.
Per-character diorama profiles **TBD** — to be written in the same format as above.

---

## IV. Asset Production Spec (drop-in pipeline)

The app auto-loads felted art when files are present; until then it shows a
matte emoji placeholder in a felt frame. **No code change needed to add art —
just drop correctly-named files in `src/assets/pets/`.**

- **Path:** `src/assets/pets/`
- **Filename:** `{petId}-{pose}.png` where `pose ∈ {face, active, contextual}`
  - e.g. `phoenix-face.png`, `phoenix-active.png`, `phoenix-contextual.png`
  - personal pets too: `dragon-face.png`, …
- **Format:** PNG, **transparent background** (the diorama backdrop is drawn by
  the app), trimmed to the subject.
- **Recommended size (2× for retina):**
  - face: 512×512 (square, centered)
  - active: 768×768
  - contextual: 1024×768
- **Look:** matte felted wool, soft studio key light from upper-left, gentle
  contact shadow baked OUT (app adds the floor shadow), dark button eyes.

> Producing the renders is an art/image-generation task outside the code agent's
> scope. This spec exists so they integrate with zero rework.

---

## V. Implementation Status

- [x] Design system documented (this file)
- [x] Visual skin: wool palette, paper backdrop, matte surfaces, AO shadows
- [x] Stop-motion ("on twos") idle motion on pets
- [x] Asset-ready `PetAvatar` (pose-aware, auto-loads `src/assets/pets/*`, emoji fallback)
- [ ] Felted character renders (3 poses × 18 pets) — awaiting art assets
- [ ] Per-character personal-pet diorama profiles
- [ ] Lottie/sprite upgrade for true frame-stepped animation (Phase 4)
