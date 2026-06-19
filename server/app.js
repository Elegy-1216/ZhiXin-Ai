/**
 * Express 应用配置
 * - 安装中间件（CORS、JSON 解析、错误处理）
 * - 注册路由
 * - 不启动监听（由 server.js 启动）
 */
const express = require('express')
const path = require('path')
const fs = require('fs')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// ===== 中间件 =====

// JSON 请求体解析
app.use(express.json({ limit: '10mb' }))

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

// 请求日志（开发用）
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      const ms = Date.now() - start
      console.log(`[HTTP] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`)
    })
    next()
  })
}

// ===== API 路由（全部挂载到 /api 下）=====
app.use('/api', routes)

// ===== 静态文件服务（生产模式）=====
const STATIC_DIR = path.resolve(__dirname, '..', 'dist')
const IS_PRODUCTION = fs.existsSync(path.join(STATIC_DIR, 'index.html'))

if (IS_PRODUCTION) {
  console.log(`[Server] Serving static files from: ${STATIC_DIR}`)
  app.use(express.static(STATIC_DIR))

  // SPA 回退：非 /api 路径返回 index.html
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      res.sendFile(path.join(STATIC_DIR, 'index.html'))
    } else {
      next()
    }
  })
}

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Not found: ${req.method} ${req.originalUrl}` })
})

// ===== 全局错误处理 =====
app.use(errorHandler)

module.exports = app
