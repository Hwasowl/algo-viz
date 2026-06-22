import { describe, it, expect } from 'vitest'
import { factorialSteps, fibSteps, recursionTopic } from '../src/topics/recursion.js'

describe('factorialSteps', () => {
  it('마지막 스텝 result는 n!', () => {
    expect(factorialSteps(4).at(-1).state.result).toBe(24)
    expect(factorialSteps(5).at(-1).state.result).toBe(120)
  })
  it('최대 콜스택 깊이가 n에 도달한다', () => {
    const maxDepth = Math.max(...factorialSteps(4).map((s) => s.state.frames.length))
    expect(maxDepth).toBe(4)
  })
  it('마지막에는 콜스택이 비어 있다', () => {
    expect(factorialSteps(4).at(-1).state.frames).toEqual([])
  })
})

describe('fibSteps', () => {
  it('마지막 스텝 result는 fib(n)', () => {
    expect(fibSteps(5).at(-1).state.result).toBe(5) // 0,1,1,2,3,5
    expect(fibSteps(6).at(-1).state.result).toBe(8)
  })
})

describe('recursionTopic', () => {
  it('call-stack 렌더러와 2종을 노출한다', () => {
    expect(recursionTopic.rendererId).toBe('call-stack')
    expect(Object.keys(recursionTopic.algorithms)).toEqual(['factorial', 'fib'])
  })
})
