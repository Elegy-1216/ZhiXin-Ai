import { ref, computed } from 'vue'
import { sendChatMessage, healthCheck } from '@/api/chat.js'

/**
 * AI 聊天状态管理 composable
 * 封装消息列表、发送、会话管理
 */
export function useChat() {
  // ===== State =====
  const messages = ref([])
  const isWaiting = ref(false)
  const error = ref(null)

  // Session management
  const sessionId = ref(loadSessionId())

  // ===== Computed =====
  const canSend = computed(() => !isWaiting.value)

  // ===== Session =====
  function loadSessionId() {
    const stored = sessionStorage.getItem('zhixin-session-id')
    if (stored) return stored
    const id = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    sessionStorage.setItem('zhixin-session-id', id)
    return id
  }

  function resetSession() {
    const id = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    sessionStorage.setItem('zhixin-session-id', id)
    sessionId.value = id
    messages.value = []
    error.value = null
  }

  // ===== Actions =====
  function addMessage(role, content) {
    messages.value.push({
      id: Date.now() + Math.random(),
      role,
      content,
      timestamp: new Date()
    })
  }

  /**
   * 发送消息到 AI
   * @param {string} text - 用户输入
   * @returns {Promise<void>}
   */
  async function send(text) {
    if (!text.trim() || isWaiting.value) return

    error.value = null

    // Add user message
    addMessage('user', text)

    isWaiting.value = true

    try {
      const result = await sendChatMessage(text, sessionId.value)

      const replyData = result.data || result
      addMessage('system', {
        text: replyData.reply || result.reply,
        model: replyData.model,
        durationMs: replyData.durationMs,
        usage: replyData.usage,
      })
    } catch (e) {
      error.value = e.message || '网络错误，请确认服务器已启动'
      addMessage('system', {
        text: '',
        error: error.value
      })
    } finally {
      isWaiting.value = false
    }
  }

  /**
   * 初始化欢迎消息
   */
  function initWelcome() {
    if (messages.value.length === 0) {
      addMessage('system', {
        text: '您好！我是 **知因AI**，基于 **OpenClaw** 平台 + **DeepSeek 大模型** 的智能错题诊断系统。\n请上传错题或输入题目，我为您进行 AI 错因诊断。',
        isWelcome: true
      })
      addMessage('system', {
        text: '**系统状态**\n- OpenClaw API 网关：在线\n- DeepSeek V4 Flash：就绪\n- 数据服务：OpenClaw Data Service',
        isStatus: true
      })
    }
  }

  /**
   * 检查后端健康状态
   */
  async function checkHealth() {
    try {
      return await healthCheck()
    } catch {
      return { status: 'disconnected' }
    }
  }

  return {
    // State
    messages,
    isWaiting,
    error,
    sessionId,
    canSend,
    // Actions
    send,
    addMessage,
    resetSession,
    initWelcome,
    checkHealth
  }
}
