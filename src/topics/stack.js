import { makeStep } from '../engine/types.js'

const java = `boolean isValid(String s) {              // 괄호 짝 검사
  Deque<Character> stack = new ArrayDeque<>();
  for (char c : s.toCharArray()) {
    if (c == '(') stack.push(c);         // 열림 → 쌓기
    else {                               // 닫힘 → 짝 맞추기
      if (stack.isEmpty()) return false;
      stack.pop();
    }
  }
  return stack.isEmpty();                // 다 비면 올바른 괄호
}`

export function parenSteps(s = '(()())') {
  const stack = []
  const steps = []
  const snap = (line, pos, ok, note) =>
    steps.push(makeStep(line, { items: [...stack], input: s, pos, ok, note }, note))

  snap(2, -1, null, '빈 스택 준비. 문자열을 왼쪽부터 읽는다')
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(') {
      stack.push('(')
      snap(4, i, null, `'(' 만남 → 스택에 push (높이 ${stack.length})`)
    } else {
      stack.pop()
      snap(7, i, null, `')' 만남 → 짝이 되는 '(' 를 pop`)
    }
  }
  snap(10, s.length, stack.length === 0, stack.length === 0 ? '스택이 비었다 → 올바른 괄호 ✓' : '스택이 남음 → 잘못된 괄호 ✗')
  return steps
}

export const stackTopic = {
  id: 'stack',
  week: 3,
  title: '스택 (Stack)',
  rendererId: 'stack-view',
  complexity: { time: 'push/pop O(1)', space: 'O(n)' },
  plainDef: '나중에 넣은 것이 가장 먼저 나오는(LIFO) 자료구조. 위로만 쌓고 위에서만 꺼낸다.',
  analogy: '책상에 쌓은 접시 더미. 맨 위 접시만 올리거나 뺄 수 있고, 맨 아래 접시를 빼려면 위를 다 치워야 한다.',
  why: '"가장 최근 것"을 되짚는 문제에 딱이다 — 괄호 검사, 실행 취소(Undo), 함수 호출(콜스택), DFS가 모두 스택으로 돌아간다.',
  terms: [
    { word: 'LIFO', desc: 'Last In First Out. 마지막에 넣은 것이 가장 먼저 나오는 순서. 스택의 핵심 성질.' },
    { word: 'push', desc: '스택 맨 위에 값을 넣는 연산. O(1).' },
    { word: 'pop', desc: '스택 맨 위 값을 꺼내(제거) 반환하는 연산. O(1).' },
    { word: 'ArrayDeque', desc: '배열 기반 양방향 큐. Java에서 스택·큐 둘 다로 권장된다. 옛 Stack 클래스보다 빠르다.' },
  ],
  coteTip:
    'Java에서 스택은 옛 Stack 클래스 대신 Deque<Integer> st = new ArrayDeque<>(); 를 쓰는 게 정석이다(더 빠르고 안전). ' +
    '괄호/수식 검사, 짝 맞추기, 단조 스택(가장 가까운 큰 수 찾기), DFS 반복 구현에 자주 등장한다.',
  concept:
    '스택은 한쪽 끝(top)에서만 넣고 빼는 LIFO 구조다. 아래 예시는 괄호 문자열을 읽으며 "(" 는 쌓고 ")" 는 짝을 꺼내, 끝에 스택이 비면 올바른 괄호로 판정한다 — 스택의 대표 활용.',
  realWorld: 'Deque<Integer> st = new ArrayDeque<>(); st.push(x); st.pop();',
  javaCode: java,
  algorithms: { default: { label: '괄호 검사', code: java, build: () => parenSteps('(()())') } },
}
