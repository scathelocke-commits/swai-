# 데이터 흐름 및 설계 한계

```text
                      [Next.js App Router]
                          /   /   /   \
                6개 화면 + 공통 UI 컴포넌트
                         |
                      DemoProvider
                    /       |          \
            localStorage  시나리오      데모 JSON
             사용자 입력   상태        (읽기 전용)
                         |               ^
                    미리 정의된 값     GET /api/demo
                                         |
                                   [Python FastAPI]
                                         |
                                backend/data/demo.json
```

- 수강내역 및 학적정보는 상태 객체와 localStorage로만 관리한다.
- 졸업 판정은 `scenarios` 배열의 현재 선택 값을 렌더링하는 과정이다.
- 추천 로드맵은 `roadmaps[scenarioId]`에 저장된 고정 배열을 렌더링한다.
- 홈, 요건, 분석, 로드맵이 동일한 시나리오 객체를 참조해 예시 학점 수치를 일관되게 표시한다.
- Python API를 읽지 못할 경우 동일 스키마의 `frontend/src/data/demo.json`을 사용한다.
- 실제 판정 엔진을 새로 개발할 때는 학사규정 소스·학기별 개정·과목 매핑·재수강·중복인정·개설정보·예외처리·판정 근거 등을 별도 데이터 계층으로 관리해야 한다.
