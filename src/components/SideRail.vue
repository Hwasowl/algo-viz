<script setup>
import { weeks, topicsByWeek } from '../topics/index.js'

defineProps({ selected: { type: Object, required: true } })
defineEmits(['select'])
</script>

<template>
  <nav class="rail">
    <div v-for="w in weeks" :key="w.week" class="wk">
      <div class="wk-t">{{ w.title }}</div>
      <button
        v-for="t in topicsByWeek(w.week)"
        :key="t.id"
        class="item"
        :class="{ on: t.id === selected.id }"
        @click="$emit('select', t)"
      >
        <span class="dot" :class="t.article ? 'doc' : 'viz'"></span>
        <span class="label">{{ t.title }}</span>
      </button>
    </div>
    <p class="cr">ⓒ 딩코딩코 원작 커리큘럼 기반<br />개발 입문자용 Java 재서술</p>
  </nav>
</template>

<style scoped>
.rail {
  grid-area: rail;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 12px 10px 24px;
  overflow: auto;
}
.wk-t {
  color: var(--text-muted);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 14px 8px 5px;
  text-transform: uppercase;
}
.item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-dim);
  padding: 7px 9px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 13.5px;
}
.item:hover { background: var(--surface-2); color: var(--text); }
.item.on { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
.dot { width: 6px; height: 6px; border-radius: 50%; flex: none; }
.dot.viz { background: var(--green); }
.dot.doc { background: var(--amber); }
.item.on .dot.viz { background: var(--accent); }
.label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cr { color: var(--text-muted); font-size: 11px; margin: 24px 8px 0; line-height: 1.6; }
</style>
