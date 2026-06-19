<template>
  <div class="chat-page">
    <div class="chat-main paper-lines">
      <div class="chat-messages" ref="msgBox">
        <div v-for="(m, i) in messages" :key="i"
          class="msg" :class="m.role">
          <div class="avatar">{{ m.role === 'user' ? '张' : '知' }}</div>
          <div class="bubble">
            <div v-html="renderMsg(m)"></div>
            <div class="meta">{{ m.role === 'user' ? '张老师 · 刚刚' : '知因AI · DeepSeek' }}</div>
          </div>
        </div>
        <div v-if="isWaiting" class="msg system">
          <div class="avatar">知</div>
          <div class="bubble typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
      <div class="chat-input-area">
        <input
          v-model="input"
          @keydown.enter="send"
          placeholder="输入你的问题…"
          :disabled="isWaiting"
        />
        <button class="btn-primary" @click="send" :disabled="isWaiting || !input.trim()">
          发送
        </button>
      </div>
    </div>
    <div class="chat-side">
      <div class="panel">
        <div class="panel-header"><h3>快捷诊断</h3></div>
        <div class="panel-body">
          <div class="quick-grid">
            <button v-for="(q, i) in QUICK_PROMPTS" :key="i"
              class="quick-btn" @click="quickDiagnose(q)">
              {{ q }}
            </button>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>会话信息</h3></div>
        <div class="panel-body">
          <div class="info-row"><span class="info-label">会话 ID</span><code class="info-value">{{ sessionId }}</code></div>
          <div class="info-row"><span class="info-label">消息数</span><span class="info-value">{{ messages.length }}</span></div>
          <div class="info-row"><span class="info-label">模型</span><span class="info-value">DeepSeek V4 Flash</span></div>
          <div class="info-row" style="margin-top:8px">
            <button class="btn-sm btn-outline" @click="clearChat">清除会话</button>
            <button class="btn-sm btn-outline" @click="checkAi">API 测试</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { sendChatMessage } from '@/api/chat.js'
import { QUICK_PROMPTS } from '@/config/index.js'
import { renderMarkdown } from '@/utils/markdown.js'

const input = ref('')
const messages = ref([])
const isWaiting = ref(false)
const sessionId = ref('')
const msgBox = ref(null)

function renderMsg(m) {
  if (m.shape === 'error') return '<div class="error-msg">' + m.text + '</div>'
  return renderMarkdown(m.text)
}

function scrollToBottom() {
  nextTick(() => {
    const el = msgBox.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

async function send() {
  const text = input.value.trim()
  if (!text || isWaiting.value) return
  input.value = ''
  messages.value.push({ role: 'user', text })
  isWaiting.value = true
  scrollToBottom()
  try {
    const r = await sendChatMessage(text, sessionId.value)
    const rd = r.data || r
    sessionId.value = rd.sessionId || sessionId.value
    messages.value.push({ role: 'system', text: rd.reply })
  } catch (e) {
    messages.value.push({ role: 'system', text: e.message, shape: 'error' })
  }
  isWaiting.value = false
  scrollToBottom()
}

function quickDiagnose(q) { input.value = q; send() }

function clearChat() {
  messages.value = []
  sessionId.value = ''
  isWaiting.value = false
}

onMounted(() => {
  messages.value.push({ role: 'system', text: '你好，我是知因AI。请描述你想诊断的数学题目。' })
})
</script>

<style scoped>
.chat-page {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 16px;
  height: calc(100vh - 56px - 44px);
}
.chat-main {
  display: flex;
  flex-direction: column;
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
  padding: 0 16px 12px;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
}
.chat-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 12px;
}
.info-label { color: var(--text-secondary); }
.info-value { color: var(--text); }
.info-value code {
  font-size: 10px;
  background: var(--bg-alt);
  padding: 1px 4px;
  border-radius: 3px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.quick-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.quick-btn {
  padding: 6px 10px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 11px;
  color: var(--text-secondary);
  cursor: pointer;
  background: var(--card);
  font-family: inherit;
  line-height: 1.4;
  transition: all 0.12s;
}
.quick-btn:hover {
  border-color: var(--ink);
  color: var(--ink);
  background: var(--ink-light);
}
.btn-sm {
  font-size: 11px; padding: 4px 10px;
  background: transparent; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary);
  font-family: inherit;
}
.btn-sm:hover { background: var(--bg-alt); }
.paper-lines {
  background-image: repeating-linear-gradient(
    transparent, transparent 27px, rgba(232,226,216,0.3) 27px, rgba(232,226,216,0.3) 28px
  );
}
@media(max-width:768px){
  .chat-page{grid-template-columns:1fr}
  .chat-side{display:none}
}
</style>
