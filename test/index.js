import {} from 'dotenv/config';
import sequelize, {ConnectionError} from '../app/storage-service/dbConfig/db.js';
import File from '../app/storage-service/services/file.CRUDservice.js';
import User from '../app/storage-service/services/user.CRUDservice.js';
import PQueue from 'p-queue';
import gUsers from './generatorUsers.js';
import gFiles from './generatorFiles.js';

import {getLog} from '../packages/logger/index.js';

const log = getLog('service:storage');

sequelize.queue = new PQueue({concurrency: (sequelize.connectionManager.pool.maxSize - 1)});
const inTransaction = (fn) => sequelize.queue.add(
  () => sequelize.transaction((transaction) => fn(transaction))
);

const start = async () => {
  try {
    await sequelize.authenticate();
    log.info(`Successfully connected to database '${sequelize.getDatabaseName()}`);
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

// const [dbUser, createdU] = await User.findOrCreate({id: 1});
// const [dbFile, createdF] = await File.findOrCreate({md5: 'a24b0ccbd3c4e21ec1425d214fbcc941'});
// // const add = await User.addFileToUser(dbFile, dbUser);
// const tr = await dbUser.hasFile(dbFile);


// export async function FileCreate() {
// // ++++++++++++++++++++++++++++++++create file+++++++++++++++++++++++++
//   const file = await File.findOrCreate({
//     name: gFiles.name(),
//     extention: gFiles.ext(),
//     md5: gFiles.md5(),
//     type: gFiles.type(),
//     size: gFiles.size()
//   });
//   // +++++++++++++++++++++++++++++++++creat user++++++++++++++++++++++++
//   const user = await User.findOrCreate({
//     id: 12 // gUsers.id()
//   });
//   // ++++++++++++++++++++++++++++++user add file+++++++++++++++++++++++
//   const add = await User.addFileToUser(file, user);
// };
// // +++++++++++++++++++++++++++++++++++++delete file+++++++++++++++++++++++++
// export async function UserDeleteFile() {
//   const deleted = await User.deleteFile(11, 12);

//   return deleted;
// };
// // ++++++++++++++++++++++++++++++++ find all Files+++++++++++++++++++++
// export async function UserFindFiles() {
//   const allFilesOfUser = await User.findAllFiles(11);

//   return allFilesOfUser;
// };
// // +++++++++++++++++++++++++++++++++ find file +++++++++++++++++++++++++
// export async function FileFindUsers() {
//   const allFilesOfUser = await File.findAllUsers(16);

//   return allFilesOfUser;
// };
// // ++++++++++++++++++++++++++++++++ find file by id+++++++++++++++++++++
// export async function FileFindById() {
//   const allFilesOfUser = await File.findById(16, 14);

//   return allFilesOfUser;
// };

// async function createUF() {
//   try {
//     inTransaction(async (t) => {
//       const tr = {transaction: t};
//       const _file = await File.findOrCreate({
//         name: gFiles.name(),
//         extention: gFiles.ext(),
//         md5: gFiles.md5(),
//         type: gFiles.type(),
//         size: gFiles.size()
//       }, tr);

//       const _user = await User.findOrCreate({
//         id: 12 // gUsers.id()
//       }, tr);

//       console.dir(_user);
//       console.dir(_file);
//       return await _user.addFile(_file, {transaction: t});
//     });
//   } catch (err) {
//     console.log('SOME ER: ', err);
//   };
// }
// createUF();

async function CR() {
  try {
    const [_file] = await File.findOrCreate({
      name: gFiles.name(),
      extention: gFiles.ext(),
      md5: gFiles.md5(),
      type: gFiles.type(),
      size: gFiles.size()
    });

    const [_user] = await User.findOrCreate({
      id: 12 // gUsers.id()
    });

    return await _file.addUser(_user);
  } catch (err) {
    console.log('SOME ER: ', err);
  };
}

// CR();
(async ()=>{
  for (let i = 0; i < 50; i++) {
    CR();
    // await createUF();
  }
})();

// .then((file) => console.dir(file));

// export async function FileFindOne() {
//   const allFilesOfUser = await File.findOne('dDdFeDa55C2AC78981AD8c368d8028F');

//   return allFilesOfUser;
// };

