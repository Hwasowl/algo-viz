<script setup>
const props = defineProps({ state: { type: Object, required: true } })
const cls = (i) => {
  const s = props.state
  if (i === s.current) return 'cur'
  if (s.deps?.includes(i)) return 'dep'
  return ''
}
</script>

<template>
  <div class="wrap">
    <div class="tablename">dp 배열 (왼쪽부터 채워 나간다)</div>
    <div class="cells">
      <div v-for="c in state.cells" :key="c.i" class="col">
        <div class="cell" :class="[cls(c.i), { filled: c.filled }]">{{ c.v === null ? '·' : c.v }}</div>
        <div class="idx">dp[{{ c.i }}]</div>
      </div>
    </div>
    <div class="legend">
      <span><i class="cur"></i>지금 계산</span>
      <span><i class="dep"></i>참조하는 작은 답</span>
      <span><i class="filled"></i>계산 완료</span>
    </div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 16px; }
.tablename { font-size: 13px; color: var(--text-dim); }
.cells { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
.col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.cell {
  width: 46px; height: 46px; display: flex; align-items: center; justify-content: center;
  background: #131d33; border: 1.5px solid var(--border); border-radius: 8px;
  color: var(--text-muted); font-weight: 700; font-size: 15px; transition: all 0.25s;
}
.cell.filled { background: #16331f; border-color: #2e5a3a; color: var(--green); }
.cell.dep { background: #1e3a5f; border-color: var(--blue); color: var(--blue); }
.cell.cur { background: #3a2e0f; border-color: var(--amber); color: var(--amber); transform: scale(1.08); }
.idx { font-size: 10.5px; color: var(--text-muted); font-family: monospace; }
.legend { display: flex; gap: 16px; font-size: 12px; color: var(--text-dim); }
.legend i { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 5px; vertical-align: middle; }
.legend i.cur { background: var(--amber); }
.legend i.dep { background: var(--blue); }
.legend i.filled { background: var(--green); }
</style>
