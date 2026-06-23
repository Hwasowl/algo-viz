<script setup>
const props = defineProps({ state: { type: Object, required: true } })
const cls = (i) => {
  const s = props.state
  if (s.inserted?.includes(i)) return 'inserted'
  if (s.highlight?.includes(i)) return 'hi'
  return ''
}
</script>

<template>
  <div class="wrap">
    <div class="list">
      <template v-for="(n, i) in state.nodes" :key="i">
        <div class="node" :class="cls(i)">
          <span class="val">{{ n.v }}</span>
          <span class="ptr">●</span>
        </div>
        <span v-if="i < state.nodes.length - 1" class="arrow">→</span>
        <span v-else class="nul">→ null</span>
      </template>
    </div>
    <div class="legend"><span class="head">head</span> 부터 화살표(next)를 따라간다</div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; }
.list { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; padding: 0 12px; }
.node {
  display: flex; align-items: center; border: 1px solid var(--border); border-radius: 8px;
  overflow: hidden; transition: all 0.25s;
}
.val { padding: 12px 14px; background: var(--tile); color: var(--text); font-weight: 700; font-size: 15px; }
.ptr { padding: 12px 10px; background: var(--surface-2); color: var(--text-muted); font-size: 11px; }
.node { background: var(--surface); }
.node.hi { border-color: var(--am-bd); box-shadow: 0 0 0 2px #d9770633; }
.node.hi .val { color: var(--am-tx); background: var(--am-bg); }
.node.inserted { border-color: var(--ok-bd); box-shadow: 0 0 0 2px #16a34a33; }
.node.inserted .val { color: var(--ok-tx); background: var(--ok-bg); }
.arrow { color: var(--accent); font-size: 20px; }
.nul { color: var(--text-muted); font-size: 13px; }
.legend { font-size: 12.5px; color: var(--text-dim); }
.head { color: var(--accent); font-weight: 700; }
</style>
