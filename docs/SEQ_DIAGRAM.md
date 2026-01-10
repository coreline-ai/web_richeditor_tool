# 시퀀스 다이어그램
프로젝트명: Next.js + TipTap 기반 Markdown 에디터

## 1. 목적
본 문서는 Next.js + TipTap 기반 Markdown 에디터에서 발생하는 주요 흐름을
시퀀스 다이어그램 형태로 정의한다.
표현은 Mermaid 문법을 사용하며, 문서 내 코드펜스는 사용하지 않는다.
Mermaid가 필요한 환경에서는 아래 텍스트를 그대로 Mermaid 블록으로 감싸 사용한다.

---

## 2. 참여자(Participants)
- User: 사용자
- UI: Next.js Client UI (Toolbar, Textarea 포함)
- Editor: TipTap Editor Instance
- Serializer: Markdown Serializer (getMarkdown)
- API: Next.js Route Handler (/api/upload)
- FS: File System (public/uploads)

---

## 3. 문서 편집 및 Markdown 자동 갱신 흐름

sequenceDiagram
    participant User as User
    participant UI as UI(Next.js Client)
    participant Editor as Editor(TipTap)
    participant Serializer as Serializer(Markdown)
    User ->> UI: 키보드 입력
    UI ->> Editor: 입력 이벤트 전달
    Editor ->> Editor: 내부 문서 상태 업데이트
    Editor ->> Serializer: onUpdate 트리거
    Serializer ->> Editor: getMarkdown 호출
    Serializer ->> UI: Markdown 문자열 반환
    UI ->> UI: Markdown textarea 상태 갱신

---

## 4. Markdown 텍스트를 에디터에 반영하는 흐름

sequenceDiagram
    participant User as User
    participant UI as UI(Next.js Client)
    participant Editor as Editor(TipTap)
    User ->> UI: Markdown textarea 수정
    User ->> UI: 버튼 클릭(Markdown -> Editor)
    UI ->> Editor: setContent(markdown)
    Editor ->> Editor: Markdown 파싱 및 문서 갱신
    Editor ->> UI: 에디터 렌더링 갱신

---

## 5. 이미지 업로드(버튼) 흐름

sequenceDiagram
    participant User as User
    participant UI as UI(Next.js Client)
    participant Editor as Editor(TipTap)
    participant API as API(/api/upload)
    participant FS as FS(public/uploads)
    User ->> UI: 버튼 클릭(이미지 업로드)
    UI ->> User: 파일 선택 다이얼로그 표시
    User ->> UI: 이미지 파일 선택
    UI ->> API: POST multipart/form-data(file)
    API ->> FS: 디렉토리 생성 및 파일 저장
    FS -->> API: 저장 완료
    API -->> UI: JSON 응답(url)
    UI ->> Editor: insert image node(src=url)
    Editor ->> UI: 에디터 렌더링 갱신
    Editor ->> UI: onUpdate 트리거
    UI ->> UI: Markdown textarea 갱신(![] 형태)

---

## 6. 이미지 드래그 앤 드롭 업로드 흐름

sequenceDiagram
    participant User as User
    participant UI as UI(Next.js Client)
    participant Editor as Editor(TipTap)
    participant API as API(/api/upload)
    participant FS as FS(public/uploads)
    User ->> UI: 이미지 파일 드래그
    User ->> UI: 에디터에 드롭
    UI ->> UI: handleDrop 가로채기(기본 동작 차단)
    UI ->> Editor: 드롭 위치 pos 계산
    UI ->> API: POST multipart/form-data(file)
    API ->> FS: 파일 저장
    FS -->> API: 저장 완료
    API -->> UI: JSON 응답(url)
    UI ->> Editor: insert image node at pos
    Editor ->> UI: 렌더링 및 Markdown 갱신

---

## 7. 붙여넣기: 클립보드 이미지 파일 업로드 흐름

sequenceDiagram
    participant User as User
    participant UI as UI(Next.js Client)
    participant Editor as Editor(TipTap)
    participant API as API(/api/upload)
    participant FS as FS(public/uploads)
    User ->> UI: 붙여넣기(Ctrl+V)
    UI ->> UI: handlePaste 가로채기(기본 동작 차단)
    UI ->> UI: clipboard files에서 image 추출
    UI ->> API: POST multipart/form-data(file)
    API ->> FS: 파일 저장
    FS -->> API: 저장 완료
    API -->> UI: JSON 응답(url)
    UI ->> Editor: insert image node at cursor
    Editor ->> UI: 렌더링 및 Markdown 갱신

---

## 8. 붙여넣기: HTML img 태그(data URL, 외부 URL) 업로드 통일 흐름

sequenceDiagram
    participant User as User
    participant UI as UI(Next.js Client)
    participant Editor as Editor(TipTap)
    participant API as API(/api/upload)
    participant FS as FS(public/uploads)
    User ->> UI: 붙여넣기(Ctrl+V)
    UI ->> UI: handlePaste 가로채기(기본 동작 차단)
    UI ->> UI: clipboard htmlContent에서 img src 추출
    alt data URL 이미지
        UI ->> UI: data URL -> File 변환
        UI ->> API: POST multipart/form-data(file)
        API ->> FS: 파일 저장
        FS -->> API: 저장 완료
        API -->> UI: JSON 응답(url)
        UI ->> Editor: insert image node(src=url)
    else 외부 URL 이미지(fetch 가능)
        UI ->> UI: fetch(url)로 blob 다운로드
        UI ->> UI: blob -> File 변환
        UI ->> API: POST multipart/form-data(file)
        API ->> FS: 파일 저장
        FS -->> API: 저장 완료
        API -->> UI: JSON 응답(url)
        UI ->> Editor: insert image node(src=url)
    else 외부 URL 이미지(fetch 실패, CORS 등)
        UI ->> UI: 삽입 생략(정책 B)
    end
    Editor ->> UI: 렌더링 및 Markdown 갱신

---

## 9. 중복 삽입 방지 흐름

sequenceDiagram
    participant User as User
    participant UI as UI(Next.js Client)
    participant Editor as Editor(TipTap)
    User ->> UI: 붙여넣기(Ctrl+V)
    UI ->> UI: handlePaste에서 기본 삽입 차단
    UI ->> UI: Set 기반 중복 키 생성
    UI ->> UI: 동일 이미지 중복 요청 제거
    UI ->> Editor: 이미지 노드는 1회만 삽입
    Editor ->> UI: Markdown 갱신

---

## 10. 참고 사항
- 본 문서의 Mermaid 텍스트는 Mermaid 지원 환경에서 렌더링된다.
- Mermaid 블록 감싸기와 렌더링은 문서 플랫폼별 규칙을 따른다.
