<template>
  <div class="msg" :class="role">
    <div class="avatar">{{ role === 'system' ? '🤖' : '张' }}</div>
    <div class="bubble">
      <!-- Error state -->
      <div v-if="content.error" class="error-msg">
        {{ content.error }}
      </div>

      <!-- Welcome state -->
      <div v-else-if="content.isWelcome">
        <span v-html="renderMarkdown(content.text)"></span>
      </div>

      <!-- Status state -->
      <div v-else-if="content.isStatus">
        <span v-html="renderMarkdown(content.text)"></span>
      </div>

      <!-- Normal text message -->
      <div v-else-if="typeof content === 'string'">
        {{ content }}
      </div>

      <!-- Rich message object -->
      <div v-else>
        <span v-html="renderMarkdown(content.text)"></span>
      </div>

      <!-- Meta info -->
      <div v-if="metaText" class="meta">{{ metaText }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: { type: String, default: 'system' },
  content: { type: [String, Object], required: true }
})

const metaText = computed(() => {
  if (props.role === 'user') return '张老师 · 刚刚'
  if (typeof props.content === 'string') return '知因AI · DeepSeek'
  if (props.content.error) return '知因AI · 错误'
  if (props.content.isWelcome) return '知因AI · 系统'
  if (props.content.isStatus) return '系统 · 实时'
  if (props.content.text && !props.content.model) return '知因AI · DeepSeek'
  const model = props.content.model || 'AI'
  const ms = props.content.durationMs || 0
  const elapsed = (ms / 1000).toFixed(1)
  const tokens = props.content.usage?.total || '?'
  return `知因AI · ${model} · ${elapsed}s · ${tokens} tokens`
})

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
    .replace(/^### (.+)$/gm, '<strong style="font-size:14px;">$1</strong>')
    .replace(/^## (.+)$/gm, '<strong style="font-size:15px;">$1</strong>')
    .replace(/^# (.+)$/gm, '<strong style="font-size:16px;">$1</strong>')
    .replace(/^---$/gm, '<hr>')
}
</script>

<style scoped>
.error-msg {
  color: var(--danger);
}
</style>
