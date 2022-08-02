import DataTypes, {Sequelize, ConnectionError} from 'sequelize';
import config from '../../../config/default.js';

const {userService: {MySQL}} = config;

console.dir(MySQL.options);
export default new Sequelize(
  MySQL.DB,
  MySQL.USER,
  MySQL.PASS,
  MySQL.options
);

export {
  DataTypes,
  ConnectionError
};
