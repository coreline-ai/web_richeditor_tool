# API 상세 명세
프로젝트명: Next.js + TipTap 기반 Markdown 에디터

## 1. 문서 목적
본 문서는 이미지 업로드 기능을 위해 구현된 서버 API의 상세 명세를 정의한다.
현재 구현은 Next.js App Router의 Route Handler 기반으로 작성되며,
개발 환경에서는 로컬 파일 시스템(public/uploads)에 저장한다.

---

## 2. 공통 규칙

### 2.1 Base URL
- 기본 경로는 동일 오리진을 사용한다.
- 예: https://example.com

### 2.2 인증
- 현재 버전에서는 인증을 적용하지 않는다.
- 운영 환경에서는 인증 및 권한 검증을 별도 요구사항으로 추가한다.

### 2.3 데이터 형식
- 요청: multipart/form-data
- 응답: application/json; charset=utf-8

### 2.4 시간 및 타임존
- 파일명 생성에 Date.now 기반 timestamp를 사용한다.
- 서버 타임존에 영향을 받지 않으나, 운영 환경에서 서버 시간 동기화가 필요하다.

---

## 3. 이미지 업로드 API

### 3.1 개요
- 사용자가 업로드한 이미지 파일을 서버에 저장하고,
  정적 접근 가능한 URL을 반환한다.

### 3.2 Endpoint
- Method: POST
- Path: /api/upload

### 3.3 Request

#### 3.3.1 Headers
- Content-Type: multipart/form-data
  - 브라우저 또는 클라이언트 라이브러리가 boundary를 자동 설정한다.

#### 3.3.2 Body (multipart/form-data)
- file: File
  - 필수
  - 이미지 파일만 허용 대상이다.

#### 3.3.3 Request 예시(설명용)
- 브라우저에서 FormData에 file 필드를 추가해 전송한다.

---

## 4. Response

### 4.1 성공 응답
- Status: 200 OK
- Content-Type: application/json; charset=utf-8

#### 4.1.1 Body
- url: string
  - 업로드된 이미지의 정적 접근 URL
  - 형식: /uploads/{filename}

#### 4.1.2 성공 응답 예시(설명용)
- url 값 예시: /uploads/1700000000000_example.png

### 4.2 실패 응답

#### 4.2.1 파일 누락
- Status: 400 Bad Request
- Body:
  - error: string
    - 값 예시: No file uploaded

#### 4.2.2 서버 처리 실패(파일 저장 실패 등)
- Status: 500 Internal Server Error
- Body:
  - error: string
  - message: string
- 참고: 현재 구현은 명시적 500 응답 처리가 단순할 수 있으므로,
  운영을 위해 표준화된 에러 응답 포맷을 권장한다.

---

## 5. 서버 저장 정책

### 5.1 저장 위치
- 저장 경로: {projectRoot}/public/uploads
- public 디렉토리 하위이므로, Next.js 정적 서빙 경로로 접근 가능하다.

### 5.2 파일명 규칙
- filename = {timestamp}_{safeName}
- timestamp: Date.now 결과(밀리초)
- safeName: 업로드 파일명에서 허용되지 않는 문자를 언더스코어로 치환한 문자열

### 5.3 파일명 정제 규칙
- 허용 문자 범위:
  - 영문, 숫자, 밑줄, 하이픈, 점
- 그 외 문자는 언더스코어로 치환한다.

---

## 6. 클라이언트 연동 규칙

### 6.1 업로드 후 에디터 삽입
- 업로드 성공 시 응답의 url을 사용해 TipTap 이미지 노드를 삽입한다.
- 이미지 노드 속성:
  - src: 응답 url
  - alt: 원본 파일명 또는 사용자 지정 텍스트

### 6.2 Markdown 직렬화 요구사항
- 에디터의 이미지 노드는 Markdown 저장 시 다음 문법으로 반영되어야 한다.
  - ![](/uploads/filename.png)

---

## 7. 오류 처리 정책

### 7.1 클라이언트 처리
- 업로드 실패 시:
  - 사용자에게 실패 메시지를 표시한다.
  - 에디터는 편집 가능 상태를 유지해야 한다.

### 7.2 서버 로그
- 서버 저장 실패 등 예외는 서버 로그에 기록되어야 한다.
- 운영 환경에서는 에러 추적 시스템 연동을 권장한다.

---

## 8. 보안 요구사항(권장)

### 8.1 파일 타입 제한
- 서버는 이미지 MIME 타입만 허용해야 한다.
- 허용 예시:
  - image/jpeg
  - image/png
  - image/gif
  - image/webp

### 8.2 파일 크기 제한
- 운영 환경에서는 파일 크기 제한을 적용해야 한다.
- 권장:
  - 단일 파일 최대 크기 제한
  - 전체 요청 크기 제한

### 8.3 악성 업로드 방지
- 파일 확장자만이 아닌 MIME 기반 검증을 수행해야 한다.
- 필요 시 이미지 디코딩 검증 또는 바이러스 스캔을 고려한다.

---

## 9. 운영 환경 고려사항

### 9.1 서버리스 환경 제약
- Vercel 등 서버리스 환경에서는 로컬 디스크 저장이 영속적이지 않을 수 있다.
- 운영 환경에서는 외부 오브젝트 스토리지로 교체해야 한다.

### 9.2 스토리지 교체 가이드(개요)
- 저장 위치를 S3 또는 R2로 변경하고,
  업로드 결과 url을 퍼블릭 접근 가능한 주소로 반환한다.
- 반환 url 정책이 바뀌어도 Markdown 저장 문법은 동일하게 유지한다.

---

## 10. 변경 이력
- v1.0
  - POST /api/upload 단일 엔드포인트 정의
  - public/uploads 로컬 저장 방식 적용
  - url 반환 규격 정의
