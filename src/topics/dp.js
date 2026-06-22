import { makeStep } from '../engine/types.js'

const java = `int climbStairs(int n) {       // 한 번에 1칸 or 2칸, n칸 오르는 경우의 수
  int[] dp = new int[n + 1];
  dp[0] = 1; dp[1] = 1;        // 기저값(작은 정답)
  for (int i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2]; // 작은 정답을 더해 큰 정답을 만든다
  return dp[n];
}`

export function dpSteps(n = 6) {
  const dp = new Array(n + 1).fill(null)
  const steps = []
  const snap = (line, current, deps, note) =>
    steps.push(
      makeStep(
        line,
        { cells: dp.map((v, i) => ({ v, i, filled: v !== null })), current, deps, note },
        note
      )
    )

  snap(2, -1, [], `dp[i] = i칸을 오르는 방법의 수. 표를 채워 나간다`)
  dp[0] = 1
  snap(3, 0, [], `dp[0] = 1 (기저값: 0칸은 가만히 있는 1가지)`)
  dp[1] = 1
  snap(3, 1, [], `dp[1] = 1 (기저값: 1칸은 1가지)`)
  for (let i = 2; i <= n; i++) {
    snap(5, i, [i - 1, i - 2], `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}`)
    dp[i] = dp[i - 1] + dp[i - 2]
    snap(5, i, [], `dp[${i}] = ${dp[i]} 로 채움`)
  }
  snap(6, n, [], `정답 dp[${n}] = ${dp[n]} (이미 계산한 값을 재사용해 O(n))`)
  return steps
}

export const dpTopic = {
  id: 'dp',
  week: 4,
  title: '동적 계획법 (DP)',
  rendererId: 'dp-table',
  complexity: { time: 'O(n) ~ O(n²)', space: 'O(n) ~ O(n²)' },
  plainDef: '큰 문제를 작은 문제로 나눠 풀고, 작은 답을 표에 저장해 두었다가 재사용해서 중복 계산을 없애는 기법.',
  analogy: '계단을 오르는 방법 수를 셀 때, 매번 처음부터 세지 않고 "한 칸 아래까지의 방법 + 두 칸 아래까지의 방법"을 적어 둔 표를 보고 더한다.',
  why: '재귀로 풀면 같은 계산을 수없이 반복(O(2ⁿ))하는 문제를, 표에 저장해 한 번씩만 계산(O(n))하게 만든다. 코테 고난도 단골.',
  terms: [
    { word: '점화식', desc: 'dp[i]를 더 작은 dp 값으로 표현한 식. 예: dp[i] = dp[i-1] + dp[i-2]. DP의 핵심.' },
    { word: '기저값', desc: '점화식의 출발점이 되는 가장 작은 정답. 예: dp[0]=1, dp[1]=1.' },
    { word: '메모이제이션', desc: '재귀로 풀되 계산한 값을 저장해 재사용하는 하향식(top-down) DP.' },
    { word: '타뷸레이션', desc: '작은 것부터 표를 채워 올라가는 상향식(bottom-up) DP. 반복문으로 구현.' },
  ],
  coteTip:
    'DP의 80%는 "점화식 세우기"가 전부다. ① 무엇을 dp[i]로 둘지(상태 정의) ② dp[i]를 작은 dp로 어떻게 표현할지(점화식) ③ 기저값을 정하면 끝. ' +
    '재귀+메모이제이션이 떠올리기 쉽고, 반복문(타뷸레이션)이 빠르고 StackOverflow가 없다. 계단/배낭/LIS/편집거리가 대표 유형.',
  concept:
    'DP는 "큰 문제 = 작은 문제들의 조합"이고 작은 문제가 겹칠 때(중복 부분문제) 쓴다. 작은 답을 표(dp 배열)에 저장해 한 번씩만 계산한다. ' +
    '아래는 계단 오르기 — dp[i] = dp[i-1] + dp[i-2] 점화식으로 표를 왼쪽부터 채운다.',
  realWorld: 'int[] dp · 점화식 + 기저값 · 메모이제이션(HashMap) 또는 타뷸레이션',
  javaCode: java,
  algorithms: { default: { label: '계단 오르기', code: java, build: () => dpSteps(6) } },
}
