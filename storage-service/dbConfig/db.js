// import dotenv from 'dotenv';
// dotenv.config({path: '../../.env'});
import DataTypes, {Sequelize, ConnectionError} from 'sequelize';
import config from '../../config/default.js';

const {storageServices} = config;

console.log('PASSW: ', storageServices.PASS);
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
