import { describe, it, expect } from 'vitest'
import { binarySearchSteps, binarySearchTopic } from '../src/topics/binarySearch.js'

describe('binarySearchSteps', () => {
  it('타깃을 찾으면 마지막 스텝 found가 인덱스다', () => {
    expect(binarySearchSteps([1, 3, 5, 7, 9], 7).at(-1).state.found).toBe(3)
  })
  it('없으면 found는 -1', () => {
    expect(binarySearchSteps([1, 3, 5], 4).at(-1).state.found).toBe(-1)
  })
  it('첫 원소도 찾는다', () => {
    expect(binarySearchSteps([1, 3, 5, 7, 9], 1).at(-1).state.found).toBe(0)
  })
  it('마지막 원소도 찾는다', () => {
    expect(binarySearchSteps([1, 3, 5, 7, 9], 9).at(-1).state.found).toBe(4)
  })
  it('log n 답게 스텝 수가 작다 (n=7, 4스텝 이하 탐색)', () => {
    const steps = binarySearchSteps([1, 3, 5, 7, 9, 11, 13], 13)
    expect(steps.length).toBeLessThanOrEqual(10)
  })
})

describe('binarySearchTopic', () => {
  it('array-bars 렌더러를 쓴다', () => {
    expect(binarySearchTopic.rendererId).toBe('array-bars')
  })
})
