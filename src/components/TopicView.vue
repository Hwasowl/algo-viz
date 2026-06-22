<script setup>
import { ref, computed, watch } from 'vue'
import { useStepPlayer } from '../composables/useStepPlayer.js'
import CodePanel from './CodePanel.vue'
import VizStage from './VizStage.vue'
import StepController from './StepController.vue'

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

const player = useStepPlayer(steps)
watch(steps, () => player.reset())
</script>

<template>
  <section class="topic">
    <header>
      <div class="title-row">
        <h2>{{ topic.title }}</h2>
        <span class="cx">⏱ {{ topic.complexity.time }} · 🗂 {{ topic.complexity.space }}</span>
      </div>
      <p class="concept">{{ topic.concept }}</p>
      <p class="rw">☕ Java 표준: {{ topic.realWorld }}</p>
      <div class="algos" v-if="algoKeys.length > 1">
        <button
          v-for="k in algoKeys"
          :key="k"
          :class="{ on: k === algoKey }"
          @click="algoKey = k"
        >
          {{ topic.algorithms[k].label }}
        </button>
      </div>
    </header>

    <div class="split">
      <div class="left">
        <div class="pane-label">Java 코드</div>
        <CodePanel class="grow" :code="algo.code" :activeLine="player.current.value.line" />
      </div>
      <div class="right">
        <div class="pane-label">시각화</div>
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
  </section>
</template>

<style scoped>
.topic { display: flex; flex-direction: column; height: 100%; min-height: 0; }
header { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.title-row { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
h2 { margin: 0; font-size: 20px; }
.cx { color: #0369a1; font-size: 13px; font-weight: 600; }
.concept { color: #334155; font-size: 14px; line-height: 1.65; margin: 8px 0; }
.rw { color: #92400e; font-size: 13px; background: #fef3c7; padding: 7px 11px; border-radius: 7px; display: inline-block; margin: 4px 0 0; }
.algos { margin-top: 12px; display: flex; gap: 7px; flex-wrap: wrap; }
.algos button { padding: 6px 14px; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; border-radius: 999px; font-size: 13px; }
.algos button.on { background: #1f6feb; color: #fff; border-color: #1f6feb; }
.split { flex: 1; display: grid; grid-template-columns: 1fr 1fr; min-height: 0; }
.left, .right { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.left { border-right: 1px solid #e2e8f0; }
.right { background: #f8fafc; }
.pane-label { font-size: 11px; color: #94a3b8; padding: 6px 14px; background: #fff; border-bottom: 1px solid #eef2f7; letter-spacing: 0.04em; text-transform: uppercase; }
.right .pane-label { background: #f8fafc; }
.grow { flex: 1; min-height: 0; }
</style>
