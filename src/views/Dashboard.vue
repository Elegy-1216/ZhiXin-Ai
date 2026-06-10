<template>
  <div>
    <!-- Stats -->
    <div class="stats-grid">
      <StatCard
        icon="📚"
        icon-bg="#eef2ff"
        icon-color="var(--primary)"
        label="累计错题"
        :value="stats.totalQuestions.toLocaleString()"
        trend="↑ 12% 较上周"
        trend-dir="up"
      />
      <StatCard
        icon="❌"
        icon-bg="#fef2f2"
        icon-color="var(--danger)"
        label="高频错误"
        :value="stats.topError"
        trend="↑ 23% 需关注"
        trend-dir="down"
      />
      <StatCard
        icon="✅"
        icon-bg="#ecfdf5"
        icon-color="var(--success)"
        label="诊断完成"
        :value="stats.diagnosed.toLocaleString()"
        :trend="`${stats.diagnoseRate}% 覆盖率`"
        trend-dir="up"
      />
      <StatCard
        icon="🎯"
        icon-bg="#fffbeb"
        icon-color="var(--warning)"
        label="薄弱知识点"
        :value="stats.weakPoints"
        trend="↓ 3 较上周"
        trend-dir="down"
      />
    </div>

    <!-- Two columns: Chat preview + Analysis -->
    <div class="two-col">
      <!-- Quick AI Console -->
      <div class="panel chat-panel">
        <div class="panel-header">
          <h3>🧠 AI 诊断控制台</h3>
          <small style="color:var(--text-secondary);font-size:12px;">
            与 OpenClaw · DeepSeek 交互
          </small>
        </div>
        <div class="panel-body chat-area">
          <div class="chat-messages">
            <ChatMessage
              v-for="msg in previewMessages"
              :key="msg.id"
              :role="msg.role"
              :content="msg.content"
            />
          </div>
          <div class="chat-input-area">
            <input
              v-model="quickInput"
              type="text"
              placeholder="输入题目/错题，快速诊断..."
              @keydown.enter="quickSend"
            />
            <button class="btn-primary" @click="quickSend">诊断</button>
            <button class="btn-outline" @click="goToChat">完整对话 →</button>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div>
        <!-- Knowledge Graph -->
        <div class="panel">
          <div class="panel-header">
            <h3>📚 知识点分析</h3>
            <small style="color:var(--text-secondary);font-size:12px;">
              知识图谱 · 薄弱点定位
            </small>
          </div>
          <div class="panel-body">
            <div class="kg-placeholder">
              <div class="big-icon">🔬</div>
              <div>AI 知识图谱将在此渲染</div>
              <small>基于 DeepSeek 大模型实时分析</small>
            </div>
          </div>
        </div>

        <!-- Error frequency table -->
        <div class="panel">
          <div class="panel-header">
            <h3>📊 班级高频错题</h3>
          </div>
          <div class="panel-body" style="padding:0;">
            <ErrorTable :items="errorItems" />
          </div>
        </div>

        <!-- API Status -->
        <div class="panel">
          <div class="panel-header">
            <h3>🔌 API 状态</h3>
          </div>
          <div class="panel-body">
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
              <button class="btn-outline btn-sm" @click="checkApiStatus">⚡ 系统状态</button>
              <button class="btn-outline btn-sm" @click="quickTestAI">🔧 AI 连通测试</button>
            </div>
            <div class="api-result">{{ apiResult }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StatCard from '@/components/dashboard/StatCard.vue'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import ErrorTable from '@/components/dashboard/ErrorTable.vue'
import { useChat } from '@/composables/useChat.js'

const router = useRouter()
const { send, initWelcome, checkHealth, messages } = useChat()

const quickInput = ref('')
const apiResult = ref('// 点击上方按钮测试 API 连接')

// Stats data (placeholder)
const stats = {
  totalQuestions: 1284,
  topError: '分配律',
  diagnosed: 1152,
  diagnoseRate: 89.7,
  weakPoints: 8
}

// Error items (placeholder)
const errorItems = [
  { id: 1, question: '2(x+3)=2x+3', count: 24, rate: '65%', rateColor: 'var(--danger)', diagnosed: true },
  { id: 2, question: '√(a²)=a 恒成立', count: 18, rate: '58%', rateColor: 'var(--danger)', diagnosed: false },
  { id: 3, question: '(a+b)²=a²+b²', count: 15, rate: '52%', rateColor: 'var(--warning)', diagnosed: false }
]

// Preview messages
const previewMessages = [
  {
    id: 1,
    role: 'system',
    content: { text: '您好！我是 **知因AI**，基于 **OpenClaw** 平台 + **DeepSeek 大模型** 的智能错题诊断系统。\n请上传错题或输入题目，我为您进行 AI 错因诊断。', isWelcome: true }
  },
  {
    id: 2,
    role: 'system',
    content: { text: '**系统状态**\n- OpenClaw API 网关：在线\n- DeepSeek V4 Flash：就绪\n- 数据服务：OpenClaw Data Service', isStatus: true }
  },
  {
    id: 3,
    role: 'user',
    content: '2(x+3) = 2x+3，这道题学生做错了，请分析原因。'
  },
  {
    id: 4,
    role: 'system',
    content: { text: '**错因诊断报告**\n\n**题目：** 2(x+3) = 2x+3\n\n**错误定位：**\n第1步：分配律应用错误\n  正确：2(x+3) = 2x + 6\n  学生：2(x+3) = 2x + 3\n\n**错误分类：**\n- 类型：概念理解错误\n- 子类：乘法分配律掌握不足\n\n**AI 讲解：**\n分配律指的是 a(b+c) = ab + ac。\n这里 a=2, b=x, c=3，所以 2(x+3) = 2·x + 2·3 = 2x + 6。\n常数 3 也要乘以 2，不能遗漏哦！', model: 'DeepSeek', durationMs: 1200 }
  }
]

function quickSend() {
  if (!quickInput.value.trim()) return
  send(quickInput.value)
  quickInput.value = ''
  // Navigate to full chat after quick interaction
  setTimeout(() => router.push('/chat'), 500)
}

function goToChat() {
  router.push('/chat')
}

async function checkApiStatus() {
  apiResult.value = '⏳ 正在检查...'
  try {
    const data = await checkHealth()
    apiResult.value = '✅ API 服务在线\n' + JSON.stringify(data, null, 2)
  } catch (e) {
    apiResult.value = '❌ 连接失败\n' + e.message + '\n请确认服务器已启动: npm run server'
  }
}

async function quickTestAI() {
  apiResult.value = '⏳ 正在测试 AI 连通性...'
  try {
    await send('回复"OK"')
    // Wait briefly and check last message
    setTimeout(() => {
      const last = messages.value[messages.value.length - 1]
      if (last && last.role === 'system' && !last.content.error) {
        apiResult.value = '✅ AI 连通测试通过\n' + JSON.stringify({
          model: last.content.model,
          durationMs: last.content.durationMs,
          usage: last.content.usage
        }, null, 2)
      } else {
        apiResult.value = '❌ AI 响应异常'
      }
    }, 500)
  } catch (e) {
    apiResult.value = '❌ 连接失败\n' + e.message
  }
}

// Init
initWelcome()
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
}
</style>
