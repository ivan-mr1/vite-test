import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';

const ignores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/*.log',
  '**/npm-debug.log*',
  '**/.git/**',
  '**/.idea/**',
  '**/.vscode/**',
  '**/.DS_Store',
  'postcss.config.js',
  'vite.config.js',
  // '**/vite-plugins/**',
];

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores,
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'off',
      eqeqeq: 'warn',
      curly: 'warn',
      'no-else-return': 'warn',
      'no-unused-vars': 'warn',
    },
  },
]);
