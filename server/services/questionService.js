/**
 * 错题服务 - 错题管理业务逻辑
 */
const { models, sequelize } = require('../db')
const { Op } = require('sequelize')

/**
 * 获取错题列表（支持分页与筛选）
 */
async function getQuestions({ userId, subjectId, status, difficulty, page = 1, pageSize = 20 }) {
  const where = { deleted_at: null }
  if (userId) where.user_id = userId
  if (subjectId) where.subject_id = subjectId
  if (status) where.status = status
  if (difficulty) where.difficulty = difficulty

  const offset = (page - 1) * pageSize
  const { rows, count } = await models.WrongQuestion.findAndCountAll({
    where,
    include: [
      { model: models.Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
      { model: models.ErrorAnalysis, as: 'errorAnalysis', attributes: ['id', 'error_category', 'confidence_score', 'created_at'] },
    ],
    order: [['created_at', 'DESC']],
    limit: pageSize,
    offset,
  })

  return { rows, count, page, pageSize }
}

/**
 * 获取单道错题详情（含分析结果）
 */
async function getQuestionDetail(id) {
  const question = await models.WrongQuestion.findByPk(id, {
    include: [
      { model: models.Subject, as: 'subject' },
      { model: models.ErrorAnalysis, as: 'errorAnalysis' },
    ],
  })
  return question
}

/**
 * 创建错题
 */
async function createQuestion(data) {
  const question = await models.WrongQuestion.create({
    user_id: data.user_id,
    subject_id: data.subject_id,
    title: data.title,
    content: data.content,
    student_answer: data.student_answer,
    correct_answer: data.correct_answer,
    difficulty: data.difficulty || 'medium',
    source: data.source || 'manual',
    status: 'pending',
  })
  return question
}

/**
 * 获取统计概览
 */
async function getStats(userId) {
  if (!userId) {
    return {
      total: 0,
      analysed: 0,
      pending: 0,
      bySubject: [],
    }
  }

  const total = await models.WrongQuestion.count({ where: { user_id: userId, deleted_at: null } })
  const analysed = await models.WrongQuestion.count({ where: { user_id: userId, status: 'analysed', deleted_at: null } })
  const pending = total - analysed

  // 按学科分组统计
  const bySubject = await models.WrongQuestion.findAll({
    attributes: [
      'subject_id',
      [sequelize.fn('COUNT', sequelize.col('WrongQuestion.id')), 'count'],
    ],
    where: { user_id: userId, deleted_at: null },
    include: [{ model: models.Subject, as: 'subject', attributes: ['id', 'name', 'code'] }],
    group: ['subject_id', 'subject.id', 'subject.name', 'subject.code'],
    raw: true,
    nest: true,
  })

  return { total, analysed, pending, bySubject }
}

module.exports = { getQuestions, getQuestionDetail, createQuestion, getStats }
