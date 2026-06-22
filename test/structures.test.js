import { describe, it, expect } from 'vitest'
import { complexitySteps } from '../src/topics/complexity.js'
import { arraySteps } from '../src/topics/array.js'
import { linkedListSteps } from '../src/topics/linkedList.js'
import { parenSteps } from '../src/topics/stack.js'
import { queueSteps } from '../src/topics/queue.js'
import { hashSteps } from '../src/topics/hash.js'
import { inorderSteps, preorderSteps } from '../src/topics/tree.js'
import { heapInsertSteps } from '../src/topics/heap.js'
import { dpSteps } from '../src/topics/dp.js'

describe('complexitySteps', () => {
  it('마지막 스텝은 n=64, 6개 복잡도 클래스', () => {
    const last = complexitySteps().at(-1)
    expect(last.state.n).toBe(64)
    expect(last.state.rows).toHaveLength(6)
  })
  it('O(n²)는 n=64에서 4096', () => {
    const last = complexitySteps().at(-1)
    expect(last.state.rows.find((r) => r.label === 'O(n²)').ops).toBe(4096)
  })
})

describe('arraySteps', () => {
  it('삽입 후 99가 들어가고 길이가 늘어난다', () => {
    const steps = arraySteps()
    const mid = steps.find((s) => s.state.cells.some((c) => c.v === 99))
    expect(mid).toBeTruthy()
  })
})

describe('linkedListSteps', () => {
  it('중간 삽입 후 노드가 4개이고 99가 포함된다', () => {
    const last = linkedListSteps().at(-1)
    expect(last.state.nodes).toHaveLength(4)
    expect(last.state.nodes.map((n) => n.v)).toContain(99)
  })
})

describe('parenSteps (스택 괄호검사)', () => {
  it('올바른 괄호는 ok=true', () => {
    expect(parenSteps('(()())').at(-1).state.ok).toBe(true)
  })
  it('짝이 안 맞으면 ok=false', () => {
    expect(parenSteps('(()').at(-1).state.ok).toBe(false)
  })
})

describe('queueSteps (FIFO)', () => {
  it('1,2,3 넣고 2번 꺼내면 [3]만 남는다', () => {
    expect(queueSteps().at(-1).state.items).toEqual([3])
  })
})

describe('hashSteps', () => {
  it('12와 27이 같은 버킷(2번)에 체이닝된다', () => {
    const last = hashSteps().at(-1)
    expect(last.state.buckets[2]).toEqual([12, 27])
    expect(last.state.buckets[0]).toEqual([5])
    expect(last.state.buckets[3]).toEqual([8])
  })
})

describe('tree 순회', () => {
  it('중위 순회는 정렬 순서 1..7', () => {
    const last = inorderSteps().at(-1)
    expect(last.state.visited.map((id) => last.state.nodes[id].val)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
  it('전위 순회는 루트(4)를 먼저 방문', () => {
    const first = preorderSteps()[0]
    expect(first.state.nodes[first.state.current].val).toBe(4)
  })
})

describe('heapInsertSteps (최소 힙)', () => {
  it('최종 루트(맨 위)가 최솟값 1', () => {
    expect(heapInsertSteps([5, 3, 8, 1, 9, 2]).at(-1).state.heap[0]).toBe(1)
  })
})

describe('dpSteps (계단 오르기)', () => {
  it('dp[6] = 13', () => {
    const last = dpSteps(6).at(-1)
    expect(last.state.cells.find((c) => c.i === 6).v).toBe(13)
  })
})
