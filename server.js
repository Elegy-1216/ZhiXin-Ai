/**
 * 知因AI · 服务入口
 * - 加载环境变量
 * - 启动 Express 服务（由 server/app.js 配置）
 * - 可选：启动时尝试数据库连接
 */
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const app = require('./server/app')
const { testConnection } = require('./server/db')

const PORT = parseInt(process.env.SERVER_PORT, 10) || 8080

// 启动服务
async function start() {
  // 确保 SQLite 数据目录存在
  const dbConfig = require('./server/db/config')
  if (dbConfig.dialect === 'sqlite' && dbConfig.storage) {
    const dataDir = path.dirname(dbConfig.storage)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  }

  // 尝试连接数据库（非阻塞，失败不影响启动）
  console.log('[Server] 尝试连接数据库...')
  const connected = await testConnection()
  if (!connected) {
    console.warn('[Server] 数据库连接失败，服务将以无数据库模式运行')
  }

  // 同步模型
  if (connected) {
    const { syncModels } = require('./server/db')
    await syncModels({ force: false })
  }

  app.listen(PORT, '127.0.0.1', () => {
    console.log('='.repeat(48))
    console.log('  知因AI · API Server (Node.js)')
    console.log(`  端口: ${PORT}`)
    console.log(`  数据库: ${connected ? 'SQLite 已连接' : '未连接（降级模式）'}`)
    console.log('  API:')
    console.log('    POST /api/chat       - AI 诊断对话')
    console.log('    GET  /api/health     - 健康检查')
    console.log('    GET  /api/questions  - 错题列表')
    console.log('    POST /api/questions  - 创建错题')
    console.log('    GET  /api/questions/:id - 错题详情')
    console.log('  Env: ' + (process.env.NODE_ENV || 'development'))
    console.log('='.repeat(48))
  })
}

start().catch((err) => {
  console.error('[Server] 启动失败:', err)
  process.exit(1)
})
