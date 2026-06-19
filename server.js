/**
 * 知因AI · 服务入口
 * - 加载环境变量
 * - 启动 Express 服务（由 server/app.js 配置）
 * - 可选：启动时尝试数据库连接
 */
require('dotenv').config()

const app = require('./server/app')
const { testConnection } = require('./server/db')

const PORT = parseInt(process.env.SERVER_PORT, 10) || 8080

// 启动服务
async function start() {
  // 尝试连接数据库（非阻塞，失败不影响启动）
  if (process.env.DB_HOST) {
    console.log('[Server] 尝试连接数据库...')
    const connected = await testConnection()
    if (!connected) {
      console.warn('[Server] 数据库连接失败，服务将以无数据库模式运行')
    }
  } else {
    console.log('[Server] 未配置数据库，服务将以 API 代理模式运行')
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(48))
    console.log('  知因AI · API Server (Node.js)')
    console.log(`  端口: ${PORT}`)
    console.log(`  模式: ${process.env.DB_HOST ? '数据库已连接' : 'API代理模式'}`)
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
