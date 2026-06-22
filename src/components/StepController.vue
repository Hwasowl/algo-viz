<script setup>
defineProps({
  index: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  playing: { type: Boolean, default: false },
  note: { type: String, default: '' },
})
const emit = defineEmits(['play', 'next', 'prev', 'reset', 'seek', 'speed'])
</script>

<template>
  <div class="ctrl">
    <div class="buttons">
      <button title="처음" @click="emit('reset')">⏮</button>
      <button title="이전" @click="emit('prev')">◀</button>
      <button class="play" @click="emit('play')">{{ playing ? '⏸ 일시정지' : '▶ 재생' }}</button>
      <button title="다음" @click="emit('next')">▶|</button>
      <select title="속도" @change="emit('speed', +$event.target.value)">
        <option value="0.5">0.5x</option>
        <option value="1" selected>1x</option>
        <option value="2">2x</option>
        <option value="4">4x</option>
      </select>
    </div>
    <input
      class="bar" type="range" min="0" :max="Math.max(0, total - 1)"
      :value="index" @input="emit('seek', +$event.target.value)"
    />
    <div class="status">
      <span class="pos">{{ index + 1 }} / {{ total }}</span>
      <span class="note">{{ note }}</span>
    </div>
  </div>
</template>

<style scoped>
.ctrl { padding: 12px 16px; border-top: 1px solid #e2e8f0; background: #fff; display: flex; flex-direction: column; gap: 8px; }
.buttons { display: flex; gap: 8px; align-items: center; }
button { padding: 6px 12px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 6px; font-size: 13px; }
button:hover { background: #eef2f7; }
button.play { background: #1f6feb; color: #fff; border-color: #1f6feb; min-width: 96px; }
select { padding: 6px; border-radius: 6px; border: 1px solid #cbd5e1; }
.bar { width: 100%; }
.status { display: flex; gap: 12px; align-items: center; }
.pos { font-variant-numeric: tabular-nums; color: #475569; font-size: 13px; flex: none; }
.note { color: #0f172a; font-size: 13px; }
</style>
