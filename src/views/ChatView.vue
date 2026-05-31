<template>
  <div class="two-col">
    <!-- Left: AI Chat -->
    <div class="panel chat-panel">
      <div class="panel-header">
        <h3>🧠 AI 诊断对话</h3>
        <div style="display:flex;align-items:center;gap:12px;">
          <span v-if="isWaiting" style="color:var(--warning);font-size:12px;">⏳ AI 思考中...</span>
          <span v-else style="color:var(--success);font-size:12px;">● 就绪</span>
          <button class="btn-outline btn-sm" @click="handleClear">清空对话</button>
        </div>
      </div>

      <div class="panel-body chat-area">
        <!-- Messages -->
        <div class="chat-messages" ref="messagesContainer">
          <ChatMessage
            v-for="msg in messages"
            :key="msg.id"
            :role="msg.role"
            :content="msg.content"
          />

          <!-- Typing indicator -->
          <div v-if="isWaiting" class="msg system">
            <div class="avatar">🤖</div>
            <div class="bubble typing-bubble">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-label">思考中...</span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-area">
          <input
            ref="inputRef"
            v-model="inputText"
            type="text"
            placeholder="输入题目、错题内容或任何问题..."
            :disabled="isWaiting"
            @keydown.enter="handleSend"
            autofocus
          />
          <button
            class="btn-primary"
            :disabled="isWaiting || !inputText.trim()"
            @click="handleSend"
          >
            {{ isWaiting ? '思考中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Right: Info + API Test -->
    <div>
      <!-- Session Info -->
      <div class="panel">
        <div class="panel-header">
          <h3>📋 会话信息</h3>
        </div>
        <div class="panel-body">
          <div style="font-size:13px;line-height:1.8;">
            <div><strong>会话 ID：</strong><code style="font-size:11px;">{{ sessionId }}</code></div>
            <div><strong>消息数：</strong>{{ messages.length }}</div>
            <div><strong>模型：</strong>DeepSeek V4 Flash</div>
            <div><strong>平台：</strong>OpenClaw Gateway</div>
          </div>
        </div>
      </div>

      <!-- Quick Diagnosis Prompts -->
      <div class="panel">
        <div class="panel-header">
          <h3>💡 快速诊断示例</h3>
        </div>
        <div class="panel-body" style="display:flex;flex-direction:column;gap:8px;">
          <button
            v-for="prompt in quickPrompts"
            :key="prompt"
            class="btn-outline btn-sm"
            style="text-align:left;"
            :disabled="isWaiting"
            @click="quickSend(prompt)"
          >
            {{ prompt }}
          </button>
        </div>
      </div>

      <!-- API Test Panel -->
      <div class="panel">
        <div class="panel-header">
          <h3>🔌 API 测试</h3>
        </div>
        <div class="panel-body">
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <button class="btn-outline btn-sm" @click="testHealth">⚡ 健康检查</button>
            <button class="btn-outline btn-sm" @click="testAI">🔧 AI 连通</button>
          </div>
          <div class="api-result">{{ testResult }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ChatMessage from '../components/ChatMessage.vue'
import { useChat } from '../composables/useChat.js'

const {
  messages,
  isWaiting,
  error,
  sessionId,
  send,
  resetSession,
  initWelcome,
  checkHealth
} = useChat()

const inputText = ref('')
const inputRef = ref(null)
const messagesContainer = ref(null)
const testResult = ref('// 点击上方按钮测试 API 连接')

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
)

// Also scroll when waiting state changes (typing indicator)
watch(isWaiting, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

const quickPrompts = [
  '2(x+3) = 2x+3，分析错因',
  '√(a²) = a 为什么不对？',
  '(a+b)² 的正确展开公式',
  '一元二次方程常见错误有哪些？',
  '请讲解乘法分配律'
]

function handleSend() {
  const text = inputText.value.trim()
  if (!text || isWaiting.value) return

  // Handle commands
  if (text === '/clear') {
    handleClear()
    return
  }
  if (text === '/help') {
    inputText.value = ''
    send('列出你的功能和可用命令')
    return
  }

  inputText.value = ''
  send(text)
}

function quickSend(text) {
  inputText.value = text
  handleSend()
}

function handleClear() {
  resetSession()
  initWelcome()
  inputText.value = ''
  nextTick(() => inputRef.value?.focus())
}

async function testHealth() {
  testResult.value = '⏳ 正在检查...'
  try {
    const data = await checkHealth()
    testResult.value = '✅ API 服务在线\n' + JSON.stringify(data, null, 2)
  } catch (e) {
    testResult.value = '❌ 连接失败: ' + e.message + '\n请确认: python server.py'
  }
}

async function testAI() {
  testResult.value = '⏳ 正在测试 AI 连通性（约 5-10 秒）...'
  try {
    await send('请回复"连通正常"')
    nextTick(() => {
      const last = messages.value[messages.value.length - 1]
      if (last && last.role === 'system' && !last.content.error) {
        testResult.value = '✅ AI 连通测试通过\n' + JSON.stringify({
          model: last.content.model || 'unknown',
          durationMs: last.content.durationMs || 0,
          usage: last.content.usage || {}
        }, null, 2)
      } else {
        testResult.value = '❌ AI 响应异常，请查看左侧对话'
      }
    })
  } catch (e) {
    testResult.value = '❌ 请求失败: ' + e.message
  }
}

// Initialize
initWelcome()
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
}

.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 50px;
  min-height: 20px;
}

.typing-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 4px;
}
</style>
