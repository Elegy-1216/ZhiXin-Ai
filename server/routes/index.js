/**
 * 路由聚合入口
 * 统一以 /api 前缀注册所有路由模块
 */
const { Router } = require('express')

const router = Router()

// 各功能模块路由
router.use(require('./health'))
router.use(require('./chat'))
router.use(require('./questions'))

// 在此处添加新路由模块：
// router.use(require('./auth'))
// router.use(require('./teacher'))

module.exports = router
