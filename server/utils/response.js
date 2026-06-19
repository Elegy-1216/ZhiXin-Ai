/**
 * 统一响应格式工具
 */
class ApiResponse {
  /**
   * 成功响应
   */
  static success(res, data = null, message = 'ok') {
    return res.json({
      success: true,
      message,
      data,
    })
  }

  /**
   * 失败响应
   */
  static error(res, message = '操作失败', statusCode = 400, errors = null) {
    const body = {
      success: false,
      message,
    }
    if (errors) body.errors = errors
    return res.status(statusCode).json(body)
  }

  /**
   * 服务器错误（500）
   */
  static serverError(res, message = '服务器内部错误') {
    return res.status(500).json({
      success: false,
      message,
    })
  }

  /**
   * 分页响应
   */
  static paginated(res, { rows, count, page, pageSize }) {
    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    })
  }
}

module.exports = ApiResponse
