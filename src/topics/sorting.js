import { makeStep } from '../engine/types.js'

// 모든 정렬은 상태 형태를 공유한다:
//   { arr:number[], compared:number[], swapped:number[], sorted:number[] }
// compared=비교 중 인덱스, swapped=교환/덮어쓰기 인덱스, sorted=확정된 인덱스

function allSorted(arr) {
  return arr.map((_, k) => k)
}

/* ── 버블 정렬 ───────────────────────────── */
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
      snap(4, [j, j + 1], [], `a[${j}]=${arr[j]} 와 a[${j + 1}]=${arr[j + 1]} 비교`)
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        snap(5, [], [j, j + 1], `${arr[j + 1]} > ${arr[j]} → 교환`)
      }
    }
    sorted.unshift(n - 1 - i)
  }
  snap(9, [], [], '정렬 완료')
  steps.at(-1).state.sorted = allSorted(arr)
  return steps
}

/* ── 선택 정렬 ───────────────────────────── */
const selectionJava = `void selectionSort(int[] a) {
  int n = a.length;
  for (int i = 0; i < n - 1; i++) {
    int min = i;
    for (int j = i + 1; j < n; j++)
      if (a[j] < a[min]) min = j;
    int t = a[min]; a[min] = a[i]; a[i] = t;
  }
}`

export function selectionSortSteps(input) {
  const arr = [...input]
  const n = arr.length
  const sorted = []
  const steps = []
  const snap = (line, compared, swapped, note) =>
    steps.push(makeStep(line, { arr: [...arr], compared, swapped, sorted: [...sorted] }, note))

  snap(1, [], [], '선택 정렬 시작')
  for (let i = 0; i < n - 1; i++) {
    let min = i
    snap(4, [min], [], `최솟값 후보 a[${min}]=${arr[min]}`)
    for (let j = i + 1; j < n; j++) {
      snap(5, [j, min], [], `a[${j}]=${arr[j]} 와 최솟값 a[${min}]=${arr[min]} 비교`)
      if (arr[j] < arr[min]) min = j
    }
    ;[arr[min], arr[i]] = [arr[i], arr[min]]
    snap(7, [], [min, i], `최솟값을 ${i}번 자리로 교환`)
    sorted.push(i)
  }
  sorted.push(n - 1)
  snap(8, [], [], '정렬 완료')
  steps.at(-1).state.sorted = allSorted(arr)
  return steps
}

/* ── 삽입 정렬 ───────────────────────────── */
const insertionJava = `void insertionSort(int[] a) {
  for (int i = 1; i < a.length; i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
}`

export function insertionSortSteps(input) {
  const arr = [...input]
  const n = arr.length
  const steps = []
  const snap = (line, compared, swapped, sorted, note) =>
    steps.push(makeStep(line, { arr: [...arr], compared, swapped, sorted }, note))

  snap(1, [], [], [0], '삽입 정렬 시작 (앞 1개는 정렬된 것으로 간주)')
  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1
    snap(2, [i], [], range(0, i - 1), `key=a[${i}]=${key} 를 앞쪽 정렬 구간에 삽입`)
    while (j >= 0 && arr[j] > key) {
      snap(3, [j], [], range(0, i), `a[${j}]=${arr[j]} > key=${key} → 한 칸 밀기`)
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
    snap(7, [], [j + 1], range(0, i), `key를 ${j + 1}번 자리에 삽입`)
  }
  snap(8, [], [], allSorted(arr), '정렬 완료')
  return steps
}

function range(a, b) {
  const r = []
  for (let k = a; k <= b; k++) r.push(k)
  return r
}

/* ── 병합 정렬 ───────────────────────────── */
const mergeJava = `void mergeSort(int[] a, int l, int r) {
  if (l >= r) return;
  int m = (l + r) / 2;
  mergeSort(a, l, m);
  mergeSort(a, m + 1, r);
  merge(a, l, m, r);
}
void merge(int[] a, int l, int m, int r) {
  int[] tmp = new int[r - l + 1];
  int i = l, j = m + 1, k = 0;
  while (i <= m && j <= r)
    tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
  while (i <= m) tmp[k++] = a[i++];
  while (j <= r) tmp[k++] = a[j++];
  for (int t = 0; t < tmp.length; t++)
    a[l + t] = tmp[t];
}`

export function mergeSortSteps(input) {
  const arr = [...input]
  const steps = []
  const snap = (line, compared, swapped, note) =>
    steps.push(makeStep(line, { arr: [...arr], compared, swapped, sorted: [] }, note))

  snap(1, [], [], '병합 정렬 시작')
  const sort = (l, r) => {
    if (l >= r) return
    const m = (l + r) >> 1
    sort(l, m)
    sort(m + 1, r)
    // merge
    const tmp = []
    let i = l, j = m + 1
    while (i <= m && j <= r) {
      snap(11, [i, j], [], `a[${i}]=${arr[i]} 와 a[${j}]=${arr[j]} 비교`)
      if (arr[i] <= arr[j]) tmp.push(arr[i++])
      else tmp.push(arr[j++])
    }
    while (i <= m) tmp.push(arr[i++])
    while (j <= r) tmp.push(arr[j++])
    for (let t = 0; t < tmp.length; t++) {
      arr[l + t] = tmp[t]
      snap(16, [], [l + t], `구간[${l}~${r}] 병합 결과 ${arr[l + t]} 쓰기`)
    }
  }
  sort(0, arr.length - 1)
  snap(7, [], [], '정렬 완료')
  steps.at(-1).state.sorted = allSorted(arr)
  return steps
}

/* ── 퀵 정렬 (Lomuto) ────────────────────── */
const quickJava = `void quickSort(int[] a, int lo, int hi) {
  if (lo >= hi) return;
  int pivot = a[hi], i = lo - 1;
  for (int j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      i++;
      int t = a[i]; a[i] = a[j]; a[j] = t;
    }
  }
  int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
  int p = i + 1;
  quickSort(a, lo, p - 1);
  quickSort(a, p + 1, hi);
}`

export function quickSortSteps(input) {
  const arr = [...input]
  const steps = []
  const sorted = []
  const snap = (line, compared, swapped, note) =>
    steps.push(makeStep(line, { arr: [...arr], compared, swapped, sorted: [...sorted] }, note))

  snap(1, [], [], '퀵 정렬 시작')
  const sort = (lo, hi) => {
    if (lo >= hi) {
      if (lo === hi) { sorted.push(lo) }
      return
    }
    const pivot = arr[hi]
    let i = lo - 1
    snap(3, [hi], [], `피벗 = a[${hi}] = ${pivot}`)
    for (let j = lo; j < hi; j++) {
      snap(5, [j, hi], [], `a[${j}]=${arr[j]} 와 피벗 ${pivot} 비교`)
      if (arr[j] < pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        snap(7, [], [i, j], `${arr[i]} < 피벗 → ${i}번 자리로 교환`)
      }
    }
    ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
    const p = i + 1
    snap(10, [], [p, hi], `피벗을 정렬 위치 ${p} 로 이동`)
    sorted.push(p)
    sort(lo, p - 1)
    sort(p + 1, hi)
  }
  sort(0, arr.length - 1)
  snap(13, [], [], '정렬 완료')
  steps.at(-1).state.sorted = allSorted(arr)
  return steps
}

/* ── 토픽 메타 ───────────────────────────── */
const sampleInput = [5, 2, 8, 1, 9, 3, 7]

export const sortingTopic = {
  id: 'sorting',
  week: 3,
  title: '정렬 (Sorting)',
  rendererId: 'array-bars',
  complexity: { time: 'O(n²) ~ O(n log n)', space: 'O(1) ~ O(n)' },
  concept:
    '정렬은 비교 기반(버블·선택·삽입 O(n²), 병합·퀵 O(n log n))으로 나뉜다. ' +
    'Java 표준 Arrays.sort는 원시형 int[]에 듀얼피벗 퀵, 객체 배열·List에는 안정 정렬 TimSort를 쓴다. ' +
    '코테에서는 직접 구현보다 Arrays.sort / Collections.sort + Comparator 조합이 훨씬 자주 등장한다.',
  realWorld: 'Arrays.sort(int[]) · Collections.sort(List) · list.sort(Comparator.comparingInt(x -> x))',
  javaCode: bubbleJava,
  algorithms: {
    bubble: { label: '버블', code: bubbleJava, build: () => bubbleSortSteps(sampleInput) },
    selection: { label: '선택', code: selectionJava, build: () => selectionSortSteps(sampleInput) },
    insertion: { label: '삽입', code: insertionJava, build: () => insertionSortSteps(sampleInput) },
    merge: { label: '병합', code: mergeJava, build: () => mergeSortSteps(sampleInput) },
    quick: { label: '퀵', code: quickJava, build: () => quickSortSteps(sampleInput) },
  },
}

export { bubbleJava }
