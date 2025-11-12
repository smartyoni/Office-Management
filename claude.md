# CSV 데이터 관리자 - 개발 가이드 (엠디 파일)

이 문서는 CSV 데이터 관리자 프로젝트의 개발 규칙과 가이드라인을 정의합니다.

## 이 문서에 대하여

**문서 명칭:** claude.md (엠디 파일)
- 이 파일은 "엠디 파일" 또는 "claude.md"로 부릅니다.
- 프로젝트의 모든 개발 규칙, 구현 가이드, 변경 이력을 기록합니다.
- 새로운 기능 추가 시 반드시 해당 섹션을 이 엠디 파일에 기록해야 합니다.

---

## 테이블 컬럼 너비 표준화

### 개요
모든 데이터 테이블의 컬럼 너비를 **한글 10글자를 기준**으로 통일합니다. 이는 일관된 UI/UX를 제공하고 장기적인 유지보수를 용이하게 합니다.

### 너비 기준
- **Tailwind CSS 클래스:** `w-40` (10rem = 160px)
- **기준:** 한글 10글자 너비
- **적용 대상:** 모든 데이터 테이블의 데이터 셀

### 구현 방식

**헤더 색상 (Header Color)**
- 배경: `bg-green-800/60` (진한 녹색, 60% 투명도)
- 텍스트: `text-green-50` (매우 밝은 녹색)

**인라인 스타일 (style prop) 사용**

#### 테이블 헤더 (th 태그)
```tsx
<th
  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-green-50 sm:pl-6 capitalize overflow-hidden text-ellipsis whitespace-nowrap"
  style={{ width: '160px', minWidth: '160px' }}
>
  {header}
</th>
```

#### 테이블 헤더 컨테이너 (thead 태그)
```tsx
<thead className="bg-green-800/60">
  {/* 헤더 행 */}
</thead>
```

#### 테이블 데이터 셀 (td 태그)
```tsx
<td
  className="py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 overflow-hidden text-ellipsis whitespace-nowrap"
  style={{ width: '160px', minWidth: '160px' }}
>
  {data}
</td>
```

### 스타일 구성

| 속성 | 용도 |
|------|------|
| `width: '160px'` | 컬럼 너비 고정 |
| `minWidth: '160px'` | 최소 너비 보장 |
| `overflow-hidden` | 텍스트 넘침 숨김 |
| `text-ellipsis` | 넘친 텍스트에 '...' 표시 |
| `whitespace-nowrap` | 줄 바꿈 방지 |

---

## 테이블 색상 및 폰트 표준화

### 개요
모든 데이터 테이블의 배경색, 텍스트 색상, 폰트 스타일을 통일합니다. 이를 통해 일관된 UI/UX를 유지합니다.

### 색상 표준

**테이블 전체 배경:**
- `bg-white` (흰색)

**헤더:**
- 배경: `bg-green-800/60` (진한 녹색, 60% 투명도)
- 텍스트: `text-green-50` (매우 밝은 녹색)
- 폰트 무게: `font-semibold`

**데이터 셀:**
- 배경: `bg-white` (흰색)
- 텍스트: `text-black` (검정색)
- 폰트 무게: `font-medium` (기본)

**제목 (h1/h2):**
- 색상: `text-black` (검정색)
- 폰트 무게: `font-bold` (굵음)

**설명 텍스트:**
- 색상: `text-gray-700` (진한 회색)

**테이블 경계선:**
- 색상: `divide-gray-300` (밝은 회색)

**검색 입력:**
- 배경: `bg-gray-100` (밝은 회색)
- 테두리: `border-gray-300` (회색)
- 텍스트: `text-black` (검정색)

**페이지네이션 버튼:**
- 배경: `bg-gray-200` (회색)
- 테두리: `border-gray-400` (진한 회색)
- 텍스트: `text-black font-bold` (검정색 굵음)
- 호버: `hover:bg-gray-300` (진해진 회색)

**행 호버 효과:**
- 호버 배경: `hover:bg-gray-100` (밝은 회색)

### 구현 예시

**전체 테이블 컨테이너:**
```tsx
<div className="p-4 sm:p-6 lg:p-8 w-full bg-white">
  {/* 테이블 내용 */}
</div>
```

**테이블 요소:**
```tsx
<table className="divide-y divide-gray-300" style={{ tableLayout: 'fixed', width: '100%' }}>
  <thead className="bg-green-800/60">
    <tr>
      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-green-50">
        헤더명
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-300 bg-white">
    <tr className="hover:bg-gray-100">
      <td className="py-4 pl-4 pr-3 text-sm font-medium text-black">
        데이터
      </td>
    </tr>
  </tbody>
</table>
```

**제목:**
```tsx
<h1 className="text-2xl font-bold text-black">데이터 관리자</h1>
<p className="mt-1 text-sm text-gray-700">설명 텍스트</p>
```

**페이지네이션:**
```tsx
<div className="text-sm text-black font-bold">
  페이지 {currentPage + 1} / {totalPages}
</div>
<button className="px-3 py-2 bg-gray-200 border border-gray-400 rounded-lg text-black font-bold hover:bg-gray-300">
  다음
</button>
```

### 색상 팔레트 참고표

| 요소 | Tailwind 클래스 | RGB/HEX | 용도 |
|------|-----------------|---------|------|
| 배경 | `bg-white` | #FFFFFF | 테이블, 컨테이너 배경 |
| 헤더 배경 | `bg-green-800/60` | rgba(34, 197, 94, 0.6) | 테이블 헤더 |
| 헤더 텍스트 | `text-green-50` | #F0FDF4 | 헤더 텍스트 |
| 주 텍스트 | `text-black` | #000000 | 데이터, 제목 |
| 보조 텍스트 | `text-gray-700` | #374151 | 설명, 부제목 |
| 호버 배경 | `bg-gray-100` | #F3F4F6 | 행 호버 |
| 버튼 배경 | `bg-gray-200` | #E5E7EB | 페이지네이션 버튼 |
| 경계선 | `divide-gray-300` | #D1D5DB | 테이블 경계선 |

### 새 테이블 추가 시 색상 체크리스트

새로운 테이블을 추가할 때 다음 색상 표준을 적용하세요:

**컨테이너:**
- [ ] 배경: `bg-white` 적용
- [ ] 패딩: `p-4 sm:p-6 lg:p-8` 적용

**헤더:**
- [ ] `<thead>`: `className="bg-green-800/60"` 적용
- [ ] `<th>`: `className="... text-green-50 font-semibold ..."` 적용

**데이터:**
- [ ] `<tbody>`: `className="... bg-white divide-y divide-gray-300 ..."` 적용
- [ ] `<td>`: `className="... text-black font-medium ..."` 적용
- [ ] 행 호버: `className="... hover:bg-gray-100 ..."` 적용

**제목:**
- [ ] `<h1>`: `className="text-2xl font-bold text-black"` 적용
- [ ] `<p>`: `className="text-sm text-gray-700"` 적용

**입력/버튼:**
- [ ] 검색창: `bg-gray-100 border-gray-300 text-black` 적용
- [ ] 버튼: `bg-gray-200 border-gray-400 text-black font-bold hover:bg-gray-300` 적용

### 예시

**DataTable.tsx의 적용 예:**
```tsx
{headers.map((header, cellIndex) => (
  <td
    key={`${rowIndex}-${cellIndex}`}
    className="py-4 pl-4 pr-3 text-sm font-medium text-gray-300 sm:pl-6 overflow-hidden text-ellipsis whitespace-nowrap"
    style={{ width: '160px', minWidth: '160px' }}
  >
    {row[header]}
  </td>
))}
```

---

## 새로운 테이블 추가 시 종합 체크리스트

새로운 데이터 테이블을 추가할 때 다음을 확인하세요:

**컨테이너 및 배경:**
- [ ] 컨테이너에 `bg-white` 배경색 적용
- [ ] 패딩: `p-4 sm:p-6 lg:p-8` 적용

**헤더 스타일:**
- [ ] `<thead>` 태그에 `className="bg-green-800/60"` 적용
- [ ] `<th>` 태그에 `text-green-50 font-semibold` 클래스 적용
- [ ] 헤더 셀(th)에 `overflow-hidden text-ellipsis whitespace-nowrap` 클래스 적용

**데이터 스타일:**
- [ ] `<tbody>` 태그에 `bg-white divide-y divide-gray-300` 적용
- [ ] `<td>` 태그에 `text-black font-medium` 클래스 적용
- [ ] 행에 `hover:bg-gray-100` 호버 효과 적용
- [ ] 데이터 셀(td)에 `overflow-hidden text-ellipsis whitespace-nowrap` 클래스 적용

**컬럼 너비:**
- [ ] 모든 데이터 컬럼에 `style={{ width: '160px', minWidth: '160px' }}` 적용
- [ ] 경계선: `divide-gray-300` 적용

**패딩:**
- [ ] 기본 padding 유지: `py-4 pl-4 pr-3` (데이터셀), `py-3.5 pl-4 pr-3` (헤더)
- [ ] 화면 축소(sm) 시 padding 조정: `sm:pl-6` 적용

**제목 및 텍스트:**
- [ ] 제목(h1/h2): `text-black font-bold` 적용
- [ ] 설명 텍스트: `text-gray-700` 적용

**입력 및 버튼:**
- [ ] 검색창: `bg-gray-100 border-gray-300 text-black` 적용
- [ ] 페이지네이션 버튼: `bg-gray-200 border-gray-400 text-black font-bold hover:bg-gray-300` 적용

---

## 커스텀 컬럼 너비

특정 컬럼이 다른 너비가 필요한 경우:

```tsx
// 작은 컬럼 (5글자 기준)
style={{ width: '80px', minWidth: '80px' }}

// 큰 컬럼 (15글자 기준)
style={{ width: '240px', minWidth: '240px' }}

// 액션 컬럼 (너비 제한 없음)
// style 속성 제거
```

**권장사항:**
- 기본값 `160px`에서만 변경하고, 이유를 주석으로 표기
- 컬럼 너비를 변경할 때 일관성 검토 필요
- 너비 변경 시 `width`와 `minWidth`를 항상 같은 값으로 설정

---

## 컴포넌트 위치

**주요 테이블 컴포넌트:**
- `components/DataTable.tsx` - CSV 데이터 메인 테이블

**향후 추가될 테이블 컴포넌트:**
- 필요시 `components/` 디렉토리에 추가

---

## 참고사항

### 브라우저 호환성
- Tailwind CSS `w-40` 클래스는 모든 현대 브라우저에서 지원
- `text-ellipsis` 및 `overflow-hidden` 는 IE11 이상 지원

### 텍스트 길이 관리
- 한글 10글자 초과 데이터는 자동으로 '...'로 표시됨
- 사용자는 셀을 클릭하여 상세 정보 모달에서 전체 내용 확인 가능

### 반응형 디자인
- 모바일 화면에서도 `w-40`이 유지되어 수평 스크롤 가능
- `overflow-x-auto` 클래스로 테이블 컨테이너를 감싸 스크롤 구현

---

---

## 테이블 페이지네이션 및 필터링

### 개요
모든 데이터 테이블은 **150개 행 단위의 페이지네이션**과 **전역 검색 필터링**을 제공합니다. 이를 통해 대용량 CSV 데이터도 효율적으로 관리할 수 있습니다.

### 주요 기능

**1. 페이지네이션 (Pagination)**
- 한 페이지에 **최대 150개 행**만 표시
- 150개를 초과하는 행은 다음 페이지에 표시
- 페이지 하단에 "이전/다음" 버튼으로 페이지 이동
- 현재 페이지 정보 표시: "페이지 1 / 5"

**2. 전역 검색 필터링**
- 모든 열에서 동시에 검색 가능
- 대소문자 구분 없이 검색
- 검색어 입력 시 자동으로 첫 페이지로 이동
- 검색 결과 수 표시: "50개 / 200개 보기"

**3. 성능 최적화**
- `useMemo` 훅으로 필터링 및 페이지네이션 결과 캐싱
- 불필요한 재계산 방지
- 대용량 데이터도 부드러운 성능 유지

### 구현 상세

**기본 설정:**
```tsx
const ROWS_PER_PAGE = 150;
```

**상태 관리:**
```tsx
const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(0);
```

**필터링 로직:**
```tsx
const filteredData = useMemo(() => {
  if (!searchQuery.trim()) {
    return data; // 검색어 없으면 전체 데이터 반환
  }

  const lowerQuery = searchQuery.toLowerCase();
  return data.filter((row) => {
    // 모든 열에서 검색
    return headers.some((header) => {
      const cellValue = String(row[header] || '').toLowerCase();
      return cellValue.includes(lowerQuery);
    });
  });
}, [data, searchQuery, headers]);
```

**페이지네이션 로직:**
```tsx
const paginatedData = useMemo(() => {
  const startIndex = currentPage * ROWS_PER_PAGE;
  return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
}, [filteredData, currentPage]);
```

### UI 컴포넌트

**검색 입력 필드:**
- 검색창은 테이블 위쪽에 위치
- 아이콘 포함: 돋보기 아이콘
- 플레이스홀더: "모든 열에서 검색..."
- 동적으로 결과 수 표시

**페이지네이션 컨트롤:**
- 테이블 아래쪽에 위치
- "이전" / "다음" 버튼
- 페이지 번호 표시
- 비활성화 상태: 첫 페이지에서 "이전" 비활성화, 마지막 페이지에서 "다음" 비활성화

### 사용 예시

**시나리오 1: 대용량 CSV 로드 (1000개 행)**
1. CSV 파일 업로드
2. 테이블에 처음 150개 행만 표시
3. 사용자가 "다음" 버튼 클릭 → 150-300개 행 표시
4. 필터링으로 100개 행 남음 → 1페이지로 모두 표시

**시나리오 2: 특정 데이터 검색**
1. 검색창에 "고객명" 입력
2. 모든 열에서 "고객명" 포함 행만 필터링
3. 필터링 결과 50개 행 → 1페이지로 표시
4. "50개 / 500개 보기" 표시

### 새 테이블 추가 시 체크리스트

새로운 테이블에 페이지네이션/필터링을 적용할 때:

- [ ] `DataTable.tsx`를 기반으로 컴포넌트 생성
- [ ] `const ROWS_PER_PAGE = 150;` 상수 정의
- [ ] `[searchQuery, setSearchQuery]` 상태 추가
- [ ] `[currentPage, setCurrentPage]` 상태 추가
- [ ] `filteredData` useMemo 훅 구현
- [ ] `paginatedData` useMemo 훅 구현
- [ ] 검색 입력 필드 UI 추가
- [ ] 페이지네이션 컨트롤 버튼 추가
- [ ] 행 렌더링: `paginatedData` 사용 (data 아님)

### 유의사항

**인덱싱 문제 해결:**
- 페이지네이션된 행의 실제 인덱스 추적 필요
- `data.indexOf(row)` 사용하여 원본 배열의 인덱스 찾기
- 편집/삭제 시 항상 원본 인덱스 사용

**검색 후 페이지 이동:**
- 검색 수행 후 `setCurrentPage(0)` 호출
- 사용자가 첫 페이지의 검색 결과를 봄

**빈 결과 처리:**
- `filteredData.length === 0`으로 빈 결과 확인
- 검색 결과 없음 vs 데이터 없음 메시지 분리

---

---

## 테이블 컬럼 정렬 기능

### 개요
모든 데이터 테이블에서 컬럼 헤더를 클릭하여 해당 컬럼으로 정렬할 수 있습니다. 숫자형 데이터와 문자형 데이터를 구분하여 올바르게 정렬합니다.

### 기능

**정렬 방식:**
- **첫 클릭:** 오름차순 정렬 (A→Z, 0→9)
- **두 번째 클릭:** 내림차순 정렬 (Z→A, 9→0)
- **세 번째 클릭:** 정렬 초기화 (원래 순서)

**정렬 종류:**
- **숫자형:** 숫자 값으로 정렬 (예: 1, 2, 10, 20)
- **문자형:** 한글 정렬 규칙 적용 (localeCompare 'ko-KR')

**정렬 표시:**
- **↑** : 오름차순 정렬 중
- **↓** : 내림차순 정렬 중
- **↕** : 정렬되지 않음 (클릭 가능)

**UI:**
- 헤더를 마우스 호버하면 배경색이 진해짐 (hover:bg-green-900/60)
- 커서가 포인터 모양으로 변함 (cursor-pointer)
- 툴팁: "클릭하여 정렬"

### 구현 상세

**상태 관리:**
```tsx
const [sortColumn, setSortColumn] = useState<string | null>(null);
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
```

**정렬 로직:**
```tsx
const sortedData = useMemo(() => {
  if (!sortColumn) return filteredData;

  const sorted = [...filteredData].sort((a, b) => {
    const aVal = String(a[sortColumn] || '');
    const bVal = String(b[sortColumn] || '');

    // 숫자 비교 시도
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    }

    // 문자 비교 (한글 정렬)
    const comparison = aVal.localeCompare(bVal, 'ko-KR');
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return sorted;
}, [filteredData, sortColumn, sortDirection]);
```

**헤더 클릭 핸들러:**
```tsx
const handleSort = (column: string) => {
  if (sortColumn === column) {
    // 같은 컬럼 클릭 시: 방향 토글
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    // 다른 컬럼 클릭 시: 새 컬럼으로 정렬
    setSortColumn(column);
    setSortDirection('asc');
  }
  setCurrentPage(0); // 첫 페이지로 리셋
};
```

**정렬 표시 함수:**
```tsx
const getSortIndicator = (column: string) => {
  if (sortColumn !== column) return ' ↕';
  return sortDirection === 'asc' ? ' ↑' : ' ↓';
};
```

**헤더 렌더링:**
```tsx
<th
  onClick={() => handleSort(header)}
  className="... cursor-pointer hover:bg-green-900/60 ..."
  title="클릭하여 정렬"
>
  {header}{getSortIndicator(header)}
</th>
```

### 작동 순서

1. **필터링 → 정렬 → 페이지네이션**
   - 검색 쿼리로 데이터 필터링
   - 필터된 데이터를 선택된 컬럼으로 정렬
   - 정렬된 데이터를 페이지네이션

2. **정렬 후 페이지 리셋**
   - 정렬 변경 시 자동으로 첫 페이지(페이지 1)로 이동

3. **검색과 정렬 조합**
   - 검색 결과를 정렬 가능
   - 검색 후 정렬 기능이 유지됨

### 새 테이블 추가 시 체크리스트

새로운 테이블에 정렬 기능을 적용할 때:

- [ ] `DataTable.tsx` 기반으로 컴포넌트 생성
- [ ] `const [sortColumn, setSortColumn]` 상태 추가
- [ ] `const [sortDirection, setSortDirection]` 상태 추가
- [ ] `sortedData` useMemo 훅 구현
- [ ] `paginatedData`를 `sortedData` 기반으로 변경
- [ ] `handleSort()` 함수 구현
- [ ] `getSortIndicator()` 함수 구현
- [ ] 헤더에 `onClick={handleSort}` 이벤트 추가
- [ ] 정렬 표시 아이콘 추가 (↕, ↑, ↓)
- [ ] 헤더에 `cursor-pointer` 클래스 추가
- [ ] 정렬 컬럼 변경 시 페이지를 첫 페이지로 리셋

### 유의사항

- **혼합형 데이터:** 숫자와 문자가 섞여있으면 숫자 비교를 먼저 시도
- **빈 값 처리:** 빈 값은 문자열 비교 시 맨 앞 또는 맨 뒤에 배치
- **한글 정렬:** `localeCompare(val, 'ko-KR')`로 한글 자음/모음 순서 준수

---

## 상세정보 모달 특수 컬럼 기능

### 개요
상세정보 모달(DetailModal)에서 특정 컬럼에 대해 특수 기능을 제공합니다. 사용자가 데이터를 더 효율적으로 활용할 수 있도록 합니다.

### 지번 컬럼 - 지도보기 기능

**기능:**
- 테이블에 "지번" 컬럼이 있으면 상세정보 모달에서 지번 값 옆에 **"📍 지도보기"** 버튼 표시
- 버튼은 항상 표시됨 (테이블 뷰와 상관없이)
- 클릭 시 해당 지번으로 카카오맵 검색 페이지가 새 탭에서 열림

**구현 위치:**
- `components/DetailModal.tsx` - DetailModal 컴포넌트

**스타일:**
- 배경색: 노란색 (`#FFDE00`)
- 텍스트색: 검은색 (`#000`)
- 호버 시: 더 밝은 노란색 (`#FFEE33`)
- 아이콘: 📍 (지도 핀 이모지)

**코드 예시:**
```tsx
const isJibun = key.toLowerCase().includes('지번') || key === '지번';
const jibunValue = isJibun ? String(value).trim() : '';

{isJibun && jibunValue && (
  <a
    href={`https://map.kakao.com/link/search/${encodeURIComponent(jibunValue)}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      // 스타일 설정...
      backgroundColor: '#FFDE00',
      color: '#000',
    }}
  >
    📍 지도보기
  </a>
)}
```

### 전화번호 컬럼 - SMS 기능 (구현 예정)

**기능:**
- 테이블에 전화번호 컬럼이 있으면 상세정보 모달에서 전화번호를 **클릭 가능한 링크**로 표시
- 클릭 시 기본 SMS 앱으로 연결 (`sms:` 프로토콜)
- 전화번호 클릭 시 사용자 기기의 기본 SMS 앱이 열림

**감지 규칙:**
- 컬럼명에 "전화", "휴대폰", "전화번호", "핸드폰" 등이 포함된 경우
- 또는 "Tel", "Phone", "Mobile" 등 영문 컬럼명

**구현 방식:**
```tsx
// 전화번호 감지 로직
const isPhoneColumn = key.toLowerCase().includes('전화') ||
                      key.toLowerCase().includes('휴대폰') ||
                      key.toLowerCase().includes('핸드폰') ||
                      key.toLowerCase().includes('phone') ||
                      key.toLowerCase().includes('tel') ||
                      key.toLowerCase().includes('mobile');

// 전화번호 포맷 정규화 (숫자만 추출)
const phoneValue = String(value).replace(/[^0-9]/g, '');

// SMS 링크 생성
<a href={`sms:${phoneValue}`}>
  {value}
</a>
```

**스타일 (예상):**
- 텍스트 색상: 파란색 (링크 색)
- 언더라인: 표시
- 호버 시: 더 어두운 파란색

**구현 위치:**
- `components/DetailModal.tsx` - DetailModal 컴포넌트

**유의사항:**
- SMS 프로토콜은 모바일 기기와 데스크톱 메일 클라이언트에서 지원
- 웹 환경에서는 기본 설정된 메시징 앱으로 연결
- 전화번호 형식을 정규화하여 숫자만 추출 후 사용

---

## 테이블 컬럼 드래그 앤 드롭 순서 변경

### 개요
모든 데이터 테이블에서 테이블 헤더를 드래그하여 컬럼의 순서를 변경할 수 있습니다. Google Sheets와 유사하게 사용할 수 있으며, 변경된 순서는 자동으로 저장됩니다.

### 기능

**컬럼 순서 변경:**
- 컬럼 헤더를 드래그하여 다른 컬럼의 위치로 이동
- 마우스 드래그로 직관적인 순서 변경
- 모든 테이블에 자동 적용

**시각적 피드백:**
- **드래그 중:** 컬럼이 반투명으로 표시 (opacity 50%)
- **드롭 위치:** 파란색 왼쪽 테두리(보더)로 삽입 위치 표시
- **호버 상태:** 배경색 진해짐

**데이터 유지:**
- 실제 데이터 객체의 구조는 변경되지 않음
- 표시 순서만 변경됨
- 정렬, 필터링, 페이지네이션 기능과 함께 작동

**순서 저장:**
- `localStorage`를 사용하여 컬럼 순서 자동 저장
- 브라우저를 닫아도 설정된 컬럼 순서 유지
- 새로운 컬럼이 추가되면 자동으로 초기화

### 구현 상세

**상태 관리:**
```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(headers);
const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
```

**localStorage 동기화:**
```tsx
// 컴포넌트 마운트 시 저장된 순서 로드
React.useEffect(() => {
  const savedOrder = localStorage.getItem('columnOrder');
  if (savedOrder) {
    try {
      const parsed = JSON.parse(savedOrder);
      // 모든 헤더가 포함되어 있을 때만 사용
      if (Array.isArray(parsed) && parsed.length === headers.length &&
          parsed.every(col => headers.includes(col))) {
        setColumnOrder(parsed);
        return;
      }
    } catch (e) {
      // 무효한 저장된 순서, 기본값 사용
    }
  }
  setColumnOrder(headers);
}, [headers]);

// 컬럼 순서 변경 시 localStorage에 저장
React.useEffect(() => {
  localStorage.setItem('columnOrder', JSON.stringify(columnOrder));
}, [columnOrder]);
```

**드래그 이벤트 핸들러:**
```tsx
const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, column: string) => {
  setDraggedColumn(column);
  e.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, column: string) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  setDragOverColumn(column);
};

const handleDragLeave = () => {
  setDragOverColumn(null);
};

const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetColumn: string) => {
  e.preventDefault();

  if (!draggedColumn || draggedColumn === targetColumn) {
    setDraggedColumn(null);
    setDragOverColumn(null);
    return;
  }

  const draggedIndex = columnOrder.indexOf(draggedColumn);
  const targetIndex = columnOrder.indexOf(targetColumn);

  if (draggedIndex === -1 || targetIndex === -1) {
    setDraggedColumn(null);
    setDragOverColumn(null);
    return;
  }

  const newColumnOrder = [...columnOrder];
  const [draggedCol] = newColumnOrder.splice(draggedIndex, 1);
  newColumnOrder.splice(targetIndex, 0, draggedCol);

  setColumnOrder(newColumnOrder);
  setDraggedColumn(null);
  setDragOverColumn(null);
};

const handleDragEnd = () => {
  setDraggedColumn(null);
  setDragOverColumn(null);
};
```

**헤더 렌더링:**
```tsx
<th
  draggable
  onDragStart={(e) => handleDragStart(e, header)}
  onDragOver={(e) => handleDragOver(e, header)}
  onDragLeave={handleDragLeave}
  onDrop={(e) => handleDrop(e, header)}
  onDragEnd={handleDragEnd}
  onClick={() => handleSort(header)}
  style={{
    borderLeft: dragOverColumn === header ? '4px solid #60A5FA' : undefined,
    opacity: draggedColumn === header ? 0.5 : 1,
    backgroundColor: draggedColumn === header ? 'rgba(5, 150, 105, 0.4)' : undefined,
    transition: 'all 0.2s ease'
  }}
  title="클릭하여 정렬 / 드래그하여 순서 변경"
>
  {header}{getSortIndicator(header)}
</th>
```

### 작동 원리

1. **드래그 시작:** 컬럼 헤더를 마우스로 누르면 `handleDragStart` 실행
2. **드래그 오버:** 다른 컬럼 위에서 마우스를 움직이면 `handleDragOver` 실행 (드롭 위치 표시)
3. **드롭:** 마우스를 놓으면 `handleDrop` 실행하여 컬럼 순서 재배열
4. **저장:** `columnOrder` 상태 변경 → `useEffect`로 `localStorage`에 자동 저장

### 렌더링 흐름

```
Filter → Sort → Pagination
         (columnOrder 기준으로 헤더와 셀 렌더링)
```

- `columnOrder` 상태를 기준으로 헤더 렌더링
- `columnOrder` 순서로 표 데이터 셀 렌더링
- 실제 데이터 객체는 변경되지 않음

### 새 테이블 추가 시 체크리스트

새로운 테이블에 컬럼 드래그 기능을 적용할 때:

- [ ] `DataTable.tsx` 기반으로 컴포넌트 생성
- [ ] `const [columnOrder, setColumnOrder]` 상태 추가
- [ ] `const [draggedColumn, setDraggedColumn]` 상태 추가
- [ ] `const [dragOverColumn, setDragOverColumn]` 상태 추가
- [ ] `localStorage` 로드/저장 `useEffect` 구현
- [ ] 5개의 드래그 이벤트 핸들러 구현 (`handleDragStart`, `handleDragOver`, `handleDragLeave`, `handleDrop`, `handleDragEnd`)
- [ ] 헤더를 `columnOrder` 기반으로 렌더링
- [ ] 테이블 셀도 `columnOrder` 기반으로 렌더링
- [ ] `draggable` 속성 추가 (th 태그)
- [ ] `colSpan` 계산 시 `columnOrder.length` 사용
- [ ] 정렬 기능과 함께 작동 (클릭 = 정렬, 드래그 = 순서 변경)

### 주의사항

**데이터 무결성:**
- 컬럼 순서 변경은 표시만 변경, 실제 데이터는 변경 없음
- 편집/삭제 작업도 원본 데이터 기준으로 작동

**localStorage 검증:**
- 저장된 순서에 모든 헤더가 포함되어 있는지 확인
- 누락되거나 추가된 컬럼이 있으면 자동으로 초기화

**드래그 UI:**
- 반투명 효과로 드래그 중인 컬럼 표시
- 파란색 왼쪽 테두리로 드롭 위치 명확히 표시
- 0.2초 트랜지션으로 부드러운 시각 효과

---

## 테이블 컬럼 삭제 및 복원

### 개요
테이블의 컬럼을 마우스 우클릭으로 삭제하고, 하단의 Undo 바에서 취소할 수 있습니다. 삭제된 컬럼의 상태는 자동으로 localStorage에 저장됩니다.

### 기능

**컬럼 삭제:**
- 컬럼 헤더를 마우스 우클릭 (Right Click)하면 컨텍스트 메뉴 팝업
- "컬럼 삭제" 메뉴 클릭 시 해당 컬럼 숨김
- 삭제된 컬럼은 테이블 뷰에서 완전히 제거됨

**Undo 기능:**
- 컬럼 삭제 후 화면 하단에 "Undo 바" 표시
- 각 삭제된 컬럼마다 "취소" 버튼 제공
- 버튼 클릭 시 해당 컬럼 복원

**상태 저장:**
- 삭제된 컬럼 목록을 `localStorage`에 자동 저장
- 브라우저 재시작 후에도 삭제된 상태 유지
- 새 컬럼이 추가되면 자동으로 표시

**검색 및 정렬:**
- 삭제된 컬럼은 검색에서 제외
- 삭제된 컬럼으로는 정렬 불가능
- 표시된 컬럼들만 처리

### 구현 상세

**상태 관리:**
```tsx
const [contextMenu, setContextMenu] = useState<{ x: number; y: number; column: string } | null>(null);
const [deletedColumns, setDeletedColumns] = useState<string[]>([]);
```

**localStorage 동기화:**
```tsx
// 마운트 시 삭제된 컬럼 로드
const savedDeleted = localStorage.getItem('deletedColumns');
if (savedDeleted) {
  try {
    const parsed = JSON.parse(savedDeleted);
    if (Array.isArray(parsed)) {
      setDeletedColumns(parsed);
    }
  } catch (e) {
    // 무효한 저장된 삭제 컬럼
  }
}

// 삭제된 컬럼 목록 변경 시 저장
React.useEffect(() => {
  localStorage.setItem('deletedColumns', JSON.stringify(deletedColumns));
}, [deletedColumns]);
```

**표시 컬럼 계산:**
```tsx
const visibleColumns = useMemo(() => {
  return columnOrder.filter(col => !deletedColumns.includes(col));
}, [columnOrder, deletedColumns]);
```

**우클릭 이벤트 핸들러:**
```tsx
const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement>, column: string) => {
  e.preventDefault();
  setContextMenu({
    x: e.clientX,
    y: e.clientY,
    column
  });
};

const handleDeleteColumn = () => {
  if (contextMenu) {
    setDeletedColumns([...deletedColumns, contextMenu.column]);
    setContextMenu(null);
  }
};

const handleUndoDelete = (column: string) => {
  setDeletedColumns(deletedColumns.filter(col => col !== column));
};
```

**헤더에 우클릭 이벤트 추가:**
```tsx
<th
  onContextMenu={(e) => handleContextMenu(e, header)}
  title="클릭하여 정렬 / 드래그하여 순서 변경 / 우클릭하여 삭제"
>
  {header}{getSortIndicator(header)}
</th>
```

**컨텍스트 메뉴 UI:**
```tsx
{contextMenu && (
  <div style={{
    position: 'fixed',
    top: `${contextMenu.y}px`,
    left: `${contextMenu.x}px`,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 1000
  }}>
    <button onClick={handleDeleteColumn} style={{ color: '#ef4444' }}>
      컬럼 삭제
    </button>
  </div>
)}
```

**Undo 바 UI:**
```tsx
{deletedColumns.length > 0 && (
  <div style={{
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#374151',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    zIndex: 999
  }}>
    <span>'{deletedColumns[deletedColumns.length - 1]}' 컬럼이 삭제되었습니다.</span>
    {deletedColumns.map((col) => (
      <button
        key={col}
        onClick={() => handleUndoDelete(col)}
        style={{ backgroundColor: '#6366f1', color: 'white' }}
      >
        취소: {col}
      </button>
    ))}
  </div>
)}
```

### 작동 흐름

1. **우클릭:** 컬럼 헤더 우클릭 → `handleContextMenu` 실행
2. **메뉴 표시:** 컨텍스트 메뉴 팝업 (고정 위치)
3. **삭제 클릭:** "컬럼 삭제" 버튼 클릭 → `handleDeleteColumn` 실행
4. **상태 업데이트:** `deletedColumns` 배열에 컬럼명 추가
5. **렌더링:** `visibleColumns`에서 제외되어 테이블에서 사라짐
6. **Undo 바 표시:** 하단에 Undo 바 자동 표시
7. **취소:** "취소" 버튼 클릭 → `handleUndoDelete` 실행
8. **저장:** 모든 변경사항이 자동으로 localStorage에 저장

### 표시/숨김 처리

**삭제 전:**
```
columnOrder: ["이름", "전화", "주소", "지번"]
deletedColumns: []
visibleColumns: ["이름", "전화", "주소", "지번"]
```

**"전화" 삭제 후:**
```
columnOrder: ["이름", "전화", "주소", "지번"]
deletedColumns: ["전화"]
visibleColumns: ["이름", "주소", "지번"]
```

**테이블 렌더링:**
- 헤더: `visibleColumns` 기준으로 렌더링
- 셀: `visibleColumns` 기준으로 렌더링
- colSpan: `visibleColumns.length + 1` 사용
- 검색: `visibleColumns`에서만 검색

### 새 테이블 추가 시 체크리스트

새로운 테이블에 컬럼 삭제 기능을 적용할 때:

- [ ] `DataTable.tsx` 기반으로 컴포넌트 생성
- [ ] `const [contextMenu, setContextMenu]` 상태 추가
- [ ] `const [deletedColumns, setDeletedColumns]` 상태 추가
- [ ] localStorage 로드/저장 `useEffect` 구현
- [ ] `visibleColumns` useMemo 훅 구현
- [ ] `handleContextMenu()` 함수 구현
- [ ] `handleDeleteColumn()` 함수 구현
- [ ] `handleUndoDelete()` 함수 구현
- [ ] 클릭 외부 감지 `useEffect` 구현
- [ ] 헤더에 `onContextMenu` 이벤트 추가
- [ ] 컨텍스트 메뉴 UI 렌더링
- [ ] Undo 바 UI 렌더링
- [ ] 모든 테이블 렌더링(`colgroup`, 헤더, 셀, colSpan)에 `visibleColumns` 사용
- [ ] 검색 로직을 `visibleColumns` 기반으로 수정

### 주의사항

**데이터 무결성:**
- 컬럼 삭제는 표시만 변경, 실제 데이터는 변경 없음
- 삭제된 컬럼의 데이터도 메모리에 유지되어 복원 가능

**UI 배치:**
- 컨텍스트 메뉴는 마우스 위치 기준 (`fixed` 위치)
- 외부 클릭 시 메뉴 자동 닫힘
- Undo 바는 화면 하단 중앙 고정

**다중 삭제:**
- 여러 컬럼 동시 삭제 가능
- Undo 바에 각 컬럼마다 취소 버튼 표시
- 개별적으로 복원 가능

**localStorage 검증:**
- JSON 파싱 실패 시 빈 배열로 초기화
- 유효한 배열만 로드

---

## 테이블 컬럼 너비 조정 (드래그 리사이즈)

### 개요
테이블의 컬럼 헤더 오른쪽 경계를 드래그하여 컬럼 너비를 동적으로 조정할 수 있습니다. Google Sheets처럼 세밀한 너비 제어가 가능하며, 조정된 너비는 localStorage에 자동 저장됩니다.

### 기능

**컬럼 너비 조정:**
- 컬럼 헤더의 오른쪽 경계에 리사이즈 핸들 표시 (약 2px 회색선)
- 마우스 커서를 경계에 가져가면 `col-resize` 커서로 변경
- 드래그하여 컬럼 너비 실시간 조정
- 최소 너비 60px 제한

**시각적 피드백:**
- 리사이즈 핸들: 회색선 (#9ca3af, 기본) → 흰색 (#ffffff, 드래그 중)
- 비활성 상태: 회색 (#9ca3af)
- 활성 상태 (드래그 중): 흰색 (#ffffff)

**너비 저장:**
- 조정된 너비를 `columnWidths` 객체에 저장
- `localStorage` → `columnWidths` 키로 자동 저장
- 브라우저 재시작 후에도 조정된 너비 유지

**협력 기능:**
- 컬럼 정렬, 드래그 앤 드롭, 삭제 기능과 독립적으로 작동
- 헤더 클릭 시 정렬, 드래그 시 순서 변경, 오른쪽 경계 드래그 시 너비 조정

### 구현 상세

**상태 관리:**
```tsx
const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
const [resizingColumn, setResizingColumn] = useState<string | null>(null);
```

**localStorage 동기화:**
```tsx
// 마운트 시 저장된 너비 로드
const savedWidths = localStorage.getItem('columnWidths');
if (savedWidths) {
  try {
    const parsed = JSON.parse(savedWidths);
    if (typeof parsed === 'object' && parsed !== null) {
      setColumnWidths(parsed);
    }
  } catch (e) {
    // Invalid saved widths
  }
}

// 너비 변경 시 저장
React.useEffect(() => {
  localStorage.setItem('columnWidths', JSON.stringify(columnWidths));
}, [columnWidths]);
```

**마우스 이벤트 핸들러:**
```tsx
const handleMouseDown = (e: React.MouseEvent, column: string) => {
  e.preventDefault();
  setResizingColumn(column);
};

React.useEffect(() => {
  if (!resizingColumn) return;

  const handleMouseMove = (e: MouseEvent) => {
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: Math.max(60, (prev[resizingColumn] || 160) + e.movementX)
    }));
  };

  const handleMouseUp = () => {
    setResizingColumn(null);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [resizingColumn]);
```

**colgroup 너비 적용:**
```tsx
<colgroup>
  {visibleColumns.map((header) => (
    <col key={`col-${header}`} style={{ width: `${columnWidths[header] || 160}px` }} />
  ))}
  <col style={{ width: 'auto' }} />
</colgroup>
```

**리사이즈 핸들 UI:**
```tsx
<div
  onMouseDown={(e) => handleMouseDown(e, header)}
  style={{
    width: '6px',
    height: '100%',
    cursor: 'col-resize',
    marginLeft: '4px',
    display: 'flex',
    alignItems: 'center'
  }}
  title="드래그하여 컬럼 너비 조정"
>
  <div style={{
    width: '2px',
    height: '70%',
    backgroundColor: resizingColumn === header ? '#ffffff' : '#9ca3af',
    borderRadius: '1px'
  }} />
</div>
```

### 작동 흐름

1. **마운스 진입:** 커서를 컬럼 헤더 오른쪽 경계에 가져가면 리사이즈 핸들 표시
2. **마우스 다운:** 리사이즈 핸들 클릭 시 `handleMouseDown` 실행
3. **마우스 이동:** 드래그 중 `handleMouseMove`로 `movementX` 기반 너비 조정
4. **마우스 업:** 드래그 종료 시 `handleMouseUp` 실행
5. **저장:** `columnWidths` 상태 변경 → `useEffect`로 localStorage 저장

### 너비 조정 범위

**최소 너비:** 60px
**최대 너비:** 제한 없음 (무한)
**기본 너비:** 160px (저장된 값이 없을 때)

```tsx
// 최소 너비 보장
Math.max(60, (prev[resizingColumn] || 160) + e.movementX)
```

### 새 테이블 추가 시 체크리스트

새로운 테이블에 컬럼 너비 조정 기능을 적용할 때:

- [ ] `const [columnWidths, setColumnWidths]` 상태 추가
- [ ] `const [resizingColumn, setResizingColumn]` 상태 추가
- [ ] localStorage 로드/저장 `useEffect` 구현
- [ ] `handleMouseDown()` 함수 구현
- [ ] 마우스 이벤트 `useEffect` 구현
- [ ] `colgroup`의 `col` 너비를 `columnWidths` 기반으로 수정
- [ ] 헤더 내부에 리사이즈 핸들 UI 추가
- [ ] 리사이즈 핸들에 `onMouseDown` 이벤트 추가
- [ ] 헤더 title 업데이트: "오른쪽 경계 드래그로 너비 조정" 추가

### 주의사항

**성능:**
- `mousemove` 이벤트가 빈번하게 발생하지만 최적화됨
- 드래그 중에만 이벤트 리스너가 활성화됨

**데이터 무결성:**
- 컬럼 너비 조정은 표시만 변경, 실제 데이터는 변경 없음

**호환성:**
- 모든 현대 브라우저의 drag-and-drop API 지원
- `movementX` 속성 지원 필요

---

## 다중 드래그 가능 모달 시스템 (v2.2)

### 개요
상세정보 모달을 다중 인스턴스로 동시에 띄우고, 각 모달을 독립적으로 드래그하여 위치 조정할 수 있는 기능입니다. 사용자가 여러 행의 상세정보를 참조하며 작업할 수 있게 합니다.

### 기능 특징
- **다중 모달:** 원하는 만큼 모달을 동시에 열 수 있음
- **드래그 가능:** 각 모달의 헤더를 드래그하여 위치 조정
- **Z-인덱스 관리:** 모달 클릭 시 자동으로 최상위로 올라옴
- **비모달 배경:** 배경을 클릭해도 앱 기능 동작 (모달 닫히지 않음)
- **개별 닫기:** 각 모달의 닫기 버튼으로 개별 종료

### 상태 관리

#### 타입 정의 (TableManager.tsx:21-26)
```tsx
interface OpenModal {
  id: string;                    // 고유 모달 ID: modal-{timestamp}-{random}
  data: DataRow;                 // 표시할 행 데이터
  position: {x: number, y: number};  // 모달의 좌표
  zIndex: number;                // 스택 순서 (클릭하면 증가)
}
```

#### 상태 변수
```tsx
const [openModals, setOpenModals] = useState<OpenModal[]>([]);
const [nextZIndex, setNextZIndex] = useState(100);
```

### 이벤트 핸들러

#### 모달 열기 (TableManager.tsx:178-192)
```tsx
const handleView = (index: number) => {
  if (appState.data) {
    const newModal: OpenModal = {
      id: `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: appState.data[index],
      position: {
        x: 100 + openModals.length * 30,  // 계단식 배치
        y: 100 + openModals.length * 30
      },
      zIndex: nextZIndex
    };
    setOpenModals([...openModals, newModal]);
    setNextZIndex(nextZIndex + 1);
  }
};
```

#### 모달 닫기 (TableManager.tsx:194-195)
```tsx
const handleCloseModal = (modalId: string) => {
  setOpenModals(openModals.filter(m => m.id !== modalId));
};
```

#### 최상위로 올리기 (TableManager.tsx:198-203)
```tsx
const handleBringToFront = (modalId: string) => {
  setOpenModals(openModals.map(m =>
    m.id === modalId ? { ...m, zIndex: nextZIndex } : m
  ));
  setNextZIndex(nextZIndex + 1);
};
```

#### 위치 업데이트 (TableManager.tsx:205-209)
```tsx
const handleUpdateModalPosition = (modalId: string, position: {x: number, y: number}) => {
  setOpenModals(openModals.map(m =>
    m.id === modalId ? { ...m, position } : m
  ));
};
```

### 모달 렌더링 (TableManager.tsx:334-347)
```tsx
{openModals.map(modal => (
  <DetailModal
    key={modal.id}
    modalId={modal.id}
    isOpen={true}
    onClose={() => handleCloseModal(modal.id)}
    onBringToFront={() => handleBringToFront(modal.id)}
    onUpdatePosition={(position) => handleUpdateModalPosition(modal.id, position)}
    data={modal.data}
    headers={appState.headers}
    position={modal.position}
    zIndex={modal.zIndex}
  />
))}
```

### DetailModal 컴포넌트 변경사항

#### Props 확장 (DetailModal.tsx:5-15)
```tsx
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DataRow | null;
  headers?: string[];
  modalId?: string;                    // 모달 고유 ID
  position?: {x: number, y: number};   // 모달 위치
  zIndex?: number;                     // 스택 순서
  onBringToFront?: () => void;         // 최상위 올리기
  onUpdatePosition?: (position: {x: number, y: number}) => void;  // 위치 업데이트
}
```

#### 드래그 상태 (DetailModal.tsx:28-30)
```tsx
const [isDragging, setIsDragging] = useState(false);
const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
const headerRef = useRef<HTMLDivElement>(null);
```

#### 헤더 드래그 시작 (DetailModal.tsx:39-48)
```tsx
const handleHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  if (onBringToFront) {
    onBringToFront();  // 클릭 시 최상위로 올리기
  }
  setIsDragging(true);
  setDragOffset({
    x: e.clientX - position.x,
    y: e.clientY - position.y,
  });
};
```

#### 드래그 처리 (DetailModal.tsx:50-70)
```tsx
React.useEffect(() => {
  if (!isDragging || !onUpdatePosition) return;

  const handleMouseMove = (e: MouseEvent) => {
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    onUpdatePosition({x: newX, y: newY});
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [isDragging, dragOffset, onUpdatePosition]);
```

#### 모달 컨테이너 (DetailModal.tsx:73-85)
```tsx
<div
  style={{
    position: 'fixed',        // 절대 위치
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex,
    pointerEvents: 'auto',
  }}
>
  <div className="bg-gray-800 rounded-lg shadow-xl w-96 transform transition-shadow">
```

#### 헤더 드래그 핸들 (DetailModal.tsx:86-99)
```tsx
<div
  ref={headerRef}
  onMouseDown={handleHeaderMouseDown}
  className="px-6 py-4 border-b border-gray-700 flex justify-between items-center cursor-move select-none"
  style={{
    backgroundColor: isDragging ? '#374151' : undefined,
    userSelect: 'none',
  }}
>
  <h3 className="text-xl font-semibold text-white">{title}</h3>
  <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
    <Icon name="close" className="w-5 h-5" />
  </button>
</div>
```

### 사용 흐름

1. **모달 열기:** 테이블에서 상세보기 아이콘 클릭 → 새 모달이 우측 아래 계단식 배치로 생성
2. **다중 모달:** 여러 행을 클릭하면 여러 모달이 동시에 열림
3. **위치 조정:** 각 모달의 제목 표시줄(헤더)을 드래그하여 위치 조정
4. **모달 전환:** 모달 클릭 시 자동으로 최상위로 올라옴
5. **개별 종료:** 각 모달의 닫기 버튼으로 독립적으로 종료

### 새로운 테이블 추가 시 체크리스트

#### 모달 시스템
- [ ] TableManager에서 `onView` 핸들러가 올바르게 구현되어 있는지 확인
- [ ] DetailModal이 `position`, `zIndex`, `onBringToFront`, `onUpdatePosition` props를 받는지 확인
- [ ] 모달 헤더에 `onMouseDown={handleHeaderMouseDown}` 적용 확인
- [ ] 모달이 `fixed` 위치 지정으로 렌더링되는지 확인

### 주의사항

**성능:**
- 다중 모달 시 drag 이벤트 리스너가 각각 활성화됨
- 일반적으로 5-10개 정도는 문제 없음

**데이터 무결성:**
- 모달은 표시만 변경, 데이터는 변경 없음

**위치 저장:**
- 현재 모달 위치는 localStorage에 저장되지 않음
- 필요 시 별도로 구현 가능

**Z-인덱스:**
- 초기값 100에서 시작하여 클릭할 때마다 증가
- 매우 많은 모달을 열면 z-index 값이 커질 수 있음 (현실적으로는 무시해도 됨)

---

## v2.4 - 공백 행 데이터 방지 시스템

### 개요

사용자가 실수로 모든 필드가 공백인 행을 저장하는 것을 방지합니다. 세 계층의 검증을 통해 데이터 품질을 보장합니다:
1. **CSV 파싱 단계:** 가져온 CSV 파일에서 공백 행 필터링
2. **모달 제출 단계:** 사용자가 수동으로 입력할 때 제출 전 검증
3. **저장 단계:** 최종 저장 전 데이터 검증

### 문제 배경

**왜 공백 행이 생기는가?**
- CSV 파일의 빈 행: `"","",""` 형식의 행이 존재하면 필터링 없이 가져와짐
- 모달 폼 제출: HTML5 `required` 속성이 공백(whitespace)을 검증하지 못함
- 저장 함수: 검증 없이 모든 rowData를 저장

**영향:**
- 데이터베이스에 의미 없는 행이 쌓임
- 테이블 UI에 빈 행이 표시되어 사용자 혼란 초래

### 해결 방법

#### 1. CSV 파싱 단계 검증 (TableManager.tsx:99-107)

CSV 파일 가져오기 시 모든 필드가 공백인 행을 필터링합니다:

```typescript
.filter((row): row is DataRow => {
  if (row === null) return false;
  // 모든 필드가 빈 문자열인 행 제외
  const hasValue = Object.values(row).some(value => {
    const trimmedValue = String(value || '').trim();
    return trimmedValue !== '';
  });
  return hasValue;
});
```

**로직:**
- `Object.values(row).some()`: 하나라도 값이 있는지 확인
- 각 값을 문자열로 변환 후 `trim()` 적용하여 공백 제거
- 최소 하나 이상의 필드가 비어있지 않은 행만 유지

#### 2. 모달 제출 단계 검증 (Modal.tsx:37-55)

사용자가 모달에서 데이터를 입력하고 저장하려 할 때:

```typescript
// 모달에 validationError 상태 추가
const [validationError, setValidationError] = useState('');

// 행이 비어있는지 확인하는 함수
const isRowEmpty = (row: DataRow): boolean => {
  return Object.values(row).every(value => {
    const trimmedValue = String(value || '').trim();
    return trimmedValue === '';
  });
};

// 폼 제출 시 검증
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  // 모든 필드가 비어있는 경우 저장하지 않음
  if (isRowEmpty(formData)) {
    setValidationError('최소 하나 이상의 항목을 입력해주세요.');
    return;
  }

  onSave(formData);
};
```

**UI 표시:**
```typescript
{validationError && (
  <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300">
    {validationError}
  </div>
)}
```

#### 3. 저장 단계 검증 (TableManager.tsx:153-174)

모달의 `onSave` 콜백인 `handleSave` 함수에서 최종 검증:

```typescript
const handleSave = async (rowData: DataRow) => {
  if (appState.data) {
    // Validate that the row is not completely empty
    const isEmpty = Object.values(rowData).every(value =>
      String(value || '').trim() === ''
    );

    if (isEmpty) {
      setErrorMessage('최소 하나 이상의 항목을 입력해주세요.');
      return;
    }

    // 검증 통과 후 데이터 저장
    if (editingRowIndex !== null) {
      const updatedData = [...appState.data];
      updatedData[editingRowIndex] = rowData;
      await appState.setData(updatedData);
    } else {
      await appState.setData([...appState.data, rowData]);
    }
  }
  handleCloseModal();
};
```

### 검증 로직 상세 설명

**공백 검출 방식:**
```typescript
Object.values(row).every(value => String(value || '').trim() === '')
```

- `Object.values(row)`: 행의 모든 필드 값 추출
- `String(value || '')`: null/undefined를 빈 문자열로 변환
- `.trim()`: 좌우 공백 제거
- `every()`: **모든** 필드가 공백이어야 true (AND 조건)

**값이 있는지 검출하는 방식:**
```typescript
Object.values(row).some(value => {
  const trimmedValue = String(value || '').trim();
  return trimmedValue !== '';
})
```

- `some()`: **하나라도** 값이 있으면 true (OR 조건)
- CSV 필터링에 사용

### 테스트 시나리오

#### 시나리오 1: CSV 가져오기 (공백 행 포함)
```csv
이름,전화번호,주소
김철수,010-1234-5678,서울시 강남구
,,,
이영희,010-9876-5432,부산시 해운대구
```

**결과:**
- 공백 행 자동 필터링
- "이름", "전화번호", "주소" 3개 행만 로드
- 2개 데이터 행(김철수, 이영희)만 테이블에 표시

#### 시나리오 2: 모달에서 빈 폼 제출
1. 새 레코드 추가 클릭
2. 모든 필드를 공백으로 둔 상태
3. 저장 버튼 클릭
4. 빨간 오류 메시지 표시: "최소 하나 이상의 항목을 입력해주세요."
5. 폼 닫기 안 함

#### 시나리오 3: 한 필드만 입력
1. "이름" 필드에만 "홍길동" 입력
2. 다른 필드 모두 공백
3. 저장 클릭
4. 성공적으로 저장 (최소 하나 이상 입력 조건 충족)

### 변경된 파일

| 파일 | 변경사항 |
|------|---------|
| TableManager.tsx | parseCSV에 공백 행 필터 추가, handleSave에 검증 로직 추가 |
| Modal.tsx | 검증 상태 및 오류 메시지 UI 추가 |

### 체크리스트

새로운 테이블 추가 시:
- [ ] 수동 입력 시 공백 행 저장 불가능 확인
- [ ] CSV 가져오기 시 공백 행 자동 필터링 확인
- [ ] 모달에서 오류 메시지 표시 확인
- [ ] 최소 하나 이상 필드 입력 시 정상 저장 확인

### 주의사항

**공백의 정의:**
- 순수 공백만: `"   "` → 공백으로 간주
- 문자 + 공백: `" 홍길동 "` → 값으로 간주 (trim 후)
- 0 또는 false: `"0"`, `"false"` → 값으로 간주

**성능:**
- 검증은 O(n) 복잡도 (n = 필드 수)
- 대부분 필드 수가 적어 무시할 수 있음

---

## 변경 이력

| 버전 | 날짜 | 변경사항 |
|------|------|---------|
| 2.4 | 2025-11-12 | 공백 행 데이터 방지 시스템 (CSV 파싱, 모달 제출, 저장 단계 3계층 검증) |
| 2.2 | 2025-11-12 | 다중 드래그 가능 모달 시스템 추가 (여러 모달 동시 열기, 헤더 드래그로 위치 조정, z-인덱스 관리) |
| 2.1 | 2025-11-12 | 테이블 컬럼 너비 조정 기능 추가 (헤더 경계 드래그로 너비 동적 조정, localStorage 저장) |
| 2.0 | 2025-11-12 | UI 개선: "행 추가" 버튼명 변경, "계약호실관리" → "계약호실" 테이블명 자동 변경 마이그레이션 추가 |
| 1.8 | 2025-11-12 | 테이블 컬럼 삭제 및 복원 기능 추가 (우클릭 메뉴, Undo 바, localStorage 저장) |
| 1.7 | 2025-11-12 | 테이블 컬럼 드래그 앤 드롭 기능 추가 (헤더 드래그로 순서 변경, localStorage 저장) |
| 1.6 | 2025-11-12 | 테이블 컬럼 정렬 기능 추가 (헤더 클릭으로 정렬, 숫자/문자 구분, 한글 정렬) |
| 1.5 | 2025-11-12 | 상세정보 모달 특수 컬럼 기능 추가 (지번→지도보기, 전화번호→SMS) |
| 1.4 | 2025-11-12 | 테이블 색상 및 폰트 표준화 (흰 배경, 검정 글씨, 굵은 폰트) |
| 1.3 | 2025-11-12 | 테이블 헤더 색상 강화 (진한 녹색 배경: bg-green-800/60) |
| 1.2 | 2025-11-12 | 페이지네이션(150개 행) 및 전역 필터링 추가 |
| 1.1 | 2025-11-12 | Tailwind CSS에서 인라인 스타일로 변경 (style prop 사용) |
| 1.0 | 2025-11-12 | 초기 버전 - 컬럼 너비 표준화 규칙 정의 |
