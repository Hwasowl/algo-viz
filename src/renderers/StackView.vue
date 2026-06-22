<script setup>
import { computed } from 'vue'
const props = defineProps({ state: { type: Object, required: true } })
const reversed = computed(() => [...(props.state.items || [])].map((v, i) => ({ v, i })).reverse())
const chars = computed(() => (props.state.input || '').split(''))
</script>

<template>
  <div class="wrap">
    <div v-if="state.input" class="input">
      <span
        v-for="(ch, i) in chars"
        :key="i"
        class="ch"
        :class="{ on: i === state.pos, done: i < state.pos }"
        >{{ ch }}</span
      >
    </div>

    <div class="stackbox">
      <div class="top-label">▲ top</div>
      <transition-group name="st">
        <div v-for="it in reversed" :key="it.i" class="item">{{ it.v }}</div>
      </transition-group>
      <div class="empty" v-if="!reversed.length">(비어 있음)</div>
      <div class="floor">bottom ▼</div>
    </div>

    <div v-if="state.ok !== null && state.ok !== undefined" class="verdict" :class="{ ok: state.ok }">
      {{ state.ok ? '올바른 괄호 ✓' : '잘못된 괄호 ✗' }}
    </div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 16px; }
.input { display: flex; gap: 4px; }
.ch {
  width: 30px; height: 34px; display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); border-radius: 6px; font-family: monospace; font-size: 16px; color: var(--text-dim);
}
.ch.on { border-color: var(--amber); color: var(--amber); background: #3a2e0f; }
.ch.done { color: var(--text-muted); opacity: 0.5; }
.stackbox {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  min-width: 120px; border: 2px solid var(--border); border-top: none; border-radius: 0 0 10px 10px; padding: 8px;
}
.top-label { font-size: 11px; color: var(--text-muted); }
.item {
  width: 86px; padding: 10px; text-align: center; background: #1c2740; border: 1px solid var(--accent);
  border-radius: 6px; color: var(--text); font-weight: 700; font-family: monospace;
}
.empty { color: var(--text-muted); padding: 14px; font-size: 13px; }
.floor { font-size: 11px; color: var(--text-muted); }
.verdict { font-size: 14px; font-weight: 700; color: var(--red); }
.verdict.ok { color: var(--green); }
.st-enter-active, .st-leave-active { transition: all 0.2s; }
.st-enter-from, .st-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
