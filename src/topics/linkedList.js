import { makeStep } from '../engine/types.js'

const java = `class Node { int val; Node next; }   // 값 + 다음 노드 주소
// 1) 순회: head부터 next를 따라간다 — O(n)
Node cur = head;
while (cur != null) cur = cur.next;
// 2) 중간 삽입: 앞 노드의 next만 바꾸면 끝 — O(1)
//    newNode.next = cur.next;  cur.next = newNode;`

export function linkedListSteps() {
  let nodes = [{ v: 10 }, { v: 20 }, { v: 30 }]
  const steps = []
  const snap = (line, highlight, inserted, note) =>
    steps.push(makeStep(line, { nodes: nodes.map((n) => ({ ...n })), highlight, inserted, note }, note))

  snap(1, [], [], '연결 리스트: 각 노드가 "값 + 다음 노드 화살표"를 가진다')
  snap(3, [0], [], 'head(0번)부터 출발')
  snap(4, [1], [], 'next 화살표를 따라 1번으로 이동')
  snap(4, [2], [], 'next를 따라 2번으로 — 순회는 한 칸씩이라 O(n)')
  snap(6, [1], [], '1번과 2번 사이에 99를 삽입하려면…')
  nodes = [{ v: 10 }, { v: 20 }, { v: 99 }, { v: 30 }]
  snap(6, [], [2], '앞 노드(20)의 화살표만 새 노드로 바꾸면 끝 — 밀기 없이 O(1)')
  return steps
}

export const linkedListTopic = {
  id: 'linked-list',
  week: 2,
  title: '연결 리스트 (Linked List)',
  rendererId: 'linked-list',
  complexity: { time: '접근 O(n) · 삽입/삭제 O(1)', space: 'O(n)' },
  plainDef: '값과 "다음 노드를 가리키는 화살표"를 가진 노드들이 사슬처럼 이어진 자료구조.',
  analogy: '보물찾기 쪽지. 각 쪽지에 보물(값)과 "다음 쪽지 위치"가 적혀 있다. 순서대로 따라가야 하지만, 중간에 쪽지를 끼우는 건 앞 쪽지의 안내만 바꾸면 된다.',
  why: '배열과 반대로 중간 삽입/삭제가 O(1)로 빠르다. 단, 특정 위치 값을 보려면 처음부터 따라가야 해 접근은 O(n).',
  terms: [
    { word: '노드', desc: '값 하나와 "다음 노드를 가리키는 참조(주소)"를 묶은 단위. 연결 리스트의 기본 부품.' },
    { word: 'head', desc: '연결 리스트의 첫 노드. 여기서부터 next를 따라가며 전체를 순회한다.' },
    { word: 'next', desc: '다음 노드를 가리키는 화살표(참조). 마지막 노드의 next는 null(끝 표시).' },
  ],
  coteTip:
    '코테에서 연결 리스트를 직접 구현할 일은 드물고, 보통 ArrayList/ArrayDeque로 충분하다. ' +
    '다만 "중간 삽입/삭제가 매우 잦다"거나 LRU 캐시 같은 문제에선 개념이 쓰인다. Java의 LinkedList는 Deque 구현체이기도 하다.',
  concept:
    '연결 리스트는 노드가 next 참조로 이어진다. 중간 삽입/삭제는 참조만 바꾸면 돼 O(1)이지만, "k번째 값"을 보려면 head부터 k번 따라가야 해 접근이 O(n)이다. ' +
    '배열이 "접근 빠름·수정 느림"이라면 연결 리스트는 정반대다.',
  realWorld: 'LinkedList (Deque 구현) · 실무 코테에선 ArrayDeque로 대체하는 경우가 많음',
  javaCode: java,
  algorithms: { default: { label: '순회·중간삽입', code: java, build: () => linkedListSteps() } },
}
