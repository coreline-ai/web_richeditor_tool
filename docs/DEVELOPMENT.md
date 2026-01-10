# 개발 가이드 (Development Guide)

본 문서는 프로젝트의 설치, 실행, 빌드 및 배포 방법을 안내합니다.

## 1. 사전 요구사항 (Prerequisites)
- **Node.js**: v18.17.0 이상 (Next.js 14 요구사항)
- **npm** 또는 **yarn**, **pnpm** (본 가이드는 npm 기준)
- **Git**

## 2. 프로젝트 설치 (Installation)

저장소를 클론하고 의존성을 설치합니다.

```bash
# 저장소 클론
git clone <repository_url>
cd web_richeditor_tool

# 의존성 설치
npm install
```

## 3. 개발 서버 실행 (Development)

로컬 개발 서버를 실행합니다.

```bash
npm run dev
```
- 실행 후 [http://localhost:3000](http://localhost:3000) 접속
- `src/app/page.tsx` 수정 시 실시간 반영 (HMR)

## 4. 빌드 및 시작 (Build & Start)

프로덕션용 빌드를 생성하고 실행합니다.

```bash
# 빌드 생성
npm run build

# 프로덕션 서버 시작
npm start
```
- 빌드 결과물은 `.next` 디렉토리에 생성됩니다.

## 5. 주요 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (디버그 모드) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint를 통한 코드 검사 |

## 6. 환경 변수 설정 (.env.local)

필요한 경우 루트 디렉토리에 `.env.local` 파일을 생성하여 환경 변수를 설정합니다.
현재 버전에서는 필수 환경 변수가 없으나, 추후 외부 스토리지(S3 등) 연동 시 사용됩니다.

```env
# 예시
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
```

## 7. 문제 해결 (Troubleshooting)

### 이미지 업로드 실패 (400/500 Error)
- `public/uploads` 디렉토리가 존재하는지 확인하세요. (없을 경우 자동 생성 로직 필요)
- 파일 쓰기 권한이 있는지 확인하세요.

### TipTap 에디터 하이드레이션 오류
- Next.js SSR 환경에서 TipTap 렌더링 시 `useEffect` 내부에서 로드되거나 `ssr: false` 동적 임포트를 사용해야 합니다.
```tsx
const Editor = dynamic(() => import('./TipTapEditor'), { ssr: false })
```
