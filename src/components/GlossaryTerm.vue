<script setup>
// 초보자용 용어 풀이 칩. 단어에 점선 밑줄 + hover 시 설명 툴팁.
defineProps({
  word: { type: String, required: true },
  desc: { type: String, required: true },
})
</script>

<template>
  <span class="term" tabindex="0">
    {{ word }}
    <span class="tip">{{ desc }}</span>
  </span>
</template>

<style scoped>
.term {
  position: relative;
  border-bottom: 1px dashed var(--accent-2);
  cursor: help;
  color: var(--text);
  white-space: nowrap;
}
.tip {
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #0a1322;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 12.5px;
  line-height: 1.5;
  width: max-content;
  max-width: 260px;
  white-space: normal;
  box-shadow: 0 8px 24px #00000066;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, transform 0.15s;
  z-index: 50;
  pointer-events: none;
}
.tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--border);
}
.term:hover .tip,
.term:focus .tip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
</style>
