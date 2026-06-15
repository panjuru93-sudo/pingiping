# 새 프로젝트 시작 가이드

## 템플릿에서 빠른 시작

`_template_settings` 폴더를 복사하여 새 프로젝트를 시작합니다.

```bash
# lecture1 디렉토리에서
cp -r _template_settings my-new-project
cd my-new-project
npm install  # node_modules가 없을 경우
npm run dev
```

## 포함된 패키지

| 패키지 | 버전 | 용도 |
|--------|------|------|
| react | ^19 | UI 라이브러리 |
| react-dom | ^19 | React DOM |
| react-router-dom | ^7 | 라우팅 |
| @mui/material | ^9 | UI 컴포넌트 |
| @emotion/react | ^11 | CSS-in-JS |
| @emotion/styled | ^11 | Styled 컴포넌트 |
| @mui/icons-material | ^9 | MUI 아이콘 |
| @fontsource/roboto | ^5 | Roboto 폰트 |

## 프로젝트 구조

```
my-project/
├── src/
│   ├── components/     # 재사용 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── utils/          # 유틸리티 함수
│   ├── theme.js        # MUI 테마 설정
│   ├── main.jsx        # 앱 진입점
│   └── App.jsx         # 루트 컴포넌트
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 개발 서버 실행

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## MUI 테마 커스터마이징

`src/theme.js`에서 색상, 타이포그래피, 간격 등을 수정합니다.
자세한 내용은 `@docs/design-system.md` 참조.

## 라우팅 설정

`src/App.jsx`에서 React Router를 설정합니다.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```
