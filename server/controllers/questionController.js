/**
 * 错题控制器
 */
const questionService = require('../services/questionService')
const ApiResponse = require('../utils/response')

/**
 * GET /api/questions - 错题列表
 */
async function list(req, res, next) {
  try {
    const { subject_id, status, difficulty, page = 1, page_size = 20 } = req.query
    const userId = req.user?.id || null

    const result = await questionService.getQuestions({
      userId,
      subjectId: subject_id,
      status,
      difficulty,
      page: parseInt(page, 10),
      pageSize: parseInt(page_size, 10),
    })

    return ApiResponse.paginated(res, {
      rows: result.rows,
      count: result.count,
      page: parseInt(page, 10),
      pageSize: parseInt(page_size, 10),
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/questions/:id - 错题详情
 */
async function detail(req, res, next) {
  try {
    const question = await questionService.getQuestionDetail(req.params.id)
    if (!question) {
      return ApiResponse.error(res, '错题不存在', 404)
    }
    return ApiResponse.success(res, question)
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/questions - 创建错题
 */
async function create(req, res, next) {
  try {
    const data = {
      ...req.body,
      user_id: req.user?.id || req.body.user_id,
    }

    if (!data.content) {
      return ApiResponse.error(res, '题目内容不能为空')
    }

    const question = await questionService.createQuestion(data)
    return ApiResponse.success(res, question, '创建成功')
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/stats - 统计概览
 */
async function stats(req, res, next) {
  try {
    const userId = req.user?.id || null
    const result = await questionService.getStats(userId)
    return ApiResponse.success(res, result)
  } catch (err) {
    next(err)
  }
}

module.exports = { list, detail, create, stats }
