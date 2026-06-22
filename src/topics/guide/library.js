export const libraryTopic = {
  id: 'library',
  week: 0,
  title: '🗂️ 자료구조 라이브러리 (Java)',
  plainDef: '코테에서 바로 꺼내 쓰는 Java 표준 자료구조 모음. "이 상황엔 이 클래스"를 한눈에. (딩코딩코 비교표의 Java 중심 재정리)',
  article: [
    { h: '핵심 자료구조 — Java 표준' },
    {
      table: {
        headers: ['자료구조', 'Java 클래스', '대표 사용'],
        rows: [
          ['동적 배열', '<code>ArrayList</code>', '<code>list.add(1); list.get(0);</code>'],
          ['연결 리스트', '<code>LinkedList</code>', '<code>list.addFirst(1);</code> (Deque이기도 함)'],
          ['스택', '<code>ArrayDeque</code>', '<code>st.push(1); st.pop();</code>'],
          ['큐', '<code>ArrayDeque</code>', '<code>q.offer(1); q.poll();</code>'],
          ['덱(양방향 큐)', '<code>ArrayDeque</code>', '<code>dq.addFirst(); dq.addLast(); dq.pollFirst();</code>'],
          ['해시맵', '<code>HashMap</code>', '<code>map.put("k",1); map.getOrDefault("k",0);</code>'],
          ['해시셋', '<code>HashSet</code>', '<code>set.add(1); set.contains(1);</code>'],
          ['우선순위 큐(힙)', '<code>PriorityQueue</code>', '<code>pq.offer(3); pq.poll();</code> (기본 최소 힙)'],
          ['정렬된 맵', '<code>TreeMap</code>', '<code>tm.put("b",2);</code> (key 자동 정렬, O(log n))'],
          ['정렬된 셋', '<code>TreeSet</code>', '<code>ts.add(3);</code> (자동 정렬, floor/ceiling 지원)'],
        ],
      },
    },

    { h: '유용한 유틸리티' },
    {
      table: {
        headers: ['기능', 'Java'],
        rows: [
          ['정렬', '<code>Arrays.sort(arr)</code> · <code>Collections.sort(list)</code> · <code>list.sort(Comparator…)</code>'],
          ['이진 탐색', '<code>Arrays.binarySearch()</code> · <code>Collections.binarySearch()</code>'],
          ['빈도수 카운팅', '<code>map.getOrDefault(k, 0) + 1</code> 로 직접'],
          ['순열/조합', '직접 재귀(백트래킹)로 구현'],
          ['최대/최소 힙', '<code>new PriorityQueue&lt;&gt;()</code> / <code>…(Collections.reverseOrder())</code>'],
        ],
      },
    },

    {
      callout: {
        tone: 'good',
        icon: '☕',
        title: '코딩테스트 Java 필수 4종',
        body: 'ArrayList · HashMap · PriorityQueue · ArrayDeque. 이 넷의 사용법만 완벽해도 코테의 90%를 커버한다. 부족한 자료구조는 직접 구현하기보다 표준 클래스를 조합해 푸는 게 빠르다.',
      },
    },
    {
      p: '참고: Java Collections Framework 공식 문서에서 각 클래스의 전체 메서드를 확인할 수 있다. 실무에서는 표준 라이브러리를 우선 쓰고(성능·안정성·가독성), 팀 컨벤션을 따르며, 필요할 때 Guava 같은 검증된 외부 라이브러리를 도입한다.',
    },
  ],
}
