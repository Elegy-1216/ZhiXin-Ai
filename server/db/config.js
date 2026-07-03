/**
 * 数据库配置
 * SQLite 本地数据库，返回 Sequelize 兼容配置
 */
const path = require('path')

const config = {
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'data', 'zhixin.db'),

  logging: process.env.DB_LOGGING === 'true'
    ? (msg) => console.log(`[DB] ${msg}`)
    : false,

  define: {
    underscored: true,
    freezeTableName: false,
    timestamps: true,
    paranoid: false,
  },
}

module.exports = config
