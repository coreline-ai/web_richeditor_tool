# 프로젝트 구조 (Project Structure)

본 문서는 `Next.js + TipTap 기반 Markdown 에디터`의 권장 폴더 구조를 정의합니다.
Next.js 14+ (App Router) 구조를 기반으로 합니다.

## 디렉토리 구조

```
/
├── .env.local                  # 환경 변수 (보안 주의)
├── .eslintrc.json              # ESLint 설정
├── .gitignore                  # Git 무시 목록
├── next.config.js              # Next.js 설정
├── package.json                # 의존성 및 스크립트 설정
├── tsconfig.json               # TypeScript 설정
├── public/                     # 정적 리소스
│   ├── uploads/                # 이미지 업로드 저장소 (로컬 개발용)
│   └── favicon.ico
├── src/
│   ├── app/                    # App Router 라우트
│   │   ├── api/                # API Routes
│   │   │   └── upload/         # 이미지 업로드 API (/api/upload)
│   │   │       └── route.ts
│   │   ├── layout.tsx          # Root Layout
│   │   ├── page.tsx            # 메인 페이지 (에디터 데모)
│   │   └── globals.css         # 전역 스타일
│   ├── components/             # 공용 컴포넌트
│   │   ├── editor/             # 에디터 관련 컴포넌트
│   │   │   ├── TipTapEditor.tsx # TipTap 에디터 코어
│   │   │   ├── Toolbar.tsx     # 에디터 툴바
│   │   │   └── extensions/     # 커스텀 확장 기능
│   │   │       └── ImageUpload.ts
│   │   └── ui/                 # UI 컴포넌트 (버튼, 입력 필드 등)
│   │       ├── Button.tsx
│   │       └── Dialog.tsx
│   ├── lib/                    # 유틸리티 및 라이브러리 설정
│   │   ├── utils.ts            # 공용 유틸리티 함수
│   │   └── hooks/              # 커스텀 훅
│   │       └── useStorage.ts
│   └── types/                  # 타입 정의
│       └── editor.d.ts
└── docs/                       # 프로젝트 문서 (본 디렉토리)
    ├── README.md
    ├── GRD.md
    ├── TRD.md
    └── ...
```

## 주요 디렉토리 설명

### `src/app`
- Next.js의 App Router의 라우팅 처리 디렉토리입니다.
- `page.tsx`: 각 경로의 UI를 정의합니다.
- `route.ts`: API 엔드포인트를 정의합니다.

### `src/components/editor`
- TipTap 에디터와 관련된 핵심 로직이 위치합니다.
- `TipTapEditor.tsx`: `useEditor` 훅을 초기화하고 에디터 인스턴스를 관리합니다.
- `Toolbar.tsx`: 에디터 상단의 툴바 UI를 담당합니다.

### `public/uploads`
- `TRD.md`에 정의된 로컬 파일 저장소 경로입니다.
- 개발 환경에서 업로드된 이미지가 이곳에 저장됩니다.
- 운영 배포 시에는 `.gitignore`에 포함하거나 S3 등 외부 스토리지로 교체해야 합니다.

## 파일 명명 규칙
- 컴포넌트 파일: PascalCase (예: `TipTapEditor.tsx`)
- 유틸리티/함수 파일: camelCase (예: `utils.ts`)
- 라우트 파일: Next.js 컨벤션 (소문자 `page.tsx`, `route.ts`)
