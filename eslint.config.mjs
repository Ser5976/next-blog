import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/generated/**/*',
      '**/generated/**/*',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // Отключаем правило Next.js про img
      '@next/next/no-img-element': 'off',
      // Отключаем правило про alt атрибут
      'jsx-a11y/alt-text': 'off',
    },
  },
];

export default eslintConfig;
