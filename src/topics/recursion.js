import { makeStep } from '../engine/types.js'

// 상태: { frames:[{call:string, ret?:number}], result? }

/* ── 팩토리얼 ────────────────────────────── */
const factJava = `int factorial(int n) {
  if (n <= 1) return 1;          // 기저 조건
  return n * factorial(n - 1);   // 재귀 호출
}`

export function factorialSteps(n) {
  const steps = []
  const frames = []
  let result
  const snap = (line, note) =>
    steps.push(makeStep(line, { frames: frames.map((f) => ({ ...f })), result }, note))

  const go = (k) => {
    frames.push({ call: `factorial(${k})` })
    snap(1, `factorial(${k}) 호출 — 콜스택 push`)
    if (k <= 1) {
      frames.at(-1).ret = 1
      snap(2, '기저 조건 도달: 1 반환')
      frames.pop()
      return 1
    }
    const sub = go(k - 1)
    const r = k * sub
    frames.at(-1).ret = r
    snap(3, `${k} * ${sub} = ${r} 반환 — 콜스택 pop`)
    frames.pop()
    return r
  }
  result = go(n)
  snap(3, `최종 결과 = ${result}`)
  return steps
}

/* ── 피보나치 (트리 재귀) ────────────────── */
const fibJava = `int fib(int n) {
  if (n <= 1) return n;          // 기저 조건
  return fib(n - 1) + fib(n - 2);// 두 갈래 재귀
}`

export function fibSteps(n) {
  const steps = []
  const frames = []
  let result
  const snap = (line, note) =>
    steps.push(makeStep(line, { frames: frames.map((f) => ({ ...f })), result }, note))

  const go = (k) => {
    frames.push({ call: `fib(${k})` })
    snap(1, `fib(${k}) 호출 — push`)
    if (k <= 1) {
      frames.at(-1).ret = k
      snap(2, `기저 조건: ${k} 반환`)
      frames.pop()
      return k
    }
    const a = go(k - 1)
    const b = go(k - 2)
    const r = a + b
    frames.at(-1).ret = r
    snap(3, `fib(${k - 1})+fib(${k - 2}) = ${a}+${b} = ${r} 반환 — pop`)
    frames.pop()
    return r
  }
  result = go(n)
  snap(3, `최종 결과 = ${result}`)
  return steps
}

export const recursionTopic = {
  id: 'recursion',
  week: 2,
  title: '재귀 (Recursion)',
  rendererId: 'call-stack',
  complexity: { time: 'O(n) ~ O(2ⁿ)', space: 'O(n) (콜스택 깊이)' },
  plainDef: '함수가 문제를 더 작은 같은 문제로 쪼개서, 자기 자신을 다시 호출하는 기법.',
  analogy: '거울 두 개를 마주 보게 두면 상이 끝없이 반복돼 보이는 것과 비슷하다. 단, 재귀는 "이쯤에서 멈춤"(기저 조건)이 꼭 있어야 무한 반복을 멈춘다.',
  why: '트리·그래프 탐색, 분할정복, 백트래킹처럼 "큰 문제 = 작은 문제들의 합"인 구조를 코드로 자연스럽고 짧게 표현할 수 있다.',
  terms: [
    { word: '기저 조건', desc: '재귀를 멈추는 조건(base case). 예: factorial(1)=1. 이게 없으면 무한 호출 → 프로그램이 죽는다.' },
    { word: '콜스택', desc: '함수 호출을 쌓아 두는 메모리 공간. 호출하면 쌓이고(push), 끝나면 빠진다(pop). 재귀는 이 스택을 직접 쌓는 것.' },
    { word: 'StackOverflowError', desc: '재귀가 너무 깊어 콜스택 메모리가 꽉 차서 나는 에러. 기저 조건 실수나 너무 깊은 재귀가 원인.' },
    { word: '메모이제이션', desc: '한 번 계산한 결과를 저장(HashMap/배열)해 두고 재사용하는 기법. 중복 계산을 없애 느린 재귀를 빠르게 만든다.' },
  ],
  coteTip:
    '재귀 함수를 짤 때 항상 ① 기저 조건(언제 멈추나) ② 재귀 식(어떻게 작은 문제로 줄이나) 두 가지를 먼저 정하라. ' +
    '피보나치처럼 같은 값을 중복 호출하는 재귀는 O(2ⁿ)로 폭발하므로, 메모이제이션이나 반복문(DP)으로 바꾸는 감각이 필요하다.',
  concept:
    '재귀는 기저 조건(base case)과 자기 호출로 구성되며, 매 호출이 JVM 콜스택에 프레임으로 쌓인다. ' +
    '깊이가 너무 깊으면 StackOverflowError가 난다. 팩토리얼은 선형 재귀라 O(n)이지만, ' +
    '피보나치의 단순 두 갈래 재귀는 같은 값을 중복 계산해 O(2ⁿ) — 메모이제이션(HashMap/배열)이나 반복문으로 바꾼다.',
  realWorld: 'JVM 호출 스택 · 깊으면 Deque로 반복 변환 · 중복 호출은 메모이제이션',
  javaCode: factJava,
  algorithms: {
    factorial: { label: '팩토리얼 (선형)', code: factJava, build: () => factorialSteps(5) },
    fib: { label: '피보나치 (트리)', code: fibJava, build: () => fibSteps(5) },
  },
}
