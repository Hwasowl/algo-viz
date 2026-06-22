import { makeStep } from '../engine/types.js'

// 최소 힙: 부모 <= 자식. 배열로 표현(1-기반): 자식 i의 부모 = i/2
const java = `void push(int x) {                  // 최소 힙 삽입
  heap[++size] = x;                // ① 맨 끝에 추가
  int i = size;
  while (i > 1 && heap[i/2] > heap[i]) { // ② 부모가 더 크면
    swap(i, i/2);                  // ③ 부모와 교환(위로 올림)
    i /= 2;
  }
}`

export function heapInsertSteps(values = [5, 3, 8, 1, 9, 2]) {
  const heap = [0] // index 0 미사용(1-기반)
  const steps = []
  const snap = (line, highlight, swapped, note) =>
    steps.push(makeStep(line, { heap: heap.slice(1), highlight, swapped, note }, note))

  snap(1, [], [], '최소 힙: 부모는 항상 자식보다 작다. 맨 위(루트)가 최솟값')
  for (const x of values) {
    heap.push(x)
    let i = heap.length - 1
    snap(2, [i - 1], [], `${x} 를 맨 끝에 추가 (위치 ${i})`)
    while (i > 1 && heap[i >> 1] > heap[i]) {
      const p = i >> 1
      snap(4, [i - 1, p - 1], [], `부모 ${heap[p]} > 자식 ${heap[i]} → 교환 필요`)
      ;[heap[i], heap[p]] = [heap[p], heap[i]]
      snap(5, [], [i - 1, p - 1], `교환 완료, 위로 올라감`)
      i = p
    }
  }
  snap(7, [], [], `완성: 루트(맨 위) = ${heap[1]} 가 전체 최솟값`)
  return steps
}

export const heapTopic = {
  id: 'heap',
  week: 4,
  title: '힙 / 우선순위 큐 (Heap)',
  rendererId: 'heap-view',
  complexity: { time: '삽입/삭제 O(log n) · 최솟값 O(1)', space: 'O(n)' },
  plainDef: '"항상 가장 작은(또는 큰) 값"을 맨 위에서 빠르게 꺼낼 수 있게 정리된, 트리 모양 자료구조.',
  analogy: '응급실 대기. 들어온 순서가 아니라 위급한 순서로 먼저 처리된다. 가장 급한 환자가 항상 맨 앞에 정렬되어 있다.',
  why: '"가장 작은/큰 것을 반복해서 꺼내는" 문제에 최적 — 다익스트라 최단경로, K번째 수, 작업 스케줄링 등. 매번 정렬하는 것(O(n log n))보다 훨씬 효율적.',
  terms: [
    { word: '완전 이진 트리', desc: '왼쪽부터 빈틈없이 채운 이진 트리. 덕분에 배열로 깔끔하게 표현할 수 있다.' },
    { word: 'sift-up', desc: '새로 넣은 값이 부모보다 작으면 부모와 교환하며 위로 올라가 힙 규칙을 회복하는 과정.' },
    { word: '우선순위 큐', desc: '꺼낼 때 항상 우선순위가 가장 높은(작은/큰) 값이 나오는 큐. 보통 힙으로 구현한다.' },
    { word: 'PriorityQueue', desc: 'Java의 우선순위 큐. 기본은 최소 힙. 최대 힙은 Collections.reverseOrder()로 만든다.' },
  ],
  coteTip:
    'Java는 PriorityQueue<Integer> pq = new PriorityQueue<>(); (최소 힙)를 그냥 쓰면 된다 — 직접 구현은 거의 안 한다. ' +
    '최대 힙은 new PriorityQueue<>(Collections.reverseOrder()), 복잡한 기준은 Comparator로 지정. 다익스트라·K개 추적 문제의 필수 도구.',
  concept:
    '힙은 "부모 ≤ 자식"(최소 힙) 규칙을 지키는 완전 이진 트리이며, 배열로 표현한다(자식 i의 부모 = i/2). ' +
    '삽입은 맨 끝에 넣고 부모와 비교하며 올라가(sift-up) O(log n)에 규칙을 회복한다. 루트는 항상 최솟값이라 O(1)에 꺼낸다.',
  realWorld: 'PriorityQueue<Integer> (최소 힙) · reverseOrder()로 최대 힙 · 다익스트라',
  javaCode: java,
  algorithms: { default: { label: '삽입 (sift-up)', code: java, build: () => heapInsertSteps() } },
}
