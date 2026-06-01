# Felted pet art drop folder

`PetAvatar` auto-loads any PNG here named `{petId}-{pose}.png`.

- **petId** — e.g. `phoenix`, `capybara`, `dragon`, `fox`, … (see `src/data/pets.js`
  and `FAMILY_PET_OPTIONS` in `src/data/habitpet-task-templates.js`)
- **pose** — `face` · `active` · `contextual`

Examples: `phoenix-face.png`, `phoenix-active.png`, `dragon-contextual.png`

Transparent background, trimmed to subject. See `docs/DESIGN_SYSTEM.md` §IV for
sizes and the felted-wool look. Until a file exists, the pet shows as a matte
emoji medallion fallback.
