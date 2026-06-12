<template>
  <div class="msg-wrap" :class="msg.role">
    <div class="avatar">{{ msg.role === 'user' ? '张' : '知' }}</div>
    <div class="bubble" :class="{ error: msg.shape === 'error' }">
      <div v-html="rendered"></div>
      <div class="meta">{{ metaText }}</div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown.js'
const props = defineProps({ msg: Object })
const rendered = computed(() => {
  if (props.msg.shape === 'error') return '<span class="err">' + props.msg.text + '</span>'
  return renderMarkdown(props.msg.text)
})
const metaText = computed(() => {
  if (props.msg.role === 'user') return '张老师 · 刚刚'
  return '知因AI · ' + (props.msg.model || 'DeepSeek')
})
</script>
<style scoped>
.msg-wrap { display: flex; gap: 8px; margin-bottom: 10px; max-width: 82%; }
.msg-wrap.system { align-self: flex-start; }
.msg-wrap.user { align-self: flex-end; flex-direction: row-reverse; }
.avatar {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
}
.msg-wrap.system .avatar { background: var(--ink-light); color: var(--ink); }
.msg-wrap.user .avatar { background: var(--ink); color: #fff; }
.bubble {
  padding: 10px 14px; border-radius: var(--radius); font-size: 13px; line-height: 1.7;
}
.msg-wrap.system .bubble {
  background: var(--card); border: 1px solid var(--card-border);
}
.msg-wrap.user .bubble { background: var(--ink); color: #fff; }
.bubble.error { background: var(--red-pen-light); color: var(--red-pen); border-color: transparent; }
.meta { font-size: 10px; color: var(--text-muted); margin-top: 6px; }
.msg-wrap.user .meta { color: rgba(255,255,255,0.5); }
.err { color: var(--red-pen); }
</style>
