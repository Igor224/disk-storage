import express from 'express';
import sequelize from './dbConfig/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/index.js';
import errorMiddleware from '../../packages/middlewares/error-middleware.js';
import config from '../../config/default.js';
import {getLog} from '../../packages/logger/index.js';

const {userService} = config;
const log = getLog('services:user');

const PORT = userService.SERVICE_PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);


const start = async () => {
  await sequelize.authenticate()
    .then(() => log.info(`Successfully connected to database '${sequelize.getDatabaseName()}`))
    .catch((err) =>
      log.error({
        err,
        db: sequelize.getDatabaseName()
      }, 'ERROR - Unable to connect to the database')
    );
  await sequelize.sync();

  app.listen(PORT, () => log.info(`Server started on PORT = ${PORT}`)); // обработать возможные ошибки
};

start();
