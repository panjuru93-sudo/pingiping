# 디자인 시스템

## 색상 팔레트

### Primary Colors
- Primary Main: `#1976d2` (MUI Blue)
- Primary Light: `#42a5f5`
- Primary Dark: `#1565c0`

### Secondary Colors
- Secondary Main: `#dc004e` (MUI Pink)
- Secondary Light: `#ff5983`
- Secondary Dark: `#9a0036`

### Neutral Colors
- Background: `#ffffff`
- Surface: `#f5f5f5`
- Text Primary: `rgba(0, 0, 0, 0.87)`
- Text Secondary: `rgba(0, 0, 0, 0.6)`

## 타이포그래피

- Font Family: `"Roboto", "Helvetica", "Arial", sans-serif`
- h1: 2.125rem / 500 weight
- h2: 1.5rem / 500 weight
- h3: 1.25rem / 500 weight
- body1: 1rem / 400 weight
- body2: 0.875rem / 400 weight

## 간격 (Spacing)
- 기본 단위: 8px
- xs: 4px (0.5 * 8)
- sm: 8px (1 * 8)
- md: 16px (2 * 8)
- lg: 24px (3 * 8)
- xl: 32px (4 * 8)

## 컴포넌트 원칙
- MUI 컴포넌트 우선 사용
- 커스텀 스타일은 `sx` prop 또는 `styled()` 사용
- 반응형 디자인 기본 적용 (xs, sm, md, lg, xl)

## 아이콘
- @mui/icons-material 패키지 사용
- 아이콘 크기: small(20px), medium(24px), large(36px)
