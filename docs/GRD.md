# 기능 요구서
프로젝트명: Next.js + TipTap 기반 Markdown 에디터

## 1. 문서 목적
본 문서는 Next.js(App Router)와 TipTap을 사용하여 구현한
웹 기반 Markdown 에디터의 기능 요구사항을 정의한다.
에디터는 리치 편집 기능을 제공하되,
최종 저장 결과는 항상 Markdown 파일 형식을 유지하는 것을 목표로 한다.

---

## 2. 시스템 개요

### 2.1 기술 스택
- Frontend: Next.js (App Router), React
- Editor Core: TipTap
- Markdown 처리: TipTap Markdown Extension
- Code Highlight: CodeBlockLowlight, lowlight
- Image Upload: Next.js API Route
- Storage (개발 기준): public/uploads 디렉토리

### 2.2 저장 포맷 정책
- 모든 문서는 Markdown(.md) 형식으로 저장한다.
- HTML 형식은 저장하지 않는다.

---

## 3. Markdown 변환 기능 요구사항

### 3.1 Editor to Markdown
- 사용자가 에디터에서 내용을 수정하면
  Markdown 문자열이 자동으로 갱신되어야 한다.
- 변환은 에디터의 내부 직렬화 기능을 사용한다.

### 3.2 Markdown to Editor
- 사용자가 Markdown 텍스트를 수정한 후
  "Markdown → 에디터 반영" 버튼을 누르면
  에디터 내용이 해당 Markdown 기준으로 재구성되어야 한다.
- GitHub Flavored Markdown 문법을 기준으로 한다.

---

## 4. Markdown 파일 입출력 요구사항

### 4.1 Markdown 파일 불러오기
- 사용자는 md 파일을 선택하여 에디터로 불러올 수 있어야 한다.
- 파일 내용은 Markdown 텍스트 영역과 에디터에 동시에 반영되어야 한다.

### 4.2 Markdown 파일 저장
- 현재 Markdown 상태를 md 파일로 다운로드할 수 있어야 한다.
- 파일 인코딩은 UTF-8을 사용한다.

---

## 5. 기본 편집 기능 요구사항 (Rich Text)

### 5.1 텍스트 스타일
- 다음의 텍스트 스타일링을 지원해야 한다.
  - **Bold** (굵게)
  - *Italic* (기울임)
  - ~~Strikethrough~~ (취소선)

### 5.2 문단 스타일
- 다음의 문단 스타일을 지원해야 한다.
  - Heading 1, 2, 3 (제목)
  - Bullet List (글머리 기호 목록)
  - Ordered List (번호 매기기 목록)
  - Blockquote (인용구)

### 5.3 기타 기능
- Horizontal Rule (구분선) 삽입
- Undo/Redo (실행 취소/다시 실행) 히스토리 관리

---

## 6. 코드블럭 기능 요구사항

### 5.1 코드블럭 생성
- 사용자는 버튼을 통해 코드블럭을 삽입하거나 해제할 수 있어야 한다.

### 5.2 코드 하이라이트
- 코드블럭은 문법 하이라이트를 지원해야 한다.
- 하이라이트 스타일은 CSS 테마를 통해 적용한다.

### 5.3 지원 언어
- 기본 지원 언어는 다음과 같다.
  - javascript
  - typescript
  - json
  - bash
  - html

### 5.4 Markdown 저장 형식
- 코드블럭은 반드시 fenced code block 규칙에 맞게 저장되어야 한다.
- 저장된 Markdown은 GitHub, VSCode, 정적 블로그 환경에서
  정상적으로 렌더링되어야 한다.

설명용 예시 표현:

    javascript 코드 예시
    console.log("hello")

---

## 7. 이미지 처리 기능 요구사항

### 6.1 이미지 업로드 (버튼)
- 사용자는 파일 선택 버튼을 통해 이미지를 업로드할 수 있어야 한다.
- 업로드 성공 시 에디터에 이미지가 삽입되어야 한다.

### 6.2 드래그 앤 드롭 이미지 업로드
- 사용자가 이미지를 에디터 영역에 드롭하면
  자동으로 업로드되어야 한다.
- 이미지 삽입 위치는 드롭된 위치를 기준으로 한다.

### 6.3 붙여넣기 이미지 업로드
- 클립보드에 이미지 파일이 포함된 상태로 붙여넣기 하면
  자동으로 업로드되어야 한다.

### 6.4 HTML 이미지 붙여넣기 통합 처리
- 붙여넣기 HTML에 이미지 태그가 포함된 경우에도
  서버 업로드 방식으로 통일한다.
- data URL 이미지는 File 객체로 변환 후 업로드한다.
- 외부 URL 이미지는 fetch 가능할 경우에만 업로드한다.
- fetch 실패 시 해당 이미지는 삽입하지 않는다.

### 6.5 중복 삽입 방지
- 하나의 붙여넣기 이벤트에서 동일 이미지가
  파일과 HTML 형태로 동시에 존재하는 경우
  중복 삽입이 발생하지 않아야 한다.
- 기본 paste 동작은 차단한다.

### 6.6 Markdown 저장 형식
- 이미지는 아래 형태로 저장되어야 한다.

설명용 예시 표현:

    ![](/uploads/example.png)

---

## 8. 서버 API 요구사항

### 7.1 이미지 업로드 API
- Method: POST
- Endpoint: /api/upload
- Request Type: multipart/form-data
- Parameter:
  - file: 이미지 파일

### 7.2 응답
- 성공 시 업로드된 이미지의 URL을 JSON 형식으로 반환한다.
- 실패 시 에러 메시지와 함께 400 상태 코드를 반환한다.

### 7.3 저장 정책
- 업로드 파일은 public/uploads 디렉토리에 저장한다.
- 파일명은 충돌 방지를 위해 timestamp 기반으로 생성한다.

---

## 9. 비기능 요구사항

### 8.1 안정성
- 붙여넣기 및 드롭 처리 중 오류가 발생해도
  에디터는 정상 동작을 유지해야 한다.

### 8.2 보안
- 이미지 파일만 업로드 가능해야 한다.
- 파일명은 서버에서 정제되어야 한다.

### 8.3 확장성
- 이미지 저장소는 추후 외부 스토리지로 교체 가능해야 한다.
- Markdown 기반 저장 구조는 유지되어야 한다.

---

## 10. 범위 외 항목
- 실시간 협업 기능
- 댓글 기능
- AI 자동 작성 기능
- 사용자 인증 및 권한 관리

위 항목은 본 기능 요구서 범위에 포함되지 않는다.
