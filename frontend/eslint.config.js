// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: ['.cache/', '.git/', '.github/', 'node_modules/'],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'prettier/prettier': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      prettier: prettierPlugin,
    },
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      'prettier/prettier': ['error', { parser: 'angular' }],
    },
  }
);
