module.exports = (schema, sequelize, type) => {
    return sequelize.define('bets', {
      idx: { type: type.BIGINT, primaryKey: true, autoIncrement: true },
      user_id: { type: type.INTEGER },
      hash_client: { type: type.STRING(500) },
      hash_server: { type: type.STRING(500) },
      result: { type: type.STRING(500) },
      amount: { type: type.STRING(500) },
      bet: { type: type.STRING(500) },
      created: { type: type.DATE },
      tx_hash: { type: type.STRING(500) },
      state: { type: type.STRING(50) }
    },
    {
      schema: schema,
      timestamps: false,
      tableName: 'bets'
    })
  }