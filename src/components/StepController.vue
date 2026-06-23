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
    <div class="row">
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
      <span class="pos">{{ index + 1 }} / {{ total }}</span>
    </div>
    <input class="bar" type="range" min="0" :max="Math.max(0, total - 1)" :value="index" @input="emit('seek', +$event.target.value)" />
    <div class="note">{{ note }}</div>
  </div>
</template>

<style scoped>
.ctrl {
  padding: 10px 16px; border-top: 1px solid var(--border); background: var(--surface);
  display: flex; flex-direction: column; gap: 8px; flex: none;
}
.row { display: flex; gap: 8px; align-items: center; }
button {
  padding: 6px 11px; cursor: pointer; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-dim); border-radius: 7px; font-size: 13px;
}
button:hover { border-color: var(--accent); color: var(--accent); }
button.play { background: var(--accent); color: #fff; border-color: var(--accent); min-width: 100px; }
button.play:hover { color: #fff; filter: brightness(1.05); }
select { padding: 6px; border-radius: 7px; border: 1px solid var(--border); background: var(--surface); color: var(--text); }
.pos { font-variant-numeric: tabular-nums; color: var(--text-muted); font-size: 13px; margin-left: auto; }
.bar { width: 100%; accent-color: var(--accent); }
.note { color: var(--text); font-size: 13px; min-height: 18px; }
</style>
