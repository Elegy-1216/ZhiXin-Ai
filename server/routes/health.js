/**
 * 健康检查路由
 */
const { Router } = require('express')
const { testConnection } = require('../db')
const ApiResponse = require('../utils/response')

const router = Router()

router.get('/health', async (req, res, next) => {
  try {
    let dbStatus = 'not_configured'
    try {
      const ok = await testConnection()
      dbStatus = ok ? 'connected' : 'disconnected'
    } catch (_) {
      dbStatus = 'disconnected'
    }

    res.json({
      success: true,
      message: 'ok',
      data: {
        service: '知因AI API Server (Node.js)',
        version: '1.0.0',
        openclawAgent: process.env.OPENCLAW_AGENT || 'math-assistant',
        database: dbStatus,
      },
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
