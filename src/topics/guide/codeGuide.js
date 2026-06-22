export const codeGuideTopic = {
  id: 'code-guide',
  week: 0,
  title: '✍️ 코드 작성 가이드 (Java)',
  plainDef: '처음 코테를 보는 사람이 "Java로 어떻게 시작하지?"에 바로 답이 되는 실전 템플릿 모음. 입출력부터 자주 쓰는 API, 흔한 실수까지.',
  article: [
    { h: '1. 문제 푸는 순서 (틀을 먼저 잡기)' },
    {
      p: '코드를 바로 짜지 말고 항상 ① 입력 받기 → ② 처리(알고리즘) → ③ 출력 세 덩어리로 나눠라. 머릿속이 복잡할수록 종이에 "무엇을 입력받아 어디에 저장하고, 어떤 과정을 거쳐, 무엇을 출력할지" 순서도부터 적는 게 빠른 길이다.',
    },
    {
      callout: {
        tone: 'info',
        icon: '🧭',
        title: '막히면 이 순서로',
        body: '문제 다시 읽기 → 입출력 예시 손으로 따라가기 → 가장 단순한 방법(완전탐색)부터 떠올리기 → 시간복잡도 계산해서 통과 가능한지 보기 → 안 되면 자료구조/알고리즘으로 개선.',
      },
    },

    { h: '2. 입출력 템플릿 — Scanner 대신 BufferedReader' },
    {
      p: 'Java의 Scanner는 느려서 입력이 많으면 시간 초과가 난다. 입력이 큰 문제는 BufferedReader + StringTokenizer, 출력이 많으면 StringBuilder나 BufferedWriter로 모아서 한 번에 내보낸다.',
      terms: [
        { word: 'BufferedReader', desc: '입력을 버퍼에 모아 한 번에 읽어 Scanner보다 빠른 입력 클래스. 대량 입력의 표준.' },
        { word: 'StringTokenizer', desc: '한 줄을 공백 기준으로 잘라 토큰으로 꺼내는 도구. nextToken()으로 하나씩 가져온다.' },
        { word: 'StringBuilder', desc: '문자열을 효율적으로 이어 붙이는 클래스. 출력을 모아 한 번에 print해 속도를 높인다.' },
      ],
    },
    {
      code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();

        int n = Integer.parseInt(br.readLine().trim());   // 첫 줄: 정수 하나
        StringTokenizer st = new StringTokenizer(br.readLine()); // 둘째 줄: 공백 구분
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());

        long sum = 0;
        for (int x : a) sum += x;        // 처리

        sb.append(sum).append('\\n');     // 출력은 모았다가
        System.out.print(sb);            // 한 번에 내보내기
    }
}`,
    },

    { h: '3. 입력 크기(N)로 허용 복잡도 추정하기' },
    {
      p: 'Java는 1초에 약 1억(10⁸)번 연산이 한계다. 문제에 주어진 N을 보고 "어떤 복잡도까지 통과되는지"를 역산하는 습관이 합격을 가른다.',
    },
    {
      table: {
        headers: ['N의 크기', '허용 시간복잡도', '대표 접근'],
        rows: [
          ['N ≤ 10', 'O(2ⁿ), O(N!)', '완전탐색, 순열·조합, 백트래킹'],
          ['N ≤ 20~25', 'O(2ⁿ)', '부분집합, 비트마스크 DP'],
          ['N ≤ 500', 'O(N³)', '플로이드–워셜, 3중 반복'],
          ['N ≤ 5,000', 'O(N²)', '이중 반복, 기본 DP'],
          ['N ≤ 100,000', 'O(N log N)', '정렬, 이분탐색, 힙, 분할정복'],
          ['N ≤ 10,000,000', 'O(N), O(log N)', '한 번 훑기, 투포인터, 누적합'],
        ],
      },
    },

    { h: '4. 자료구조 선택 가이드' },
    {
      table: {
        headers: ['이럴 때', '이걸 쓴다 (Java)'],
        rows: [
          ['순서대로 저장 + 인덱스 접근', '<code>ArrayList</code> / <code>int[]</code>'],
          ['먼저 넣은 걸 먼저 처리 (BFS)', '<code>ArrayDeque</code> (큐)'],
          ['나중 넣은 걸 먼저 처리 (DFS·괄호)', '<code>ArrayDeque</code> (스택)'],
          ['key로 값 찾기 / 빈도수 세기', '<code>HashMap</code>'],
          ['있는지 확인 / 중복 제거', '<code>HashSet</code>'],
          ['항상 최소·최대를 빠르게 꺼내기', '<code>PriorityQueue</code>'],
          ['정렬된 상태로 검색·순회', '<code>TreeMap</code> / <code>TreeSet</code>'],
        ],
      },
    },

    { h: '5. 자주 쓰는 Java API 스니펫' },
    {
      code: `// 정렬 + 기준 지정(Comparator)
int[][] arr = ...;
Arrays.sort(arr, (x, y) -> x[0] - y[0]);            // 첫 원소 오름차순
list.sort(Comparator.comparingInt(p -> p.age));     // 나이순
list.sort(Comparator.comparingInt((P p) -> p.age).reversed()); // 내림차순

// 빈도수 세기
Map<String, Integer> cnt = new HashMap<>();
for (String w : words) cnt.put(w, cnt.getOrDefault(w, 0) + 1);

// 우선순위 큐(최소/최대 힙)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// 큐 / 스택 (둘 다 ArrayDeque)
Deque<Integer> queue = new ArrayDeque<>();  queue.offer(1); queue.poll();
Deque<Integer> stack = new ArrayDeque<>();  stack.push(1);  stack.pop();

// 문자열
char[] cs = s.toCharArray();
String joined = String.join(",", list);
StringBuilder sb = new StringBuilder(s).reverse();`,
    },

    { h: '6. 초보자가 가장 많이 하는 실수' },
    {
      list: [
        'int 오버플로 — 합·곱이 21억을 넘으면 long으로. "최댓값", "경우의 수"는 일단 long을 의심하라.',
        '배열 범위 — 인덱스 0~n-1. 격자 문제는 0 ≤ x < N && 0 ≤ y < M 경계 체크를 항상 먼저.',
        'Scanner 사용 — 입력 많은 문제는 BufferedReader로. Scanner는 느려서 시간 초과의 단골 원인.',
        '== 로 문자열 비교 — Java에서 문자열은 .equals()로 비교해야 한다. == 는 주소 비교.',
        '재귀 깊이 — DFS 재귀가 깊으면 StackOverflow. 칸 수가 많으면 명시적 스택(ArrayDeque)으로.',
        '출력마다 println — 출력이 많으면 StringBuilder에 모아 한 번에. 반복 println은 느리다.',
      ],
      terms: [
        { word: 'int 오버플로', desc: 'int 최대값 약 21억을 넘으면 음수로 뒤집히는 버그. long(약 922경)으로 바꿔 해결.' },
        { word: 'long', desc: '약 ±922경까지 담는 정수 타입. 큰 합·곱·경우의 수에 쓴다. 리터럴은 100000000000L 처럼 L을 붙인다.' },
      ],
    },
    {
      callout: {
        tone: 'good',
        icon: '☕',
        title: '코테용 Java 4종 세트',
        body: 'ArrayList · HashMap · PriorityQueue · ArrayDeque 이 4개의 사용법만 손에 익혀도 코테 문제의 대부분을 커버한다. 자세한 동작은 왼쪽 메뉴의 각 자료구조 페이지에서 애니메이션으로 확인하라.',
      },
    },
  ],
}
