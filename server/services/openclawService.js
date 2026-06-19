/**
 * OpenClaw Agent 调用服务
 * 负责与 OpenClaw CLI 交互，调用 AI 大模型
 */
const { spawn } = require('child_process')
const crypto = require('crypto')

const IS_WINDOWS = process.platform === 'win32'
const OPENCLAW_AGENT = process.env.OPENCLAW_AGENT || 'math-assistant'
const OPENCLAW_TIMEOUT = parseInt(process.env.OPENCLAW_TIMEOUT, 10) || 120_000
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw'

function buildPrompt(userMessage) {
  return userMessage
}

/**
 * 调用 OpenClaw Agent
 * @param {string} message - 用户消息
 * @param {string|null} sessionId - 会话ID
 * @returns {Promise<Object>}
 */
function callAgent(message, sessionId) {
  return new Promise((resolve) => {
    const sid = sessionId || 's' + crypto.randomUUID().slice(0, 12)
    const sessionKey = `zhixin-${sid}`
    const fullMessage = buildPrompt(message)

    console.log(`[OpenClaw] Calling agent (session: ${sid})`)
    console.log(`[OpenClaw]   Message: ${message.slice(0, 80)}${message.length > 80 ? '...' : ''}`)

    const args = [
      'agent',
      '--agent', OPENCLAW_AGENT,
      '--json',
      '--session-id', sessionKey,
      '--message', fullMessage,
      '--timeout', '120',
    ]

    const child = IS_WINDOWS
      ? spawn('cmd.exe', ['/c', OPENCLAW_BIN, ...args], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true })
      : spawn(OPENCLAW_BIN, args, { stdio: ['pipe', 'pipe', 'pipe'] })

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      child.kill()
    }, OPENCLAW_TIMEOUT + 10_000)

    child.stdout.on('data', (chunk) => { stdout += chunk.toString('utf-8') })
    child.stderr.on('data', (chunk) => { stderr += chunk.toString('utf-8') })

    child.on('error', (err) => {
      console.log(`[OpenClaw] ERR spawn error: ${err.message}`)
      resolve({
        success: false,
        error: `OpenClaw 调用失败: ${err.message}`,
        sessionId: sid,
      })
    })

    child.on('close', (code) => {
      clearTimeout(timer)

      if (timedOut) {
        console.log(`[OpenClaw] ERR Timeout after ${OPENCLAW_TIMEOUT / 1000}s`)
        resolve({
          success: false,
          error: `AI 响应超时（${OPENCLAW_TIMEOUT / 1000}秒），请重试`,
          sessionId: sid,
        })
        return
      }

      if (code !== 0) {
        const errMsg = (stderr || `exit code ${code}`).slice(0, 200)
        console.log(`[OpenClaw] ERR error (code ${code}): ${errMsg}`)
        resolve({
          success: false,
          error: `OpenClaw 调用失败: ${errMsg}`,
          sessionId: sid,
        })
        return
      }

      if (!stdout) {
        resolve({
          success: false,
          error: 'OpenClaw 返回空响应',
          sessionId: sid,
        })
        return
      }

      try {
        const data = JSON.parse(stdout)

        if (data.status && data.status !== 'ok') {
          resolve({
            success: false,
            error: `Agent 返回异常状态: ${data.status}`,
            sessionId: sid,
          })
          return
        }

        const payloads = data.payloads || data.result?.payloads || []
        let replyText = ''
        for (const p of payloads) {
          if (p.text) replyText += p.text
        }

        const agentMeta = data.meta?.agentMeta || data.result?.meta?.agentMeta || {}
        const usage = agentMeta.usage || {}
        const fullReply = data.meta?.finalAssistantVisibleText || data.result?.finalAssistantVisibleText || replyText

        console.log(`[OpenClaw] OK Response (${fullReply.length} chars, ` +
          `${data.result?.meta?.durationMs || '?'}ms, ` +
          `tokens: ${usage.total || '?'})`)

        resolve({
          success: true,
          reply: fullReply,
          sessionId: sid,
          model: agentMeta.model || 'unknown',
          durationMs: data.result?.meta?.durationMs || 0,
          usage: {
            input: usage.input || 0,
            output: usage.output || 0,
            total: usage.total || 0,
          },
        })
      } catch (e) {
        console.log(`[OpenClaw] ERR JSON parse: ${e.message}`)
        resolve({
          success: false,
          error: 'AI 响应解析失败，请重试',
          sessionId: sid,
        })
      }
    })
  })
}

module.exports = { callAgent }
