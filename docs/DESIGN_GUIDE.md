# 디자인 가이드 (Design Guide)

본 문서는 `Next.js + TipTap Markdown Editor`의 시각적 디자인 시스템과 컴포넌트 스타일 가이드를 정의합니다.
개발자와 디자이너 간의 협업 기준 문서로 사용됩니다.

---

## 1. 디자인 원칙 (Design Principles)

1.  **Content First**: 편집기의 본질은 글쓰기입니다. UI는 콘텐츠를 방해하지 않아야 합니다.
2.  **Clean & Minimal**: 불필요한 장식을 배제하고, 직관적인 아이콘과 여백을 활용합니다.
3.  **Visual Feedback**: 사용자의 모든 액션(클릭, 드래그, 타이핑)에 명확한 시각적 피드백을 제공합니다.

---

## 2. 컬러 시스템 (Color System)

Tailwind CSS 색상 팔레트 기준을 권장합니다.

### 2.1 Primary (브랜드 컬러)
- **Primary-500 (#3B82F6)**: 주요 버튼, 활성 상태 아이콘, 포커스 링
- **Primary-600 (#2563EB)**: Primary Hover 상태
- **Primary-50 (#EFF6FF)**: 활성 상태 배경 (Light)

### 2.2 Neutral (그레이 스케일)
- **Neutral-900 (#171717)**: 기본 텍스트 (Title, Body)
- **Neutral-500 (#737373)**: 보조 텍스트, 비활성 아이콘
- **Neutral-200 (#E5E5E5)**: 경계선 (Border)
- **Neutral-100 (#F5F5F5)**: 배경 (Toolbar Background, Area Background)
- **White (#FFFFFF)**: 컴포넌트 배경

### 2.3 Semantic (상태 컬러)
- **Error (#EF4444)**: 오류 메시지, 삭제 버튼
- **Success (#22C55E)**: 업로드 성공, 저장 완료
- **Warning (#F59E0B)**: 주의 사항

---

## 3. 타이포그래피 (Typography)

### 3.1 Font Family
- **UI & Body**: `Pretendard`, `Inter`, system-ui
- **Code & Markdown**: `JetBrains Mono`, `Fira Code`, monospace

### 3.2 Scale
| 역할 | Size | Weight | Line Height | 비고 |
| --- | --- | --- | --- | --- |
| **Heading 1** | 24px (1.5rem) | Bold (700) | 1.3 | 에디터 내 H1 |
| **Heading 2** | 20px (1.25rem) | Bold (700) | 1.35 | 에디터 내 H2 |
| **Heading 3** | 18px (1.125rem) | SemiBold (600) | 1.4 | 에디터 내 H3 |
| **Body** | 16px (1rem) | Regular (400) | 1.6 | 본문 텍스트 |
| **Small** | 14px (0.875rem) | Medium (500) | 1.5 | 툴팁, 도움말 |
| **Code** | 14px (0.875rem) | Regular (400) | 1.6 | 코드블럭 |

---

## 4. 컴포넌트 디자인 (Component Design)

### 4.1 툴바 (Toolbar)
- **Container**:
  - Height: 48px ~ 56px
  - Background: Neutral-50 (#F8FAFC)
  - Border-Bottom: 1px solid Neutral-200
  - Padding: 0 16px
  - Flexbox: `gap-2`, `items-center`
  - Sticky Position: 상단 고정 (z-index: 50)

- **Toolbar Button**:
  - Size: 32px x 32px (Icon Button)
  - Border-Radius: 4px (Rounded)
  - **State: Default**:
    - Color: Neutral-600
    - Background: Transparent
  - **State: Hover**:
    - Background: Neutral-200
    - Color: Neutral-900
  - **State: Active (IsActive)**:
    - Background: Primary-100
    - Color: Primary-600
  - **State: Disabled**:
    - Opacity: 0.5
    - Cursor: not-allowed

### 4.2 에디터 영역 (Editor Area)
- **Container**:
  - Min-Height: 500px
  - Background: White
  - Padding: 24px 32px
  - Typography Plugin 적용 (`prose`, `prose-slate`)
- **Focus**:
  - Outline: None (내부 텍스트에 집중)
- **Placeholder**:
  - Color: Neutral-400
  - Content: "내용을 입력하세요..."

### 4.3 Markdown 뷰어/에디터 (Right/Bottom Pane)
- **Container**:
  - Background: Neutral-50 (#F8FAFC)
  - Border-Left: 1px solid Neutral-200 (Desktop 기준)
  - Padding: 24px
  - Font-Family: Monospace
- **Textarea**:
  - Width: 100%
  - Height: 100%
  - Background: Transparent
  - Border: None
  - Resize: None
  - Outline: None

### 4.4 코드블럭 (Code Block)
- **Style**:
  - Background: #0D1117 (Dark Theme 권장)
  - Text Color: #E6EDF3
  - Border-Radius: 6px
  - Padding: 12px 16px
  - Font-Family: Monospace
- **Syntax Highlighting**:
  - `lowlight` 기본 테마 또는 GitHub Dark Dimmed 테마 적용

### 4.5 이미지 (Image)
- **Style**:
  - Max-Width: 100%
  - Border-Radius: 4px
  - Margin: 16px 0
- **Focused (Selected)**:
  - Border: 2px solid Primary-500
  - Overlay: 선택 시 리사이즈 핸들 표시 (Optional)

---

## 5. 레이아웃 (Layout)

### 5.1 Desktop ( > 768px )
- **Split View**:
  - 좌측: Rich Editor (50%)
  - 우측: Markdown Source (50%)
  - 중앙 구분선: 1px solid Neutral-200

### 5.2 Mobile ( <= 768px )
- **Stack View**:
  - 상단: Toolbar (Sticky)
  - 중단: Rich Editor (Min-Height 300px)
  - 하단: Markdown Source (Min-Height 200px)
  - 구분: 두 영역 사이 8px Gap 또는 Divider

---

## 6. 아이콘 (Icons)

- **Library**: `Lucide React` 또는 `Material Symbols Rounded` 권장
- **Size**: 20px (Button 내부)
- **Stroke Width**: 2px (Lucide 기준)

| 기능 | 아이콘 명(Lucide 예시) |
| --- | --- |
| Bold | `Bold` |
| Italic | `Italic` |
| Strike | `Strikethrough` |
| H1 | `Heading1` |
| H2 | `Heading2` |
| Bullet List | `List` |
| Ordered List | `ListOrdered` |
| Blockquote | `Quote` |
| Code Block | `Code` |
| Image | `Image` |
| Undo | `Undo` |
| Redo | `Redo` |
