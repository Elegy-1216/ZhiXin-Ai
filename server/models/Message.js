/**
 * 消息模型（聊天记录 + 系统通知）
 */
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' })
      Message.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' })
    }
  }

  Message.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: '发送者(NULL=系统)',
    },
    receiver_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: '接收者(NULL=不限)',
    },
    class_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: '班级ID',
    },
    msg_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'chat',
      validate: { isIn: [['chat', 'system', 'top_wrong', 'weekly_report', 'student_alert', 'teaching']] },
      comment: '消息类型',
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: '消息标题',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '消息内容',
    },
    extra_data: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '扩展数据(JSON)',
      get() {
        const raw = this.getDataValue('extra_data')
        return raw ? JSON.parse(raw) : null
      },
      set(value) {
        this.setDataValue('extra_data', value ? JSON.stringify(value) : null)
      },
    },
    is_read: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '0=未读 1=已读',
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '读取时间',
    },
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'message',
    underscored: true,
    timestamps: true,
    indexes: [
      { name: 'idx_receiver', fields: ['receiver_id', 'is_read', 'created_at'] },
      { name: 'idx_class_type', fields: ['class_id', 'msg_type', 'created_at'] },
    ],
  })

  return Message
}
