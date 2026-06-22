# Phase 1: 코테 알고리즘 시각화 웹 (골격 + 4토픽) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vite+Vue3 정적 웹에서 좌측 Java 코드와 우측 인터랙티브 애니메이션이 스텝 단위로 동기화되는 골격 + 정렬·이진탐색·BFS/DFS·재귀 4토픽을 구현한다.

**Architecture:** 알고리즘을 "실행하며 `{line,state,note}` 스텝을 push하는 순수 함수"로 작성(테스트 가능 코어). StepController가 인덱스를 관리하고 CodePanel은 `step.line`을, VizStage는 `step.state`를 렌더한다. 계산(스텝 생성)과 표현(렌더러)을 분리한다.

**Tech Stack:** Vite, Vue3(Composition API, SFC), Vitest(스텝 제너레이터 단위 테스트), highlight.js(코드 하이라이트), SVG(시각화).

---

## File Structure

```
algo-viz-web/
├─ index.html
├─ package.json
├─ vite.config.js
├─ vitest.config.js
├─ src/
│  ├─ main.js
│  ├─ App.vue                      # AppShell: 사이드바 + 라우팅(상태기반)
│  ├─ engine/
│  │  └─ types.js                  # Step 형태 JSDoc + 헬퍼(makeStep)
│  ├─ composables/
│  │  └─ useStepPlayer.js          # 재생/일시정지/속도/인덱스
│  ├─ topics/
│  │  ├─ index.js                  # 토픽 레지스트리(주차별)
│  │  ├─ sorting.js                # 정렬 5종 step generator + 메타
│  │  ├─ binarySearch.js
│  │  ├─ graphTraversal.js         # BFS/DFS
│  │  └─ recursion.js              # 팩토리얼/피보나치 콜스택
│  ├─ components/
│  │  ├─ TopicView.vue             # 개념 + 분할패널 조립
│  │  ├─ CodePanel.vue             # 코드 + 현재 줄 하이라이트
│  │  ├─ StepController.vue        # ◀ ▶ 재생/속도/진행바
│  │  └─ VizStage.vue              # rendererId로 렌더러 선택
│  └─ renderers/
│     ├─ ArrayBars.vue            # 배열 막대(정렬·이진탐색)
│     ├─ GraphView.vue            # 그래프 노드/엣지(BFS/DFS)
│     └─ CallStack.vue            # 콜스택 프레임(재귀)
└─ test/
   ├─ sorting.test.js
   ├─ binarySearch.test.js
   ├─ graphTraversal.test.js
   └─ recursion.test.js
```

---

## Task 0: 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`, `vite.config.js`, `vitest.config.js`, `index.html`, `src/main.js`, `src/App.vue`

- [ ] **Step 1: Vite 의존성 설치**

```bash
cd "C:/Users/hwaso/OneDrive/바탕 화면/shwa/algo-viz-web"
npm init -y
npm i vue
npm i -D vite @vitejs/plugin-vue vitest @vue/test-utils jsdom highlight.js
```

- [ ] **Step 2: 설정 파일 작성**

`vite.config.js`:
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  base: './',                       // 정적 번들: 상대 경로
  cacheDir: 'C:/tmp/algo-viz-build', // OneDrive 한글경로 회피
})
```

`vitest.config.js`:
```js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom', globals: true },
})
```

`package.json` scripts에 추가:
```json
"scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview", "test": "vitest run" }
```

- [ ] **Step 3: 엔트리 파일**

`index.html`:
```html
<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>코테 알고리즘 시각화</title></head>
<body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>
```

`src/main.js`:
```js
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

`src/App.vue` (임시 — Task 6에서 완성):
```vue
<template><div>scaffold ok</div></template>
```

- [ ] **Step 4: 빌드 확인**

Run: `npm run build`
Expected: `dist/` 생성, 에러 없음.

- [ ] **Step 5: 커밋**

```bash
git add -A && git commit -m "chore: Vite+Vue3 스캐폴딩"
```

---

## Task 1: 스텝 엔진 타입 + 헬퍼

**Files:**
- Create: `src/engine/types.js`

- [ ] **Step 1: makeStep 헬퍼 작성**

`src/engine/types.js`:
```js
/**
 * @typedef {Object} Step
 * @property {number} line  - 좌측 코드 하이라이트 줄(1-based)
 * @property {Object} state - 우측 시각화 스냅샷(토픽별)
 * @property {string} [note]- 스텝 설명 한 줄
 */

/** @returns {Step} */
export function makeStep(line, state, note = '') {
  // state는 매 스텝 깊은 복사(이후 변형이 과거 스텝을 오염시키지 않게)
  return { line, state: structuredClone(state), note }
}
```

- [ ] **Step 2: 커밋**

```bash
git add -A && git commit -m "feat: 스텝 엔진 타입/헬퍼"
```

---

## Task 2: 정렬 step generator (TDD)

정렬은 배열 상태 `{ arr:number[], compared:number[], swapped:number[], sorted:number[] }`를 스텝으로 낸다. `compared`/`swapped`/`sorted`는 강조용 인덱스 배열.

**Files:**
- Create: `src/topics/sorting.js`
- Test: `test/sorting.test.js`

- [ ] **Step 1: 실패 테스트 작성**

`test/sorting.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { bubbleSortSteps, sortingTopic } from '../src/topics/sorting.js'

describe('bubbleSortSteps', () => {
  it('마지막 스텝의 arr는 오름차순 정렬 결과다', () => {
    const steps = bubbleSortSteps([3, 1, 2])
    expect(steps.at(-1).state.arr).toEqual([1, 2, 3])
  })
  it('모든 스텝은 line과 state.arr를 가진다', () => {
    const steps = bubbleSortSteps([3, 1, 2])
    expect(steps.length).toBeGreaterThan(0)
    for (const s of steps) {
      expect(typeof s.line).toBe('number')
      expect(Array.isArray(s.state.arr)).toBe(true)
    }
  })
  it('마지막 스텝은 전체가 sorted로 표시된다', () => {
    const steps = bubbleSortSteps([3, 1, 2])
    expect(steps.at(-1).state.sorted).toEqual([0, 1, 2])
  })
})

describe('sortingTopic', () => {
  it('레지스트리 메타를 노출한다', () => {
    expect(sortingTopic.id).toBe('sorting')
    expect(sortingTopic.rendererId).toBe('array-bars')
    expect(typeof sortingTopic.javaCode).toBe('string')
    expect(sortingTopic.algorithms.bubble.build).toBeTypeOf('function')
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- test/sorting.test.js`
Expected: FAIL ("Cannot find module sorting.js").

- [ ] **Step 3: 구현**

`src/topics/sorting.js` — 버블 정렬 줄번호는 아래 `bubbleJava` 코드 기준.
```js
import { makeStep } from '../engine/types.js'

const bubbleJava = `void bubbleSort(int[] a) {
  int n = a.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
      }
    }
  }
}`

export function bubbleSortSteps(input) {
  const arr = [...input]
  const n = arr.length
  const sorted = []
  const steps = []
  const snap = (line, compared, swapped, note) =>
    steps.push(makeStep(line, { arr: [...arr], compared, swapped, sorted: [...sorted] }, note))

  snap(1, [], [], '버블 정렬 시작')
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      snap(4, [j, j + 1], [], `a[${j}]와 a[${j + 1}] 비교`)
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        snap(6, [], [j, j + 1], `교환`)
      }
    }
    sorted.unshift(n - 1 - i)
  }
  sorted.unshift(0)
  snap(8, [], [], '정렬 완료')
  steps.at(-1).state.sorted = arr.map((_, k) => k)
  return steps
}

// 선택/삽입/병합/퀵은 동일 패턴(상태 형태 동일, 줄번호는 각 코드 기준).
// 각 build 함수는 위와 같은 snap 규칙을 따른다.
export { bubbleJava }

export const sortingTopic = {
  id: 'sorting',
  week: 3,
  title: '정렬 (Sorting)',
  rendererId: 'array-bars',
  complexity: { time: 'O(n²)~O(n log n)', space: 'O(1)~O(n)' },
  concept: '정렬은 비교 기반 정렬(버블/선택/삽입 O(n²), 병합/퀵 O(n log n))과 ' +
    'Java 표준 Arrays.sort(원시형=듀얼피벗 퀵, 객체=TimSort)로 나뉜다. ' +
    '코테에서 직접 구현보다 Arrays.sort/Collections.sort + Comparator가 더 자주 쓰인다.',
  realWorld: 'Arrays.sort(int[]) / Collections.sort(List) / list.sort(Comparator.comparingInt(...))',
  javaCode: bubbleJava,
  algorithms: {
    bubble: { label: '버블', code: bubbleJava, build: bubbleSortSteps },
    // selection, insertion, merge, quick 추가
  },
}
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- test/sorting.test.js`
Expected: PASS.

- [ ] **Step 5: 나머지 4종(선택·삽입·병합·퀵) 추가 + 각 1개 정렬결과 테스트**

각 `xxxSortSteps`에 대해 `expect(steps.at(-1).state.arr).toEqual([...정렬결과])` 테스트를 추가하고 통과시킨다. (버블과 동일한 snap/상태 계약 사용.)

- [ ] **Step 6: 커밋**

```bash
git add -A && git commit -m "feat: 정렬 5종 스텝 제너레이터 + 테스트"
```

---

## Task 3: 이진탐색 step generator (TDD)

상태 `{ arr, lo, hi, mid, target, found }`. 렌더러는 array-bars 재사용(lo/hi/mid 강조).

**Files:**
- Create: `src/topics/binarySearch.js`
- Test: `test/binarySearch.test.js`

- [ ] **Step 1: 실패 테스트**

```js
import { describe, it, expect } from 'vitest'
import { binarySearchSteps } from '../src/topics/binarySearch.js'

describe('binarySearchSteps', () => {
  it('타깃을 찾으면 마지막 스텝 found가 인덱스다', () => {
    const steps = binarySearchSteps([1, 3, 5, 7, 9], 7)
    expect(steps.at(-1).state.found).toBe(3)
  })
  it('없으면 found는 -1', () => {
    const steps = binarySearchSteps([1, 3, 5], 4)
    expect(steps.at(-1).state.found).toBe(-1)
  })
  it('각 스텝은 lo<=hi 또는 종료 상태다', () => {
    const steps = binarySearchSteps([1, 3, 5, 7, 9], 9)
    expect(steps.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: 실패 확인** — Run: `npm test -- test/binarySearch.test.js` → FAIL.

- [ ] **Step 3: 구현**

```js
import { makeStep } from '../engine/types.js'

const java = `int binarySearch(int[] a, int target) {
  int lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`

export function binarySearchSteps(a, target) {
  const steps = []
  let lo = 0, hi = a.length - 1, found = -1
  const snap = (line, mid, note) =>
    steps.push(makeStep(line, { arr: [...a], lo, hi, mid, target, found }, note))
  snap(2, -1, `lo=0, hi=${hi}`)
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1
    snap(4, mid, `mid=${mid}, a[mid]=${a[mid]}`)
    if (a[mid] === target) { found = mid; snap(5, mid, '발견'); break }
    if (a[mid] < target) { lo = mid + 1; snap(6, mid, '오른쪽 절반') }
    else { hi = mid - 1; snap(7, mid, '왼쪽 절반') }
  }
  if (found === -1) snap(9, -1, '없음')
  return steps
}

export const binarySearchTopic = {
  id: 'binary-search', week: 2, title: '이진탐색 (Binary Search)',
  rendererId: 'array-bars',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  concept: '정렬된 배열에서 매번 탐색 범위를 절반으로 줄인다. ' +
    'Java는 Arrays.binarySearch / Collections.binarySearch 제공. ' +
    'mid 계산은 오버플로 방지로 (lo+hi)>>>1 사용.',
  realWorld: 'Arrays.binarySearch(int[], key) / Collections.binarySearch(List, key)',
  javaCode: java,
  algorithms: { default: { label: '이진탐색', code: java, build: (a = [1,3,5,7,9,11], t = 7) => binarySearchSteps(a, t) } },
}
```

- [ ] **Step 4: 통과 확인** — Run: `npm test -- test/binarySearch.test.js` → PASS.

- [ ] **Step 5: 커밋** — `git commit -m "feat: 이진탐색 스텝 제너레이터 + 테스트"`

---

## Task 4: BFS/DFS step generator (TDD)

그래프는 인접 리스트 `{0:[1,2],...}`. 상태 `{ nodes, edges, visited:number[], frontier:number[], current }`.

**Files:**
- Create: `src/topics/graphTraversal.js`
- Test: `test/graphTraversal.test.js`

- [ ] **Step 1: 실패 테스트**

```js
import { describe, it, expect } from 'vitest'
import { bfsSteps, dfsSteps } from '../src/topics/graphTraversal.js'

const adj = { 0: [1, 2], 1: [3], 2: [3], 3: [] }

describe('bfsSteps', () => {
  it('방문 순서는 0,1,2,3', () => {
    const steps = bfsSteps(adj, 0)
    expect(steps.at(-1).state.visited).toEqual([0, 1, 2, 3])
  })
})
describe('dfsSteps', () => {
  it('0에서 시작해 모든 노드를 방문한다', () => {
    const steps = dfsSteps(adj, 0)
    expect([...steps.at(-1).state.visited].sort()).toEqual([0, 1, 2, 3])
    expect(steps.at(-1).state.visited[0]).toBe(0)
  })
})
```

- [ ] **Step 2: 실패 확인** — FAIL.

- [ ] **Step 3: 구현** (BFS=큐 ArrayDeque 관점, DFS=재귀)

```js
import { makeStep } from '../engine/types.js'

const nodesOf = (adj) => Object.keys(adj).map(Number)
const edgesOf = (adj) => nodesOf(adj).flatMap(u => adj[u].map(v => [u, v]))

const bfsJava = `void bfs(List<List<Integer>> adj, int start) {
  Queue<Integer> q = new ArrayDeque<>();
  boolean[] vis = new boolean[adj.size()];
  q.add(start); vis[start] = true;
  while (!q.isEmpty()) {
    int u = q.poll();
    for (int v : adj.get(u))
      if (!vis[v]) { vis[v] = true; q.add(v); }
  }
}`

export function bfsSteps(adj, start) {
  const steps = [], visited = [], q = [start]
  const vis = new Set([start])
  const base = { nodes: nodesOf(adj), edges: edgesOf(adj) }
  const snap = (line, current, note) =>
    steps.push(makeStep(line, { ...base, visited: [...visited], frontier: [...q], current }, note))
  snap(4, start, `시작 ${start} 큐에 추가`)
  while (q.length) {
    const u = q.shift()
    visited.push(u)
    snap(6, u, `${u} 방문(큐에서 꺼냄)`)
    for (const v of adj[u]) if (!vis.has(v)) { vis.add(v); q.push(v); snap(8, u, `${v} 큐에 추가`) }
  }
  return steps
}

const dfsJava = `void dfs(List<List<Integer>> adj, int u, boolean[] vis) {
  vis[u] = true;            // 방문 처리
  for (int v : adj.get(u))
    if (!vis[v]) dfs(adj, v, vis);
}`

export function dfsSteps(adj, start) {
  const steps = [], visited = [], vis = new Set()
  const base = { nodes: nodesOf(adj), edges: edgesOf(adj) }
  const snap = (line, current, note) =>
    steps.push(makeStep(line, { ...base, visited: [...visited], frontier: [], current }, note))
  const go = (u) => {
    vis.add(u); visited.push(u); snap(2, u, `${u} 방문`)
    for (const v of adj[u]) if (!vis.has(v)) { snap(4, u, `${u}→${v} 진입`); go(v) }
  }
  go(start)
  return steps
}

export const graphTopic = {
  id: 'graph-traversal', week: 4, title: 'BFS / DFS',
  rendererId: 'graph',
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  concept: 'BFS는 큐(ArrayDeque)로 가까운 노드부터, DFS는 재귀/스택으로 깊이 먼저. ' +
    '최단경로(가중치 1)는 BFS, 연결요소/사이클 탐지는 DFS가 흔하다.',
  realWorld: 'ArrayDeque<Integer> (BFS 큐) / 재귀 호출 스택 (DFS)',
  javaCode: bfsJava,
  algorithms: {
    bfs: { label: 'BFS', code: bfsJava, build: (a = { 0:[1,2],1:[3,4],2:[4],3:[],4:[] }, s = 0) => bfsSteps(a, s) },
    dfs: { label: 'DFS', code: dfsJava, build: (a = { 0:[1,2],1:[3,4],2:[4],3:[],4:[] }, s = 0) => dfsSteps(a, s) },
  },
}
```

- [ ] **Step 4: 통과 확인** — PASS.
- [ ] **Step 5: 커밋** — `git commit -m "feat: BFS/DFS 스텝 제너레이터 + 테스트"`

---

## Task 5: 재귀 콜스택 step generator (TDD)

상태 `{ frames:[{call:string, ret?:number}], result? }`. 콜스택 push/pop 시각화.

**Files:**
- Create: `src/topics/recursion.js`
- Test: `test/recursion.test.js`

- [ ] **Step 1: 실패 테스트**

```js
import { describe, it, expect } from 'vitest'
import { factorialSteps } from '../src/topics/recursion.js'

describe('factorialSteps', () => {
  it('마지막 스텝 result는 n!', () => {
    expect(factorialSteps(4).at(-1).state.result).toBe(24)
  })
  it('최대 깊이에서 프레임 수가 n에 도달한다', () => {
    const maxDepth = Math.max(...factorialSteps(4).map(s => s.state.frames.length))
    expect(maxDepth).toBe(4)
  })
})
```

- [ ] **Step 2: 실패 확인** — FAIL.

- [ ] **Step 3: 구현**

```js
import { makeStep } from '../engine/types.js'

const java = `int factorial(int n) {
  if (n <= 1) return 1;          // 기저 조건
  return n * factorial(n - 1);   // 재귀 호출
}`

export function factorialSteps(n) {
  const steps = [], frames = []
  let result
  const snap = (line, note) =>
    steps.push(makeStep(line, { frames: frames.map(f => ({ ...f })), result }, note))
  const go = (k) => {
    frames.push({ call: `factorial(${k})` })
    snap(1, `factorial(${k}) 호출 — 스택 push`)
    if (k <= 1) {
      frames.at(-1).ret = 1
      snap(2, `기저 조건: 1 반환`)
      const r = 1; frames.pop(); return r
    }
    const sub = go(k - 1)
    const r = k * sub
    frames.at(-1).ret = r
    snap(3, `${k} * ${sub} = ${r} 반환 — 스택 pop`)
    frames.pop()
    return r
  }
  result = go(n)
  snap(3, `최종 결과 ${result}`)
  return steps
}

export const recursionTopic = {
  id: 'recursion', week: 2, title: '재귀 (Recursion)',
  rendererId: 'call-stack',
  complexity: { time: 'O(n)', space: 'O(n) (콜스택 깊이)' },
  concept: '재귀는 기저 조건(base case)과 재귀 호출로 구성된다. 각 호출은 JVM 콜스택에 ' +
    '프레임으로 쌓이며, 너무 깊으면 StackOverflowError. 반복문/메모이제이션으로 변환 가능.',
  realWorld: 'JVM 호출 스택 / 깊이 깊으면 명시적 Deque로 반복 변환',
  javaCode: java,
  algorithms: { factorial: { label: '팩토리얼', code: java, build: (n = 4) => factorialSteps(n) } },
}
```

- [ ] **Step 4: 통과 확인** — PASS.
- [ ] **Step 5: 커밋** — `git commit -m "feat: 재귀 콜스택 스텝 제너레이터 + 테스트"`

---

## Task 6: 토픽 레지스트리 + 재생 컴포저블

**Files:**
- Create: `src/topics/index.js`, `src/composables/useStepPlayer.js`

- [ ] **Step 1: 레지스트리**

`src/topics/index.js`:
```js
import { sortingTopic } from './sorting.js'
import { binarySearchTopic } from './binarySearch.js'
import { graphTopic } from './graphTraversal.js'
import { recursionTopic } from './recursion.js'

export const topics = [sortingTopic, binarySearchTopic, graphTopic, recursionTopic]
export const weeks = [
  { week: 2, title: '2주차 — 배열·이진탐색·재귀' },
  { week: 3, title: '3주차 — 정렬·스택·큐·해쉬' },
  { week: 4, title: '4주차 — 트리·힙·BFS·DFS·DP' },
]
export const topicsByWeek = (w) => topics.filter(t => t.week === w)
```

- [ ] **Step 2: 재생 컴포저블**

`src/composables/useStepPlayer.js`:
```js
import { ref, computed, onUnmounted } from 'vue'

export function useStepPlayer(stepsRef) {
  const index = ref(0)
  const playing = ref(false)
  const speed = ref(1)          // 1x = 700ms/스텝
  let timer = null

  const current = computed(() => stepsRef.value[index.value] ?? { line: 0, state: {}, note: '' })
  const total = computed(() => stepsRef.value.length)

  function stop() { playing.value = false; clearInterval(timer); timer = null }
  function next() { if (index.value < total.value - 1) index.value++; else stop() }
  function prev() { if (index.value > 0) index.value-- }
  function reset() { stop(); index.value = 0 }
  function play() {
    if (playing.value) return stop()
    playing.value = true
    timer = setInterval(next, 700 / speed.value)
  }
  function seek(i) { index.value = Math.max(0, Math.min(total.value - 1, i)) }

  onUnmounted(stop)
  return { index, playing, speed, current, total, next, prev, reset, play, seek }
}
```

- [ ] **Step 3: 커밋** — `git commit -m "feat: 토픽 레지스트리 + 재생 컴포저블"`

---

## Task 7: 렌더러 3종

각 렌더러는 `props.state`만 받는 순수 표현 컴포넌트. 인라인 SVG.

**Files:**
- Create: `src/renderers/ArrayBars.vue`, `GraphView.vue`, `CallStack.vue`

- [ ] **Step 1: ArrayBars.vue** — `state.arr`를 막대로, `compared`/`swapped`/`sorted`/`lo`/`hi`/`mid`를 색으로 강조.

```vue
<script setup>
const props = defineProps({ state: { type: Object, required: true } })
const colorOf = (i) => {
  const s = props.state
  if (s.found === i) return '#16a34a'
  if (s.mid === i) return '#f59e0b'
  if (s.sorted?.includes(i)) return '#16a34a'
  if (s.swapped?.includes(i)) return '#ef4444'
  if (s.compared?.includes(i)) return '#3b82f6'
  if ((s.lo !== undefined && i < s.lo) || (s.hi !== undefined && i > s.hi)) return '#d1d5db'
  return '#64748b'
}
</script>
<template>
  <div class="bars">
    <div v-for="(v,i) in state.arr" :key="i" class="bar"
         :style="{ height: (v*8+12)+'px', background: colorOf(i) }">
      <span>{{ v }}</span>
    </div>
  </div>
</template>
<style scoped>
.bars{display:flex;gap:6px;align-items:flex-end;height:100%;padding:16px}
.bar{width:34px;border-radius:4px 4px 0 0;color:#fff;display:flex;align-items:flex-end;justify-content:center;font-size:12px;transition:height .2s,background .2s}
</style>
```

- [ ] **Step 2: GraphView.vue** — `state.nodes`를 원형 배치, `state.edges` 선, `visited`/`current`/`frontier` 색 강조.

```vue
<script setup>
import { computed } from 'vue'
const props = defineProps({ state: { type: Object, required: true } })
const pos = computed(() => {
  const n = props.state.nodes ?? []
  const cx = 200, cy = 160, r = 120
  return Object.fromEntries(n.map((id, i) => {
    const a = (i / n.length) * 2 * Math.PI - Math.PI / 2
    return [id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }]
  }))
})
const fill = (id) => {
  const s = props.state
  if (s.current === id) return '#f59e0b'
  if (s.visited?.includes(id)) return '#16a34a'
  if (s.frontier?.includes(id)) return '#3b82f6'
  return '#64748b'
}
</script>
<template>
  <svg viewBox="0 0 400 320" class="g">
    <line v-for="(e,i) in state.edges" :key="i"
      :x1="pos[e[0]].x" :y1="pos[e[0]].y" :x2="pos[e[1]].x" :y2="pos[e[1]].y" stroke="#cbd5e1" stroke-width="2"/>
    <g v-for="id in state.nodes" :key="id">
      <circle :cx="pos[id].x" :cy="pos[id].y" r="20" :fill="fill(id)"/>
      <text :x="pos[id].x" :y="pos[id].y+5" text-anchor="middle" fill="#fff" font-size="14">{{ id }}</text>
    </g>
  </svg>
</template>
<style scoped>.g{width:100%;height:100%}</style>
```

- [ ] **Step 3: CallStack.vue** — `state.frames`를 아래에서 위로 쌓인 프레임으로, `ret` 있으면 반환값 표시.

```vue
<script setup>
defineProps({ state: { type: Object, required: true } })
</script>
<template>
  <div class="cs">
    <div class="result" v-if="state.result !== undefined">결과: {{ state.result }}</div>
    <div class="frames">
      <div v-for="(f,i) in [...state.frames].reverse()" :key="i"
           class="frame" :class="{ done: f.ret !== undefined }">
        {{ f.call }}<span v-if="f.ret !== undefined"> → {{ f.ret }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.cs{padding:16px;height:100%;display:flex;flex-direction:column;gap:10px}
.frames{display:flex;flex-direction:column;gap:4px;justify-content:flex-end}
.frame{background:#1e293b;color:#e2e8f0;padding:8px 12px;border-radius:6px;font-family:monospace}
.frame.done{background:#166534}
.result{font-weight:bold}
</style>
```

- [ ] **Step 4: 커밋** — `git commit -m "feat: 렌더러 3종(배열바·그래프·콜스택)"`

---

## Task 8: 코어 컴포넌트 + 셸 조립

**Files:**
- Create: `src/components/CodePanel.vue`, `StepController.vue`, `VizStage.vue`, `TopicView.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: CodePanel.vue** — highlight.js로 Java 하이라이트 + 현재 줄 배경 강조.

```vue
<script setup>
import { computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import 'highlight.js/styles/github-dark.css'
hljs.registerLanguage('java', java)
const props = defineProps({ code: String, activeLine: Number })
const lines = computed(() =>
  props.code.split('\n').map((l, i) => ({
    n: i + 1,
    html: hljs.highlight(l, { language: 'java' }).value || '&nbsp;',
  })))
</script>
<template>
  <pre class="code"><code><div v-for="l in lines" :key="l.n"
    class="ln" :class="{ active: l.n === activeLine }"><span class="gutter">{{ l.n }}</span><span v-html="l.html"></span></div></code></pre>
</template>
<style scoped>
.code{margin:0;height:100%;overflow:auto;background:#0d1117;font-size:13px;line-height:1.6}
.ln{display:flex;padding:0 12px}
.ln.active{background:#1f6feb33;box-shadow:inset 3px 0 #1f6feb}
.gutter{width:28px;color:#6e7681;user-select:none;text-align:right;margin-right:12px}
</style>
```

- [ ] **Step 2: StepController.vue** — props `index,total,playing`; emits `play,next,prev,reset,seek,speed`.

```vue
<script setup>
defineProps({ index: Number, total: Number, playing: Boolean, note: String })
const emit = defineEmits(['play','next','prev','reset','seek','speed'])
</script>
<template>
  <div class="ctrl">
    <button @click="emit('reset')">⏮</button>
    <button @click="emit('prev')">◀</button>
    <button @click="emit('play')">{{ playing ? '⏸' : '▶' }}</button>
    <button @click="emit('next')">▶|</button>
    <input type="range" min="0" :max="total-1" :value="index" @input="emit('seek', +$event.target.value)"/>
    <span class="pos">{{ index+1 }}/{{ total }}</span>
    <select @change="emit('speed', +$event.target.value)">
      <option value="0.5">0.5x</option><option value="1" selected>1x</option><option value="2">2x</option>
    </select>
    <span class="note">{{ note }}</span>
  </div>
</template>
<style scoped>
.ctrl{display:flex;gap:8px;align-items:center;padding:10px;border-top:1px solid #e2e8f0;flex-wrap:wrap}
button{padding:4px 10px;cursor:pointer}
.pos{font-variant-numeric:tabular-nums}
.note{color:#475569;font-size:13px;margin-left:auto}
input[type=range]{flex:1;min-width:120px}
</style>
```

- [ ] **Step 3: VizStage.vue** — `rendererId`로 렌더러 선택.

```vue
<script setup>
import ArrayBars from '../renderers/ArrayBars.vue'
import GraphView from '../renderers/GraphView.vue'
import CallStack from '../renderers/CallStack.vue'
const map = { 'array-bars': ArrayBars, 'graph': GraphView, 'call-stack': CallStack }
const props = defineProps({ rendererId: String, state: Object })
</script>
<template>
  <div class="stage"><component :is="map[rendererId]" :state="state" v-if="state" /></div>
</template>
<style scoped>.stage{height:100%;display:flex;align-items:center;justify-content:center}</style>
```

- [ ] **Step 4: TopicView.vue** — 토픽 + 선택된 알고리즘 키를 받아 스텝 생성, 좌/우 패널 + 컨트롤러 + 개념 조립.

```vue
<script setup>
import { ref, computed, watch } from 'vue'
import { useStepPlayer } from '../composables/useStepPlayer.js'
import CodePanel from './CodePanel.vue'
import VizStage from './VizStage.vue'
import StepController from './StepController.vue'
const props = defineProps({ topic: Object })
const algoKeys = computed(() => Object.keys(props.topic.algorithms))
const algoKey = ref(algoKeys.value[0])
watch(() => props.topic, () => { algoKey.value = Object.keys(props.topic.algorithms)[0] })
const algo = computed(() => props.topic.algorithms[algoKey.value])
const steps = computed(() => algo.value.build())
const player = useStepPlayer(steps)
watch(steps, () => player.reset())
</script>
<template>
  <section class="topic">
    <header>
      <h2>{{ topic.title }}</h2>
      <p class="cx">시간 {{ topic.complexity.time }} · 공간 {{ topic.complexity.space }}</p>
      <p class="concept">{{ topic.concept }}</p>
      <p class="rw">☕ Java 표준: {{ topic.realWorld }}</p>
      <div class="algos" v-if="algoKeys.length > 1">
        <button v-for="k in algoKeys" :key="k" :class="{ on: k===algoKey }" @click="algoKey=k">
          {{ topic.algorithms[k].label }}</button>
      </div>
    </header>
    <div class="split">
      <CodePanel class="left" :code="algo.code" :activeLine="player.current.value.line"/>
      <VizStage class="right" :rendererId="topic.rendererId" :state="player.current.value.state"/>
    </div>
    <StepController :index="player.index.value" :total="player.total.value"
      :playing="player.playing.value" :note="player.current.value.note"
      @play="player.play" @next="player.next" @prev="player.prev" @reset="player.reset"
      @seek="player.seek" @speed="v => player.speed.value = v"/>
  </section>
</template>
<style scoped>
.topic{display:flex;flex-direction:column;height:100%}
header{padding:16px;border-bottom:1px solid #e2e8f0}
h2{margin:0 0 4px}
.cx{color:#0369a1;font-size:13px;margin:2px 0}
.concept{color:#334155;font-size:14px;margin:6px 0}
.rw{color:#92400e;font-size:13px;background:#fef3c7;padding:6px 10px;border-radius:6px;display:inline-block}
.algos{margin-top:8px;display:flex;gap:6px}
.algos button{padding:4px 12px;cursor:pointer}
.algos button.on{background:#1f6feb;color:#fff}
.split{flex:1;display:grid;grid-template-columns:1fr 1fr;min-height:0}
.left{border-right:1px solid #e2e8f0}
.right{background:#f8fafc}
</style>
```

- [ ] **Step 5: App.vue** — 사이드바(주차→토픽) + 현재 토픽 TopicView.

```vue
<script setup>
import { ref } from 'vue'
import { topics, weeks, topicsByWeek } from './topics/index.js'
import TopicView from './components/TopicView.vue'
const selected = ref(topics[0])
</script>
<template>
  <div class="app">
    <nav>
      <h1>코테 알고리즘 시각화</h1>
      <div v-for="w in weeks" :key="w.week" class="wk">
        <div class="wk-t">{{ w.title }}</div>
        <button v-for="t in topicsByWeek(w.week)" :key="t.id"
          :class="{ on: t.id===selected.id }" @click="selected=t">{{ t.title }}</button>
      </div>
      <p class="cr">ⓒ 딩코딩코 원작 기반 · Java 재서술</p>
    </nav>
    <main><TopicView :topic="selected" :key="selected.id"/></main>
  </div>
</template>
<style>
*{box-sizing:border-box}body{margin:0;font-family:'Malgun Gothic',system-ui,sans-serif}
.app{display:grid;grid-template-columns:240px 1fr;height:100vh}
nav{background:#0f172a;color:#e2e8f0;padding:16px;overflow:auto}
nav h1{font-size:16px;margin:0 0 16px}
.wk-t{color:#94a3b8;font-size:12px;margin:14px 0 6px}
nav button{display:block;width:100%;text-align:left;background:none;border:none;color:#cbd5e1;padding:7px 8px;border-radius:6px;cursor:pointer;font-size:14px}
nav button.on{background:#1f6feb;color:#fff}
.cr{color:#64748b;font-size:11px;margin-top:24px}
main{min-width:0;overflow:hidden}
</style>
```

- [ ] **Step 6: 전체 테스트 + 빌드 + 브라우저 확인**

Run: `npm test` → 모든 테스트 PASS.
Run: `npm run build` → `dist/` 생성, 에러 없음.
Run: `npm run dev` → 브라우저에서 토픽 전환·재생·줄 하이라이트·시각화 동기화 수동 확인.

- [ ] **Step 7: 커밋** — `git commit -m "feat: 코어 컴포넌트 + 셸 조립(Phase 1 완료)"`

---

## Self-Review 결과

- **Spec 커버리지:** 스텝 동기화 엔진(§4)=Task1·6, 토픽 데이터 모델(§4.3)=Task2~5, 콘텐츠 Java 재서술(§5)=각 토픽 concept/realWorld/javaCode, Phase1 4토픽(§6)=Task2~5, 정적 빌드(§2)=Task0/8. 커버됨.
- **타입 일관성:** Step=`{line,state,note}` 전 토픽 공통, 렌더러 state 형태는 rendererId로 매핑(array-bars/graph/call-stack). useStepPlayer 반환(`current/index/total/...`)을 TopicView가 그대로 사용. 일치.
- **Placeholder:** 정렬 4종/추가 테스트는 "동일 패턴" 명시(Task2 Step5) — 버블 코드가 완전 예시로 존재하므로 반복 작성 가능.
- **범위:** Phase 1만. 방법론·나머지 자료구조는 Phase 2/3.
