<script setup>
import ArrayBars from '../renderers/ArrayBars.vue'
import GraphView from '../renderers/GraphView.vue'
import CallStack from '../renderers/CallStack.vue'

const map = {
  'array-bars': ArrayBars,
  graph: GraphView,
  'call-stack': CallStack,
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
.ph { color: #94a3b8; }
</style>
