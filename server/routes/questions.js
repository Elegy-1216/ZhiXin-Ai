/**
 * 错题路由
 */
const { Router } = require('express')
const questionController = require('../controllers/questionController')

const router = Router()

router.get('/questions', questionController.list)
router.get('/questions/:id', questionController.detail)
router.post('/questions', questionController.create)
router.get('/stats', questionController.stats)

module.exports = router
