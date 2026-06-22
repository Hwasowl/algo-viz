<script setup>
import { computed } from 'vue'
const props = defineProps({ state: { type: Object, required: true } })

const layout = computed(() => {
  const heap = props.state.heap || []
  const W = 400, H = 220, padY = 28
  const nodes = heap.map((v, i) => {
    const depth = Math.floor(Math.log2(i + 1))
    const levelStart = Math.pow(2, depth) - 1
    const posInLevel = i - levelStart
    const levelCount = Math.pow(2, depth)
    return { i, v, x: ((posInLevel + 0.5) / levelCount) * W, y: padY + depth * 56 }
  })
  const edges = []
  nodes.forEach((n) => {
    for (const c of [2 * n.i + 1, 2 * n.i + 2]) {
      if (c < nodes.length) edges.push([n, nodes[c]])
    }
  })
  return { nodes, edges, W, H }
})

const color = (i) => {
  const s = props.state
  if (s.swapped?.includes(i)) return '#f87171'
  if (s.highlight?.includes(i)) return '#60a5fa'
  if (i === 0) return '#34d399'
  return '#64748b'
}
</script>

<template>
  <div class="wrap">
    <svg :viewBox="`0 0 ${layout.W} ${layout.H}`" class="g">
      <line v-for="(e, i) in layout.edges" :key="'e' + i" :x1="e[0].x" :y1="e[0].y" :x2="e[1].x" :y2="e[1].y" stroke="#2a3a59" stroke-width="2" />
      <g v-for="n in layout.nodes" :key="n.i">
        <circle :cx="n.x" :cy="n.y" r="18" :fill="color(n.i)" />
        <text :x="n.x" :y="n.y + 5" text-anchor="middle" fill="#0b1220" font-size="14" font-weight="700">{{ n.v }}</text>
      </g>
    </svg>
    <div class="arr">
      <div class="arr-label">배열 표현</div>
      <div class="cells">
        <div v-for="n in layout.nodes" :key="n.i" class="cell" :style="{ borderColor: color(n.i), color: color(n.i) }">{{ n.v }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.g { width: 100%; max-width: 420px; flex: 1; }
.arr { display: flex; flex-direction: column; align-items: center; gap: 5px; padding-bottom: 8px; }
.arr-label { font-size: 11px; color: var(--text-muted); }
.cells { display: flex; gap: 4px; }
.cell {
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  background: #131d33; border: 1.5px solid var(--border); border-radius: 6px; font-weight: 700; font-size: 13px; font-family: monospace;
}
</style>
