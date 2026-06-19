/**
 * 学科模型
 */
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate(models) {
      Subject.hasMany(models.KnowledgePoint, { foreignKey: 'subject_id', as: 'knowledgePoints' })
      Subject.hasMany(models.WrongQuestion, { foreignKey: 'subject_id', as: 'wrongQuestions' })
    }
  }

  Subject.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '学科名称',
    },
    code: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      comment: '唯一编码',
    },
    icon: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: '图标URL',
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序号',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'Subject',
    tableName: 'subject',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  })

  return Subject
}
