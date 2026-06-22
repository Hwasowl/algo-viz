<script setup>
import { computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('java', java)

const props = defineProps({
  code: { type: String, default: '' },
  activeLine: { type: Number, default: 0 },
})

const lines = computed(() =>
  props.code.split('\n').map((l, i) => ({
    n: i + 1,
    html: l.length ? hljs.highlight(l, { language: 'java' }).value : '&nbsp;',
  }))
)
</script>

<template>
  <div class="code">
    <div
      v-for="l in lines"
      :key="l.n"
      class="ln"
      :class="{ active: l.n === activeLine }"
    >
      <span class="gutter">{{ l.n }}</span>
      <code class="src" v-html="l.html"></code>
    </div>
  </div>
</template>

<style scoped>
.code {
  height: 100%; overflow: auto; background: #0d1117;
  font-family: 'Consolas', 'D2Coding', monospace; font-size: 13px; line-height: 1.7;
  padding: 12px 0;
}
.ln { display: flex; padding: 0 14px; }
.ln.active { background: #1f6feb29; box-shadow: inset 3px 0 #1f6feb; }
.gutter {
  width: 26px; flex: none; color: #6e7681; user-select: none;
  text-align: right; margin-right: 14px;
}
.src { white-space: pre; color: #c9d1d9; }
</style>
