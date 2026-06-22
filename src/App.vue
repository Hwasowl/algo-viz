<script setup>
import { ref } from 'vue'
import { topics, weeks, topicsByWeek } from './topics/index.js'
import TopicView from './components/TopicView.vue'

const selected = ref(topics[0])
</script>

<template>
  <div class="app">
    <nav>
      <h1>코테 알고리즘<br />시각화</h1>
      <p class="sub">좌측 Java 코드 ↔ 우측 동작을 한 스텝씩</p>
      <div v-for="w in weeks" :key="w.week" class="wk">
        <div class="wk-t">{{ w.title }}</div>
        <button
          v-for="t in topicsByWeek(w.week)"
          :key="t.id"
          :class="{ on: t.id === selected.id }"
          @click="selected = t"
        >
          {{ t.title }}
        </button>
      </div>
      <p class="cr">ⓒ 딩코딩코 원작 커리큘럼 기반<br />Java 개발자 관점 재서술</p>
    </nav>
    <main>
      <TopicView :topic="selected" :key="selected.id" />
    </main>
  </div>
</template>

<style>
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body { font-family: 'Malgun Gothic', system-ui, -apple-system, sans-serif; color: #0f172a; }
#app { height: 100vh; }
.app { display: grid; grid-template-columns: 248px 1fr; height: 100vh; }
nav { background: #0f172a; color: #e2e8f0; padding: 20px 16px; overflow: auto; }
nav h1 { font-size: 18px; margin: 0 0 6px; line-height: 1.3; }
.sub { color: #94a3b8; font-size: 12px; margin: 0 0 8px; }
.wk-t { color: #64748b; font-size: 11px; margin: 18px 0 6px; letter-spacing: 0.03em; }
nav button { display: block; width: 100%; text-align: left; background: none; border: none; color: #cbd5e1; padding: 8px 10px; border-radius: 7px; cursor: pointer; font-size: 14px; }
nav button:hover { background: #1e293b; }
nav button.on { background: #1f6feb; color: #fff; }
.cr { color: #475569; font-size: 11px; margin-top: 28px; line-height: 1.5; }
main { min-width: 0; min-height: 0; overflow: hidden; }
</style>
