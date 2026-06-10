/**
 * 知因AI API 封装
 * 通过 Vite proxy 转发到 Node.js 后端 (localhost:8080)
 */

const BASE = '/api'

/**
 * 发送聊天消息，获取 AI 回复
 * @param {string} message - 用户消息
 * @param {string} sessionId - 会话 ID（用于保持上下文）
 * @returns {Promise<object>} { success, reply, sessionId, model, durationMs, usage }
 */
export async function sendChatMessage(message, sessionId) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId })
  })

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.error || 'AI 响应失败')
  }

  return data
}

/**
 * 健康检查
 * @returns {Promise<object>} { status, service, openclawAgent, version }
 */
export async function healthCheck() {
  const res = await fetch(`${BASE}/health`)
  return res.json()
}
