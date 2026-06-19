/**
 * 错因分析模型（1:1 关联错题）
 */
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ErrorAnalysis extends Model {
    static associate(models) {
      ErrorAnalysis.belongsTo(models.WrongQuestion, { foreignKey: 'wrong_question_id', as: 'wrongQuestion' })
    }
  }

  ErrorAnalysis.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    wrong_question_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      comment: '错题ID(唯一)',
    },
    analysis_type: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'math',
      validate: { isIn: [['math', 'general']] },
      comment: '分析模型类型',
    },
    error_steps: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '逐步骤比对(JSON)',
      get() {
        const raw = this.getDataValue('error_steps')
        return raw ? JSON.parse(raw) : null
      },
      set(value) {
        this.setDataValue('error_steps', value ? JSON.stringify(value) : null)
      },
    },
    error_category: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: { isIn: [['concept', 'formula', 'calculation', 'comprehension', 'logic', 'other', null]] },
      comment: '错误类别',
    },
    knowledge_gaps: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '知识漏洞(JSON)',
      get() {
        const raw = this.getDataValue('knowledge_gaps')
        return raw ? JSON.parse(raw) : null
      },
      set(value) {
        this.setDataValue('knowledge_gaps', value ? JSON.stringify(value) : null)
      },
    },
    weakness_points: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '具体弱点列表(JSON)',
      get() {
        const raw = this.getDataValue('weakness_points')
        return raw ? JSON.parse(raw) : null
      },
      set(value) {
        this.setDataValue('weakness_points', value ? JSON.stringify(value) : null)
      },
    },
    error_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '错因描述',
    },
    confidence_score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: '置信度',
    },
    model_used: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: '模型名称',
    },
    analysis_duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '耗时(ms)',
    },
  }, {
    sequelize,
    modelName: 'ErrorAnalysis',
    tableName: 'error_analysis',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { name: 'idx_category', fields: ['error_category'] },
    ],
  })

  return ErrorAnalysis
}
