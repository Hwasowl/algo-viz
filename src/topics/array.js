import { makeStep } from '../engine/types.js'

const java = `int[] a = {10, 20, 30, 40, 50};
// 1) 인덱스 접근: O(1) — 위치를 바로 계산
int x = a[2];                 // 30
// 2) 중간 삽입: O(n) — 뒤 원소를 한 칸씩 밀기
//    list.add(1, 99);
// 3) 앞 삭제: O(n) — 뒤 원소를 한 칸씩 당기기
//    list.remove(0);`

export function arraySteps() {
  let arr = [10, 20, 30, 40, 50]
  const steps = []
  const snap = (line, highlight, shifting, inserted, note) =>
    steps.push(makeStep(line, { cells: arr.map((v) => ({ v })), highlight, shifting, inserted, note }, note))

  snap(1, [], [], [], '배열: 같은 크기 칸이 연속된 메모리에 줄지어 있다')
  snap(3, [2], [], [], 'a[2] 접근 — 시작 주소 + 2칸으로 위치를 바로 계산해 O(1)')
  snap(5, [], [1, 2, 3, 4], [], '1번에 99 삽입 준비 — 1번부터 뒤 원소를 한 칸씩 밀어야 한다')
  arr = [10, 99, 20, 30, 40, 50]
  snap(5, [], [], [1], '99 삽입 완료 — 뒤 원소가 모두 이동해서 O(n)')
  snap(8, [], [1, 2, 3, 4, 5], [], '0번 삭제 준비 — 뒤 원소를 한 칸씩 당겨야 한다')
  arr = [99, 20, 30, 40, 50]
  snap(8, [], [], [], '삭제 완료 — 역시 O(n)')
  return steps
}

export const arrayTopic = {
  id: 'array',
  week: 2,
  title: '배열 (Array)',
  rendererId: 'array-cells',
  complexity: { time: '접근 O(1) · 삽입/삭제 O(n)', space: 'O(n)' },
  plainDef: '같은 종류의 값을 번호(인덱스)가 붙은 칸에 연속으로 담아 두는, 가장 기본적인 자료구조.',
  analogy: '번호가 붙은 사물함 한 줄. 27번 사물함은 바로 찾아갈 수 있지만(빠름), 중간에 새 사물함을 끼우려면 뒤 사물함을 전부 옮겨야 한다(느림).',
  why: '인덱스로 즉시 접근(O(1))이 가능해 가장 빠르고 메모리 효율이 좋다. 대부분의 자료구조·알고리즘의 토대.',
  terms: [
    { word: '인덱스', desc: '배열에서 각 칸의 번호. 0부터 시작한다. a[2]는 세 번째 칸.' },
    { word: '연속된 메모리', desc: '값들이 메모리에 빈틈없이 붙어 저장된 상태. 덕분에 "시작주소 + 인덱스"로 위치를 즉시 계산한다.' },
    { word: 'ArrayList', desc: '크기가 자동으로 늘어나는 Java의 동적 배열. 내부는 배열이라 접근은 O(1), 중간 삽입/삭제는 O(n).' },
  ],
  coteTip:
    '크기가 고정이면 기본 배열(int[]), 크기가 변하면 ArrayList를 쓴다. ' +
    '맨 뒤 추가/삭제는 O(1)이지만 앞·중간 삽입/삭제는 O(n)이라, 그런 연산이 많으면 LinkedList나 Deque를 고려한다.',
  concept:
    '배열은 연속된 메모리에 값을 담아 인덱스로 위치를 즉시 계산한다(O(1) 접근). 대신 중간에 끼우거나 빼면 뒤 원소를 모두 밀거나 당겨야 해서 O(n)이다. ' +
    '"읽기는 많고 중간 수정은 드물다" 면 배열이 최적이다.',
  realWorld: 'int[] (고정) · ArrayList (가변) · 맨 뒤 add/remove는 O(1)',
  javaCode: java,
  algorithms: { default: { label: '접근·삽입·삭제', code: java, build: () => arraySteps() } },
}
