const Sequelize = require('sequelize');
const userModel = require('../model/userModel');
const betsModel = require('../model/betsModel');
const config = require('../config');

//lee los parametros desde las variables de entorno, si no vienen se usan valores por defecto
const DB_HOST = process.env.DB_HOST || config.db.host;
const DB_PORT = process.env.DB_PORT || config.db.port;
const DB_USER = process.env.DB_USER || config.db.user;
const DB_PWD = process.env.DB_PWD || config.db.pwd;
const DB_NAME = process.env.DB_NAME || config.db.name;
const DB_DIALECT = process.env.DB_DIALECT || config.db.dialect;
const DB_SQL_OUT_LOG = process.env.DB_SQL_OUT_LOG || config.db.sql_out_log;

const DB_POOL_MIN_DEFAULT = config.db.pool.min;
const DB_POOL_MAX_DEFAULT = config.db.pool.max;

var DB_POOL_MIN = process.env.DB_POOL_MIN || DB_POOL_MIN_DEFAULT;
var DB_POOL_MAX = process.env.DB_POOL_MAX || DB_POOL_MAX_DEFAULT;

DB_POOL_MIN = isNaN(DB_POOL_MIN) ? DB_POOL_MIN_DEFAULT : Number(DB_POOL_MIN);
DB_POOL_MAX = isNaN(DB_POOL_MAX) ? DB_POOL_MAX_DEFAULT : Number(DB_POOL_MAX);

function mask(text) {
  if (!text == undefined || text == '') {
    return text;
  }
  var text_mask = text;
  if (text.length > 2) {
    text_mask = text.substring(0, text.length / 2);
    text_mask = text_mask + ''.padEnd(text.length / 2, '*');
  }
  return text_mask;
}

const dataLog = {
  DB_HOST: mask(DB_HOST),
  DB_PORT,
  DB_USER: mask(DB_USER),
  DB_NAME,
  DB_DIALECT,
  DB_SQL_OUT_LOG,
  DB_POOL_MIN,
  DB_POOL_MIN
};


var options = {
  host: DB_HOST,
  dialect: DB_DIALECT,
  operatorsAliases: false,
  logging: DB_SQL_OUT_LOG.toString() == 'true' ? console.log : () => {} ,
  pool: {
    max: DB_POOL_MAX,
    min: DB_POOL_MIN,
    acquire: 30000,
    idle: 10000
  }
}

if (DB_DIALECT == 'sqlite') {
  options.storage = 'database.sqlite';
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, options);

const User = userModel(DB_NAME, sequelize, Sequelize);
const Bets = betsModel(DB_NAME, sequelize, Sequelize);

module.exports = {
  sequelize,
  Bets,
  User
};
