<script setup>
import { ref, computed } from 'vue'
import { topics, weeks } from './topics/index.js'
import SideRail from './components/SideRail.vue'
import ProblemView from './components/ProblemView.vue'
import ArticleView from './components/ArticleView.vue'

const selected = ref(topics[0])
const railOpen = ref(true)

const weekTitle = computed(() => weeks.find((w) => w.week === selected.value.week)?.title || '')
</script>

<template>
  <div class="app" :class="{ 'rail-closed': !railOpen }">
    <header class="topbar">
      <button class="ham" @click="railOpen = !railOpen" :title="railOpen ? '목록 접기' : '목록 펼치기'">☰</button>
      <span class="logo">🧮</span>
      <span class="brand">코테 알고리즘 시각화</span>
      <span class="sep">›</span>
      <span class="crumb">{{ weekTitle }}</span>
      <span class="sep">›</span>
      <span class="crumb cur">{{ selected.title }}</span>
      <div class="spacer"></div>
      <a class="ghlink" href="https://github.com/Hwasowl/algo-viz" target="_blank" rel="noopener">GitHub</a>
    </header>

    <SideRail v-show="railOpen" :selected="selected" @select="(t) => (selected = t)" />

    <main>
      <ArticleView v-if="selected.article" :topic="selected" :key="selected.id" />
      <ProblemView v-else :topic="selected" :key="selected.id" />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: 48px 1fr;
  grid-template-areas:
    'top top'
    'rail main';
  height: 100vh;
}
.app.rail-closed {
  grid-template-columns: 0 1fr;
}
.topbar {
  grid-area: top;
  background: var(--chrome);
  color: #dfe6ee;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  font-size: 13px;
}
.ham {
  background: none;
  border: none;
  color: #aebccb;
  font-size: 17px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.ham:hover { background: #ffffff14; color: #fff; }
.logo { font-size: 17px; }
.brand { font-weight: 700; color: #fff; }
.sep { color: #6b7c8d; }
.crumb { color: #aebccb; }
.crumb.cur { color: #fff; font-weight: 600; }
.spacer { flex: 1; }
.ghlink {
  color: #aebccb;
  text-decoration: none;
  font-size: 12.5px;
  padding: 4px 10px;
  border: 1px solid #ffffff22;
  border-radius: 6px;
}
.ghlink:hover { background: #ffffff14; color: #fff; }
main {
  grid-area: main;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--bg);
}
</style>
