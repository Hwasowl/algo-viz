<script setup>
import { ref, computed, watch } from 'vue'
import { useStepPlayer } from '../composables/useStepPlayer.js'
import CodePanel from './CodePanel.vue'
import VizStage from './VizStage.vue'
import StepController from './StepController.vue'
import RichText from './RichText.vue'

const props = defineProps({ topic: { type: Object, required: true } })

const algoKeys = computed(() => Object.keys(props.topic.algorithms))
const algoKey = ref(algoKeys.value[0])
watch(
  () => props.topic,
  () => {
    algoKey.value = Object.keys(props.topic.algorithms)[0]
  }
)

const algo = computed(() => props.topic.algorithms[algoKey.value])
const steps = computed(() => algo.value.build())
const terms = computed(() => props.topic.terms || [])

const player = useStepPlayer(steps)
watch(steps, () => player.reset())
</script>

<template>
  <section class="topic">
    <!-- 도입: 초보자용 설명 -->
    <div class="intro">
      <div class="title-row">
        <h2>{{ topic.title }}</h2>
        <span class="badge time">⏱ {{ topic.complexity.time }}</span>
        <span class="badge space">🗂 {{ topic.complexity.space }}</span>
      </div>

      <p v-if="topic.plainDef" class="lead">{{ topic.plainDef }}</p>

      <div class="cards">
        <div v-if="topic.analogy" class="card">
          <div class="card-t">💡 쉽게 말하면</div>
          <p>{{ topic.analogy }}</p>
        </div>
        <div v-if="topic.why" class="card">
          <div class="card-t">❓ 왜 쓰나요</div>
          <p>{{ topic.why }}</p>
        </div>
      </div>

      <p v-if="topic.concept" class="concept">
        <RichText :text="topic.concept" :terms="terms" />
      </p>
      <p class="rw">☕ Java 표준: {{ topic.realWorld }}</p>

      <div class="algos" v-if="algoKeys.length > 1">
        <span class="algos-label">실행 예시</span>
        <button
          v-for="k in algoKeys"
          :key="k"
          :class="{ on: k === algoKey }"
          @click="algoKey = k"
        >
          {{ topic.algorithms[k].label }}
        </button>
      </div>
    </div>

    <!-- 좌측 코드 / 우측 시각화 -->
    <div class="split">
      <div class="left">
        <div class="pane-label">Java 코드 <span class="dim">— 노란 줄이 지금 실행 중</span></div>
        <CodePanel class="grow" :code="algo.code" :activeLine="player.current.value.line" />
      </div>
      <div class="right">
        <div class="pane-label">시각화 <span class="dim">— 코드가 실제로 하는 일</span></div>
        <VizStage class="grow" :rendererId="topic.rendererId" :state="player.current.value.state" />
      </div>
    </div>

    <StepController
      :index="player.index.value"
      :total="player.total.value"
      :playing="player.playing.value"
      :note="player.current.value.note"
      @play="player.play"
      @next="player.next"
      @prev="player.prev"
      @reset="player.reset"
      @seek="player.seek"
      @speed="player.setSpeed"
    />

    <!-- 코테 포인트 -->
    <div v-if="topic.coteTip" class="cote">
      <div class="cote-t">🎯 코테 출제 포인트</div>
      <p><RichText :text="topic.coteTip" :terms="terms" /></p>
    </div>
  </section>
</template>

<style scoped>
.topic {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.intro {
  padding: 22px 28px 16px;
  border-bottom: 1px solid var(--border);
}
.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
h2 {
  margin: 0;
  font-size: 23px;
}
.badge {
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid var(--border);
}
.badge.time {
  color: var(--blue);
  background: #1e3a5f33;
}
.badge.space {
  color: var(--purple);
  background: #3b2f5f33;
}
.lead {
  font-size: 16px;
  color: var(--text);
  line-height: 1.6;
  margin: 14px 0 0;
}
.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 16px 0;
}
.card {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
}
.card-t {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 5px;
}
.card p {
  margin: 0;
  font-size: 13.5px;
  color: var(--text-dim);
  line-height: 1.65;
}
.concept {
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.8;
  margin: 8px 0;
}
.rw {
  color: var(--amber);
  font-size: 13px;
  background: #3a2e0f55;
  border: 1px solid #5a4a1a;
  padding: 7px 12px;
  border-radius: 8px;
  display: inline-block;
  margin: 4px 0 0;
}
.algos {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.algos-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-right: 2px;
}
.algos button {
  padding: 6px 14px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-elev);
  color: var(--text-dim);
  border-radius: 999px;
  font-size: 13px;
}
.algos button:hover {
  border-color: var(--accent);
  color: var(--text);
}
.algos button.on {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 440px;
  flex: none;
  border-bottom: 1px solid var(--border);
}
.left,
.right {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}
.left {
  border-right: 1px solid var(--border);
}
.right {
  background: var(--bg-elev);
}
.pane-label {
  font-size: 12px;
  color: var(--text-dim);
  padding: 8px 14px;
  background: var(--bg-elev2);
  border-bottom: 1px solid var(--border);
}
.pane-label .dim {
  color: var(--text-muted);
}
.grow {
  flex: 1;
  min-height: 0;
}
.cote {
  margin: 18px 28px 40px;
  background: #1e2a1799;
  border: 1px solid #3a5a2a;
  border-left: 3px solid var(--green);
  border-radius: 10px;
  padding: 14px 16px;
}
.cote-t {
  font-weight: 700;
  margin-bottom: 6px;
}
.cote p {
  margin: 0;
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.75;
}
</style>
