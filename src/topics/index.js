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

export const topics = [
  complexityTopic,
  arrayTopic,
  linkedListTopic,
  binarySearchTopic,
  recursionTopic,
  sortingTopic,
  stackTopic,
  queueTopic,
  hashTopic,
  treeTopic,
  heapTopic,
  dpTopic,
  graphTopic,
]

export const weeks = [
  { week: 1, title: '1주차 · 복잡도' },
  { week: 2, title: '2주차 · 배열·리스트·탐색·재귀' },
  { week: 3, title: '3주차 · 정렬·스택·큐·해시' },
  { week: 4, title: '4주차 · 트리·힙·DP·그래프' },
]

export const topicsByWeek = (w) => topics.filter((t) => t.week === w)
