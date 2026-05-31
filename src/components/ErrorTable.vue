<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>题目</th>
        <th style="text-align:center;">错题数</th>
        <th style="text-align:center;">错误率</th>
        <th style="text-align:right;">诊断</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.question }}</td>
        <td style="text-align:center;">{{ item.count }}</td>
        <td style="text-align:center;" :style="{ color: item.rateColor || 'var(--danger)' }">
          {{ item.rate }}
        </td>
        <td style="text-align:right;">
          <span
            :style="{ cursor: 'pointer', color: item.diagnosed ? 'var(--text)' : 'var(--primary)' }"
          >
            {{ item.diagnosed ? '✅ 已诊断' : '待诊断 →' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] }
})
</script>
