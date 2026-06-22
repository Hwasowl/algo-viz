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

// 상태: { arr, lo, hi, mid, target, found }
export function binarySearchSteps(a, target) {
  const steps = []
  let lo = 0,
    hi = a.length - 1,
    found = -1
  const snap = (line, mid, note) =>
    steps.push(makeStep(line, { arr: [...a], lo, hi, mid, target, found }, note))

  snap(2, -1, `lo=0, hi=${hi}, target=${target}`)
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1
    snap(4, mid, `mid=${mid}, a[mid]=${a[mid]}`)
    if (a[mid] === target) {
      found = mid
      snap(5, mid, `a[${mid}]==${target} → 발견`)
      break
    }
    if (a[mid] < target) {
      lo = mid + 1
      snap(6, mid, `a[mid] < target → 오른쪽 절반 (lo=${lo})`)
    } else {
      hi = mid - 1
      snap(7, mid, `a[mid] > target → 왼쪽 절반 (hi=${hi})`)
    }
  }
  if (found === -1) snap(9, -1, '범위 소진 → 없음(-1)')
  return steps
}

export const binarySearchTopic = {
  id: 'binary-search',
  week: 2,
  title: '이진탐색 (Binary Search)',
  rendererId: 'array-bars',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  plainDef: '정렬된 데이터에서 "가운데를 찍어보고 절반씩 버리며" 원하는 값을 빠르게 찾는 방법.',
  analogy: '국어사전에서 단어 찾기. 처음부터 한 장씩 넘기지 않고, 책 한가운데를 펴서 앞/뒤 어느 쪽인지 보고 절반을 버린다. 이걸 반복하면 금방 찾는다.',
  why: '데이터가 100만 개여도 약 20번만 비교하면 찾는다(log₂ 1,000,000 ≈ 20). 하나씩 보는 것(최대 100만 번)과는 비교가 안 되는 속도.',
  terms: [
    { word: 'O(log n)', desc: '데이터가 2배로 늘어도 비교 횟수는 1번만 늘어나는, 매우 빠른 시간복잡도. 절반씩 줄이는 알고리즘의 특징.' },
    { word: '오버플로', desc: '정수가 표현할 수 있는 최대값(약 21억)을 넘어 음수로 뒤집히는 버그. lo+hi가 너무 크면 발생한다.' },
    { word: '부호 없는 시프트', desc: '>>> 연산자. 비트를 오른쪽으로 밀어 2로 나눈다. 음수 처리를 안전하게 해 오버플로 버그를 막는다.' },
  ],
  coteTip:
    '전제 조건은 "데이터가 정렬되어 있어야 한다". 정렬 안 된 배열엔 못 쓴다. ' +
    '직접 구현보다 "답을 이분 탐색"하는 응용(파라메트릭 서치 — 가능/불가능의 경계를 이진탐색으로 찾기)이 더 자주 나온다. lo<=hi 경계 조건에서 실수가 잦으니 주의.',
  concept:
    '정렬된 배열에서 매 단계 탐색 범위를 절반으로 줄여 O(log n)에 찾는다. ' +
    'mid 계산은 (lo+hi)가 int 범위를 넘는 오버플로를 막기 위해 (lo+hi)>>>1(부호 없는 시프트)을 쓴다. ' +
    'Java는 Arrays.binarySearch / Collections.binarySearch를 제공하며, 없을 때 (-(삽입점)-1)을 반환하는 점을 주의.',
  realWorld: 'Arrays.binarySearch(int[], key) · Collections.binarySearch(List, key)',
  javaCode: java,
  algorithms: {
    found: { label: '찾는 경우 (7)', code: java, build: () => binarySearchSteps([1, 3, 5, 7, 9, 11, 13], 7) },
    notFound: { label: '없는 경우 (6)', code: java, build: () => binarySearchSteps([1, 3, 5, 7, 9, 11, 13], 6) },
  },
}
