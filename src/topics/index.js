import { complexityTopic } from './complexity.js'
import { arrayTopic } from './array.js'
import { linkedListTopic } from './linkedList.js'
import { binarySearchTopic } from './binarySearch.js'
import { recursionTopic } from './recursion.js'
import { sortingTopic } from './sorting.js'
import { stackTopic } from './stack.js'
import { queueTopic } from './queue.js'
import { hashTopic } from './hash.js'
import { treeTopic } from './tree.js'
import { heapTopic } from './heap.js'
import { dpTopic } from './dp.js'
import { graphTopic } from './graphTraversal.js'
import { codeGuideTopic } from './guide/codeGuide.js'
import { strategyTopic } from './guide/strategy.js'
import { debuggingTopic } from './guide/debugging.js'
import { libraryTopic } from './guide/library.js'
import { examTopic } from './guide/exam.js'

export const topics = [
  // 0주차 · 학습 가이드 (읽기)
  codeGuideTopic,
  strategyTopic,
  debuggingTopic,
  libraryTopic,
  // 1주차
  complexityTopic,
  // 2주차
  arrayTopic,
  linkedListTopic,
  binarySearchTopic,
  recursionTopic,
  // 3주차
  sortingTopic,
  stackTopic,
  queueTopic,
  hashTopic,
  // 4주차
  treeTopic,
  heapTopic,
  dpTopic,
  graphTopic,
  // 5주차
  examTopic,
]

export const weeks = [
  { week: 0, title: '학습 가이드' },
  { week: 1, title: '1주차 · 복잡도' },
  { week: 2, title: '2주차 · 배열·리스트·탐색·재귀' },
  { week: 3, title: '3주차 · 정렬·스택·큐·해시' },
  { week: 4, title: '4주차 · 트리·힙·DP·그래프' },
  { week: 5, title: '5주차 · 기출 유형' },
]

export const topicsByWeek = (w) => topics.filter((t) => t.week === w)
