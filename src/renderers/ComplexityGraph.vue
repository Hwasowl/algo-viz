<script setup>
import { computed } from 'vue'
const props = defineProps({ state: { type: Object, required: true } })
const maxLog = computed(() => {
  const m = Math.max(...(props.state.rows || []).map((r) => Math.log10(r.ops + 1)))
  return m || 1
})
const fmt = (n) => (n >= 10000 ? n.toExponential(0).replace('e+', '×10^') : n.toLocaleString())
</script>

<template>
  <div class="wrap">
    <div class="n">입력 크기 n = <b>{{ state.n }}</b></div>
    <div class="rows">
      <div v-for="r in state.rows" :key="r.label" class="row">
        <span class="lbl" :style="{ color: r.color }">{{ r.label }}</span>
        <div class="track">
          <div class="fill" :style="{ width: (Math.log10(r.ops + 1) / maxLog) * 100 + '%', background: r.color }"></div>
        </div>
        <span class="ops">{{ fmt(r.ops) }}</span>
      </div>
    </div>
    <div class="hint">막대가 길수록 연산이 많다(느리다). 막대는 보기 좋게 로그 스케일.</div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; padding: 18px 22px; display: flex; flex-direction: column; gap: 12px; }
.n { font-size: 14px; color: var(--text-dim); }
.n b { color: var(--text); font-size: 16px; }
.rows { display: flex; flex-direction: column; gap: 12px; flex: 1; justify-content: center; }
.row { display: grid; grid-template-columns: 84px 1fr 96px; align-items: center; gap: 12px; }
.lbl { font-size: 13px; font-weight: 700; font-family: monospace; }
.track { height: 18px; background: #0d1526; border-radius: 5px; overflow: hidden; }
.fill { height: 100%; border-radius: 5px; transition: width 0.35s ease; min-width: 2px; }
.ops { font-size: 12px; color: var(--text-dim); text-align: right; font-variant-numeric: tabular-nums; }
.hint { font-size: 12px; color: var(--text-muted); }
</style>
