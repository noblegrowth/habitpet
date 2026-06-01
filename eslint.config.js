import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Reference artifacts wired up in later phases. Their conversation-mode
    // builders destructure a full input contract; not every field is used yet.
    files: ['src/ai/**/*.{js,jsx}'],
    rules: { 'no-unused-vars': 'off' },
  },
  {
    // Vitest globals (describe/it/expect) in test files.
    files: ['**/*.{test,spec}.{js,jsx}'],
    languageOptions: { globals: { ...globals.node } },
  },
])
