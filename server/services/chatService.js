/**
 * 聊天服务 - AI 诊断对话业务逻辑
 */
const { callAgent } = require('./openclawService')
const { models } = require('../db')
const crypto = require('crypto')

/**
 * 发送消息给 AI 并返回回复
 * @param {string} message - 用户消息
 * @param {string|null} sessionId - 会话ID
 * @param {number|null} userId - 当前用户ID（可选，用于存储聊天记录）
 * @returns {Promise<Object>}
 */
async function sendMessage(message, sessionId, userId = null) {
  if (!message || !message.trim()) {
    return { success: false, error: '消息不能为空' }
  }

  // 调用 OpenClaw Agent
  const result = await callAgent(message, sessionId)

  // 如果数据库可用且用户已登录，异步保存聊天记录
  if (result.success && userId && models.Message) {
    try {
      await models.Message.create({
        sender_id: userId,
        msg_type: 'chat',
        title: message.slice(0, 100),
        content: message,
      })
      await models.Message.create({
        sender_id: null, // AI 消息
        receiver_id: userId,
        msg_type: 'chat',
        title: result.reply.slice(0, 100),
        content: result.reply,
        extra_data: {
          model: result.model,
          durationMs: result.durationMs,
          usage: result.usage,
        },
      })
    } catch (err) {
      console.warn(`[ChatService] Failed to save message: ${err.message}`)
    }
  }

  return result
}

/**
 * 生成新会话ID
 */
function createSession() {
  return 's' + crypto.randomUUID().slice(0, 12)
}

module.exports = { sendMessage, createSession }
