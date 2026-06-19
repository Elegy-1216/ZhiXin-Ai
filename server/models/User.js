/**
 * 用户模型
 */
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User has many WrongQuestions
      User.hasMany(models.WrongQuestion, { foreignKey: 'user_id', as: 'wrongQuestions' })
      // User belongs to many Classes via UserClass (if model exists later)
    }
  }

  User.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      comment: '登录用户名',
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'BCrypt加密密码',
    },
    real_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: '真实姓名',
    },
    role: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'student',
      validate: { isIn: [['student', 'teacher', 'admin']] },
      comment: '角色',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号',
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: '邮箱',
    },
    avatar_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: '头像地址',
    },
    platform_open_id: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: '第三方平台免登ID',
    },
    platform_type: {
      type: DataTypes.STRING(16),
      allowNull: true,
      validate: { isIn: [['wecom', 'dingtalk', 'feishu', null]] },
      comment: '平台类型',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '1=启用 0=禁用',
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '软删除标记',
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    underscored: true,
    timestamps: true,
    paranoid: false,
    indexes: [
      { name: 'idx_role', fields: ['role'] },
      { name: 'idx_deleted', fields: ['deleted_at'] },
      { name: 'idx_platform', fields: ['platform_type', 'platform_open_id'] },
    ],
  })

  return User
}
