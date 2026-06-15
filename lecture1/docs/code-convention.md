# 코드 컨벤션

## 파일 및 폴더 명명 규칙

### 컴포넌트 파일
- PascalCase 사용: `MyComponent.jsx`
- 폴더명은 camelCase: `components/myFeature/`

### 유틸리티 파일
- camelCase 사용: `useMyHook.js`, `myUtil.js`

### 상수 파일
- UPPER_SNAKE_CASE: `API_CONSTANTS.js`

## 컴포넌트 작성 규칙

### 함수형 컴포넌트 사용
```jsx
// Good
const MyComponent = ({ title, children }) => {
  return <div>{title}</div>;
};

export default MyComponent;
```

### Props 구조분해할당
```jsx
// Good
const Button = ({ label, onClick, variant = 'contained' }) => {
  return <MuiButton variant={variant} onClick={onClick}>{label}</MuiButton>;
};
```

## Import 순서
1. React 및 React 관련 패키지
2. 외부 라이브러리 (MUI, React Router 등)
3. 내부 컴포넌트
4. 유틸리티 / 훅
5. 스타일 / 에셋

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import MyComponent from './MyComponent';
import { useMyHook } from '../hooks/useMyHook';
```

## 상태 관리
- 로컬 상태: `useState`
- 사이드 이펙트: `useEffect`
- 전역 상태: Context API 또는 별도 상태 관리 라이브러리

## CSS / 스타일링
- MUI `sx` prop 우선 사용
- 인라인 스타일 최소화
- 전역 스타일은 theme.js에서 관리

## 주석
- 복잡한 로직에만 주석 작성
- JSDoc 형식 사용 지양 (TypeScript 미사용 시)
- 코드가 자체 설명되도록 변수명 명확하게 작성
