/**
 * 知因AI · API 代理服务器 (Node.js)
 * - POST /api/chat  → 调用 OpenClaw Agent → DeepSeek 大模型
 * - GET  /api/health → 健康检查
 * - 生产模式下提供静态文件服务 (dist/)
 */

require('dotenv').config()

const express = require('express')
const { spawn } = require('child_process')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')

// ===== Config =====
const PORT = parseInt(process.env.SERVER_PORT, 10) || 8080
const OPENCLAW_AGENT = process.env.OPENCLAW_AGENT || 'math-assistant'
const OPENCLAW_TIMEOUT = parseInt(process.env.OPENCLAW_TIMEOUT, 10) || 120_000  // ms
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw'
const IS_WINDOWS = process.platform === 'win32'
const STATIC_DIR = path.resolve(__dirname, 'dist')
const IS_PRODUCTION = fs.existsSync(path.join(STATIC_DIR, 'index.html'))

// ===== 消息传递（直接转发） =====
function buildPrompt(userMessage) { return userMessage }

// ===== OpenClaw Agent Caller =====
function callOpenclawAgent(message, sessionId) {
  return new Promise((resolve) => {
    const sid = sessionId || 's' + crypto.randomUUID().slice(0, 12)
    const sessionKey = `zhixin-${sid}`
    const fullMessage = buildPrompt(message)

    console.log(`[API] Calling OpenClaw agent (session: ${sid})`)
    console.log(`[API]   Message: ${message.slice(0, 80)}${message.length > 80 ? '...' : ''}`)
    console.log(`[API]   Full prompt length: ${fullMessage.length} chars`)

    const args = [
      'agent',
      '--agent', OPENCLAW_AGENT,
      '--json',
      '--session-id', sessionKey,
      '--message', fullMessage,
      
      '--json',
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
      console.log(`[API] ERR OpenClaw spawn error: ${err.message}`)
      resolve({
        success: false,
        error: `OpenClaw 调用失败: ${err.message}`,
        sessionId: sid,
      })
    })

    child.on('close', (code) => {
      clearTimeout(timer)

      if (timedOut) {
        console.log(`[API] ERR Timeout after ${OPENCLAW_TIMEOUT / 1000}s`)
        resolve({
          success: false,
          error: `AI 响应超时（${OPENCLAW_TIMEOUT / 1000}秒），请重试`,
          sessionId: sid,
        })
        return
      }

      if (code !== 0) {
        const errMsg = (stderr || `exit code ${code}`).slice(0, 200)
        console.log(`[API] ERR OpenClaw error (code ${code}): ${errMsg}`)
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

        // Linux版OpenClaw直接返回payloads没有status字段，Windows版有status='ok'
        if (data.status && data.status !== 'ok') {
          resolve({
            success: false,
            error: `Agent 返回异常状态: ${data.status}`,
            sessionId: sid,
          })
          return
        }

        // Extract response text
        // Linux版OpenClaw: payloads在顶层; Windows版: 在data.result.payloads
        const payloads = data.payloads || data.result?.payloads || []
        let replyText = ''
        for (const p of payloads) {
          if (p.text) replyText += p.text
        }

        const agentMeta = data.meta?.agentMeta || data.result?.meta?.agentMeta || {}
        const usage = agentMeta.usage || {}
        const fullReply = data.meta?.finalAssistantVisibleText || data.result?.finalAssistantVisibleText || replyText

        console.log(`[API] OK Response received (${fullReply.length} chars, ` +
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
        console.log(`[API] ERR JSON parse error: ${e.message}`)
        console.log(`[API]   Raw stdout (first 500 chars): ${(stdout || '').slice(0, 500)}`)
        resolve({
          success: false,
          error: 'AI 响应解析失败，请重试',
          sessionId: sid,
        })
      }
    })
  })
}

// ===== Express App =====
const app = express()
app.use(express.json())

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

// ===== API Routes =====

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '知因AI API Server (Node.js)',
    openclawAgent: OPENCLAW_AGENT,
    version: '1.0.0',
  })
})

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  const message = (req.body?.message || '').trim()
  if (!message) {
    res.status(400).json({ success: false, error: '消息不能为空' })
    return
  }

  const sessionId = req.body?.sessionId || null
  const result = await callOpenclawAgent(message, sessionId)

  if (result.success) {
    res.json(result)
  } else {
    res.status(502).json(result)
  }
})

// ===== Static files (production) =====
if (IS_PRODUCTION) {
  console.log(`[Server] Serving static files from: ${STATIC_DIR}`)
  app.use(express.static(STATIC_DIR))
  // SPA fallback — use middleware, not route wildcard (Express 5 compat)
  app.use((req, res) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      res.sendFile(path.join(STATIC_DIR, 'index.html'))
    } else {
      res.status(404).json({ success: false, error: 'Not found' })
    }
  })
}

// ===== Error handler =====
app.use((err, req, res, next) => {
  console.error(`[API] ERR Unhandled: ${err.message}`)
  res.status(500).json({ success: false, error: '服务器内部错误' })
})

// ===== Start =====
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(48))
  console.log('  ZhiYin AI - Server (Node.js)')
  console.log('  OpenClaw Gateway -> DeepSeek Model')
  console.log(`  Dir:  ${__dirname}`)
  console.log(`  URL:  http://localhost:${PORT}`)
  console.log('  API:  POST /api/chat  - AI Chat')
  console.log('        GET  /api/health - Health Check')
  console.log('  Mode: ' + (IS_PRODUCTION ? 'Production (serving dist/)' : 'API only (use with Vite dev)'))
  console.log('='.repeat(48))
})
