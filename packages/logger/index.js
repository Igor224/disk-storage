import pino from 'pino';

const loggerOptions = {
  name: process.env.APP_NAME,
  prettyPrint: false,
  level: 'trace',
  timestamp: pino.stdTimeFunctions.isoTime
};


export const getLog = (name) => pino({
  ...loggerOptions,
  name
});
