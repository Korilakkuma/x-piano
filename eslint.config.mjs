import eslint from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  eslint.configs.recommended,
  {
    files: ['src/**/*.js', 'jest.config.mjs', 'webpack.config.mjs'],
    languageOptions: {
      'globals': {
        'XSound': 'readonly',
        'X': 'readonly'
      }
    },
    rules: {
      'default-param-last': 'off',
      'indent': [
        'error',
        2,
        {
          'ignoredNodes': ['TemplateLiteral'],
          'SwitchCase': 1
        }
      ],
      'key-spacing': 'off',
      'jsx-a11y/no-onchange': 'off',
      'no-case-declarations': 'off',
      'no-console': 'warn',
      'no-constant-condition': 'off',
      'no-else-return': 'error',
      'no-multi-spaces': 'off',
      'no-unneeded-ternary': 'off',
      'no-unused-vars': ['off', { 'vars': 'all', 'args': 'after-used' }],
      'no-use-before-define': 'off',
      'no-var': 'warn',
      'prefer-promise-reject-errors': 'off',
      'quotes': ['error', 'single'],
      'quote-props': 'off',
      'radix': 'warn',
      'semi': ['error', 'always'],
      'space-before-function-paren': 'off',
      'template-curly-spacing': 'off'
    }
  }
];
