import { describe, it, expect } from 'vitest'
import { bfsSteps, dfsSteps, graphTopic } from '../src/topics/graphTraversal.js'

const adj = { 0: [1, 2], 1: [3], 2: [3], 3: [] }

describe('bfsSteps', () => {
  it('방문 순서는 0,1,2,3 (너비 우선)', () => {
    expect(bfsSteps(adj, 0).at(-1).state.visited).toEqual([0, 1, 2, 3])
  })
  it('각 노드를 한 번씩만 방문한다', () => {
    const v = bfsSteps(adj, 0).at(-1).state.visited
    expect(new Set(v).size).toBe(v.length)
  })
})

describe('dfsSteps', () => {
  it('0에서 시작해 모든 노드를 방문한다', () => {
    const v = dfsSteps(adj, 0).at(-1).state.visited
    expect([...v].sort()).toEqual([0, 1, 2, 3])
    expect(v[0]).toBe(0)
  })
  it('깊이 우선이라 0 다음 1을 먼저 끝까지 판다 (0,1,3,2)', () => {
    expect(dfsSteps(adj, 0).at(-1).state.visited).toEqual([0, 1, 3, 2])
  })
})

describe('graphTopic', () => {
  it('graph 렌더러와 BFS/DFS 2종을 노출한다', () => {
    expect(graphTopic.rendererId).toBe('graph')
    expect(Object.keys(graphTopic.algorithms)).toEqual(['bfs', 'dfs'])
  })
})
