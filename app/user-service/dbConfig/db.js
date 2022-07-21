import DataTypes, {Sequelize, ConnectionError} from 'sequelize';
import config from '../../../config/default.js';

const {userService} = config;

export default new Sequelize(
  userService.DB,
  userService.USER,
  userService.PASS,
  userService.options
);

export {
  DataTypes,
  ConnectionError
};
