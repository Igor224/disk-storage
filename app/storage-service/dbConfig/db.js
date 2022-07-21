import DataTypes, {Sequelize, ConnectionError} from 'sequelize';
import config from '../../../config/default.js';

const {storageServices} = config;

export default new Sequelize(
  storageServices.DB,
  storageServices.USER,
  storageServices.PASS,
  storageServices.options
);

export {
  DataTypes,
  ConnectionError
};
