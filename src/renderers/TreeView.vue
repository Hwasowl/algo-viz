<script setup>
import { computed } from 'vue'
const props = defineProps({ state: { type: Object, required: true } })

const layout = computed(() => {
  const { nodes, root } = props.state
  const order = {}
  let counter = 0
  let maxDepth = 0
  const assign = (id, depth) => {
    if (id == null) return
    assign(nodes[id].left, depth + 1)
    order[id] = { x: counter++, depth }
    maxDepth = Math.max(maxDepth, depth)
    assign(nodes[id].right, depth + 1)
  }
  assign(root, 0)
  const total = counter
  const W = 400, H = 280, padX = 32, padY = 34
  const coords = {}
  for (const id in order) {
    const o = order[id]
    coords[id] = {
      x: total <= 1 ? W / 2 : padX + (o.x / (total - 1)) * (W - 2 * padX),
      y: padY + (maxDepth === 0 ? 0 : (o.depth / maxDepth) * (H - 2 * padY)),
    }
  }
  const edges = []
  for (const id in nodes) {
    if (!coords[id]) continue
    for (const c of [nodes[id].left, nodes[id].right]) {
      if (c != null && coords[c]) edges.push([coords[id], coords[c]])
    }
  }
  return { coords, edges, W, H }
})

const fill = (id) => {
  const s = props.state
  if (s.current === Number(id) || s.current === id) return '#fbbf24'
  if (s.visited?.includes(Number(id))) return '#34d399'
  return '#64748b'
}
</script>

<template>
  <div class="wrap">
    <svg :viewBox="`0 0 ${layout.W} ${layout.H}`" class="g">
      <line v-for="(e, i) in layout.edges" :key="'e' + i" :x1="e[0].x" :y1="e[0].y" :x2="e[1].x" :y2="e[1].y" stroke="#2a3a59" stroke-width="2" />
      <g v-for="(c, id) in layout.coords" :key="id">
        <circle :cx="c.x" :cy="c.y" r="19" :fill="fill(id)" />
        <text :x="c.x" :y="c.y + 5" text-anchor="middle" fill="#0b1220" font-size="14" font-weight="700">{{ state.nodes[id].val }}</text>
      </g>
    </svg>
    <div class="visited">방문 순서: {{ (state.visited || []).map((id) => state.nodes[id].val).join(' → ') || '—' }}</div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.g { width: 100%; max-width: 420px; flex: 1; }
.visited { font-size: 13px; color: var(--text-dim); padding: 6px 12px; text-align: center; }
</style>
