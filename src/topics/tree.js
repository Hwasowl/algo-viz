import { makeStep } from '../engine/types.js'

// 이진 탐색 트리(BST) — 왼쪽<부모<오른쪽
const nodes = {
  4: { val: 4, left: 2, right: 6 },
  2: { val: 2, left: 1, right: 3 },
  6: { val: 6, left: 5, right: 7 },
  1: { val: 1, left: null, right: null },
  3: { val: 3, left: null, right: null },
  5: { val: 5, left: null, right: null },
  7: { val: 7, left: null, right: null },
}
const ROOT = 4

const inorderJava = `void inorder(Node n) {     // 중위 순회 (왼 → 자신 → 오)
  if (n == null) return;
  inorder(n.left);          // ① 왼쪽 서브트리
  visit(n);                 // ② 자기 자신 처리
  inorder(n.right);         // ③ 오른쪽 서브트리
}`

const preorderJava = `void preorder(Node n) {    // 전위 순회 (자신 → 왼 → 오)
  if (n == null) return;
  visit(n);                 // ① 먼저 자기 자신
  preorder(n.left);         // ② 왼쪽
  preorder(n.right);        // ③ 오른쪽
}`

function traverse(order) {
  const visited = []
  const steps = []
  const snap = (line, current, note) =>
    steps.push(makeStep(line, { nodes, root: ROOT, current, visited: [...visited] }, note))
  const go = (id) => {
    if (id == null) return
    if (order === 'pre') {
      visited.push(id)
      snap(3, id, `${nodes[id].val} 방문 (먼저 자신)`)
    }
    go(nodes[id].left)
    if (order === 'in') {
      visited.push(id)
      snap(4, id, `${nodes[id].val} 방문 (왼쪽 끝낸 뒤 자신)`)
    }
    go(nodes[id].right)
  }
  go(ROOT)
  return steps
}

export const inorderSteps = () => traverse('in')
export const preorderSteps = () => traverse('pre')

export const treeTopic = {
  id: 'tree',
  week: 4,
  title: '트리 (Tree)',
  rendererId: 'tree-view',
  complexity: { time: '탐색 O(log n)~O(n)', space: 'O(n)' },
  plainDef: '하나의 뿌리(root)에서 가지처럼 뻗어 나가는, 계층 구조를 표현하는 자료구조.',
  analogy: '회사 조직도나 가계도. 위에 부모가 있고 아래로 자식이 갈라진다. 사이클(되돌아오는 길)은 없다.',
  why: '폴더 구조, 우선순위, 정렬된 데이터를 빠르게 검색하는 데 쓰인다. 특히 이진 탐색 트리는 정렬 상태를 유지하며 O(log n) 검색을 제공한다.',
  terms: [
    { word: 'root', desc: '트리의 가장 위 노드(뿌리). 부모가 없는 유일한 노드.' },
    { word: '이진 탐색 트리(BST)', desc: '왼쪽 자식 < 부모 < 오른쪽 자식 규칙을 지키는 트리. 중위 순회하면 정렬된 순서로 나온다.' },
    { word: '중위 순회', desc: '왼쪽 → 자신 → 오른쪽 순으로 방문. BST에선 값이 오름차순으로 나온다.' },
    { word: '전위 순회', desc: '자신 → 왼쪽 → 오른쪽 순으로 방문. 트리를 복사·직렬화할 때 쓴다.' },
  ],
  coteTip:
    '코테에서 트리는 보통 인접 리스트(그래프)로 주고 DFS로 순회한다. 순회 3종(전위·중위·후위)의 차이는 "자신을 언제 처리하느냐"뿐이다. ' +
    '정렬된 집합/맵이 필요하면 TreeMap·TreeSet(내부가 균형 BST, O(log n))을 그냥 쓰면 된다.',
  concept:
    '트리는 root에서 자식으로 뻗는 계층 구조다. 아래는 이진 탐색 트리를 순회하는 예시 — 중위 순회는 왼쪽을 끝낸 뒤 자신을 처리해 1,2,3,4,5,6,7 정렬 순서로 방문한다. ' +
    '"자신을 언제 방문하나"를 바꾸면 전위·후위가 된다.',
  realWorld: 'TreeMap · TreeSet (균형 BST) · 그래프 DFS로 트리 순회',
  javaCode: inorderJava,
  algorithms: {
    inorder: { label: '중위 순회 (정렬순)', code: inorderJava, build: inorderSteps },
    preorder: { label: '전위 순회', code: preorderJava, build: preorderSteps },
  },
}
