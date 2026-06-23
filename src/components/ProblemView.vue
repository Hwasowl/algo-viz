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
  () => { algoKey.value = Object.keys(props.topic.algorithms)[0] }
)

const algo = computed(() => props.topic.algorithms[algoKey.value])
const steps = computed(() => algo.value.build())
const terms = computed(() => props.topic.terms || [])

const player = useStepPlayer(steps)
watch(steps, () => player.reset())
</script>

<template>
  <section class="problem">
    <!-- 서브바: 제목 + 복잡도 + 알고리즘 탭 -->
    <div class="subbar">
      <div class="ttl">
        <h2>{{ topic.title }}</h2>
        <span class="badge time">⏱ {{ topic.complexity.time }}</span>
        <span class="badge space">🗂 {{ topic.complexity.space }}</span>
      </div>
      <div class="tabs" v-if="algoKeys.length > 1">
        <button v-for="k in algoKeys" :key="k" :class="{ on: k === algoKey }" @click="algoKey = k">
          {{ topic.algorithms[k].label }}
        </button>
      </div>
    </div>

    <!-- 2분할 -->
    <div class="panes">
      <!-- 좌: 설명 -->
      <div class="desc">
        <div class="sec-h">📖 개념 설명</div>
        <p class="lead">{{ topic.plainDef }}</p>

        <div class="card" v-if="topic.analogy">
          <div class="card-t">💡 쉽게 말하면</div>
          <p>{{ topic.analogy }}</p>
        </div>
        <div class="card" v-if="topic.why">
          <div class="card-t">❓ 왜 쓰나요</div>
          <p>{{ topic.why }}</p>
        </div>

        <p class="body" v-if="topic.concept"><RichText :text="topic.concept" :terms="terms" /></p>
        <p class="rw">☕ Java 표준 &nbsp;<code>{{ topic.realWorld }}</code></p>

        <div class="cote" v-if="topic.coteTip">
          <div class="cote-t">🎯 코테 출제 포인트</div>
          <p><RichText :text="topic.coteTip" :terms="terms" /></p>
        </div>
      </div>

      <!-- 우: 코드 + 실행결과(시각화) -->
      <div class="work">
        <div class="wbar">
          <span class="fname">Solution.java</span>
          <span class="hint">노란 줄 = 지금 실행 중</span>
        </div>
        <CodePanel class="code" :code="algo.code" :activeLine="player.current.value.line" />

        <div class="rbar">실행 결과 <span class="dim">— 코드가 실제로 하는 일</span></div>
        <VizStage class="viz" :rendererId="topic.rendererId" :state="player.current.value.state" />
        <StepController
          :index="player.index.value"
          :total="player.total.value"
          :playing="player.playing.value"
          :note="player.current.value.note"
          @play="player.play" @next="player.next" @prev="player.prev"
          @reset="player.reset" @seek="player.seek" @speed="player.setSpeed"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.problem { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.subbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 18px; background: var(--surface); border-bottom: 1px solid var(--border); flex: none; flex-wrap: wrap;
}
.ttl { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
h2 { margin: 0; font-size: 18px; }
.badge { font-size: 11.5px; font-weight: 600; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); }
.badge.time { color: var(--blue); background: #eff4ff; }
.badge.space { color: var(--purple); background: #f3effe; }
.tabs { display: flex; gap: 6px; }
.tabs button {
  padding: 5px 13px; cursor: pointer; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-dim); border-radius: 999px; font-size: 12.5px;
}
.tabs button:hover { border-color: var(--accent); color: var(--accent); }
.tabs button.on { background: var(--accent); color: #fff; border-color: var(--accent); }

.panes { flex: 1; display: grid; grid-template-columns: minmax(320px, 42%) 1fr; min-height: 0; }

.desc { overflow: auto; padding: 18px 22px 40px; border-right: 1px solid var(--border); background: var(--surface); }
.sec-h { font-size: 12px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.03em; margin-bottom: 10px; }
.lead { font-size: 16px; line-height: 1.6; color: var(--text); margin: 0 0 16px; font-weight: 500; }
.card { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; margin: 10px 0; }
.card-t { font-size: 12.5px; font-weight: 700; margin-bottom: 4px; }
.card p { margin: 0; font-size: 13.5px; color: var(--text-dim); line-height: 1.65; }
.body { font-size: 14px; line-height: 1.8; color: var(--text-dim); margin: 14px 0; }
.rw { font-size: 13px; color: var(--text-dim); margin: 8px 0; }
.rw code { background: var(--surface-2); border: 1px solid var(--border); border-radius: 5px; padding: 2px 7px; font-family: 'D2Coding', Consolas, monospace; font-size: 12px; color: var(--amber); }
.cote { margin-top: 18px; background: #f0fbf3; border: 1px solid #c5ead0; border-left: 3px solid var(--green); border-radius: 10px; padding: 12px 14px; }
.cote-t { font-weight: 700; margin-bottom: 5px; }
.cote p { margin: 0; font-size: 13.5px; color: var(--text-dim); line-height: 1.75; }

.work { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.wbar { display: flex; align-items: center; justify-content: space-between; padding: 7px 14px; background: #161b22; border-bottom: 1px solid #2a3038; flex: none; }
.fname { color: #c9d1d9; font-size: 12.5px; font-family: 'D2Coding', Consolas, monospace; }
.hint { color: #6e7681; font-size: 11.5px; }
.code { flex: 1 1 0; min-height: 0; }
.rbar { padding: 7px 14px; background: var(--surface-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text-dim); font-weight: 600; flex: none; }
.rbar .dim { color: var(--text-muted); font-weight: 400; }
.viz { flex: 1 1 0; min-height: 0; background: var(--surface); }
</style>
