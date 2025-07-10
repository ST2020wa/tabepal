// backend/eslint.config.js
import js from '@eslint/js'

export default [
  { ignores: ['node_modules', 'dist'] },
  {
    extends: [js.configs.recommended],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
]