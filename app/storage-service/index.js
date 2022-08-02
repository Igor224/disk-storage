import express from 'express';
import Sequelize, {ConnectionError} from './dbConfig/db.js';
import cors from 'cors';
import os from 'os';
import uploadFile from 'express-fileupload';
import router from './routers/index.js';
import errorMiddleware from '../../packages/middlewares/error-middleware.js';
import config from '../../config/default.js';
import {getLog} from '../../packages/logger/index.js';

const {storageServices} = config;
const log = getLog('service:storage');

const PORT = storageServices.SERVICE_PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('static')); // до делать для фронта
app.use(uploadFile({
  debug: true,
  useTempFiles: true,
  tempFileDir: os.tmpdir()}));
app.use(cors());
app.use('/api/file', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await Sequelize.authenticate();
    log.info(`Successfully connected to database '${Sequelize.getDatabaseName()}`);
    await Sequelize.sync();

    app.listen(PORT, () => log.info(`Server started on PORT = ${PORT}`));
  } catch (err) {
    if (err instanceof ConnectionError) {
      log.error({
        err: err,
        db: Sequelize.getDatabaseName()
      }, 'ERROR - Unable to connect to the database');
    } else {
      log.error({
        err: err
      }, 'Unexpected server error');
    }
  }
};

start();
