<script setup>
import { ref } from 'vue'
import { topics, weeks, topicsByWeek } from './topics/index.js'
import TopicView from './components/TopicView.vue'
import ArticleView from './components/ArticleView.vue'

const selected = ref(topics[0])
</script>

<template>
  <div class="app">
    <nav>
      <div class="brand">
        <span class="logo">🧮</span>
        <div>
          <div class="bt">코테 알고리즘 시각화</div>
          <div class="bs">좌측 코드 ↔ 우측 동작, 한 스텝씩</div>
        </div>
      </div>

      <div v-for="w in weeks" :key="w.week" class="wk">
        <div class="wk-t">{{ w.title }}</div>
        <button
          v-for="t in topicsByWeek(w.week)"
          :key="t.id"
          :class="{ on: t.id === selected.id }"
          @click="selected = t"
        >
          <span class="dot" :class="t.article ? 'doc' : 'viz'"></span>
          {{ t.title }}
        </button>
      </div>

      <p class="cr">
        ⓒ 딩코딩코 원작 커리큘럼 기반<br />
        개발 입문자용 Java 재서술
      </p>
    </nav>

    <main>
      <ArticleView v-if="selected.article" :topic="selected" :key="selected.id" />
      <TopicView v-else :topic="selected" :key="selected.id" />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-columns: 268px 1fr;
  height: 100vh;
}
nav {
  background: #080e1a;
  border-right: 1px solid var(--border);
  padding: 18px 14px;
  overflow: auto;
}
.brand {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
  padding: 0 4px;
}
.logo {
  font-size: 26px;
}
.bt {
  font-size: 15px;
  font-weight: 700;
}
.bs {
  font-size: 11.5px;
  color: var(--text-muted);
  margin-top: 2px;
}
.wk-t {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  margin: 16px 6px 6px;
  text-transform: uppercase;
}
nav button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-dim);
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13.5px;
}
nav button:hover {
  background: var(--bg-elev);
  color: var(--text);
}
nav button.on {
  background: var(--accent);
  color: #fff;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: none;
}
.dot.viz {
  background: var(--green);
}
.dot.doc {
  background: var(--amber);
}
nav button.on .dot {
  background: #fff;
}
.cr {
  color: var(--text-muted);
  font-size: 11px;
  margin: 26px 6px 0;
  line-height: 1.6;
}
main {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
