import { makeStep } from '../engine/types.js'

const java = `Queue<Integer> q = new ArrayDeque<>();
q.offer(1);          // enqueue: 뒤에 넣기
q.offer(2);
q.offer(3);
int a = q.poll();    // dequeue: 앞에서 꺼내기 → 1
int b = q.poll();    // → 2  (넣은 순서대로 나온다)`

export function queueSteps() {
  const q = []
  const steps = []
  const snap = (line, op, note) =>
    steps.push(makeStep(line, { items: [...q], op, note }, note))

  snap(1, '', '빈 큐 준비. 뒤로 넣고(enqueue) 앞에서 꺼낸다(dequeue)')
  for (const v of [1, 2, 3]) {
    q.push(v)
    snap(2, 'in', `offer(${v}) → 뒤(rear)에 ${v} 추가`)
  }
  let x = q.shift()
  snap(5, 'out', `poll() → 앞(front)에서 ${x} 꺼냄 (가장 먼저 넣은 값)`)
  x = q.shift()
  snap(6, 'out', `poll() → ${x} 꺼냄. 넣은 순서대로 1,2 가 나온다 (FIFO)`)
  return steps
}

export const queueTopic = {
  id: 'queue',
  week: 3,
  title: '큐 (Queue)',
  rendererId: 'queue-view',
  complexity: { time: 'enqueue/dequeue O(1)', space: 'O(n)' },
  plainDef: '먼저 넣은 것이 먼저 나오는(FIFO) 자료구조. 뒤로 넣고 앞에서 꺼낸다.',
  analogy: '매표소 줄. 먼저 줄 선 사람이 먼저 표를 산다. 새치기 없이 들어온 순서대로 처리된다.',
  why: '"들어온 순서대로 처리"가 필요한 모든 곳에 쓰인다 — BFS(너비 우선 탐색), 작업 대기열, 캐시, 프린터 출력 순서 등.',
  terms: [
    { word: 'FIFO', desc: 'First In First Out. 먼저 넣은 것이 먼저 나오는 순서. 큐의 핵심 성질(스택의 LIFO와 반대).' },
    { word: 'enqueue', desc: '큐의 뒤(rear)에 값을 넣는 연산. Java에서는 offer() 또는 add(). O(1).' },
    { word: 'dequeue', desc: '큐의 앞(front)에서 값을 꺼내는 연산. Java에서는 poll() 또는 remove(). O(1).' },
    { word: 'front / rear', desc: 'front는 다음에 나올 맨 앞, rear는 방금 들어온 맨 뒤를 가리킨다.' },
  ],
  coteTip:
    'Java에서 큐는 Queue<Integer> q = new ArrayDeque<>(); 가 가장 빠르다(LinkedList도 가능). ' +
    'poll()/peek()은 비었을 때 null을 반환하고, remove()/element()는 예외를 던진다 — 코테에선 null 반환형이 다루기 편하다. BFS의 핵심 부품.',
  concept:
    '큐는 한쪽(rear)으로 넣고 반대쪽(front)에서 빼는 FIFO 구조다. 들어온 순서가 그대로 나가는 순서가 된다. ' +
    'BFS에서 "방문할 노드"를 큐에 담아 가까운 것부터 꺼내는 데 쓰인다.',
  realWorld: 'Queue<Integer> q = new ArrayDeque<>(); q.offer(x); q.poll();',
  javaCode: java,
  algorithms: { default: { label: 'enqueue / dequeue', code: java, build: () => queueSteps() } },
}
