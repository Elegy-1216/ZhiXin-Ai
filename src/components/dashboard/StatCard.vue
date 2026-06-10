<template>
  <div class="stat-card">
    <div class="icon-bg" :style="{ background: iconBg, color: iconColor }">
      {{ icon }}
    </div>
    <div class="label">{{ label }}</div>
    <div class="value">{{ value }}</div>
    <div v-if="trend" class="trend" :class="trendDir">
      {{ trend }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '📊' },
  iconBg: { type: String, default: '#eef2ff' },
  iconColor: { type: String, default: 'var(--primary)' },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  trend: { type: String, default: '' },
  trendDir: { type: String, default: 'up' },
})
</script>
