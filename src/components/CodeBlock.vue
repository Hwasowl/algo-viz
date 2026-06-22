<script setup>
import { computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('java', java)

const props = defineProps({
  code: { type: String, default: '' },
  lang: { type: String, default: 'java' },
})

const html = computed(() => hljs.highlight(props.code, { language: props.lang }).value)
</script>

<template>
  <pre class="cb"><code v-html="html"></code></pre>
</template>

<style scoped>
.cb {
  margin: 0;
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  overflow: auto;
  font-family: 'D2Coding', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.65;
}
.cb code {
  color: #c9d1d9;
  white-space: pre;
}
</style>
