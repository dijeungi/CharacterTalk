import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier'; // Prettier 설정 추가

export default [
  { ignores: ['dist'] }, // 'dist' 폴더는 ESLint 검사를 무시
  {
    files: ['**/*.{js,jsx}'], // 검사 대상 파일들 (JavaScript 및 JSX 파일)
    languageOptions: {
      ecmaVersion: 2020, // ECMAScript 2020 문법 지원
      globals: globals.browser, // 브라우저 환경 전역 변수를 허용
      parserOptions: {
        ecmaVersion: 'latest', // 최신 ECMAScript 문법 지원
        ecmaFeatures: { jsx: true }, // JSX 문법을 허용 (React에서 사용)
        sourceType: 'module', // ECMAScript 모듈(ESM) 사용
      },
    },
    settings: { react: { version: '18.3' } }, // React 버전 자동 감지
    plugins: {
      react, // React 관련 ESLint 규칙 적용
      'react-hooks': reactHooks, // React Hooks 관련 규칙 적용
      'react-refresh': reactRefresh, // React Fast Refresh 관련 규칙 적용
      prettier: prettierPlugin, // Prettier 플러그인 추가
    },
    rules: {
      ...js.configs.recommended.rules, // ESLint 기본 권장 규칙 적용
      ...react.configs.recommended.rules, // React 권장 규칙 적용
      ...reactHooks.configs.recommended.rules, // React Hooks 권장 규칙 적용
      'react/jsx-no-target-blank': 'off', // target="_blank" 보안 경고 비활성화
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ], // React Fast Refresh 관련: 컴포넌트만 export하도록 경고
      'no-unused-vars': 'off', // 미사용 변수 경고 비활성화
      'react/prop-types': 'off', // PropTypes 사용 강제 비활성화
      'prettier/prettier': 'error', // Prettier 규칙 위반 시 에러 처리
      ...prettierConfig.rules, // Prettier 규칙 적용 (eslint-config-prettier)
    },
  },
];