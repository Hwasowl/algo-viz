import { makeStep } from '../engine/types.js'

const classes = [
  { label: 'O(1)', color: '#34d399', f: () => 1 },
  { label: 'O(log n)', color: '#60a5fa', f: (n) => Math.max(1, Math.ceil(Math.log2(n))) },
  { label: 'O(n)', color: '#a78bfa', f: (n) => n },
  { label: 'O(n log n)', color: '#fbbf24', f: (n) => n * Math.max(1, Math.ceil(Math.log2(n))) },
  { label: 'O(n²)', color: '#fb923c', f: (n) => n * n },
  { label: 'O(2ⁿ)', color: '#f87171', f: (n) => Math.pow(2, n) },
]

const java = `// 입력 크기 n에 따라 연산이 몇 번 일어나나?
int x = a[0];                 // O(1)    : 한 번에 끝
binarySearch(a, key);         // O(log n): 절반씩 줄임
for (int v : a) sum += v;     // O(n)    : 한 번 훑음
Arrays.sort(a);               // O(nlogn): 표준 정렬
for(i..) for(j..) compare;    // O(n²)   : 모든 쌍 비교
subsets(a);                   // O(2ⁿ)   : 모든 부분집합`

export function complexitySteps() {
  const ns = [1, 2, 4, 8, 16, 32, 64]
  return ns.map((n) =>
    makeStep(
      0,
      { n, rows: classes.map((c) => ({ label: c.label, color: c.color, ops: Math.round(c.f(n)) })) },
      `n = ${n} 일 때 각 복잡도의 연산 횟수 (막대가 길수록 느림)`
    )
  )
}

export const complexityTopic = {
  id: 'complexity',
  week: 1,
  title: '시간·공간 복잡도',
  rendererId: 'complexity-graph',
  complexity: { time: '— (개념)', space: '— (개념)' },
  plainDef: '입력이 커질 때 "시간이 얼마나 늘어나는지(시간복잡도)"와 "메모리를 얼마나 쓰는지(공간복잡도)"를 대략적으로 나타낸 척도.',
  analogy: '요리 시간을 "정확히 23분"이 아니라 "재료가 2배면 시간도 대략 2배"처럼 증가 경향으로 말하는 것. 정확한 초가 아니라 늘어나는 모양이 중요하다.',
  why: '코드를 돌려보지 않고도 "이 풀이가 시간 초과날까?"를 미리 판단하기 위해서. 코테 합격/불합격을 가르는 가장 중요한 감각.',
  terms: [
    { word: '시간복잡도', desc: '입력 크기 n이 커질 때 연산 횟수가 늘어나는 정도. Big-O 표기(O(n) 등)로 나타낸다.' },
    { word: '공간복잡도', desc: '알고리즘이 추가로 쓰는 메모리의 양. 보통 만든 배열·재귀 깊이로 결정된다.' },
    { word: 'Big-O', desc: '최악의 경우 증가 경향만 남기고 상수·낮은 차수는 버린 표기. 2n+3 → O(n).' },
  ],
  coteTip:
    'Java 기준 1초에 약 1억(10⁸)번 연산이 한계라고 기억하라. n이 주어지면 역으로 허용 복잡도를 추정한다: ' +
    'n ≤ 10이면 O(2ⁿ)·O(n!)도 OK, n ≤ 1,000이면 O(n²), n ≤ 1,000,000이면 O(n log n), n ≤ 1억이면 O(n)·O(log n)만 가능.',
  concept:
    '복잡도는 정확한 시간이 아니라 "입력이 커질 때 증가하는 모양"을 본다. 상수와 낮은 차수는 버린다(2n+3 → O(n)). ' +
    '아래 그래프에서 n이 커질수록 O(n²)·O(2ⁿ)가 폭발하는 게 보인다 — 같은 문제도 어떤 복잡도로 푸느냐가 시간 초과를 가른다.',
  realWorld: 'n 크기로 허용 복잡도 역산 → 자료구조·알고리즘 선택의 기준',
  javaCode: java,
  algorithms: { default: { label: '복잡도 증가 비교', code: java, build: () => complexitySteps() } },
}
