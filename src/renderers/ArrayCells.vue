<script setup>
const props = defineProps({ state: { type: Object, required: true } })
const cls = (i) => {
  const s = props.state
  if (s.inserted?.includes(i)) return 'inserted'
  if (s.highlight?.includes(i)) return 'hi'
  if (s.shifting?.includes(i)) return 'shift'
  return ''
}
</script>

<template>
  <div class="wrap">
    <div class="cells">
      <div v-for="(c, i) in state.cells" :key="i" class="col">
        <div class="cell" :class="cls(i)">{{ c.v }}</div>
        <div class="idx">{{ i }}</div>
      </div>
    </div>
    <div class="legend">
      <span><i class="hi"></i>접근</span>
      <span><i class="shift"></i>이동(밀기/당기기)</span>
      <span><i class="inserted"></i>삽입됨</span>
    </div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
.cells { display: flex; gap: 4px; }
.col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.cell {
  width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
  background: var(--tile); border: 1.5px solid var(--tile-border); border-radius: 8px;
  color: var(--text); font-weight: 600; font-size: 15px; transition: all 0.25s;
}
.cell.hi { background: var(--hi-bg); border-color: var(--hi-bd); color: var(--hi-tx); }
.cell.shift { background: var(--am-bg); border-color: var(--am-bd); color: var(--am-tx); }
.cell.inserted { background: var(--ok-bg); border-color: var(--ok-bd); color: var(--ok-tx); }
.idx { font-size: 11px; color: var(--text-muted); }
.legend { display: flex; gap: 16px; font-size: 12px; color: var(--text-dim); }
.legend i { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 5px; vertical-align: middle; }
.legend i.hi { background: var(--blue); }
.legend i.shift { background: var(--amber); }
.legend i.inserted { background: var(--green); }
</style>
