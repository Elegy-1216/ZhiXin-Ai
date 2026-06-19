/**
 * 全局错误处理中间件
 */
function errorHandler(err, req, res, _next) {
  console.error(`[API] Unhandled error:`, err)

  // Sequelize 校验错误
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: '数据校验失败',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    })
  }

  // Sequelize 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: '数据已存在',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    })
  }

  // Sequelize 外键错误
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: '关联数据不存在',
    })
  }

  // 通用
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
  })
}

module.exports = errorHandler
