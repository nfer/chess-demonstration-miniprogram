module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/member-ordering': 'error',
    'react/jsx-filename-extension': 'off',
    'no-underscore-dangle': 'error',
    'no-console': 'error',
  },
  overrides: [{
    files: [
      'miniprogram/pages/**/*.ts',
      'miniprogram/components/**/*.ts',
    ],
    rules: {
      'no-underscore-dangle': 'off',
    },
  }],
  globals: {
    App: true,
    Page: true,
    wx: true,
    getApp: true,
    IAppOption: true,
  },
};
