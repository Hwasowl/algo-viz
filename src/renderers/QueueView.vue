<script setup>
defineProps({ state: { type: Object, required: true } })
</script>

<template>
  <div class="wrap">
    <div class="labels">
      <span class="front">front (먼저 나감)</span>
      <span class="rear">rear (나중 들어옴)</span>
    </div>
    <div class="queue">
      <span class="cap">◀ 꺼냄</span>
      <transition-group name="q" tag="div" class="items">
        <div v-for="(v, i) in state.items" :key="v + '-' + i" class="item">{{ v }}</div>
      </transition-group>
      <span class="cap">넣음 ◀</span>
    </div>
    <div class="empty" v-if="!state.items.length">(비어 있음)</div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
.labels { display: flex; justify-content: space-between; width: 320px; font-size: 12px; }
.front { color: var(--green); }
.rear { color: var(--blue); }
.queue { display: flex; align-items: center; gap: 10px; border: 2px solid var(--border); border-radius: 10px; padding: 12px; min-width: 320px; justify-content: center; }
.items { display: flex; gap: 6px; }
.item {
  width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
  background: #1c2740; border: 1px solid var(--accent); border-radius: 8px; color: var(--text); font-weight: 700; font-size: 16px;
}
.cap { font-size: 11px; color: var(--text-muted); }
.empty { color: var(--text-muted); font-size: 13px; }
.q-enter-active, .q-leave-active { transition: all 0.25s; }
.q-enter-from { opacity: 0; transform: translateX(14px); }
.q-leave-to { opacity: 0; transform: translateX(-14px); }
</style>
