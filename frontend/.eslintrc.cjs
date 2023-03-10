/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsConfigRootDir: '.',
  },
  ignorePatterns: ['node_modules/', 'vite.config.js'],
  plugins: ['@typescript-eslint', 'jsx-a11y', 'react-hooks', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

module.exports = config;
