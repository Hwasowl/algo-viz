<script setup>
const props = defineProps({ state: { type: Object, required: true } })

const colorOf = (i) => {
  const s = props.state
  if (s.found === i) return '#16a34a'
  if (s.mid === i) return '#f59e0b'
  if (s.sorted?.includes(i)) return '#16a34a'
  if (s.swapped?.includes(i)) return '#ef4444'
  if (s.compared?.includes(i)) return '#3b82f6'
  if ((s.lo !== undefined && i < s.lo) || (s.hi !== undefined && i > s.hi)) return '#cbd5e1'
  return '#64748b'
}
</script>

<template>
  <div class="wrap">
    <div class="bars">
      <div
        v-for="(v, i) in state.arr"
        :key="i"
        class="bar"
        :style="{ height: v * 18 + 14 + 'px', background: colorOf(i) }"
      >
        <span class="val">{{ v }}</span>
        <span class="idx">{{ i }}</span>
      </div>
    </div>
    <div class="legend">
      <span><i style="background:#3b82f6"></i>비교</span>
      <span><i style="background:#ef4444"></i>교환</span>
      <span><i style="background:#f59e0b"></i>mid</span>
      <span><i style="background:#16a34a"></i>확정/발견</span>
    </div>
  </div>
</template>

<style scoped>
.wrap { display: flex; flex-direction: column; height: 100%; width: 100%; }
.bars { flex: 1; display: flex; gap: 8px; align-items: flex-end; justify-content: center; padding: 24px 16px; }
.bar {
  width: 38px; border-radius: 5px 5px 0 0; color: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
  font-size: 13px; padding-top: 4px; position: relative;
  transition: height 0.25s ease, background 0.2s ease;
}
.val { font-weight: 600; }
.idx { position: absolute; bottom: -20px; color: #94a3b8; font-size: 11px; }
.legend { display: flex; gap: 14px; justify-content: center; padding: 10px; font-size: 12px; color: var(--text-dim); }
.legend i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; }
</style>
