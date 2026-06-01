-- ============================================================
-- HabitPet — Supabase Schema Migration
-- File: /supabase/migrations/001_habitpet_initial.sql
--
-- Run in Supabase SQL Editor or via: supabase db push
-- RLS (Row Level Security) policies included.
-- Designed to be a drop-in migration from localStorage.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────
-- FAMILIES
-- ────────────────────────────────────────────

CREATE TABLE families (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  parent_pin      TEXT NOT NULL,                    -- hashed PIN for parent dashboard
  timezone        TEXT DEFAULT 'America/Chicago',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- FAMILY PET
-- ────────────────────────────────────────────

CREATE TABLE family_pets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  pet_type        TEXT NOT NULL,                    -- 'phoenix', 'capybara', 'elephant', etc.
  pet_name        TEXT NOT NULL,
  xp              INTEGER DEFAULT 0,
  level           INTEGER DEFAULT 1,
  mood            TEXT DEFAULT 'happy',             -- 'thriving','happy','okay','tired','struggling'
  accessories     JSONB DEFAULT '[]',
  environment     TEXT DEFAULT 'meadow',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- CHILDREN
-- ────────────────────────────────────────────

CREATE TABLE children (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  age_bracket     TEXT NOT NULL CHECK (age_bracket IN ('4-7','8-12','13+')),
  pin             TEXT,                             -- optional PIN for older kids
  avatar_color    TEXT DEFAULT '#7DD3FC',
  interests       TEXT[] DEFAULT '{}',             -- ['soccer','music','coding',...]
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- CHILD PETS
-- ────────────────────────────────────────────

CREATE TABLE child_pets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  pet_type        TEXT NOT NULL,                   -- 'dragon','fox','bunny','owl','puppy','kitten','hamster','bee','unicorn'
  pet_name        TEXT NOT NULL,
  xp              INTEGER DEFAULT 0,
  level           INTEGER DEFAULT 1,
  mood            TEXT DEFAULT 'happy',
  accessories     JSONB DEFAULT '[]',
  room_theme      TEXT DEFAULT 'meadow',
  total_xp_earned INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- TASKS
-- ────────────────────────────────────────────

CREATE TABLE tasks (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id            UUID REFERENCES children(id) ON DELETE CASCADE,
  family_id           UUID REFERENCES families(id) ON DELETE CASCADE,
  template_id         TEXT,                         -- nullable for custom tasks
  title               TEXT NOT NULL,
  category            TEXT NOT NULL,                -- 'hygiene','chores','school','fitness','interests','character','family','reflection','kid_goal'
  frequency           TEXT NOT NULL DEFAULT 'daily', -- 'daily','weekday','weekly','as-needed'
  xp_value            INTEGER NOT NULL DEFAULT 15,
  icon                TEXT DEFAULT '⭐',
  requires_approval   BOOLEAN DEFAULT FALSE,
  check_in_windows    TEXT[] DEFAULT '{}',          -- ['wake_up','before_school','home','mid_afternoon','last_chance','bedtime']
  character_traits    TEXT[] DEFAULT '{}',
  skill_tree_node     TEXT,
  is_bonus            BOOLEAN DEFAULT FALSE,
  bonus_multiplier    NUMERIC DEFAULT 1.0,
  feeds_family_pet    BOOLEAN DEFAULT FALSE,
  family_pet_xp       INTEGER DEFAULT 0,
  is_kid_initiated    BOOLEAN DEFAULT FALSE,
  kid_initiated_bonus BOOLEAN DEFAULT FALSE,
  is_active           BOOLEAN DEFAULT TRUE,
  pending_parent_review BOOLEAN DEFAULT FALSE,
  parent_xp_override  INTEGER,                     -- parent can adjust kid-initiated XP
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- TASK COMPLETIONS
-- ────────────────────────────────────────────

CREATE TABLE task_completions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id         UUID REFERENCES tasks(id) ON DELETE CASCADE,
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  completed_at    TIMESTAMPTZ DEFAULT NOW(),
  check_in_window TEXT,                            -- which window it was completed in
  xp_awarded      INTEGER NOT NULL,
  approved_at     TIMESTAMPTZ,
  approved_by     TEXT,                            -- 'parent' or 'auto'
  streak_day      INTEGER DEFAULT 1,              -- what day of streak this was
  note_from_child TEXT                             -- optional child note/voice input
);

-- ────────────────────────────────────────────
-- STREAKS
-- ────────────────────────────────────────────

CREATE TABLE streaks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  task_id         UUID REFERENCES tasks(id) ON DELETE CASCADE,
  category        TEXT,                            -- can track category-level streaks too
  current_streak  INTEGER DEFAULT 0,
  longest_streak  INTEGER DEFAULT 0,
  last_completed  DATE,
  at_risk         BOOLEAN DEFAULT FALSE,           -- true if not yet completed today
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- BADGES & TRAITS
-- ────────────────────────────────────────────

CREATE TABLE badges (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  badge_type      TEXT NOT NULL,                   -- 'streak_7','trait_kindness','xp_500', etc.
  badge_label     TEXT NOT NULL,
  badge_icon      TEXT,
  earned_at       TIMESTAMPTZ DEFAULT NOW(),
  xp_bonus        INTEGER DEFAULT 0               -- some badges award bonus XP
);

CREATE TABLE character_trait_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  trait           TEXT NOT NULL,                  -- 'grit','kindness','faithfulness', etc.
  points          INTEGER DEFAULT 0,
  level           INTEGER DEFAULT 0,              -- 0=seed, 1=sprout, 2=growing, 3=flourishing, 4=mastered
  last_earned_at  TIMESTAMPTZ,
  UNIQUE(child_id, trait)
);

-- ────────────────────────────────────────────
-- SKILL TREE PROGRESS (future phase)
-- ────────────────────────────────────────────

CREATE TABLE skill_tree_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  node_id         TEXT NOT NULL,                  -- 'BASIC_HYGIENE','HOMEWORK_HABIT', etc.
  completions     INTEGER DEFAULT 0,
  unlocked        BOOLEAN DEFAULT FALSE,
  unlocked_at     TIMESTAMPTZ,
  UNIQUE(child_id, node_id)
);

-- ────────────────────────────────────────────
-- CONVERSATIONS (AI chat history)
-- ────────────────────────────────────────────

CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  mode            TEXT NOT NULL,                  -- 'morning_nudge','free_chat','weekly_reflection', etc.
  check_in_window TEXT,
  messages        JSONB DEFAULT '[]',             -- [{role:'user'|'assistant', content, timestamp}]
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  notable_shown   JSONB                           -- { text, source, category } if a notable was surfaced
);

-- ────────────────────────────────────────────
-- WEEKLY REFLECTIONS
-- ────────────────────────────────────────────

CREATE TABLE weekly_reflections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE,
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  week_start      DATE NOT NULL,                  -- Sunday of that week
  week_end        DATE NOT NULL,                  -- Saturday
  stats           JSONB NOT NULL,                 -- { tasksCompleted, totalXP, topStreak, topCategory, etc. }
  pet_report_text TEXT,                           -- AI-generated report (Phase 1 of reflection)
  child_response  TEXT,                           -- Child's typed/voice response
  reframe_text    TEXT,                           -- AI-generated growth mindset reframe
  completed_at    TIMESTAMPTZ,
  nudge_sent_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- XP THRESHOLDS (parent-configurable)
-- ────────────────────────────────────────────

CREATE TABLE xp_thresholds (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE, -- null = applies to all kids
  xp_amount       INTEGER NOT NULL,
  label           TEXT NOT NULL,
  reward_text     TEXT,
  icon            TEXT DEFAULT '🏆',
  is_active       BOOLEAN DEFAULT TRUE,
  triggered_at    TIMESTAMPTZ,                    -- null if not yet reached
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- PARENT NOTIFICATIONS / NUDGES
-- ────────────────────────────────────────────

CREATE TABLE parent_nudges (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  child_id        UUID REFERENCES children(id),   -- null for family-wide nudges
  nudge_type      TEXT NOT NULL,                  -- 'STREAK_AT_RISK','MISSED_3_DAYS','NEW_KID_GOAL', etc.
  message         TEXT NOT NULL,
  issue_data      JSONB,                          -- context for the nudge
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  read_at         TIMESTAMPTZ
);

-- ────────────────────────────────────────────
-- NOTABLES (future phase — Bible verses, quotes, trivia)
-- ────────────────────────────────────────────

CREATE TABLE notables (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id       UUID REFERENCES families(id),   -- null = global/default set
  category        TEXT NOT NULL,                  -- 'bible_verse','stoic_quote','history_trivia','science_trivia'
  text            TEXT NOT NULL,
  source          TEXT,                           -- 'John 3:16', 'Marcus Aurelius', etc.
  age_brackets    TEXT[] DEFAULT '{4-7,8-12,13+}',
  tags            TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- CELEBRATION EMOTES (future phase)
-- ────────────────────────────────────────────

CREATE TABLE emotes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id       UUID REFERENCES families(id),   -- null = global/earned
  child_id        UUID REFERENCES children(id),   -- null = all children
  emote_key       TEXT NOT NULL,
  emote_label     TEXT NOT NULL,
  emote_asset_url TEXT,
  unlock_method   TEXT DEFAULT 'earned',          -- 'earned','purchased','promoted','default'
  unlock_condition JSONB,                         -- { type:'xp_threshold', value: 500 }
  unlocked_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────

CREATE INDEX idx_tasks_child_id ON tasks(child_id);
CREATE INDEX idx_tasks_family_id ON tasks(family_id);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_completions_child_id ON task_completions(child_id);
CREATE INDEX idx_completions_completed_at ON task_completions(completed_at);
CREATE INDEX idx_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_streaks_child_id ON streaks(child_id);
CREATE INDEX idx_traits_child_id ON character_trait_progress(child_id);
CREATE INDEX idx_conversations_child_id ON conversations(child_id);
CREATE INDEX idx_reflections_child_family ON weekly_reflections(child_id, family_id);
CREATE INDEX idx_nudges_family_id ON parent_nudges(family_id);
CREATE INDEX idx_nudges_unread ON parent_nudges(family_id, is_read) WHERE is_read = FALSE;

-- ────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- (Enable after setting up Supabase Auth)
-- ────────────────────────────────────────────

ALTER TABLE families                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_pets              ENABLE ROW LEVEL SECURITY;
ALTER TABLE children                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_pets               ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_trait_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_tree_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reflections       ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_thresholds            ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_nudges            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notables                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotes                   ENABLE ROW LEVEL SECURITY;

-- Basic RLS: family members can only see their own family's data
-- (Expand these policies once Supabase Auth is wired up)

CREATE POLICY "Family can access own data" ON families
  FOR ALL USING (auth.uid()::TEXT = id::TEXT);

CREATE POLICY "Family access: children" ON children
  FOR ALL USING (
    family_id IN (SELECT id FROM families WHERE auth.uid()::TEXT = id::TEXT)
  );

CREATE POLICY "Family access: tasks" ON tasks
  FOR ALL USING (
    family_id IN (SELECT id FROM families WHERE auth.uid()::TEXT = id::TEXT)
  );

CREATE POLICY "Family access: completions" ON task_completions
  FOR ALL USING (
    family_id IN (SELECT id FROM families WHERE auth.uid()::TEXT = id::TEXT)
  );

-- ────────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_families_updated_at
  BEFORE UPDATE ON families FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_child_pets_updated_at
  BEFORE UPDATE ON child_pets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_family_pets_updated_at
  BEFORE UPDATE ON family_pets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────
-- SEED DATA: Default XP Thresholds
-- ────────────────────────────────────────────

-- These get seeded per-family on signup, referencing this as a template
CREATE TABLE default_xp_thresholds (
  xp_amount  INTEGER PRIMARY KEY,
  label      TEXT NOT NULL,
  reward     TEXT,
  icon       TEXT
);

INSERT INTO default_xp_thresholds VALUES
  (100,  'First Century',   'Unlock a new pet accessory',              '🎖️'),
  (250,  'Building Steam',  'Pet room decoration unlock',              '⭐'),
  (500,  'Halfway Hero',    'Choose a special family activity',        '🏆'),
  (1000, 'Four Digits',     'Customize your pet''s name',              '👑'),
  (2500, 'Grind Master',    'Unlock a rare pet accessory',             '💎'),
  (5000, 'Habit Legend',    'Family celebration (you define it!)',     '🌟');

-- ────────────────────────────────────────────
-- SEED DATA: Streak Thresholds
-- ────────────────────────────────────────────

CREATE TABLE streak_thresholds (
  days        INTEGER PRIMARY KEY,
  label       TEXT NOT NULL,
  trait       TEXT,
  icon        TEXT,
  xp_bonus    INTEGER DEFAULT 0
);

INSERT INTO streak_thresholds VALUES
  (3,   '3-Day Spark',     'faithfulness', '🔥', 10),
  (7,   '1-Week Warrior',  'grit',         '⚔️', 25),
  (14,  'Two-Week Titan',  'self_control', '🛡️', 50),
  (30,  'Month of Might',  'ambition',     '🏔️', 100),
  (100, 'Century Club',    'faithfulness', '💯', 300);

-- ────────────────────────────────────────────
-- localStorage → Supabase Migration Helper
-- ────────────────────────────────────────────
-- Run this migration function from your app to move
-- existing localStorage data into Supabase on first login.
--
-- In your app (/src/utils/migrateToSupabase.js):
--
-- export async function migrateLocalStorageToSupabase(supabase) {
--   const localData = JSON.parse(localStorage.getItem('habitpet_data') || '{}');
--   if (!localData.familyId) return; // nothing to migrate
--
--   // 1. Create family
--   const { data: family } = await supabase.from('families').insert({...}).select().single();
--
--   // 2. Create children + pets
--   for (const child of localData.children) { ... }
--
--   // 3. Migrate tasks, completions, streaks
--   // 4. Set migrated flag in localStorage
--   localStorage.setItem('habitpet_migrated', 'true');
-- }
--
-- See /docs/migration-guide.md for full implementation.
-- ────────────────────────────────────────────

-- ────────────────────────────────────────────
-- VIEWS (useful for parent dashboard)
-- ────────────────────────────────────────────

-- Daily summary per child
CREATE VIEW child_daily_summary AS
SELECT
  c.id AS child_id,
  c.name AS child_name,
  c.family_id,
  COUNT(DISTINCT t.id) AS total_tasks_today,
  COUNT(DISTINCT tc.task_id) AS completed_tasks_today,
  COALESCE(SUM(tc.xp_awarded), 0) AS xp_earned_today,
  ROUND(
    COUNT(DISTINCT tc.task_id)::NUMERIC /
    NULLIF(COUNT(DISTINCT t.id), 0) * 100
  ) AS completion_pct_today
FROM children c
LEFT JOIN tasks t ON t.child_id = c.id AND t.is_active = TRUE
LEFT JOIN task_completions tc
  ON tc.task_id = t.id
  AND tc.completed_at::DATE = CURRENT_DATE
GROUP BY c.id, c.name, c.family_id;

-- Weekly summary per child
CREATE VIEW child_weekly_summary AS
SELECT
  c.id AS child_id,
  c.name AS child_name,
  c.family_id,
  COUNT(DISTINCT tc.id) AS completions_this_week,
  COALESCE(SUM(tc.xp_awarded), 0) AS xp_this_week,
  COUNT(DISTINCT CASE WHEN t.is_kid_initiated THEN tc.id END) AS kid_goal_completions,
  MAX(s.current_streak) AS longest_active_streak
FROM children c
LEFT JOIN task_completions tc
  ON tc.child_id = c.id
  AND tc.completed_at >= DATE_TRUNC('week', CURRENT_DATE)
LEFT JOIN tasks t ON t.id = tc.task_id
LEFT JOIN streaks s ON s.child_id = c.id
GROUP BY c.id, c.name, c.family_id;

-- Family pet health view
CREATE VIEW family_pet_health AS
SELECT
  fp.family_id,
  fp.pet_name,
  fp.pet_type,
  fp.xp,
  fp.level,
  fp.mood,
  COALESCE(SUM(tc.xp_awarded), 0) AS family_xp_today,
  COUNT(DISTINCT tc.child_id) AS kids_contributed_today
FROM family_pets fp
LEFT JOIN task_completions tc
  ON tc.family_id = fp.family_id
  AND tc.completed_at::DATE = CURRENT_DATE
GROUP BY fp.family_id, fp.pet_name, fp.pet_type, fp.xp, fp.level, fp.mood;
