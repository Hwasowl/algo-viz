import { makeStep } from '../engine/types.js'

const nodesOf = (adj) => Object.keys(adj).map(Number)
const edgesOf = (adj) => nodesOf(adj).flatMap((u) => adj[u].map((v) => [u, v]))

// 상태: { nodes, edges, visited:number[], frontier:number[], current }

/* ── BFS (큐 = ArrayDeque) ───────────────── */
const bfsJava = `void bfs(List<List<Integer>> adj, int start) {
  Queue<Integer> q = new ArrayDeque<>();
  boolean[] vis = new boolean[adj.size()];
  q.add(start); vis[start] = true;
  while (!q.isEmpty()) {
    int u = q.poll();
    for (int v : adj.get(u))
      if (!vis[v]) { vis[v] = true; q.add(v); }
  }
}`

export function bfsSteps(adj, start) {
  const steps = []
  const visited = []
  const q = [start]
  const vis = new Set([start])
  const base = { nodes: nodesOf(adj), edges: edgesOf(adj) }
  const snap = (line, current, note) =>
    steps.push(makeStep(line, { ...base, visited: [...visited], frontier: [...q], current }, note))

  snap(4, start, `시작 노드 ${start} 를 큐에 추가`)
  while (q.length) {
    const u = q.shift()
    visited.push(u)
    snap(6, u, `${u} 방문 (큐에서 꺼냄)`)
    for (const v of adj[u]) {
      if (!vis.has(v)) {
        vis.add(v)
        q.push(v)
        snap(8, u, `${u}의 이웃 ${v} 를 큐에 추가`)
      }
    }
  }
  return steps
}

/* ── DFS (재귀 = 콜스택) ─────────────────── */
const dfsJava = `void dfs(List<List<Integer>> adj, int u, boolean[] vis) {
  vis[u] = true;            // 방문 처리
  for (int v : adj.get(u))
    if (!vis[v]) dfs(adj, v, vis);
}`

export function dfsSteps(adj, start) {
  const steps = []
  const visited = []
  const vis = new Set()
  const base = { nodes: nodesOf(adj), edges: edgesOf(adj) }
  const snap = (line, current, note) =>
    steps.push(makeStep(line, { ...base, visited: [...visited], frontier: [], current }, note))

  const go = (u) => {
    vis.add(u)
    visited.push(u)
    snap(2, u, `${u} 방문`)
    for (const v of adj[u]) {
      if (!vis.has(v)) {
        snap(4, u, `${u} → ${v} 깊이 진입`)
        go(v)
      }
    }
  }
  go(start)
  return steps
}

const sample = { 0: [1, 2], 1: [3, 4], 2: [4], 3: [], 4: [5], 5: [] }

export const graphTopic = {
  id: 'graph-traversal',
  week: 4,
  title: 'BFS / DFS',
  rendererId: 'graph',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  concept:
    'BFS는 큐(ArrayDeque)로 가까운 노드부터 퍼져 가중치 1 그래프의 최단경로에 쓰인다. ' +
    'DFS는 재귀(=JVM 콜스택)나 명시적 Deque로 깊이부터 파고들어 연결요소·사이클 탐지·위상정렬에 쓰인다. ' +
    '둘 다 방문 배열(boolean[] vis)로 재방문을 막아 O(V+E)를 보장한다.',
  realWorld: 'ArrayDeque<Integer> (BFS 큐) · 재귀 호출 스택 또는 Deque (DFS)',
  javaCode: bfsJava,
  algorithms: {
    bfs: { label: 'BFS (너비)', code: bfsJava, build: () => bfsSteps(sample, 0) },
    dfs: { label: 'DFS (깊이)', code: dfsJava, build: () => dfsSteps(sample, 0) },
  },
}
