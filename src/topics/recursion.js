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
