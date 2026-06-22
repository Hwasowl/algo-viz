<script setup>
const props = defineProps({ state: { type: Object, required: true } })
</script>

<template>
  <div class="wrap">
    <div class="calc" v-if="state.key !== null && state.key !== undefined">
      key <b>{{ state.key }}</b> % {{ state.size }} = <b class="hl">{{ state.hash }}</b>
    </div>
    <div class="table">
      <div v-for="(bucket, i) in state.buckets" :key="i" class="bucket" :class="{ active: i === state.hash }">
        <div class="bi">[{{ i }}]</div>
        <div class="chain">
          <template v-for="(k, j) in bucket" :key="j">
            <span class="node">{{ k }}</span>
            <span v-if="j < bucket.length - 1" class="link">→</span>
          </template>
          <span v-if="!bucket.length" class="nul">비어 있음</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 16px; }
.calc { font-size: 14px; color: var(--text-dim); }
.calc b { color: var(--text); }
.calc .hl { color: var(--amber); }
.table { display: flex; flex-direction: column; gap: 5px; }
.bucket { display: flex; align-items: center; gap: 10px; padding: 4px; border-radius: 6px; }
.bucket.active { background: #3a2e0f55; outline: 1px solid var(--amber); }
.bi { width: 34px; font-family: monospace; color: var(--text-muted); font-size: 13px; }
.chain { display: flex; align-items: center; gap: 6px; min-height: 32px; }
.node {
  background: #1c2740; border: 1px solid var(--accent); border-radius: 6px; padding: 6px 12px;
  color: var(--text); font-weight: 700; font-family: monospace; font-size: 14px;
}
.link { color: var(--accent); }
.nul { color: var(--text-muted); font-size: 12px; }
</style>
