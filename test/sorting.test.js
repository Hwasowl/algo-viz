import { describe, it, expect } from 'vitest'
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  sortingTopic,
} from '../src/topics/sorting.js'

const cases = {
  bubble: bubbleSortSteps,
  selection: selectionSortSteps,
  insertion: insertionSortSteps,
  merge: mergeSortSteps,
  quick: quickSortSteps,
}

const input = [5, 2, 8, 1, 9, 3, 7]
const expected = [1, 2, 3, 5, 7, 8, 9]

describe.each(Object.entries(cases))('%s 정렬', (name, fn) => {
  it('마지막 스텝의 arr는 오름차순 정렬 결과다', () => {
    expect(fn(input).at(-1).state.arr).toEqual(expected)
  })

  it('모든 스텝은 number line과 배열 state.arr를 가진다', () => {
    const steps = fn(input)
    expect(steps.length).toBeGreaterThan(0)
    for (const s of steps) {
      expect(typeof s.line).toBe('number')
      expect(Array.isArray(s.state.arr)).toBe(true)
    }
  })

  it('마지막 스텝은 전체가 sorted로 표시된다', () => {
    expect(fn(input).at(-1).state.sorted).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('이미 정렬된 입력도 정확히 처리한다', () => {
    expect(fn([1, 2, 3]).at(-1).state.arr).toEqual([1, 2, 3])
  })
})

describe('sortingTopic', () => {
  it('레지스트리 메타를 노출한다', () => {
    expect(sortingTopic.id).toBe('sorting')
    expect(sortingTopic.rendererId).toBe('array-bars')
    expect(typeof sortingTopic.javaCode).toBe('string')
    expect(sortingTopic.algorithms.bubble.build).toBeTypeOf('function')
    expect(Object.keys(sortingTopic.algorithms)).toHaveLength(5)
  })
})
