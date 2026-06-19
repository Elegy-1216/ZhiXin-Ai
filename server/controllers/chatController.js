/**
 * 聊天控制器
 */
const chatService = require('../services/chatService')
const ApiResponse = require('../utils/response')

/**
 * POST /api/chat - 发送聊天消息
 */
async function chat(req, res, next) {
  try {
    const { message, sessionId } = req.body
    const userId = req.user?.id || null

    if (!message || !message.trim()) {
      return ApiResponse.error(res, '消息不能为空')
    }

    const result = await chatService.sendMessage(message, sessionId, userId)

    if (result.success) {
      return ApiResponse.success(res, {
        reply: result.reply,
        sessionId: result.sessionId,
        model: result.model,
        durationMs: result.durationMs,
        usage: result.usage,
      })
    } else {
      return ApiResponse.error(res, result.error, 502)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { chat }
