/**
 * Sequelize 实例
 * - 初始化连接池（延迟连接，首次 query 时自动连）
 * - 自动加载 models 目录下的所有模型
 * - 导出 sequelize 实例和 Sequelize 类
 */
const { Sequelize } = require('sequelize')
const config = require('./config')

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: config.pool,
    timezone: config.timezone,
    logging: config.logging,
    define: config.define,
    dialectOptions: config.dialectOptions,
  }
)

// 自动加载模型
const models = {}
const modelFiles = ['User', 'Subject', 'KnowledgePoint', 'WrongQuestion', 'ErrorAnalysis', 'Message']

modelFiles.forEach((name) => {
  try {
    const model = require(`../models/${name}`)
    if (typeof model === 'function') {
      const instance = model(sequelize, Sequelize.DataTypes)
      models[instance.name] = instance
    }
  } catch (err) {
    console.warn(`[DB] Model "${name}" not loaded: ${err.message}`)
  }
})

// 建立模型关联（在模型全部注册后调用）
Object.keys(models).forEach((name) => {
  if (typeof models[name].associate === 'function') {
    models[name].associate(models)
  }
})

// 导出
sequelize.models = models

/**
 * 测试数据库连接
 */
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('[DB] SQL Server 连接成功')
    return true
  } catch (err) {
    console.error('[DB] SQL Server 连接失败:', err.message)
    return false
  }
}

/**
 * 同步模型到数据库（开发环境使用 force 可重建表）
 * options.force = true 会删表重建（危险！）
 */
async function syncModels(options = {}) {
  try {
    await sequelize.sync(options)
    console.log('[DB] 模型同步完成')
  } catch (err) {
    console.error('[DB] 模型同步失败:', err.message)
  }
}

module.exports = {
  sequelize,
  Sequelize,
  models,
  testConnection,
  syncModels,
}
