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
