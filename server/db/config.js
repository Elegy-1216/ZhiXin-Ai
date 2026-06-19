/**
 * 数据库配置
 * 从 .env 读取 SQL Server 连接参数，返回 Sequelize 兼容配置
 */
require('dotenv').config()

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  database: process.env.DB_NAME || 'zhiyin_ai',
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mssql',

  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
  },

  timezone: process.env.DB_TIMEZONE || '+08:00',

  logging: process.env.DB_LOGGING === 'true'
    ? (msg) => console.log(`[DB] ${msg}`)
    : false,

  define: {
    underscored: true,
    freezeTableName: false,
    timestamps: true,
    paranoid: false,
  },

  dialectOptions: {
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
      requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT, 10) || 30000,
    },
  },
}

module.exports = config
