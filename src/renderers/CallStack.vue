<script setup>
import { computed } from 'vue'
const props = defineProps({ state: { type: Object, required: true } })
const reversed = computed(() => [...(props.state.frames || [])].reverse())
</script>

<template>
  <div class="wrap">
    <div class="result">결과: {{ state.result !== undefined ? state.result : '계산 중…' }}</div>
    <div class="stack">
      <div class="top-label" v-if="reversed.length">▲ 스택 top (마지막 호출)</div>
      <transition-group name="frame">
        <div
          v-for="f in reversed"
          :key="f.call"
          class="frame"
          :class="{ done: f.ret !== undefined }"
        >
          {{ f.call }}
          <span v-if="f.ret !== undefined" class="ret">→ {{ f.ret }}</span>
        </div>
      </transition-group>
      <div class="base" v-if="reversed.length">▼ 스택 base</div>
      <div class="empty" v-else>콜스택 비어 있음</div>
    </div>
  </div>
</template>

<style scoped>
.wrap { display: flex; flex-direction: column; height: 100%; width: 100%; padding: 20px; gap: 12px; }
.result { font-weight: 700; font-size: 15px; color: var(--text); }
.stack { display: flex; flex-direction: column; justify-content: flex-end; flex: 1; gap: 5px; }
.top-label, .base { color: #94a3b8; font-size: 11px; text-align: center; }
.frame {
  background: #1e293b; color: #e2e8f0; padding: 9px 14px; border-radius: 7px;
  font-family: 'Consolas', monospace; font-size: 14px;
  display: flex; justify-content: space-between; align-items: center;
}
.frame.done { background: #166534; }
.ret { color: #86efac; font-weight: 600; }
.frame.done .ret { color: #bbf7d0; }
.empty { color: #94a3b8; text-align: center; padding: 20px; }
.frame-enter-active, .frame-leave-active { transition: all 0.2s ease; }
.frame-enter-from, .frame-leave-to { opacity: 0; transform: translateY(8px); }
</style>
