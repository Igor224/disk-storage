import {} from 'dotenv/config';
import express from 'express';
import Sequelize, {ConnectionError} from './dbConfig/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import uploadFile from 'express-fileupload';
import router from './routers/index';
import errorMiddleware from '../../packages/middlewares/error-middleware';
import {getLog} from '../../packages/logger/index.js';

const log = getLog('service:storage');

const PORT = process.env.PORT_API || 5000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(uploadFile({})); // добавить валидацию файлов
app.use(cors());
app.use('/api/files', router);
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
