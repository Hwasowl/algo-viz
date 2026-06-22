import { makeStep } from '../engine/types.js'

const java = `Map<Integer, Integer> map = new HashMap<>();
// 저장 위치(인덱스) = key % 배열크기
map.put(12, 1);      // 12 % 5 = 2
map.put(27, 1);      // 27 % 5 = 2  → 같은 칸! (충돌)
//   충돌하면 그 칸에 체인(목록)으로 매달아 해결
int v = map.get(27); // 인덱스 2로 가서 체인을 훑어 찾음`

export function hashSteps() {
  const size = 5
  const buckets = Array.from({ length: size }, () => [])
  const steps = []
  const snap = (line, key, hash, note) =>
    steps.push(makeStep(line, { buckets: buckets.map((b) => [...b]), size, key, hash, note }, note))

  snap(2, null, -1, `크기 ${size} 해시테이블. 저장 위치 = key % ${size}`)
  for (const k of [12, 27, 5, 8]) {
    const h = k % size
    const collision = buckets[h].length > 0
    snap(3, k, h, `put(${k}) → ${k} % ${size} = ${h}${collision ? ' (이미 값 있음 → 충돌!)' : ''}`)
    buckets[h].push(k)
    snap(5, k, h, collision ? `충돌 해결: ${h}번 칸 체인에 ${k} 매달기` : `${h}번 칸에 ${k} 저장`)
  }
  const h = 27 % size
  snap(6, 27, h, `get(27) → 인덱스 ${h} 로 이동`)
  snap(6, 27, h, `${h}번 체인을 훑어 27 발견 ✓ (평균 O(1))`)
  return steps
}

export const hashTopic = {
  id: 'hash',
  week: 3,
  title: '해시 (Hash)',
  rendererId: 'hash-table',
  complexity: { time: '평균 O(1) · 최악 O(n)', space: 'O(n)' },
  plainDef: '값을 "계산식(해시 함수)"으로 곧바로 저장 위치로 바꿔, 검색·저장을 평균 O(1)에 하는 자료구조.',
  analogy: '사물함 번호를 학번 뒷자리로 정하는 규칙. "27번 학생 물건?" → 27%5=2, 바로 2번 사물함으로. 처음부터 뒤지지 않아도 된다.',
  why: '"이 값이 있나?", "이 key의 값은?"을 평균 한 번에 답한다. 중복 제거, 빈도수 세기, 캐싱 등 코테에서 압도적으로 많이 쓰인다.',
  terms: [
    { word: '해시 함수', desc: '값(key)을 저장 위치(정수 인덱스)로 바꾸는 계산식. 예: key % 배열크기.' },
    { word: '충돌', desc: '서로 다른 key가 같은 인덱스로 계산되는 것. 체인(연결)이나 다른 칸 찾기로 해결한다.' },
    { word: '체이닝', desc: '같은 칸에 충돌한 값들을 연결 리스트로 매달아 두는 충돌 해결법. Java HashMap의 기본 방식.' },
    { word: 'HashMap / HashSet', desc: 'key→value 저장은 HashMap, "있는지"만 보는 집합은 HashSet. 둘 다 평균 O(1).' },
  ],
  coteTip:
    'getOrDefault(key, 0) 로 빈도수 세기, containsKey/contains 로 존재 확인이 코테 단골 패턴. ' +
    '순서가 필요하면 LinkedHashMap, 정렬된 순회가 필요하면 TreeMap(O(log n))을 쓴다. 해시는 "순서 없음"이 기본이라는 점을 기억하라.',
  concept:
    '해시는 해시 함수로 key를 인덱스로 바꿔 그 자리에 값을 둔다. 서로 다른 key가 같은 자리로 가면(충돌) 체인으로 매달아 해결한다. ' +
    '충돌이 적으면 평균 O(1)이지만, 다 같은 자리로 몰리면 최악 O(n)이 된다.',
  realWorld: 'HashMap<K,V> · HashSet<T> · getOrDefault · 빈도수/중복 처리',
  javaCode: java,
  algorithms: { default: { label: '저장·충돌·조회', code: java, build: () => hashSteps() } },
}
