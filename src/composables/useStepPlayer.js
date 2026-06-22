import { ref, computed, onUnmounted } from 'vue'

/**
 * 스텝 배열을 재생/탐색하는 플레이어.
 * @param {import('vue').Ref<Array>} stepsRef - 스텝 배열 ref
 */
export function useStepPlayer(stepsRef) {
  const index = ref(0)
  const playing = ref(false)
  const speed = ref(1) // 1x = 700ms/스텝
  let timer = null

  const current = computed(
    () => stepsRef.value[index.value] ?? { line: 0, state: {}, note: '' }
  )
  const total = computed(() => stepsRef.value.length)

  function stop() {
    playing.value = false
    clearInterval(timer)
    timer = null
  }
  function next() {
    if (index.value < total.value - 1) index.value++
    else stop()
  }
  function prev() {
    if (index.value > 0) index.value--
  }
  function reset() {
    stop()
    index.value = 0
  }
  function play() {
    if (playing.value) return stop()
    if (index.value >= total.value - 1) index.value = 0
    playing.value = true
    timer = setInterval(next, 700 / speed.value)
  }
  function seek(i) {
    index.value = Math.max(0, Math.min(total.value - 1, i))
  }
  function setSpeed(v) {
    speed.value = v
    if (playing.value) {
      stop()
      play()
    }
  }

  onUnmounted(stop)
  return { index, playing, speed, current, total, next, prev, reset, play, seek, setSpeed }
}
