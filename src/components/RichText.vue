<script setup>
import { computed } from 'vue'
import GlossaryTerm from './GlossaryTerm.vue'

// 본문 문자열에서 terms의 단어를 찾아 용어풀이 칩으로 감싼다.
const props = defineProps({
  text: { type: String, default: '' },
  terms: { type: Array, default: () => [] }, // [{ word, desc }]
})

const segments = computed(() => {
  if (!props.terms.length || !props.text) return [{ t: props.text }]
  const map = new Map(props.terms.map((x) => [x.word, x.desc]))
  const words = props.terms.map((x) => x.word).sort((a, b) => b.length - a.length)
  const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp('(' + words.map(esc).join('|') + ')')
  return props.text.split(re).map((p) => (map.has(p) ? { t: p, desc: map.get(p) } : { t: p }))
})
</script>

<template>
  <span>
    <template v-for="(s, i) in segments" :key="i"
      ><GlossaryTerm v-if="s.desc" :word="s.t" :desc="s.desc" /><template v-else>{{ s.t }}</template></template
    >
  </span>
</template>
