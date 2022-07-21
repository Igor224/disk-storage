require('dotenv').config();
const express = require('express');
const sequelize = require('./db/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const {getLog} = require('../../packages/logger');

const log = getLog('services:user');

const PORT = process.env.PORT_USER || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.API_NOTE_URL
}));
app.use('/api', router);
app.use(errorMiddleware);


const start = async () => {
  await sequelize.authenticate()
    .then(() => log.info(`Successfully connected to database '${sequelize.getDatabaseName()}`))
    .catch((e) =>
      log.error({
        e,
        db: sequelize.getDatabaseName()
      }, 'ERROR - Unable to connect to the database')
    );
  await sequelize.sync();

  app.listen(PORT, () => log.info(`Server started on PORT = ${PORT}`)); // обработать возможные ошибки
};

start();
