<script setup>
import RichText from './RichText.vue'
import CodeBlock from './CodeBlock.vue'

// 읽기형 토픽 렌더러. topic.article = 블록 배열.
// 블록 형태:
//  { h: '제목' } | { p: '문단', terms? } | { list: [..] , terms? }
//  { steps: [..] } | { code: 'java' } | { callout: { icon, title, body, terms } }
//  { table: { headers:[], rows:[[]] } }
defineProps({ topic: { type: Object, required: true } })
</script>

<template>
  <article class="article">
    <header class="head">
      <h2>{{ topic.title }}</h2>
      <p v-if="topic.plainDef" class="lead">{{ topic.plainDef }}</p>
    </header>

    <div class="body">
      <template v-for="(b, i) in topic.article" :key="i">
        <h3 v-if="b.h" class="h3">{{ b.h }}</h3>

        <p v-else-if="b.p" class="p">
          <RichText :text="b.p" :terms="b.terms || []" />
        </p>

        <ul v-else-if="b.list" class="list">
          <li v-for="(it, j) in b.list" :key="j"><RichText :text="it" :terms="b.terms || []" /></li>
        </ul>

        <ol v-else-if="b.steps" class="steps">
          <li v-for="(it, j) in b.steps" :key="j"><RichText :text="it" :terms="b.terms || []" /></li>
        </ol>

        <CodeBlock v-else-if="b.code" :code="b.code" class="code" />

        <div v-else-if="b.callout" class="callout" :class="b.callout.tone || 'info'">
          <div class="ct">{{ b.callout.icon || '💡' }} {{ b.callout.title }}</div>
          <div class="cb"><RichText :text="b.callout.body" :terms="b.callout.terms || []" /></div>
        </div>

        <div v-else-if="b.table" class="tablewrap">
          <table>
            <thead>
              <tr>
                <th v-for="(h, k) in b.table.headers" :key="k">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, r) in b.table.rows" :key="r">
                <td v-for="(cell, c) in row" :key="c" v-html="cell"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </article>
</template>

<style scoped>
.article {
  height: 100%;
  overflow: auto;
  padding: 28px 40px 80px;
  background: var(--surface);
}
.head {
  max-width: 860px;
  margin: 0 auto 8px;
}
h2 {
  font-size: 26px;
  margin: 0 0 8px;
}
.lead {
  font-size: 16px;
  color: var(--text-dim);
  line-height: 1.6;
  margin: 0;
}
.body {
  max-width: 860px;
  margin: 0 auto;
}
.h3 {
  font-size: 18px;
  margin: 30px 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}
.p {
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-dim);
  margin: 12px 0;
}
.list,
.steps {
  margin: 12px 0;
  padding-left: 22px;
}
.list li,
.steps li {
  font-size: 14.5px;
  line-height: 1.85;
  color: var(--text-dim);
  margin: 4px 0;
}
.code {
  margin: 14px 0;
}
.callout {
  margin: 16px 0;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.callout.info {
  border-left: 3px solid var(--accent);
}
.callout.warn {
  border-left: 3px solid var(--amber);
}
.callout.good {
  border-left: 3px solid var(--green);
}
.ct {
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text);
}
.cb {
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-dim);
}
.tablewrap {
  overflow: auto;
  margin: 16px 0;
  border: 1px solid var(--border);
  border-radius: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
th,
td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-soft);
  vertical-align: top;
  color: var(--text-dim);
}
th {
  background: var(--surface-2);
  color: var(--text);
  font-weight: 600;
}
tbody tr:last-child td {
  border-bottom: none;
}
td :deep(code) {
  background: #0d1117;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 5px;
  font-family: 'D2Coding', 'Consolas', monospace;
  font-size: 12px;
  color: var(--green);
}
</style>
