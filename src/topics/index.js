import { sortingTopic } from './sorting.js'
import { binarySearchTopic } from './binarySearch.js'
import { graphTopic } from './graphTraversal.js'
import { recursionTopic } from './recursion.js'

export const topics = [binarySearchTopic, recursionTopic, sortingTopic, graphTopic]

export const weeks = [
  { week: 2, title: '2주차 · 이진탐색 · 재귀' },
  { week: 3, title: '3주차 · 정렬' },
  { week: 4, title: '4주차 · BFS · DFS' },
]

export const topicsByWeek = (w) => topics.filter((t) => t.week === w)
