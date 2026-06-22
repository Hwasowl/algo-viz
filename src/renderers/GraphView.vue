<script setup>
import { computed } from 'vue'
const props = defineProps({ state: { type: Object, required: true } })

const pos = computed(() => {
  const n = props.state.nodes ?? []
  const cx = 200, cy = 165, r = 125
  return Object.fromEntries(
    n.map((id, i) => {
      const a = (i / n.length) * 2 * Math.PI - Math.PI / 2
      return [id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }]
    })
  )
})

const fill = (id) => {
  const s = props.state
  if (s.current === id) return '#f59e0b'
  if (s.visited?.includes(id)) return '#16a34a'
  if (s.frontier?.includes(id)) return '#3b82f6'
  return '#64748b'
}
</script>

<template>
  <div class="wrap">
    <svg viewBox="0 0 400 330" class="g">
      <line
        v-for="(e, i) in state.edges"
        :key="'e' + i"
        :x1="pos[e[0]].x" :y1="pos[e[0]].y"
        :x2="pos[e[1]].x" :y2="pos[e[1]].y"
        stroke="#cbd5e1" stroke-width="2"
      />
      <g v-for="id in state.nodes" :key="id">
        <circle :cx="pos[id].x" :cy="pos[id].y" r="21" :fill="fill(id)" />
        <text :x="pos[id].x" :y="pos[id].y + 5" text-anchor="middle" fill="#fff" font-size="15">{{ id }}</text>
      </g>
    </svg>
    <div class="info">
      <div><b>방문 순서</b> {{ (state.visited || []).join(' → ') || '—' }}</div>
      <div v-if="state.frontier?.length"><b>큐</b> [{{ state.frontier.join(', ') }}]</div>
    </div>
    <div class="legend">
      <span><i style="background:#f59e0b"></i>현재</span>
      <span><i style="background:#16a34a"></i>방문완료</span>
      <span><i style="background:#3b82f6"></i>큐 대기</span>
    </div>
  </div>
</template>

<style scoped>
.wrap { display: flex; flex-direction: column; height: 100%; width: 100%; align-items: center; }
.g { width: 100%; max-width: 400px; flex: 1; }
.info { font-size: 13px; color: #334155; padding: 4px 12px; text-align: center; }
.info b { color: #0f172a; }
.legend { display: flex; gap: 14px; padding: 10px; font-size: 12px; color: #475569; }
.legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
</style>
