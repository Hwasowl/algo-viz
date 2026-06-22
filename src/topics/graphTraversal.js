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
  plainDef: '점(노드)과 선(간선)으로 연결된 지도에서, 한 점에서 출발해 연결된 모든 점을 빠짐없이 방문하는 방법.',
  analogy: 'BFS는 돌을 던졌을 때 물결이 동심원으로 퍼지듯 가까운 곳부터. DFS는 미로에서 한 길을 끝까지 가본 뒤 막히면 되돌아 나오는 방식.',
  why: '"A에서 B로 갈 수 있나?", "최소 몇 단계로 가나?", "섬이 몇 개인가?" 같은 연결 관계 문제를 푸는 가장 기본 도구. 코테 단골.',
  terms: [
    { word: '노드', desc: '그래프의 점. 도시, 사람, 칸 등 무언가를 나타낸다. 정점(vertex)이라고도 한다.' },
    { word: '간선', desc: '두 노드를 잇는 선. 도로, 친구 관계 등 연결을 나타낸다. edge라고도 한다.' },
    { word: '인접 리스트', desc: '각 노드마다 "직접 연결된 이웃 목록"을 저장하는 방식. 메모리를 아껴서 코테에서 가장 많이 쓴다.' },
    { word: '큐', desc: '먼저 들어간 것이 먼저 나오는(FIFO) 줄. BFS는 방문할 노드를 큐에 담아 순서대로 꺼낸다.' },
    { word: '방문 배열', desc: '이미 가본 노드를 표시하는 boolean 배열. 같은 곳을 또 방문해 무한 반복하는 것을 막는다.' },
  ],
  coteTip:
    '"최단 거리(칸 단위)"는 BFS, "모든 경우/경로 탐색·백트래킹"은 DFS가 정석이다. ' +
    'DFS를 재귀로 짜면 깊이가 깊을 때 StackOverflow가 날 수 있어, 칸 수가 많으면 명시적 스택(ArrayDeque)으로 바꾼다. 방문 체크를 "큐에 넣을 때" 하는 게 BFS 중복 방지의 핵심.',
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
