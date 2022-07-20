import {} from 'dotenv/config';
import sequelize, {ConnectionError} from '../storage-service/dbConfig/db.js';
import File from '../storage-service/services/file.service.js';
import User from '../storage-service/services/user.service.js';
import PQueue from 'p-queue';
import gUsers from './generatorUsers.js';
import gFiles from './generatorFiles.js';

import {getLog} from '../logger/index.js';

const log = getLog('service:storage');

sequelize.queue = new PQueue({concurrency: (sequelize.connectionManager.pool.maxSize - 1)});
const inTransaction = (fn) => sequelize.queue.add(
  () => sequelize.transaction((transaction) => fn(transaction))
);

const start = async () => {
  try {
    await sequelize.authenticate();
    log.info(`Successfully connected to database '${sequelize.getDatabaseName()}`);
    await sequelize.sync();
  } catch (err) {
    if (err instanceof ConnectionError) {
      log.error({
        err: err,
        db: sequelize.getDatabaseName()
      }, 'ERROR - Unable to connect to the database');
    } else {
      log.error({
        err: err
      }, 'Unexpected server error');
    }
  }
};

start();

export async function FileUserCreate() { // повторить циклом 50 раз, так же транзакцией
// ++++++++++++++++++++++++++++++++create file+++++++++++++++++++++++++
  const file = await File.create({
    name: gFiles.name(),
    extention: gFiles.ext(),
    md5: gFiles.md5(),
    type: gFiles.type(),
    size: gFiles.size()
  });
  // +++++++++++++++++++++++++++++++++creat user++++++++++++++++++++++++
  const user = await User.create({
    id: gUsers.id() // 12
  });
  // ++++++++++++++++++++++++++++++user add file+++++++++++++++++++++++
  const add = await User.addFileToUser(file, user);
};
// +++++++++++++++++++++++++++++++++++++delete file+++++++++++++++++++++++++
export async function UserDeleteFile() {
  const deleted = await User.deleteFile(11, 12);

  return deleted;
};
// ++++++++++++++++++++++++++++++++ find all Files+++++++++++++++++++++
export async function UserFindFiles() {
  const allFilesOfUser = await User.findAllFiles(11);

  return allFilesOfUser;
};
// +++++++++++++++++++++++++++++++++ find file +++++++++++++++++++++++++
export async function FileFindUsers() {
  const allFilesOfUser = await File.findAllUsers(16);

  return allFilesOfUser;
};
// ++++++++++++++++++++++++++++++++ find file by id+++++++++++++++++++++
export async function FileFindById() {
  const allFilesOfUser = await File.findById(16, 14);

  return allFilesOfUser;
};

// async function createUF() {        // ТРАНЗАКЦИЯ СКОРЕЕ ВСЕГО НЕ НУЖНА!
//   try {
//     inTransaction(async (t) => {
//       const _file = await File.create({
//         name: gFiles.name(),
//         extention: gFiles.ext(),
//         md5: '5f9AeAf5ea2fFa5ffB87Dc0a8BfFFCce', //gFiles.md5(),
//         type: gFiles.type(),
//         size: gFiles.size()
//       }, {transaction: t});

//       const _user = await User.create({
//         id: 12 // gUsers.id()
//       }, {transaction: t});

//       return await User.addFile(_user.id, _file.id, {transaction: t});
//     });
//   } catch (err) {
//     console.log('HEY! SOME ER: ', err);
//   };
// }

// (async ()=>{
//   for (let i = 0; i < 20; i++) {
//     await createUF();
//   }
// })();

