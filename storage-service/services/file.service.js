import db from '../models/index.js';
import {getLog} from '../../logger/index.js';

const log = getLog('services:storage-service'); // убрать

const File = db.file;
const User = db.user;

async function create(data, transaction = null) {
  try {
    return await File.findOrCreate({
      where: {md5: data.md5},
      defaults: {
        name: data.name,
        extention: data.extention,
        md5: data.md5,
        type: data.type,
        size: data.size
      }, transaction})
      .then((data) => {
        const file = data?.[0];

        log.trace({
          id: file.id,
          name: file.name,
          extention: file.extention,
          md5: file.md5,
          type: file.type,
          size: file.size
        },
        'File created');

        return file;
      });
  } catch (err) {
    log.error({
      err: err,
      modelName: File.getTableName()
    }, 'Failed to create a file');
  };
};

async function findById(fileId, userId) {
  try {
    return await File.findByPk(fileId, {
      include: {
        model: User,
        where: {
          id: userId
        }
      }}).then((data)=> {
      if (data) {
        console.log('DATA: ', data);
        log.trace({
          fileId: data.id
        }, `File id:${data.id} belongs to user with id:${userId}`);
      } else {
        log.trace({
          fileId: fileId
        }, `File id:${fileId} was deleted or not exist`);

        return null;
      }

      return data;
    });
  } catch (err) {
    log.error({
      err: err,
      modelName: File.getTableName()
    }, 'Failed to finde file');
  }
};

async function findAllUsers(fileId) {
  try {
    return await File.findByPk(fileId, {
      include: User
    }).then((data) => {
      console.dir(data);
      const {Users = null} = data;

      if (Users.length > 0) {
        log.trace({
          fileId: data?.id,
          users: Users.length
        },
        `File id:${data?.id} belongs to ${Users.length} users`);

        return Users;
      } else {
        log.trace({
          fileId: data?.id,
          users: null
        },
        `File id:${data?.id} belongs to nobody`);

        return null;
      }
    });
  } catch (err) {
    log.error({
      err: err,
      modelName: File.getTableName()
    }, 'Failed to find users');
  };
}

export default {
  create,
  findById,
  findAllUsers
};
