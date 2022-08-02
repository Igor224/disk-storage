import DataTypes, {Sequelize, ConnectionError} from 'sequelize';
import config from '../../../config/default.js';

const {storageServices: {MySQL}} = config;

export default new Sequelize(
  MySQL.DB,
  MySQL.USER,
  MySQL.PASS,
  MySQL.options
);
console.log('DB: ', MySQL.DB);
export {
  DataTypes,
  ConnectionError
};
