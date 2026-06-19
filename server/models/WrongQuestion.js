/**
 * 错题模型（核心表）
 */
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class WrongQuestion extends Model {
    static associate(models) {
      WrongQuestion.belongsTo(models.User, { foreignKey: 'user_id', as: 'student' })
      WrongQuestion.belongsTo(models.Subject, { foreignKey: 'subject_id', as: 'subject' })
      WrongQuestion.hasOne(models.ErrorAnalysis, { foreignKey: 'wrong_question_id', as: 'errorAnalysis' })
    }
  }

  WrongQuestion.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '学生ID',
    },
    subject_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '学科ID',
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: '题目标题',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '题目文本(OCR/输入)',
    },
    student_answer: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '学生作答',
    },
    correct_answer: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '正确答案',
    },
    difficulty: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: 'medium',
      validate: { isIn: [['easy', 'medium', 'hard']] },
      comment: '难度',
    },
    source: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'photo',
      validate: { isIn: [['manual', 'photo', 'import']] },
      comment: '来源',
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'pending',
      validate: { isIn: [['pending', 'analysed', 'failed']] },
      comment: '分析状态',
    },
    image_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '图片数量',
    },
    image_ids: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '图片ID列表(JSON)',
      get() {
        const raw = this.getDataValue('image_ids')
        return raw ? JSON.parse(raw) : null
      },
      set(value) {
        this.setDataValue('image_ids', value ? JSON.stringify(value) : null)
      },
    },
    analysed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '分析完成时间',
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '软删除',
    },
  }, {
    sequelize,
    modelName: 'WrongQuestion',
    tableName: 'wrong_question',
    underscored: true,
    timestamps: true,
    indexes: [
      { name: 'idx_user_status', fields: ['user_id', 'status'] },
      { name: 'idx_subject', fields: ['subject_id'] },
      { name: 'idx_created', fields: ['created_at'] },
      { name: 'idx_analysed', fields: ['analysed_at'] },
      { name: 'idx_status', fields: ['status'] },
    ],
  })

  return WrongQuestion
}
