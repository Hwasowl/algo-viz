<script setup>
import ArrayBars from '../renderers/ArrayBars.vue'
import GraphView from '../renderers/GraphView.vue'
import CallStack from '../renderers/CallStack.vue'
import ComplexityGraph from '../renderers/ComplexityGraph.vue'
import ArrayCells from '../renderers/ArrayCells.vue'
import LinkedListView from '../renderers/LinkedListView.vue'
import StackView from '../renderers/StackView.vue'
import QueueView from '../renderers/QueueView.vue'
import HashTable from '../renderers/HashTable.vue'
import TreeView from '../renderers/TreeView.vue'
import HeapView from '../renderers/HeapView.vue'
import DpTable from '../renderers/DpTable.vue'

const map = {
  'array-bars': ArrayBars,
  graph: GraphView,
  'call-stack': CallStack,
  'complexity-graph': ComplexityGraph,
  'array-cells': ArrayCells,
  'linked-list': LinkedListView,
  'stack-view': StackView,
  'queue-view': QueueView,
  'hash-table': HashTable,
  'tree-view': TreeView,
  'heap-view': HeapView,
  'dp-table': DpTable,
}

defineProps({
  rendererId: { type: String, default: '' },
  state: { type: Object, default: () => ({}) },
})
</script>

<template>
  <div class="stage">
    <component :is="map[rendererId]" :state="state" v-if="state && map[rendererId]" />
    <div v-else class="ph">렌더러 없음: {{ rendererId }}</div>
  </div>
</template>

<style scoped>
.stage { height: 100%; display: flex; align-items: center; justify-content: center; overflow: auto; }
.ph { color: var(--text-muted); }
</style>
