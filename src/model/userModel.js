module.exports = (schema, sequelize, type) => {
    return sequelize.define('user', {
      idx: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
      email: { type: type.STRING(500) },
      password: { type: type.STRING(500) },
      enabled: { type: type.BOOLEAN },
      address: { type: type.STRING(500) },
      pk: { type: type.STRING(500) },
      wallet: { type: type.STRING(500) },
      balance: { type: type.INTEGER }
    },
    {
      schema: schema,
      timestamps: false,
      tableName: 'user'
    })
  }