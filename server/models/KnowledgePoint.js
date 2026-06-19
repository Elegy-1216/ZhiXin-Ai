/**
 * 知识点模型（树形结构，parent_id 自关联）
 */
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class KnowledgePoint extends Model {
    static associate(models) {
      KnowledgePoint.belongsTo(models.Subject, { foreignKey: 'subject_id', as: 'subject' })
      KnowledgePoint.belongsTo(models.KnowledgePoint, { foreignKey: 'parent_id', as: 'parent' })
      KnowledgePoint.hasMany(models.KnowledgePoint, { foreignKey: 'parent_id', as: 'children' })
    }
  }

  KnowledgePoint.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    subject_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '所属学科',
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: '父知识点ID(NULL=根)',
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: '知识点名称',
    },
    code: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      comment: '唯一编码',
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '层级深度',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '知识点描述',
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'KnowledgePoint',
    tableName: 'knowledge_point',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { name: 'idx_subject', fields: ['subject_id'] },
      { name: 'idx_parent', fields: ['parent_id'] },
      { name: 'idx_level', fields: ['level'] },
    ],
  })

  return KnowledgePoint
}
